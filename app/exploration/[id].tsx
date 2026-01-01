import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, View as RNView, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { useExplorations } from '@/hooks/useExplorations';
import { CATEGORY_LABELS, ExplorationCategory, ExplorationStatus, STATUS_LABELS, formatDate } from '@/types/types';

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

const CATEGORIES: ExplorationCategory[] = ['mobile', 'web', 'component', 'animation', 'other'];

export default function ExplorationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { explorations, updateExploration, deleteExploration } = useExplorations();
  
  const exploration = explorations.find(e => e.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(exploration?.title || '');
  const [editDescription, setEditDescription] = useState(exploration?.description || '');
  const [editCategory, setEditCategory] = useState<ExplorationCategory>(exploration?.category || 'mobile');
  const [editTags, setEditTags] = useState(exploration?.tags?.join(', ') || '');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleStatusChange = async (newStatus: ExplorationStatus) => {
    await updateExploration(exploration.id, { status: newStatus });
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Exploration',
      'Are you sure you want to delete this exploration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteExploration(exploration.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setEditTitle(exploration.title);
    setEditDescription(exploration.description || '');
    setEditCategory(exploration.category);
    setEditTags(exploration.tags?.join(', ') || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    
    setIsSaving(true);
    try {
      const tags = editTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
      
      await updateExploration(exploration.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        category: editCategory,
        tags: tags.length > 0 ? tags : undefined,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backIcon}>
          <FontAwesome name="arrow-left" size={20} color={COLORS.text} />
        </Pressable>
        <View style={styles.headerActions}>
          {isEditing ? (
            <>
              <Pressable onPress={handleCancel} style={styles.headerButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSave} style={styles.saveButton} disabled={isSaving}>
                <Text style={styles.saveText}>{isSaving ? 'Saving...' : 'Save'}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={handleEdit} style={styles.editButton}>
                <FontAwesome name="pencil" size={18} color={COLORS.blue} />
              </Pressable>
              <Pressable onPress={handleDelete} style={styles.deleteButton}>
                <FontAwesome name="trash-o" size={18} color={COLORS.textMuted} />
              </Pressable>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Day Badge */}
        <RNView style={[styles.dayBadge, { backgroundColor: categoryColors[exploration.category] }]}>
          <Text style={styles.dayText}>Day {exploration.dayNumber}</Text>
        </RNView>

        {/* Title */}
        {isEditing ? (
          <TextInput
            style={styles.titleInput}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Title"
            placeholderTextColor={COLORS.textMuted}
            autoFocus
          />
        ) : (
          <Text style={styles.title}>{exploration.title}</Text>
        )}

        {/* Meta */}
        <View style={styles.meta}>
          <Text style={styles.date}>{formatDate(exploration.date)}</Text>
          {!isEditing && (
            <RNView style={[styles.categoryPill, { borderColor: categoryColors[exploration.category] }]}>
              <Text style={[styles.categoryText, { color: categoryColors[exploration.category] }]}>
                {CATEGORY_LABELS[exploration.category]}
              </Text>
            </RNView>
          )}
        </View>

        {/* Category (Edit Mode) */}
        {isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map(cat => (
                <Pressable
                  key={cat}
                  onPress={() => setEditCategory(cat)}
                  style={[
                    styles.categoryButton,
                    editCategory === cat && { 
                      backgroundColor: categoryColors[cat] + '20',
                      borderColor: categoryColors[cat],
                    },
                  ]}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    editCategory === cat && { color: categoryColors[cat] },
                  ]}>
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Description */}
        {isEditing ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Add a description..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>
        ) : exploration.description ? (
          <Text style={styles.description}>{exploration.description}</Text>
        ) : null}

        {/* Tags */}
        {isEditing ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <TextInput
              style={styles.tagsInput}
              value={editTags}
              onChangeText={setEditTags}
              placeholder="tag1, tag2, tag3..."
              placeholderTextColor={COLORS.textMuted}
            />
            <Text style={styles.tagsHint}>Separate tags with commas</Text>
          </View>
        ) : exploration.tags && exploration.tags.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsRow}>
              {exploration.tags.map((tag, index) => (
                <RNView key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </RNView>
              ))}
            </View>
          </View>
        ) : null}

        {/* Status Selector */}
        {!isEditing && (
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
        )}

        {/* Timestamps */}
        {!isEditing && (
          <View style={styles.timestamps}>
            <Text style={styles.timestamp}>Created: {new Date(exploration.createdAt).toLocaleString()}</Text>
            <Text style={styles.timestamp}>Updated: {new Date(exploration.updatedAt).toLocaleString()}</Text>
          </View>
        )}
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
    gap: 12,
    backgroundColor: 'transparent',
  },
  headerButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.blue,
    borderRadius: 8,
  },
  cancelText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    padding: 0,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blue,
    paddingBottom: 8,
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
  descriptionInput: {
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  section: {
    marginBottom: 24,
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
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: 'transparent',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
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
  tagsInput: {
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagsHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: 'transparent',
  },
  tag: {
    backgroundColor: COLORS.card,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: 13,
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
