import {colors, radius} from '@/theme';
import {Pressable, StyleSheet, Text} from 'react-native';

export default function IconButton({
  onPress,
  icon,
}: {
  onPress: () => void;
  icon?: string;
}) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.iconButton,
        pressed && styles.iconButtonPressed,
      ]}
      onPress={onPress}
      hitSlop={8}>
      <Text style={styles.iconButtonText}>{icon ?? '+'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  iconButtonText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 26,
  },
});
