import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation, type StaticScreenProps} from '@react-navigation/native';
import {colors, radius, spacing} from '@/theme';
import ScreenLayout from '@/ui/ScreenLayout';
import Button from '@/ui/Button';
import {usePlantById} from '@/hooks/usePlantById';
import {useDeletePlant} from '@/hooks/useDeletePlant';
import CloseButton from '@/ui/CloseButton';

type Props = StaticScreenProps<{id: string}>;

function PlantDetail({route}: Props) {
  const {id} = route.params;
  const navigation = useNavigation();
  const {data: plant, isLoading} = usePlantById(id);
  const {mutate: deletePlant, isPending: isDeleting} = useDeletePlant();

  const closeButton = <CloseButton onPress={navigation.goBack} />;

  if (isLoading) {
    return (
      <ScreenLayout title="Plant" rightSlot={closeButton}>
        <View style={styles.centered}>
          <Text style={styles.mutedText}>Loading…</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (!plant) {
    return (
      <ScreenLayout title="Plant" rightSlot={closeButton}>
        <View style={styles.centered}>
          <Text style={styles.mutedText}>Plant not found</Text>
        </View>
      </ScreenLayout>
    );
  }

  const onDelete = () => {
    Alert.alert('Delete plant?', `${plant.name} will be permanently removed.`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deletePlant(plant.id, {
            onSuccess: () => navigation.goBack(),
          });
        },
      },
    ]);
  };

  return (
    <ScreenLayout title={plant.name} rightSlot={closeButton}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {plant.photoUri ? (
          <Image source={{uri: plant.photoUri}} style={styles.heroPhoto} />
        ) : (
          <View style={[styles.heroPhoto, styles.photoPlaceholder]}>
            <Text style={styles.placeholderEmoji}>🌿</Text>
          </View>
        )}

        <Button
          text="Delete plant"
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
    gap: spacing.lg,
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
});
