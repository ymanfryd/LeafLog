import {Pressable, Text, View, StyleSheet, Image} from 'react-native';
import {colors, radius, spacing} from '@/theme';
import {Plant} from '@/db/types';

export default function PlantCard({
  item,
  onDelete,
}: {
  item: Plant;
  onDelete: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        {item.photoUri ? (
          <Image source={{uri: item.photoUri}} width={40} height={40} />
        ) : (
          <Text style={styles.emoji}>🌿</Text>
        )}

        <View>
          <Text style={styles.name}>{item.name}</Text>
          {item.species && <Text style={styles.species}>{item.species}</Text>}
        </View>
      </View>
      <Pressable onPress={onDelete}>
        <Text style={styles.delete}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  species: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  delete: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
});
