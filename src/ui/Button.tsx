import {colors, radius, spacing} from '@/theme';
import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  onPress: () => void;
  text: string;
  loading?: boolean;
  disabled?: boolean;
  color?: string;
};

function Button({
  onPress,
  text,
  loading = false,
  disabled = false,
  color = colors.primary,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Pressable
      onPress={() => {
        onPress();
      }}
      disabled={disabled}
      onPressIn={() => (scale.value = withSpring(0.95))}
      onPressOut={() => (scale.value = withSpring(1))}
      android_ripple={{color: colors.surfaceElevated}}
      style={styles.pressable}>
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: color,
          },
          animatedStyle,
          disabled && styles.buttonDisabled,
        ]}>
        {loading ? (
          <ActivityIndicator color={colors.text} size={35} />
        ) : (
          <Text style={styles.buttonText}>{text}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: colors.primaryMuted,
    opacity: 0.3,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
