import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Dimensions, View as RNView, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { useExplorations } from '@/hooks/useExplorations';
import { CATEGORY_LABELS, ExplorationCategory } from '@/types/types';

const { width } = Dimensions.get('window');

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

const categoryColors: Record<ExplorationCategory, string> = {
  mobile: COLORS.blue,
  web: COLORS.cyan,
  component: COLORS.pink,
  animation: COLORS.orange,
  other: COLORS.textMuted,
};

export default function StatsScreen() {
  const { getStats, getAchievements } = useExplorations();
  const stats = getStats();
  const achievements = getAchievements();

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  
  // Calculate category percentages for pie chart visualization
  const categoryData = Object.entries(stats.byCategory)
    .map(([category, count]) => ({
      category: category as ExplorationCategory,
      count,
      percentage: stats.total > 0 ? (count / stats.total) * 100 : 0,
    }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Stats</Text>
          <Text style={styles.subtitle}>Your 2026 journey so far</Text>
        </View>

        {/* Streak Cards */}
        <View style={styles.streakRow}>
          <RNView style={[styles.streakCard, { backgroundColor: COLORS.orange + '20' }]}>
            <Text style={[styles.streakValue, { color: COLORS.orange }]}>{stats.currentStreak}</Text>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <FontAwesome name="fire" size={20} color={COLORS.orange} style={styles.streakIcon} />
          </RNView>
          <RNView style={[styles.streakCard, { backgroundColor: COLORS.blue + '20' }]}>
            <Text style={[styles.streakValue, { color: COLORS.blue }]}>{stats.longestStreak}</Text>
            <Text style={styles.streakLabel}>Longest Streak</Text>
            <FontAwesome name="trophy" size={20} color={COLORS.blue} style={styles.streakIcon} />
          </RNView>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <RNView style={styles.statBox}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </RNView>
            <RNView style={styles.statBox}>
              <Text style={[styles.statValue, { color: COLORS.green }]}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </RNView>
          </View>
          <View style={[styles.statsGrid, { marginTop: 12 }]}>
            <RNView style={styles.statBox}>
              <Text style={[styles.statValue, { color: COLORS.orange }]}>{stats.inProgress}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </RNView>
            <RNView style={styles.statBox}>
              <Text style={[styles.statValue, { color: COLORS.blue }]}>{stats.ideas}</Text>
              <Text style={styles.statLabel}>Ideas</Text>
            </RNView>
          </View>
        </View>

        {/* Period Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.periodRow}>
            <RNView style={styles.periodCard}>
              <Text style={styles.periodValue}>{stats.thisWeek}</Text>
              <Text style={styles.periodLabel}>This Week</Text>
            </RNView>
            <RNView style={styles.periodCard}>
              <Text style={styles.periodValue}>{stats.thisMonth}</Text>
              <Text style={styles.periodLabel}>This Month</Text>
            </RNView>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryList}>
            {categoryData.map(({ category, count, percentage }) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <RNView style={[styles.categoryDot, { backgroundColor: categoryColors[category] }]} />
                  <Text style={styles.categoryName}>{CATEGORY_LABELS[category]}</Text>
                  <Text style={styles.categoryCount}>{count}</Text>
                </View>
                <RNView style={styles.progressBarBg}>
                  <RNView 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${percentage}%`,
                        backgroundColor: categoryColors[category],
                      }
                    ]} 
                  />
                </RNView>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Text style={styles.achievementCount}>{unlockedCount}/{achievements.length}</Text>
          </View>
          <View style={styles.achievementsGrid}>
            {achievements.map(achievement => (
              <RNView 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  !achievement.unlockedAt && styles.achievementLocked,
                ]}
              >
                <Text style={[
                  styles.achievementIcon,
                  !achievement.unlockedAt && styles.achievementIconLocked,
                ]}>
                  {achievement.icon}
                </Text>
                <Text style={[
                  styles.achievementName,
                  !achievement.unlockedAt && styles.achievementNameLocked,
                ]}>
                  {achievement.name}
                </Text>
                <Text style={styles.achievementDesc}>
                  {achievement.description}
                </Text>
              </RNView>
            ))}
          </View>
        </View>

        {/* <View style={{ height: 40 }} /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  streakRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  streakCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
  },
  streakValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  streakLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  streakIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    opacity: 0.6,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  achievementCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
  },
  periodCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  periodLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  categoryList: {
    gap: 16,
    backgroundColor: 'transparent',
  },
  categoryItem: {
    backgroundColor: 'transparent',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: 'transparent',
  },
  achievementCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementIconLocked: {
    opacity: 0.4,
  },
  achievementName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementNameLocked: {
    color: COLORS.textMuted,
  },
  achievementDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
