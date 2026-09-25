import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing} from '@/theme';
import type {Plant} from '@/db/types';
import {resolvePhotoUri} from '@/utils/photoStorage';

type Props = {
  item: Plant;
  onPress: () => void;
};

export default function PlantCard({item, onPress}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {item.photoUri ? (
        <Image
          source={{uri: resolvePhotoUri(item.photoUri)}}
          style={styles.photo}
        />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]}>
          <Text style={styles.placeholderEmoji}>🌿</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    margin: spacing.xs,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceElevated,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  info: {
    padding: spacing.sm,
  },
  name: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
