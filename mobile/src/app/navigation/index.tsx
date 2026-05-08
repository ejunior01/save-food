import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@app/lib/queryClient';
import { AuthProvider } from '@app/context/AuthContext';
import { AppDataProvider } from '@app/context/AppDataContext';
import { RootStack } from './RootStack';

export function Navigation() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppDataProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </AppDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
