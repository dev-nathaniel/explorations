import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { View as RNView, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { Text, View } from './Themed';
import { useColorScheme } from './useColorScheme';

const SPACING = { xs: 4, sm: 8, xl: 24, '2xl': 32, '3xl': 48 };
const RADIUS = { xl: 24 };
const TYPOGRAPHY = {
  sizes: { sm: 13, md: 15, '2xl': 24, '3xl': 32 },
  weights: { bold: '700' as const },
  lineHeights: { relaxed: 1.75 },
};

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'Start Your 2026 Journey',
  description = 'Tap the + button to create your first UI exploration',
}: EmptyStateProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <RNView style={[styles.iconContainer, { backgroundColor: Colors.palette.accent.blue + '20' }]}>
        <FontAwesome name="rocket" size={48} color={Colors.palette.accent.blue} />
      </RNView>
      
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.blue }]}>366</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Days to Go</Text>
        </View>
        <RNView style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.cyan }]}>∞</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Possibilities</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING['3xl'],
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.md,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.sizes.md * TYPOGRAPHY.lineHeights.relaxed,
    marginBottom: SPACING['2xl'],
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    backgroundColor: 'transparent',
  },
  statValue: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    marginTop: SPACING.xs,
  },
  divider: {
    width: 1,
    height: 40,
  },
});
