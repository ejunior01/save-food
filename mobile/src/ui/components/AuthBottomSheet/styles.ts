import { StyleSheet } from 'react-native';
import { theme } from '@ui/styles/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  heading: {
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  form: {
    gap: 16,
    marginTop: 20,
  },
  biometricLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 13,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: '#3DA67212',
  },
  biometricOffer: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 16,
  },
  biometricIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3DA67215',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  biometricOfferActions: {
    width: '100%',
    gap: 8,
    marginTop: 8,
  },
});
