import { StyleSheet } from 'react-native';
import { theme } from '@ui/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 22,
    paddingVertical: 8,
  },
  skipButton: {
    minHeight: 36,
    justifyContent: 'center',
  },
  skipText: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.sans.semiBold,
    fontSize: theme.fontSize.sm,
  },
  mainContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  productFrame: {
    alignItems: 'center',
    backgroundColor: theme.colors.success.soft,
    borderRadius: 110,
    height: 220,
    justifyContent: 'center',
    marginBottom: 32,
    width: 220,
  },
  productImage: {
    includeFontPadding: false,
    lineHeight: 124,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.text,
    fontFamily: theme.fontFamily.sans.semiBold,
    fontSize: theme.fontSize['2xl'],
    lineHeight: 34,
    margin: 0,
    maxWidth: 330,
    textAlign: 'center',
  },
  description: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.sans.regular,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 320,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 22,
  },
  indicators: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    backgroundColor: theme.colors.gray[500],
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  indicatorActive: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    minHeight: 56,
    justifyContent: 'center',
    width: '100%',
  },
  nextButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fontFamily.sans.semiBold,
    fontSize: theme.fontSize.base,
  },
  pressed: {
    opacity: 0.72,
  },
});
