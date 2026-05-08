import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppStack } from './AppStack';
import { RecipeDetail } from '@ui/screens/RecipeDetail';
import { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppStack} />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetail}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
