import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Pressable, View as RNView, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { getDayOfYear } from '@/types/types';
import { Text, View } from './Themed';
import { useColorScheme } from './useColorScheme';

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
const RADIUS = { full: 9999 };
const TYPOGRAPHY = {
  sizes: { sm: 13, '3xl': 32 },
  weights: { medium: '500' as const, semibold: '600' as const, bold: '700' as const },
};

interface HeaderProps {
  streak?: number;
  totalExplorations?: number;
  onSettingsPress?: () => void;
}

export function Header({ streak = 0, totalExplorations = 0, onSettingsPress }: HeaderProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const currentDay = getDayOfYear(new Date());
  const year = new Date().getFullYear();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topRow}>
        <View style={styles.titleSection}>
          <Text style={[styles.greeting, { color: colors.textMuted }]}>
            Day {currentDay} of {year}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Explorations
          </Text>
        </View>

        <Pressable onPress={onSettingsPress} style={styles.settingsButton}>
          <FontAwesome name="gear" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <RNView style={[styles.streakContainer, { backgroundColor: Colors.palette.accent.orange + '20' }]}>
          <FontAwesome name="fire" size={16} color={Colors.palette.accent.orange} />
          <Text style={[styles.streakText, { color: Colors.palette.accent.orange }]}>
            {streak} day streak
          </Text>
        </RNView>

        <RNView style={[styles.countBadge, { backgroundColor: colors.card }]}>
          <Text style={[styles.countText, { color: colors.textSecondary }]}>
            {totalExplorations} exploration{totalExplorations !== 1 ? 's' : ''}
          </Text>
        </RNView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    backgroundColor: 'transparent',
  },
  titleSection: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  settingsButton: {
    padding: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'transparent',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  streakText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  countBadge: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
  },
  countText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
});
