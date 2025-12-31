/**
 * Eidolon Design Tokens
 * Based on eidolon-design-system-UIUX-spec.md
 */

export const colors = {
  // Backgrounds
  bg: {
    base: '#0a0a0c',
    surface: '#121216',
    elevated: '#1a1a20',
    hover: '#22222a',
    active: '#2a2a34',
    input: '#16161a',
  },

  // Accents
  accent: {
    primary: '#8b5cf6', // Phantom Purple
    primaryHover: '#7c3aed',
    primaryGlow: 'rgba(139, 92, 246, 0.15)',
    secondary: '#e040a0', // Electric Magenta
    secondaryHover: '#c03080',
    tertiary: '#00d4aa', // Spectral Teal
    warm: '#f4a024', // Sunrise Orange
  },

  // Text
  text: {
    primary: '#f0f0f2',
    secondary: '#a0a0a8',
    tertiary: '#606068',
    inverse: '#0a0a0c',
  },

  // Status
  status: {
    success: '#00d4aa',
    warning: '#f4a024',
    error: '#e040a0',
    info: '#8b5cf6',
  },

  // Borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    default: 'rgba(255, 255, 255, 0.1)',
    active: 'rgba(139, 92, 246, 0.5)',
  },

  // Tweek-specific
  tweek: {
    fur: '#8b6b4a',
    furLight: '#a08060',
    furDark: '#5c4033',
    coffee: '#92400e',
    energyDrink: '#f4a024',
  },
} as const;

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export const radii = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 12px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  xl: '0 16px 48px rgba(0, 0, 0, 0.6)',
  glow: '0 0 20px rgba(139, 92, 246, 0.15)',
  focusRing: '0 0 0 2px #0a0a0c, 0 0 0 4px #8b5cf6',
} as const;

export const typography = {
  fonts: {
    display: "'Satoshi', system-ui, sans-serif",
    body: "'General Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', Consolas, monospace",
  },
  sizes: {
    display: '32px',
    h1: '24px',
    h2: '20px',
    h3: '16px',
    body: '15px',
    small: '13px',
    tiny: '12px',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
} as const;

export const layout = {
  sidebarWidth: '260px',
  sidebarCollapsed: '56px',
  chatMaxWidth: '768px',
  editorMaxWidth: '900px',
  panelPadding: '16px',
  messageGap: '16px',
  toolbarHeight: '48px',
  statusbarHeight: '28px',
} as const;

export const animation = {
  duration: {
    instant: '50ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

/**
 * Generate CSS custom properties from design tokens
 */
export function generateCSSVariables(): string {
  return `
:root {
  /* Backgrounds */
  --bg-base: ${colors.bg.base};
  --bg-surface: ${colors.bg.surface};
  --bg-elevated: ${colors.bg.elevated};
  --bg-hover: ${colors.bg.hover};
  --bg-active: ${colors.bg.active};
  --bg-input: ${colors.bg.input};

  /* Accents */
  --accent-primary: ${colors.accent.primary};
  --accent-primary-hover: ${colors.accent.primaryHover};
  --accent-primary-glow: ${colors.accent.primaryGlow};
  --accent-secondary: ${colors.accent.secondary};
  --accent-secondary-hover: ${colors.accent.secondaryHover};
  --accent-tertiary: ${colors.accent.tertiary};
  --accent-warm: ${colors.accent.warm};

  /* Text */
  --text-primary: ${colors.text.primary};
  --text-secondary: ${colors.text.secondary};
  --text-tertiary: ${colors.text.tertiary};
  --text-inverse: ${colors.text.inverse};

  /* Status */
  --status-success: ${colors.status.success};
  --status-warning: ${colors.status.warning};
  --status-error: ${colors.status.error};
  --status-info: ${colors.status.info};

  /* Borders */
  --border-subtle: ${colors.border.subtle};
  --border-default: ${colors.border.default};
  --border-active: ${colors.border.active};

  /* Shadows */
  --shadow-sm: ${shadows.sm};
  --shadow-md: ${shadows.md};
  --shadow-lg: ${shadows.lg};
  --shadow-glow: ${shadows.glow};
  --focus-ring: ${shadows.focusRing};

  /* Layout */
  --sidebar-width: ${layout.sidebarWidth};
  --sidebar-collapsed: ${layout.sidebarCollapsed};
  --chat-max-width: ${layout.chatMaxWidth};
  --editor-max-width: ${layout.editorMaxWidth};

  /* Typography */
  --font-display: ${typography.fonts.display};
  --font-body: ${typography.fonts.body};
  --font-mono: ${typography.fonts.mono};

  /* Tweek */
  --tweek-fur: ${colors.tweek.fur};
  --tweek-coffee: ${colors.tweek.coffee};
}
`.trim();
}
