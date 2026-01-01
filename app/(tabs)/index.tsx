import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, View as RNView, ScrollView, StyleSheet, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingActionButton } from '@/components/FloatingActionButton';
import { SwipeableExplorationCard } from '@/components/SwipeableExplorationCard';
import { Text, View } from '@/components/Themed';
import { useExplorations } from '@/hooks/useExplorations';
import { ExplorationCategory, ExplorationStatus, getDayOfYear } from '@/types/types';

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
};

type FilterType = 'all' | ExplorationStatus | ExplorationCategory;

const FILTERS: { key: FilterType; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: COLORS.blue },
  { key: 'idea', label: 'Ideas', color: COLORS.blue },
  { key: 'in-progress', label: 'In Progress', color: COLORS.orange },
  { key: 'completed', label: 'Done', color: COLORS.green },
  { key: 'mobile', label: 'Mobile', color: COLORS.blue },
  { key: 'web', label: 'Web', color: COLORS.cyan },
];

export default function ExplorationsScreen() {
  const router = useRouter();
  const { explorations, isLoading, getStreak, reload, searchExplorations, updateExploration, deleteExploration } = useExplorations();
  const streak = getStreak();
  const currentDay = getDayOfYear(new Date());
  const year = new Date().getFullYear();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredExplorations = useMemo(() => {
    let filters: { status?: ExplorationStatus; category?: ExplorationCategory } = {};
    
    if (['idea', 'in-progress', 'completed'].includes(activeFilter)) {
      filters.status = activeFilter as ExplorationStatus;
    } else if (['mobile', 'web', 'component', 'animation', 'other'].includes(activeFilter)) {
      filters.category = activeFilter as ExplorationCategory;
    }
    
    return searchExplorations(searchQuery, Object.keys(filters).length > 0 ? filters : undefined);
  }, [searchQuery, activeFilter, searchExplorations]);

  const handleAddPress = () => {
    router.push('/add-exploration');
  };

  const handleExplorationPress = (id: string) => {
    router.push(`/exploration/${id}`);
  };

  const handleComplete = async (id: string) => {
    await updateExploration(id, { status: 'completed' });
  };

  const handleDelete = async (id: string) => {
    await deleteExploration(id);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            {filteredExplorations.length} of {explorations.length} exploration{explorations.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <RNView style={styles.searchInputWrapper}>
            <FontAwesome name="search" size={16} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search explorations..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <FontAwesome name="times-circle" size={16} color={COLORS.textMuted} />
              </Pressable>
            )}
          </RNView>
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map(filter => (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[
                styles.filterChip,
                activeFilter === filter.key && { 
                  backgroundColor: filter.color + '20',
                  borderColor: filter.color,
                },
              ]}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter.key && { color: filter.color },
              ]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {filteredExplorations.length === 0 && !isLoading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {searchQuery || activeFilter !== 'all' ? 'No matches found' : 'No explorations yet'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery || activeFilter !== 'all' ? 'Try adjusting your search or filters' : 'Tap + to start your first one'}
            </Text>
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
            {filteredExplorations.map((exploration) => (
              <SwipeableExplorationCard
                key={exploration.id}
                exploration={exploration}
                onPress={() => handleExplorationPress(exploration.id)}
                onComplete={() => handleComplete(exploration.id)}
                onDelete={() => handleDelete(exploration.id)}
              />
            ))}
          </ScrollView>
        )}

        <FloatingActionButton onPress={handleAddPress} />
      </SafeAreaView>
    </GestureHandlerRootView>
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
    paddingBottom: 16,
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    maxHeight: 44,
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
