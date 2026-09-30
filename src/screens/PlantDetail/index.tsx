import {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation, type StaticScreenProps} from '@react-navigation/native';
import {colors, radius, spacing} from '@/theme';
import ScreenLayout from '@/ui/ScreenLayout';
import Button from '@/ui/Button';
import CloseButton from '@/ui/CloseButton';
import {usePlantById} from '@/hooks/usePlantById';
import {useDeletePlant} from '@/hooks/useDeletePlant';
import {useLatestCheckByPlantId} from '@/hooks/useLatestCheck';
import {useCreatePlantCheck} from '@/hooks/useCreatePlantCheck';
import {useUpdatePlant} from '@/hooks/useUpdatePlant';
import {resolvePhotoUri, readPhotoAsBase64} from '@/utils/photoStorage';
import {useTranslation} from 'react-i18next';
import {usePlural} from '@/i18n/usePlural';
import {analyzePlant} from '@/ai/plantAnalysis';
import {analyzeErrorMessage} from '@/ai/errorMessage';

type Props = StaticScreenProps<{id: string}>;
type Level = 'low' | 'medium' | 'high';

const LEVEL_COUNT: Record<Level, number> = {low: 1, medium: 2, high: 3};

function Row({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function HealthPill({status}: {status: 'healthy' | 'warning' | 'critical'}) {
  const {t} = useTranslation();
  return (
    <View style={[styles.pill, styles[`pill_${status}`]]}>
      <Text style={styles.pillText}>{t(`plantDetail.status.${status}`)}</Text>
    </View>
  );
}

export function levelBar(level: Level, symbol: string): string {
  return symbol.repeat(LEVEL_COUNT[level]);
}

function PlantDetail({route}: Props) {
  const {id} = route.params;
  const navigation = useNavigation();
  const {data: plant, isLoading} = usePlantById(id);
  const {data: latestCheck} = useLatestCheckByPlantId(id);
  const {mutate: deletePlant, isPending: isDeleting} = useDeletePlant();
  const {mutateAsync: createPlantCheck} = useCreatePlantCheck();
  const {mutateAsync: updatePlant} = useUpdatePlant();
  const {t, i18n} = useTranslation();
  const tp = usePlural();

  const [analyzing, setAnalyzing] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  async function onAnalyze() {
    if (!plant?.photoUri) return;
    setAnalyzeError(null);
    setRetryAttempt(0);
    setAnalyzing(true);
    try {
      const base64 = await readPhotoAsBase64(plant.photoUri);
      const result = await analyzePlant(base64, {
        onRetry: setRetryAttempt,
        language: i18n.language,
      });
      await createPlantCheck({
        plantId: plant.id,
        photoUri: plant.photoUri,
        species: result.species,
        commonName: result.commonName,
        wateringIntervalDays: result.wateringIntervalDays,
        lightRequirement: result.lightRequirement,
        humidityRequirement: result.humidityRequirement,
        healthStatus: result.healthStatus,
        issues: result.issues,
      });
      await updatePlant({
        id: plant.id,
        patch: {
          species: result.species,
          commonName: result.commonName,
          wateringIntervalDays: result.wateringIntervalDays,
          lightRequirement: result.lightRequirement,
          humidityRequirement: result.humidityRequirement,
        },
      });
    } catch (e) {
      setAnalyzeError(analyzeErrorMessage(t, e));
    } finally {
      setAnalyzing(false);
      setRetryAttempt(0);
    }
  }

  const closeButton = <CloseButton onPress={navigation.goBack} />;

  if (isLoading) {
    return (
      <ScreenLayout title={t('plantDetail.title')} rightSlot={closeButton}>
        <View style={styles.centered}>
          <Text style={styles.mutedText}>{t('common.loading')}</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (!plant) {
    return (
      <ScreenLayout title={t('plantDetail.title')} rightSlot={closeButton}>
        <View style={styles.centered}>
          <Text style={styles.mutedText}>{t('plantDetail.notFound')}</Text>
        </View>
      </ScreenLayout>
    );
  }

  const onDelete = () => {
    Alert.alert(
      t('plantDetail.deleteAlertTitle'),
      t('plantDetail.deleteAlertBody', {name: plant.name}),
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deletePlant(plant.id, {onSuccess: () => navigation.goBack()});
          },
        },
      ],
    );
  };

  const hasCareInfo =
    plant.wateringIntervalDays !== null ||
    plant.lightRequirement !== null ||
    plant.humidityRequirement !== null;

  const hasIssues = latestCheck?.issues && latestCheck.issues.length > 0;
  return (
    <ScreenLayout title={plant.name} rightSlot={closeButton}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {plant.photoUri ? (
          <Image
            source={{uri: resolvePhotoUri(plant.photoUri)}}
            style={styles.heroPhoto}
          />
        ) : (
          <View style={[styles.heroPhoto, styles.photoPlaceholder]}>
            <Text style={styles.placeholderEmoji}>🌿</Text>
          </View>
        )}

        <View style={styles.subheader}>
          {plant.commonName && plant.commonName !== plant.name && (
            <Text style={styles.commonName}>{plant.commonName}</Text>
          )}
          {plant.species && <Text style={styles.species}>{plant.species}</Text>}
        </View>

        {hasCareInfo && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('plantDetail.care')}</Text>
            {plant.wateringIntervalDays !== null && (
              <Row
                label={t('analysis.watering')}
                value={tp(
                  'analysis.wateringInterval',
                  plant.wateringIntervalDays,
                )}
              />
            )}
            {plant.lightRequirement && (
              <Row
                label={t('analysis.light')}
                value={levelBar(plant.lightRequirement as Level, '☀️')}
              />
            )}
            {plant.humidityRequirement && (
              <Row
                label={t('analysis.humidity')}
                value={levelBar(plant.humidityRequirement as Level, '💧')}
              />
            )}
          </View>
        )}

        {latestCheck?.healthStatus && (
          <View style={styles.card}>
            <View style={styles.healthHeader}>
              <Text style={styles.cardTitle}>{t('plantDetail.health')}</Text>
              <HealthPill status={latestCheck.healthStatus} />
            </View>
            {hasIssues && (
              <View style={styles.issues}>
                {latestCheck.issues!.map((issue, i) => (
                  <Text key={i} style={styles.issueText}>
                    • {issue.issue} — {issue.advice}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {plant.notes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('plantDetail.notes')}</Text>
            <Text style={styles.notesText}>{plant.notes}</Text>
          </View>
        )}

        {!latestCheck && plant.photoUri && (
          <>
            {analyzing ? (
              <View style={styles.analyzingBox}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.analyzingText}>
                  {retryAttempt === 0
                    ? t('addPlant.analyzing')
                    : t('addPlant.retrying', {attempt: retryAttempt})}
                </Text>
              </View>
            ) : (
              <>
                {analyzeError && (
                  <Text style={styles.errorText}>{analyzeError}</Text>
                )}
                <Button
                  text={t(
                    analyzeError
                      ? 'common.tryAgain'
                      : 'plantDetail.analyzeButton',
                  )}
                  onPress={onAnalyze}
                />
              </>
            )}
          </>
        )}
        <Button
          text={t('plantDetail.deleteButton')}
          color={colors.danger}
          onPress={onDelete}
          loading={isDeleting}
          disabled={isDeleting}
        />
      </ScrollView>
    </ScreenLayout>
  );
}

export default PlantDetail;

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
    gap: spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutedText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  heroPhoto: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  subheader: {
    gap: spacing.xs,
  },
  commonName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  species: {
    color: colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
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
    flexShrink: 1,
    textAlign: 'right',
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.full,
  },
  pill_healthy: {
    backgroundColor: colors.success + '30',
  },
  pill_warning: {
    backgroundColor: colors.primary + '30',
  },
  pill_critical: {
    backgroundColor: colors.danger + '30',
  },
  pillText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  issues: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  issueText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  notesText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  analyzingBox: {
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  analyzingText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
});
