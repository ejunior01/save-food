import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStack } from './AuthStack';
import { AppNavigator } from './AppNavigator';
import { useAuth } from '@app/context/AuthContext';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) { return null; }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen
          name="App"
          component={AppNavigator}
          options={{ animationTypeForReplace: 'push' }}
        />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ animationTypeForReplace: 'pop' }}
        />
      )}
    </Stack.Navigator>
  );
}
