import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '@/theme';

export default function CloseButton({onPress}: {onPress: () => void}) {
  return (
    <Pressable
      style={({pressed}) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      hitSlop={12}>
      <Text style={styles.text}>✕</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
  text: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
});
