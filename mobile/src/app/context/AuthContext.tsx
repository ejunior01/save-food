import React, { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPlan } from "@app/types";
import { fakeSignIn } from "@app/services/AuthService";
import { useUserStore } from "@app/stores/userStore";

const KEY_ONBOARDING = "@despensacerta:onboarding_done";

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  plan: UserPlan;
  signIn: (email: string, password: string) => boolean;
  signInWithStoredUser: () => boolean;
  completeSignUp: () => void;
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

  const { email: storedEmail, plan, setProfile, setHousehold, setPlan, reset } = useUserStore();

  useEffect(() => {
    AsyncStorage.getItem(KEY_ONBOARDING).then((onboarding) => {
      setHasSeenOnboarding(onboarding === "true");
      setIsReady(true);
    });
  }, []);

  function signIn(email: string, password: string): boolean {
    const user = fakeSignIn(email, password);
    if (!user) { return false; }
    setProfile({ name: user.name, email: user.email });
    setHousehold({
      houseName: user.houseName,
      adults: user.adults,
      kids: user.kids,
      pets: user.pets,
      restrictions: [],
    });
    setPlan(user.plan);
    setIsAuthenticated(true);
    return true;
  }

  function signInWithStoredUser(): boolean {
    if (!storedEmail) { return false; }
    setIsAuthenticated(true);
    return true;
  }

  function completeSignUp() {
    setIsAuthenticated(true);
  }

  function signOut() {
    setIsAuthenticated(false);
    reset();
  }

  async function markOnboardingDone() {
    await AsyncStorage.setItem(KEY_ONBOARDING, "true");
    setHasSeenOnboarding(true);
  }

  async function upgradeToPremium() {
    setPlan("premium");
  }

  async function downgradeTofree() {
    setPlan("free");
  }

  return (
    <AuthContext.Provider value={{ isReady, isAuthenticated, hasSeenOnboarding, plan, signIn, signInWithStoredUser, completeSignUp, signOut, markOnboardingDone, upgradeToPremium, downgradeTofree }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) { throw new Error("useAuth must be used inside AuthProvider"); }
  return ctx;
}
