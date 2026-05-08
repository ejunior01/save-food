import { StyleSheet } from 'react-native';
import { theme } from '@ui/styles/theme';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowFocused: {
    borderColor: theme.colors.primary,
  },
  rowError: {
    borderColor: theme.colors.danger.DEFAULT,
  },
  input: {
    flex: 1,
    fontFamily: theme.fontFamily.sans.regular,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    includeFontPadding: false,
    padding: 0,
  },
  error: {
    color: theme.colors.danger.DEFAULT,
    fontFamily: theme.fontFamily.sans.regular,
    fontSize: theme.fontSize.xs,
    includeFontPadding: false,
  },
});
