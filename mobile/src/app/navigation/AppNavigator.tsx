import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppStack } from './AppStack';
import { RecipeDetail } from '@ui/screens/RecipeDetail';
import { Recipes } from '@ui/screens/Recipes';
import { Insights } from '@ui/screens/Insights';
import { Household } from '@ui/screens/Household';
import { Replenishment } from '@ui/screens/Replenishment';
import { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppStack} />
      <Stack.Screen name="Recipes" component={Recipes} options={{ presentation: 'modal' }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetail} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Insights" component={Insights} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Household" component={Household} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Replenishment" component={Replenishment} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
