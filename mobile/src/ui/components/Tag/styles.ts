import { createVariants } from '@ui/styles/utils/createVariants';
import { theme } from '@ui/styles/theme';

export const containerVariants = createVariants({
  base: {
    borderRadius: theme.radii.pill,
    alignSelf: 'flex-start',
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  variants: {
    tone: {
      success: { backgroundColor: theme.colors.success.soft },
      warning: { backgroundColor: theme.colors.warning.soft },
      danger: { backgroundColor: theme.colors.danger.soft },
      info: { backgroundColor: theme.colors.info.soft },
      neutral: { backgroundColor: theme.colors.border },
      primary: { backgroundColor: theme.colors.primary },
    },
    size: {
      sm: { paddingHorizontal: 8, paddingVertical: 2 },
      md: { paddingHorizontal: 10, paddingVertical: 4 },
    },
  },
  defaultVariants: {
    tone: 'neutral',
    size: 'md',
  },
});

export const toneTextColors: Record<string, string> = {
  success: theme.colors.success.DEFAULT,
  warning: theme.colors.warning.DEFAULT,
  danger: theme.colors.danger.DEFAULT,
  info: theme.colors.info.DEFAULT,
  neutral: theme.colors.textMuted,
  primary: '#fff',
};
