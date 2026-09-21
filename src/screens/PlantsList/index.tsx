import {useQuery} from '@tanstack/react-query';
import {db} from '@/db/client';
import {plants} from '@/db/schema';
import ScreenLayout from '@/ui/ScreenLayout';
import {StyleSheet, Text} from 'react-native';
import {colors} from '@/theme';

const PlantsList = () => {
  const {data} = useQuery({
    queryKey: ['plants'],
    queryFn: () => db.select().from(plants),
  });

  return (
    <ScreenLayout title="Plants">
      <Text style={styles.text}>{data?.length ?? 0} plants</Text>
    </ScreenLayout>
  );
};

export default PlantsList;

const styles = StyleSheet.create({
  text: {
    color: colors.text,
  },
});
