// Design system for TakeOverBench
// Calm, rational, and trustworthy visual language

export const colors = {
  // Primary palette - professional blues
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Neutral grays for text and backgrounds
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic colors for risk levels
  risk: {
    low: '#10b981',      // Emerald green
    medium: '#f59e0b',   // Amber
    high: '#ef4444',     // Red
    critical: '#991b1b', // Dark red
  },

  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Chart colors - muted but distinctive
  chart: {
    1: '#3b82f6',  // Blue
    2: '#8b5cf6',  // Purple
    3: '#10b981',  // Emerald
    4: '#f59e0b',  // Amber
    5: '#ef4444',  // Red
    6: '#06b6d4',  // Cyan
    7: '#ec4899',  // Pink
    8: '#14b8a6',  // Teal
  }
};

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'JetBrains Mono, Monaco, Consolas, "Courier New", monospace',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  }
};

export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  base: '0.25rem', // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

export const transitions = {
  fast: '150ms ease',
  base: '250ms ease',
  slow: '350ms ease',
  slower: '500ms ease',
};

// Risk level styling helpers
export function getRiskColor(level: 'low' | 'medium' | 'high' | 'critical'): string {
  return colors.risk[level];
}

export function getRiskBackgroundColor(level: 'low' | 'medium' | 'high' | 'critical'): string {
  const alphas = {
    low: '10',
    medium: '15',
    high: '15',
    critical: '20'
  };
  return `${colors.risk[level]}${alphas[level]}`;
}

// Time horizon helpers
export function getTimeHorizonLabel(horizon: 'near' | 'medium' | 'long'): string {
  const labels = {
    near: '0-2 years',
    medium: '2-5 years',
    long: '5+ years'
  };
  return labels[horizon];
}

export function getTimeHorizonColor(horizon: 'near' | 'medium' | 'long'): string {
  const horizonColors = {
    near: colors.risk.high,
    medium: colors.risk.medium,
    long: colors.primary[600]
  };
  return horizonColors[horizon];
}

// Capability level helpers
export function getCapabilityLevelColor(level: number): string {
  if (level < 30) return colors.status.success;
  if (level < 50) return colors.gray[500];
  if (level < 70) return colors.status.warning;
  return colors.status.error;
}

export function getCapabilityLevelLabel(level: number): string {
  if (level < 30) return 'Low';
  if (level < 50) return 'Moderate';
  if (level < 70) return 'High';
  if (level < 90) return 'Very High';
  return 'Near Maximum';
}
