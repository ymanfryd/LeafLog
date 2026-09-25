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
import {launchCamera, type Asset} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';
import {useCreatePlantCheck} from '@/hooks/useCreatePlantCheck';

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
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{analysis.species}</Text>
      <Row
        label={t('analysis.watering')}
        value={t('analysis.wateringInterval', {
          count: analysis.wateringIntervalDays,
        })}
      />
      <Row label={t('analysis.light')} value={analysis.lightRequirement} />
      <Row
        label={t('analysis.humidity')}
        value={analysis.humidityRequirement}
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
      setAnalyzeError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
      setRetryAttempt(0);
    }
  }

  const onTakePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    });
    const asset = result.assets?.[0];
    if (!asset?.uri || !asset.base64) return;

    setChosenPhoto(asset);
    await runAnalysis(asset.base64);
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
        <Pressable style={styles.pressableContainer} onPress={onTakePhoto}>
          <Text style={styles.emptyText}>{t('addPlant.takePhoto')}</Text>
        </Pressable>
      )}
    </ScreenLayout>
  );
}

export default AddPlant;

const styles = StyleSheet.create({
  pressableContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textMuted,
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
    textTransform: 'capitalize',
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
    textTransform: 'uppercase',
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
