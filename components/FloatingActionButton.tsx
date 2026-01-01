import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Pressable, View as RNView, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const COLORS = {
  blue: '#2665f1',
  card: '#18181B',
};

interface FloatingActionButtonProps {
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <RNView style={styles.button}>
        <FontAwesome name="plus" size={22} color="#FFFFFF" />
      </RNView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 20,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
