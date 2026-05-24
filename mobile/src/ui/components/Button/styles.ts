import { createVariants } from '@ui/styles/utils/createVariants';
import { theme } from '@ui/styles/theme';

export const containerVariants = createVariants({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  variants: {
    variant: {
      primary: { backgroundColor: theme.colors.text },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.text,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      danger: { backgroundColor: theme.colors.danger.DEFAULT },
    },
    size: {
      sm: {
        minHeight: 36,
        paddingHorizontal: 16,
        borderRadius: theme.radii.pill,
      },
      md: {
        minHeight: 44,
        paddingHorizontal: 20,
        borderRadius: theme.radii.pill,
      },
      lg: {
        minHeight: 54,
        paddingHorizontal: 24,
        borderRadius: theme.radii.pill,
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export const labelVariants = createVariants({
  base: {
    includeFontPadding: false,
    fontFamily: theme.fontFamily.sans.medium,
    letterSpacing: 0.2,
  },
  variants: {
    variant: {
      primary: { color: '#fff' },
      secondary: { color: theme.colors.text },
      ghost: { color: theme.colors.text },
      danger: { color: '#fff' },
    },
    size: {
      sm: { fontSize: theme.fontSize.sm },
      md: { fontSize: 15 },
      lg: { fontSize: theme.fontSize.base },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
