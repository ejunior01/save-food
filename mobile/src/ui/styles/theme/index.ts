const colors = {
  white: '#FFFFFF',
  primary: '#1F4D2E',
  background: '#FAF5EB',
  surface: '#FFFFFF',
  surface2: '#F6F0E2',
  text: '#1A2B1F',
  textMuted: 'rgba(26,43,31,0.52)',
  border: 'rgba(26,43,31,0.1)',
  block: {
    pistachio: '#D5E2A8',
    cream: '#F0E6CF',
    peach: '#F2C57C',
    rose: '#EAB5A8',
    sage: '#C8D9B5',
    charcoal: '#2D3B32',
  },
  success: {
    DEFAULT: '#5C8D4A',
    soft: '#E2EBD2',
  },
  warning: {
    DEFAULT: '#B5901E',
    soft: '#F3E9C3',
  },
  danger: {
    DEFAULT: '#B33A3A',
    soft: '#F3D6D2',
  },
  info: {
    DEFAULT: '#C97A2D',
    soft: '#F6E0C8',
  },
  gray: {
    100: '#fafafa',
    200: '#f4f4f5',
    300: '#f3f4f6',
    400: '#e4e4e7',
    500: '#d9d9d9',
    600: '#a1a1aa',
    700: '#71717a',
  },
  black: {
    600: '#1e293b',
    700: '#18181b',
    800: '#09090b',
    900: '#000000',
  },
} as const;

const fontFamily = {
  sans: {
    regular: 'HostGrotesk_400Regular',
    medium: 'HostGrotesk_500Medium',
    semiBold: 'HostGrotesk_600SemiBold',
  },
  display: {
    regular: 'InstrumentSerif_400Regular',
    italic: 'InstrumentSerif_400Regular_Italic',
  },
} as const;

const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 36,
  '4xl': 44,
} as const;

const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;

export const theme = {
  colors,
  fontFamily,
  fontSize,
  radii,
} as const;
