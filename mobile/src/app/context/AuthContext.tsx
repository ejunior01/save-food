import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_ONBOARDING = '@savefood:onboarding_done';

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  signIn: () => void;
  signOut: () => void;
  markOnboardingDone: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY_ONBOARDING).then((value) => {
      setHasSeenOnboarding(value === 'true');
      setIsReady(true);
    });
  }, []);

  function signIn() {
    setIsAuthenticated(true);
  }

  function signOut() {
    setIsAuthenticated(false);
  }

  async function markOnboardingDone() {
    await AsyncStorage.setItem(KEY_ONBOARDING, 'true');
    setHasSeenOnboarding(true);
  }

  return (
    <AuthContext.Provider value={{ isReady, isAuthenticated, hasSeenOnboarding, signIn, signOut, markOnboardingDone }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) { throw new Error('useAuth must be used inside AuthProvider'); }
  return ctx;
}
