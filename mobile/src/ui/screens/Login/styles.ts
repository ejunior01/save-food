import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logoArea: {
    paddingTop: 8,
    alignItems: 'center',
  },
  ctaArea: {
    paddingBottom: 8,
  },
  headline: {
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  actions: {
    gap: 16,
    marginTop: 28,
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
});
