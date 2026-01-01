import { ExplorationTemplate } from '@/types/types';

export const TEMPLATES: ExplorationTemplate[] = [
  {
    id: 'mobile-app',
    name: 'Mobile App Screen',
    description: 'Design a mobile app screen with navigation and interactions',
    category: 'mobile',
    defaultTags: ['ios', 'android', 'screen'],
    icon: 'mobile',
  },
  {
    id: 'web-landing',
    name: 'Web Landing Page',
    description: 'Create a compelling landing page with hero section',
    category: 'web',
    defaultTags: ['landing', 'hero', 'responsive'],
    icon: 'globe',
  },
  {
    id: 'ui-component',
    name: 'UI Component',
    description: 'Build a reusable UI component with variants',
    category: 'component',
    defaultTags: ['reusable', 'design-system'],
    icon: 'puzzle-piece',
  },
  {
    id: 'micro-animation',
    name: 'Micro Animation',
    description: 'Create a delightful micro-interaction or animation',
    category: 'animation',
    defaultTags: ['motion', 'interaction', 'lottie'],
    icon: 'magic',
  },
  {
    id: 'dashboard',
    name: 'Dashboard Widget',
    description: 'Design a data visualization or dashboard component',
    category: 'web',
    defaultTags: ['dashboard', 'charts', 'data-viz'],
    icon: 'chart-bar',
  },
];

export function getTemplateById(id: string): ExplorationTemplate | undefined {
  return TEMPLATES.find(t => t.id === id);
}
