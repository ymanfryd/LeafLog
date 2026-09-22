import ScreenLayout from '@/ui/ScreenLayout';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '@/theme';
import {usePlants} from '@/hooks/usePlants';
import {FlashList} from '@shopify/flash-list';
import PlantCard from './PlantCard';
import {useCreatePlant} from '@/hooks/useCreatePlant';
import {useDeletePlant} from '@/hooks/useDeletePlant';
import IconButton from '@/ui/IconButton';

const PlantsList = () => {
  const {data: plants, isLoading, isError} = usePlants();
  const {mutate: createPlant, isPending} = useCreatePlant();
  const {mutate: deletePlant} = useDeletePlant();

  const seed = () => {
    createPlant({
      name: 'Sample Ficus',
      species: 'Ficus Elastica',
      commonName: 'Rubber Plant',
      photoUri: null,
      wateringIntervalDays: 7,
      lightRequirement: 'medium',
      humidityRequirement: 'medium',
      notes: null,
    });
  };

  return (
    <ScreenLayout title="Plants" rightSlot={<IconButton onPress={seed} />}>
      {isLoading || isPending ? (
        <ActivityIndicator color={colors.primary} />
      ) : isError ? (
        <Text style={styles.errorText}>Error while getting plants</Text>
      ) : plants && plants.length > 0 ? (
        <FlashList
          data={plants}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <PlantCard item={item} onDelete={() => deletePlant(item.id)} />
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No plants yet</Text>
          <Text style={styles.emptyHint}>Tap + to add your first plant</Text>
        </View>
      )}
    </ScreenLayout>
  );
};

export default PlantsList;

const styles = StyleSheet.create({
  errorText: {
    color: colors.danger,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyHint: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
