import { useSharedValue, useAnimatedStyle, withSpring, withTiming, withSequence } from 'react-native-reanimated';

export const useBounceAnimation = () => {
  const scale = useSharedValue(1);

  const bounce = () => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { bounce, animatedStyle };
};

export const useFadeAnimation = (initialOpacity: number = 0) => {
  const opacity = useSharedValue(initialOpacity);

  const fadeIn = (duration: number = 300) => {
    opacity.value = withTiming(1, { duration });
  };

  const fadeOut = (duration: number = 300) => {
    opacity.value = withTiming(0, { duration });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { fadeIn, fadeOut, animatedStyle };
};

export const useSlideAnimation = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const slideIn = (direction: 'left' | 'right' | 'up' | 'down' = 'left', distance: number = 100) => {
    switch (direction) {
      case 'left':
        translateX.value = withSpring(0, { damping: 15, stiffness: 300 });
        break;
      case 'right':
        translateX.value = withSpring(0, { damping: 15, stiffness: 300 });
        break;
      case 'up':
        translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
        break;
      case 'down':
        translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
        break;
    }
  };

  const slideOut = (direction: 'left' | 'right' | 'up' | 'down' = 'left', distance: number = 100) => {
    switch (direction) {
      case 'left':
        translateX.value = withSpring(-distance, { damping: 15, stiffness: 300 });
        break;
      case 'right':
        translateX.value = withSpring(distance, { damping: 15, stiffness: 300 });
        break;
      case 'up':
        translateY.value = withSpring(-distance, { damping: 15, stiffness: 300 });
        break;
      case 'down':
        translateY.value = withSpring(distance, { damping: 15, stiffness: 300 });
        break;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return { slideIn, slideOut, animatedStyle };
};
