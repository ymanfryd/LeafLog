import {analyzePlant} from '@/ai/plantAnalysis';
import {PlantAnalysis} from '@/ai/types';
import {useCreatePlant} from '@/hooks/useCreatePlant';
import {colors, radius, spacing} from '@/theme';
import Button from '@/ui/Button';
import CloseButton from '@/ui/CloseButton';
import ScreenLayout from '@/ui/ScreenLayout';
import {savePhoto} from '@/utils/photoStorage';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';
import {useCreatePlantCheck} from '@/hooks/useCreatePlantCheck';
import {usePlural} from '@/i18n/usePlural';
import {analyzeErrorMessage} from '@/ai/errorMessage';
type Level = 'low' | 'medium' | 'high';

const LEVEL_COUNT: Record<Level, number> = {low: 1, medium: 2, high: 3};

export function levelBar(level: Level, symbol: string): string {
  return symbol.repeat(LEVEL_COUNT[level]);
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function AnalysisCard({analysis}: {analysis: PlantAnalysis}) {
  const {t} = useTranslation();
  const tp = usePlural();
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{analysis.species}</Text>
      <Row
        label={t('analysis.watering')}
        value={tp('analysis.wateringInterval', analysis.wateringIntervalDays)}
      />
      <Row
        label={t('analysis.light')}
        value={levelBar(analysis.lightRequirement as Level, '☀️')}
      />
      <Row
        label={t('analysis.humidity')}
        value={levelBar(analysis.humidityRequirement as Level, '💧')}
      />
      {analysis.issues.length > 0 && (
        <View style={styles.issues}>
          <Text style={styles.issuesTitle}>{t('analysis.issuesTitle')}</Text>
          {analysis.issues.map((issue, i) => (
            <Text key={i} style={styles.issueText}>
              • {issue.issue} — {issue.advice}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

function AddPlant() {
  const navigation = useNavigation();
  const {mutateAsync: createPlant, isPending} = useCreatePlant();
  const {mutateAsync: createPlantCheck, isPending: isPlantCheckPending} =
    useCreatePlantCheck();
  const [chosenPhoto, setChosenPhoto] = useState<Asset | null>(null);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [retryAttempt, setRetryAttempt] = useState(0);
  const {t, i18n} = useTranslation();

  async function runAnalysis(base64: string) {
    setAnalysis(null);
    setAnalyzeError(null);
    setRetryAttempt(0);
    setAnalyzing(true);
    try {
      const result = await analyzePlant(base64, {
        onRetry: setRetryAttempt,
        language: i18n.language,
      });
      setAnalysis(result);
      setName(prev => prev.trim() || result.commonName);
    } catch (e) {
      setAnalyzeError(analyzeErrorMessage(t, e));
    } finally {
      setAnalyzing(false);
      setRetryAttempt(0);
    }
  }

  const handleAsset = async (asset: Asset | undefined) => {
    if (!asset?.uri || !asset.base64) return;
    setChosenPhoto(asset);
    await runAnalysis(asset.base64);
  };

  const onTakePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    });
    await handleAsset(result.assets?.[0]);
  };

  const onChooseFromLibrary = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    });
    await handleAsset(result.assets?.[0]);
  };

  async function onSave() {
    if (!chosenPhoto?.uri) return;
    const permanentUri = await savePhoto(chosenPhoto.uri);

    const plant = await createPlant({
      name: name.trim(),
      photoUri: permanentUri,
      species: analysis?.species ?? null,
      commonName: analysis?.commonName ?? null,
      wateringIntervalDays: analysis?.wateringIntervalDays ?? null,
      lightRequirement: analysis?.lightRequirement ?? null,
      humidityRequirement: analysis?.humidityRequirement ?? null,
    });

    if (analysis) {
      await createPlantCheck({
        plantId: plant.id,
        photoUri: permanentUri,
        species: analysis.species,
        commonName: analysis.commonName,
        wateringIntervalDays: analysis.wateringIntervalDays,
        lightRequirement: analysis.lightRequirement,
        humidityRequirement: analysis.humidityRequirement,
        healthStatus: analysis.healthStatus,
        issues: analysis.issues,
      });
    }

    navigation.goBack();
  }

  const isSaving = isPending || isPlantCheckPending;

  return (
    <ScreenLayout
      title={t('addPlant.title')}
      rightSlot={<CloseButton onPress={navigation.goBack} />}>
      {chosenPhoto ? (
        <ScrollView contentContainerStyle={styles.form}>
          <Image source={{uri: chosenPhoto.uri}} style={styles.photo} />
          <Text style={styles.label}>{t('addPlant.name')}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('addPlant.namePlaceholder')}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          {analyzing && (
            <View style={styles.analyzing}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.analyzingText}>
                {retryAttempt === 0
                  ? t('addPlant.analyzing')
                  : t('addPlant.retrying', {attempt: retryAttempt})}
              </Text>
            </View>
          )}
          {analyzeError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{analyzeError}</Text>
              <Button
                text={t('common.tryAgain')}
                onPress={() => {
                  if (chosenPhoto?.base64) runAnalysis(chosenPhoto.base64);
                }}
              />
            </View>
          )}
          {analysis && <AnalysisCard analysis={analysis} />}
          {!analyzing && (
            <Button
              text={t('common.save')}
              onPress={onSave}
              loading={isSaving}
              disabled={!name.trim() || isSaving}
            />
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyTitle}>{t('addPlant.emptyTitle')}</Text>
          <Text style={styles.emptyHint}>{t('addPlant.emptyHint')}</Text>
          <View style={styles.emptyAction}>
            <Button text={t('addPlant.takePhoto')} onPress={onTakePhoto} />
            <Pressable
              onPress={onChooseFromLibrary}
              style={({pressed}) => [
                styles.libraryLink,
                pressed && styles.libraryLinkPressed,
              ]}
              hitSlop={8}>
              <Text style={styles.libraryLinkText}>
                {t('addPlant.chooseFromLibrary')}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScreenLayout>
  );
}

export default AddPlant;

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyHint: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyAction: {
    width: '100%',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  libraryLink: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  libraryLinkPressed: {
    opacity: 0.5,
  },
  libraryLinkText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    color: colors.danger,
  },
  photo: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  form: {
    padding: spacing.md,
    gap: spacing.md,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  rowValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  issues: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.textMuted,
    gap: spacing.xs,
  },
  issuesTitle: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  issueText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  analyzing: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  analyzingText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  errorBox: {
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
});
