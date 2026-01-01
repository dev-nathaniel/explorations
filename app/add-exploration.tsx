import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View as RNView,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { useExplorations } from '@/hooks/useExplorations';
import { CATEGORY_LABELS, ExplorationCategory, ExplorationStatus, STATUS_LABELS } from '@/types/types';

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

const categoryColors: Record<ExplorationCategory, string> = {
  mobile: COLORS.blue,
  web: COLORS.cyan,
  component: COLORS.pink,
  animation: COLORS.orange,
  other: COLORS.textMuted,
};

const statusColors: Record<ExplorationStatus, string> = {
  idea: COLORS.blue,
  'in-progress': COLORS.orange,
  completed: COLORS.green,
};

const CATEGORIES: ExplorationCategory[] = ['mobile', 'web', 'component', 'animation', 'other'];
const STATUSES: ExplorationStatus[] = ['idea', 'in-progress', 'completed'];

export default function AddExplorationModal() {
  const router = useRouter();
  const { addExploration } = useExplorations();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExplorationCategory>('mobile');
  const [status, setStatus] = useState<ExplorationStatus>('idea');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addExploration({
        title: title.trim(),
        description: description.trim() || undefined,
        date: new Date().toISOString().split('T')[0],
        category,
        status,
      });
      router.back();
    } catch (error) {
      console.error('Failed to add exploration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <FontAwesome name="times" size={20} color={COLORS.textMuted} />
          </Pressable>
          <Text style={styles.headerTitle}>New Exploration</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What are you building?"
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Optional details..."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pillContainer}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.pill,
                    category === cat && { 
                      backgroundColor: categoryColors[cat] + '20',
                      borderColor: categoryColors[cat],
                    },
                  ]}
                >
                  <Text style={[
                    styles.pillText,
                    category === cat && { color: categoryColors[cat] },
                  ]}>
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Status */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pillContainer}>
              {STATUSES.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setStatus(s)}
                  style={[
                    styles.pill,
                    status === s && { 
                      backgroundColor: statusColors[s] + '20',
                      borderColor: statusColors[s],
                    },
                  ]}
                >
                  <RNView style={[styles.statusDot, { backgroundColor: statusColors[s] }]} />
                  <Text style={[
                    styles.pillText,
                    status === s && { color: statusColors[s] },
                  ]}>
                    {STATUS_LABELS[s]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Submit */}
        <View style={styles.footer}>
          <Pressable
            onPress={handleSubmit}
            disabled={!title.trim() || isSubmitting}
            style={({ pressed }) => [
              styles.submitButton,
              { opacity: !title.trim() || isSubmitting ? 0.5 : pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={styles.submitText}>
              {isSubmitting ? 'Creating...' : 'Create Exploration'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: 'transparent',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  submitButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
