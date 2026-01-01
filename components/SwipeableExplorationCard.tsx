import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Alert, Dimensions, Pressable, View as RNView, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

import { CATEGORY_LABELS, Exploration } from '@/types/types';
import { Text, View } from './Themed';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const SWIPE_THRESHOLD = 80;

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
  red: '#EF4444',
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

interface SwipeableExplorationCardProps {
  exploration: Exploration;
  onPress?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SwipeableExplorationCard({ 
  exploration, 
  onPress, 
  onDelete, 
  onComplete 
}: SwipeableExplorationCardProps) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleDelete = () => {
    Alert.alert(
      'Delete Exploration',
      'Are you sure you want to delete this exploration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(),
        },
      ]
    );
  };

  const handleComplete = () => {
    onComplete?.();
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        // Swiped left - delete
        runOnJS(handleDelete)();
        translateX.value = withSpring(0);
      } else if (event.translationX > SWIPE_THRESHOLD && exploration.status !== 'completed') {
        // Swiped right - complete
        runOnJS(handleComplete)();
        translateX.value = withSpring(0);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const leftActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? Math.min(translateX.value / SWIPE_THRESHOLD, 1) : 0,
  }));

  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? Math.min(-translateX.value / SWIPE_THRESHOLD, 1) : 0,
  }));

  const handlePressIn = () => {
    // scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    // scale.value = withSpring(1, { damping: 15 });
  };

  const categoryColor = categoryColors[exploration.category] || COLORS.textMuted;

  return (
    <RNView style={styles.container}>
      {/* Left action (complete) */}
      <Animated.View style={[styles.leftAction, leftActionStyle]}>
        <FontAwesome name="check" size={24} color="#fff" />
        <Text style={styles.actionText}>Complete</Text>
      </Animated.View>

      {/* Right action (delete) */}
      <Animated.View style={[styles.rightAction, rightActionStyle]}>
        <FontAwesome name="trash" size={24} color="#fff" />
        <Text style={styles.actionText}>Delete</Text>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <AnimatedPressable
          style={[styles.cardWrapper, animatedCardStyle]}
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
              <RNView style={styles.statusBadge}>
                <RNView style={[styles.statusDot, { backgroundColor: statusColors[exploration.status] }]} />
              </RNView>
            </View>

            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
              {exploration.title}
            </Text>

            {/* Category and Tags Row */}
            <View style={styles.bottomRow}>
              <Text style={[styles.category, { color: categoryColor }]}>
                {CATEGORY_LABELS[exploration.category]}
              </Text>
              {exploration.tags && exploration.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {exploration.tags.slice(0, 2).map((tag, index) => (
                    <RNView key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </RNView>
                  ))}
                  {exploration.tags.length > 2 && (
                    <Text style={styles.moreTags}>+{exploration.tags.length - 2}</Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </AnimatedPressable>
      </GestureDetector>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 12,
    position: 'relative',
  },
  cardWrapper: {
    zIndex: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'transparent',
  },
  tag: {
    backgroundColor: COLORS.border,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  moreTags: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  leftAction: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: COLORS.green,
    borderRadius: 16,
    paddingLeft: 24,
    zIndex: 0,
  },
  rightAction: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: COLORS.red,
    borderRadius: 16,
    paddingRight: 24,
    zIndex: 0,
  },
  actionText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
  },
});
