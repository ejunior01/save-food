import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Onboarding } from '@ui/screens/Onboarding';
import { Biometric } from '@ui/screens/Biometric';
import { Login } from '@ui/screens/Login';
import { SignUp } from '@ui/screens/SignUp';
import { AuthStackParamList } from './types';
import { useAuth } from '@app/context/AuthContext';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const { hasSeenOnboarding } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={hasSeenOnboarding ? 'Login' : 'Onboarding'}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Biometric" component={Biometric} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}
