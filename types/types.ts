export interface Exploration {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  dayNumber: number; // Day of year (1-366)
  category: ExplorationCategory;
  status: ExplorationStatus;
  thumbnailUri?: string;
  tags?: string[];
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExplorationTemplate {
  id: string;
  name: string;
  description: string;
  category: ExplorationCategory;
  defaultTags: string[];
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  condition: { type: 'streak' | 'total' | 'category' | 'daily'; value: number };
}

export type ExplorationCategory = 'mobile' | 'web' | 'component' | 'animation' | 'other';

export type ExplorationStatus = 'idea' | 'in-progress' | 'completed';

export const CATEGORY_LABELS: Record<ExplorationCategory, string> = {
  mobile: 'Mobile',
  web: 'Web',
  component: 'Component',
  animation: 'Animation',
  other: 'Other',
};

export const STATUS_LABELS: Record<ExplorationStatus, string> = {
  idea: 'Idea',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

// Helper to get day of year
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Helper to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Generate unique ID
export function generateId(): string {
  return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
