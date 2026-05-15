import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPlan } from '@app/types';

const KEY_ONBOARDING = '@savefood:onboarding_done';
const KEY_PLAN = '@savefood:plan';

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  plan: UserPlan;
  signIn: () => void;
  signOut: () => void;
  markOnboardingDone: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  downgradeTofree: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [plan, setPlan] = useState<UserPlan>('free');

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(KEY_ONBOARDING),
      AsyncStorage.getItem(KEY_PLAN),
    ]).then(([onboarding, savedPlan]) => {
      setHasSeenOnboarding(onboarding === 'true');
      if (savedPlan === 'premium') { setPlan('premium'); }
      setIsReady(true);
    });
  }, []);

  function signIn() { setIsAuthenticated(true); }
  function signOut() { setIsAuthenticated(false); }

  async function markOnboardingDone() {
    await AsyncStorage.setItem(KEY_ONBOARDING, 'true');
    setHasSeenOnboarding(true);
  }

  async function upgradeToPremium() {
    await AsyncStorage.setItem(KEY_PLAN, 'premium');
    setPlan('premium');
  }

  async function downgradeTofree() {
    await AsyncStorage.setItem(KEY_PLAN, 'free');
    setPlan('free');
  }

  return (
    <AuthContext.Provider value={{ isReady, isAuthenticated, hasSeenOnboarding, plan, signIn, signOut, markOnboardingDone, upgradeToPremium, downgradeTofree }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) { throw new Error('useAuth must be used inside AuthProvider'); }
  return ctx;
}
