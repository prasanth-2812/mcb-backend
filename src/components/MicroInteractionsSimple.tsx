import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface MicroInteractionsProps {
  children: React.ReactNode;
  onPress?: () => void;
  hapticFeedback?: boolean;
  animationType?: 'scale' | 'bounce' | 'fade' | 'slide';
  disabled?: boolean;
  style?: ViewStyle;
}

const MicroInteractions: React.FC<MicroInteractionsProps> = ({
  children,
  onPress,
  hapticFeedback = true,
  animationType = 'scale',
  disabled = false,
  style,
}) => {
  const scaleValue = useSharedValue(1);
  const opacityValue = useSharedValue(1);
  const translateY = useSharedValue(0);

  const handlePressIn = () => {
    if (disabled) return;

    // Animation based on type
    switch (animationType) {
      case 'scale':
        scaleValue.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        break;
      case 'bounce':
        scaleValue.value = withSpring(0.9, { damping: 8, stiffness: 400 });
        break;
      case 'fade':
        opacityValue.value = withTiming(0.7, { duration: 100 });
        break;
      case 'slide':
        translateY.value = withSpring(2, { damping: 15, stiffness: 300 });
        break;
    }
  };

  const handlePressOut = () => {
    if (disabled) return;

    // Reset animations
    scaleValue.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacityValue.value = withTiming(1, { duration: 100 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled) return;
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = animationType === 'scale' || animationType === 'bounce' ? scaleValue.value : 1;
    const opacity = animationType === 'fade' ? opacityValue.value : 1;
    const translateYValue = animationType === 'slide' ? translateY.value : 0;

    return {
      transform: [
        { scale },
        { translateY: translateYValue },
      ],
      opacity: disabled ? 0.5 : opacity,
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        style={styles.touchable}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Specialized components for common use cases
export const AnimatedButton: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}> = ({ children, onPress, style, disabled }) => (
  <MicroInteractions
    onPress={onPress}
    animationType="scale"
    hapticFeedback={false}
    disabled={disabled}
    style={style}
  >
    {children}
  </MicroInteractions>
);

export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}> = ({ children, onPress, style, disabled }) => (
  <MicroInteractions
    onPress={onPress}
    animationType="bounce"
    hapticFeedback={false}
    disabled={disabled}
    style={style}
  >
    {children}
  </MicroInteractions>
);

export const AnimatedChip: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}> = ({ children, onPress, style, disabled }) => (
  <MicroInteractions
    onPress={onPress}
    animationType="scale"
    hapticFeedback={false}
    disabled={disabled}
    style={style}
  >
    {children}
  </MicroInteractions>
);

export const AnimatedIcon: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}> = ({ children, onPress, style, disabled }) => (
  <MicroInteractions
    onPress={onPress}
    animationType="scale"
    hapticFeedback={false}
    disabled={disabled}
    style={style}
  >
    {children}
  </MicroInteractions>
);

const styles = StyleSheet.create({
  touchable: {
    // Remove default touchable opacity
  },
});

export default MicroInteractions;
