import ScreenLayout from '@/ui/ScreenLayout';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '@/theme';
import {usePlants} from '@/hooks/usePlants';
import {FlashList} from '@shopify/flash-list';
import PlantCard from './PlantCard';
import {useDeletePlant} from '@/hooks/useDeletePlant';
import IconButton from '@/ui/IconButton';
import {StaticParamList, useNavigation} from '@react-navigation/native';
import PlantsStack from '@/navigation/PlantsStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type PlantsStackParams = StaticParamList<typeof PlantsStack>;

const PlantsList = () => {
  const {data: plants, isLoading, isError} = usePlants();
  const {mutate: deletePlant} = useDeletePlant();
  const navigation =
    useNavigation<NativeStackNavigationProp<PlantsStackParams>>();

  return (
    <ScreenLayout
      title="Plants"
      rightSlot={
        <IconButton onPress={() => navigation.navigate('AddPlant')} />
      }>
      {isLoading ? (
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
