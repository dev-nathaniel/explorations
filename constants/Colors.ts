// Premium color palette for Explorations app
const palette = {
  // Dark backgrounds
  dark: {
    900: '#0A0A0F',
    800: '#12121A',
    700: '#1A1A25',
    600: '#242432',
    500: '#2E2E3F',
  },
  // Light backgrounds
  light: {
    100: '#FFFFFF',
    200: '#F8F9FC',
    300: '#F0F1F5',
    400: '#E4E5EB',
    500: '#D1D3DB',
  },
  // Accent gradients
  accent: {
    blue: '#2665f1',
    blueLight: '#5B8DF5',
    cyan: '#06B6D4',
    cyanLight: '#22D3EE',
    orange: '#F97316',
    orangeLight: '#FB923C',
    pink: '#EC4899',
    green: '#10B981',
  },
  // Semantic colors
  status: {
    idea: '#2665f1',      // Blue
    inProgress: '#F97316', // Orange
    completed: '#10B981',  // Green
  },
  // Category colors
  category: {
    mobile: '#2665f1',
    web: '#06B6D4',
    component: '#EC4899',
    animation: '#F97316',
    other: '#6B7280',
  },
};

export default {
  light: {
    text: '#1A1A25',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    background: palette.light[200],
    backgroundSecondary: palette.light[100],
    card: palette.light[100],
    cardBorder: palette.light[400],
    tint: palette.accent.blue,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: palette.accent.blue,
    tabBar: palette.light[100],
    tabBarBorder: palette.light[400],
    ...palette.accent,
    ...palette.status,
    ...palette.category,
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    background: palette.dark[900],
    backgroundSecondary: palette.dark[800],
    card: palette.dark[700],
    cardBorder: palette.dark[500],
    tint: palette.accent.blue,
    tabIconDefault: '#71717A',
    tabIconSelected: palette.accent.blue,
    tabBar: palette.dark[800],
    tabBarBorder: palette.dark[600],
    ...palette.accent,
    ...palette.status,
    ...palette.category,
  },
  palette,
};
