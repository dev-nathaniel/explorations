import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View as RNView, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { useExplorations } from '@/hooks/useExplorations';
import { CATEGORY_LABELS, STATUS_LABELS, formatDate } from '@/types/types';

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

export default function ExplorationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { explorations, updateExploration, deleteExploration } = useExplorations();
  
  const exploration = explorations.find(e => e.id === id);

  if (!exploration) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Exploration not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleStatusChange = async (newStatus: 'idea' | 'in-progress' | 'completed') => {
    await updateExploration(exploration.id, { status: newStatus });
  };

  const handleDelete = async () => {
    await deleteExploration(exploration.id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backIcon}>
          <FontAwesome name="arrow-left" size={20} color={COLORS.text} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <FontAwesome name="trash-o" size={18} color={COLORS.textMuted} />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Day Badge */}
        <RNView style={[styles.dayBadge, { backgroundColor: categoryColors[exploration.category] }]}>
          <Text style={styles.dayText}>Day {exploration.dayNumber}</Text>
        </RNView>

        {/* Title */}
        <Text style={styles.title}>{exploration.title}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          <Text style={styles.date}>{formatDate(exploration.date)}</Text>
          <RNView style={[styles.categoryPill, { borderColor: categoryColors[exploration.category] }]}>
            <Text style={[styles.categoryText, { color: categoryColors[exploration.category] }]}>
              {CATEGORY_LABELS[exploration.category]}
            </Text>
          </RNView>
        </View>

        {/* Description */}
        {exploration.description && (
          <Text style={styles.description}>{exploration.description}</Text>
        )}

        {/* Status Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusRow}>
            {(['idea', 'in-progress', 'completed'] as const).map(status => (
              <Pressable
                key={status}
                onPress={() => handleStatusChange(status)}
                style={[
                  styles.statusButton,
                  exploration.status === status && { 
                    backgroundColor: statusColors[status] + '20',
                    borderColor: statusColors[status],
                  },
                ]}
              >
                <RNView style={[styles.statusDot, { backgroundColor: statusColors[status] }]} />
                <Text style={[
                  styles.statusText,
                  exploration.status === status && { color: statusColors[status] },
                ]}>
                  {STATUS_LABELS[status]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Timestamps */}
        <View style={styles.timestamps}>
          <Text style={styles.timestamp}>Created: {new Date(exploration.createdAt).toLocaleString()}</Text>
          <Text style={styles.timestamp}>Updated: {new Date(exploration.updatedAt).toLocaleString()}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backIcon: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: 'transparent',
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dayBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  dayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  date: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  categoryPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'transparent',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  timestamps: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 4,
    backgroundColor: 'transparent',
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.text,
    fontWeight: '500',
  },
});
