import React from 'react';
import { Dimensions, Pressable, View as RNView, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { CATEGORY_LABELS, Exploration } from '@/types/types';
import { Text, View } from './Themed';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40 - 12) / 2;

const COLORS = {
  bg: '#09090B',
  card: '#18181B',
  border: '#27272A',
  text: '#FAFAFA',
  textMuted: '#71717A',
  blue: '#2665f1',
  cyan: '#22D3EE',
  orange: '#FB923C',
  green: '#4ADE80',
  pink: '#F472B6',
};

const categoryColors: Record<string, string> = {
  mobile: COLORS.blue,
  web: COLORS.cyan,
  component: COLORS.pink,
  animation: COLORS.orange,
  other: COLORS.textMuted,
};

const statusColors: Record<string, string> = {
  idea: COLORS.blue,
  'in-progress': COLORS.orange,
  completed: COLORS.green,
};

interface ExplorationCardProps {
  exploration: Exploration;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ExplorationCard({ exploration, onPress }: ExplorationCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const categoryColor = categoryColors[exploration.category] || COLORS.textMuted;

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.card}>
        {/* Top row: Day + Status */}
        <View style={styles.topRow}>
          <Text style={[styles.day, { color: categoryColor }]}>
            Day {exploration.dayNumber}
          </Text>
          <RNView style={[styles.statusDot, { backgroundColor: statusColors[exploration.status] }]} />
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {exploration.title}
        </Text>

        {/* Category */}
        <Text style={[styles.category, { color: categoryColor }]}>
          {CATEGORY_LABELS[exploration.category]}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  day: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
  },
});
