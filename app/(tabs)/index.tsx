import { useRouter } from 'expo-router';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExplorationCard } from '@/components/ExplorationCard';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Text, View } from '@/components/Themed';
import { useExplorations } from '@/hooks/useExplorations';
import { getDayOfYear } from '@/types/types';

const COLORS = {
  bg: '#09090B',
  text: '#FAFAFA',
  textMuted: '#71717A',
  blue: '#2665f1',
};

export default function ExplorationsScreen() {
  const router = useRouter();
  const { explorations, isLoading, getStreak, reload } = useExplorations();
  const streak = getStreak();
  const currentDay = getDayOfYear(new Date());
  const year = new Date().getFullYear();

  const handleAddPress = () => {
    router.push('/add-exploration');
  };

  const handleExplorationPress = (id: string) => {
    router.push(`/exploration/${id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Day {currentDay} · {year}</Text>
          {streak > 0 && (
            <Text style={styles.streak}>🔥 {streak}</Text>
          )}
        </View>
        <Text style={styles.title}>Explorations</Text>
        <Text style={styles.count}>
          {explorations.length} exploration{explorations.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {explorations.length === 0 && !isLoading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No explorations yet</Text>
          <Text style={styles.emptyText}>Tap + to start your first one</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={reload}
              tintColor={COLORS.blue}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {explorations.map((exploration) => (
              <ExplorationCard
                key={exploration.id}
                exploration={exploration}
                onPress={() => handleExplorationPress(exploration.id)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      <FloatingActionButton onPress={handleAddPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  greeting: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  streak: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  count: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
