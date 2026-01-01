import { Achievement } from '@/types/types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-flight',
    name: 'First Flight',
    description: 'Complete your first exploration',
    icon: '🚀',
    condition: { type: 'total', value: 1 },
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Complete 10 explorations',
    icon: '🌱',
    condition: { type: 'total', value: 10 },
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Achieve a 7-day streak',
    icon: '🔥',
    condition: { type: 'streak', value: 7 },
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Achieve a 30-day streak',
    icon: '👑',
    condition: { type: 'streak', value: 30 },
  },
  {
    id: 'century',
    name: 'Century',
    description: 'Complete 100 explorations',
    icon: '💯',
    condition: { type: 'total', value: 100 },
  },
  {
    id: 'diverse-designer',
    name: 'Diverse Designer',
    description: 'Use all 5 categories',
    icon: '🎨',
    condition: { type: 'category', value: 5 },
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 5 explorations in one day',
    icon: '⚡',
    condition: { type: 'daily', value: 5 },
  },
  {
    id: 'half-year',
    name: 'Halfway There',
    description: 'Reach day 183 with at least 100 explorations',
    icon: '🎯',
    condition: { type: 'total', value: 100 },
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}
