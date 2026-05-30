const colors = {
  // surfaces
  canvas: "#FAF5EB",
  canvas2: "#F4ECDB",
  surface: "#FFFFFF",
  surfaceSoft: "#F6F0E2",

  // ink
  ink: "#1A2B1F",
  ink2: "#2C3E32",
  muted: "rgba(26,43,31,0.62)",
  muted2: "rgba(26,43,31,0.45)",
  hairline: "rgba(26,43,31,0.10)",
  hairlineSoft: "rgba(26,43,31,0.06)",

  // brand
  primary: "#1F4D2E",
  primary2: "#143822",
  onPrimary: "#FAF5EB",

  // color blocks
  block: {
    pistachio: "#D5E2A8",
    cream: "#F0E6CF",
    peach: "#F2C57C",
    rose: "#EAB5A8",
    sage: "#C8D9B5",
    clay: "#D9A57C",
    charcoal: "#1A2B1F",
  },

  // semantic / expiry
  safe: "#5C8D4A",
  safeSoft: "#E2EBD2",
  soon: "#B5901E",
  soonSoft: "#F3E9C3",
  urgent: "#C97A2D",
  urgentSoft: "#F6E0C8",
  danger: "#B33A3A",
  dangerSoft: "#F3D6D2",

  // legacy aliases (keep for compat during migration)
  white: "#FFFFFF",
  background: "#FAF5EB",
  text: "#1A2B1F",
  textMuted: "rgba(26,43,31,0.62)",
  border: "rgba(26,43,31,0.10)",
} as const;

const fontFamily = {
  sans: {
    regular: "DMSans_400Regular",
    medium: "DMSans_500Medium",
    semiBold: "DMSans_600SemiBold",
  },
  display: {
    regular: "InstrumentSerif_400Regular",
    italic: "InstrumentSerif_400Regular_Italic",
  },
  mono: {
    regular: "JetBrainsMono_400Regular",
  },
} as const;

const fontSize = {
  xs: 10.5,
  sm: 13,
  base: 15,
  lg: 20,
  xl: 26,
  "2xl": 32,
  "3xl": 42,
  "4xl": 56,
} as const;

const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;

const shadows = {
  sm: { shadowColor: "#1A2B1F", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 0, elevation: 1 },
  md: { shadowColor: "#1A2B1F", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 14, elevation: 3 },
  lg: { shadowColor: "#1A2B1F", shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.10, shadowRadius: 40, elevation: 8 },
} as const;

export const theme = {
  colors,
  fontFamily,
  fontSize,
  radii,
  shadows,
} as const;
