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
      primary: { backgroundColor: theme.colors.primary },
      secondary: {
        backgroundColor: theme.colors.surface2,
        borderWidth: 1,
        borderColor: theme.colors.border,
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
        paddingHorizontal: 12,
        borderRadius: theme.radii.md,
      },
      md: {
        minHeight: 44,
        paddingHorizontal: 16,
        borderRadius: theme.radii.lg,
      },
      lg: {
        minHeight: 56,
        paddingHorizontal: 20,
        borderRadius: theme.radii.lg,
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
    fontFamily: theme.fontFamily.sans.semiBold,
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
