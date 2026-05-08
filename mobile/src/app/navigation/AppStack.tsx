import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { BottomTabBar } from '@ui/components/BottomTabBar';
import { Home } from '@ui/screens/Home';
import { Alerts } from '@ui/screens/Alerts';
import { Scanner } from '@ui/screens/Scanner';
import { Recipes } from '@ui/screens/Recipes';
import { ShoppingList } from '@ui/screens/ShoppingList';
import { AppTabParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppStack() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Alerts" component={Alerts} />
      <Tab.Screen name="Scanner" component={Scanner} />
      <Tab.Screen name="Recipes" component={Recipes} />
      <Tab.Screen name="ShoppingList" component={ShoppingList} />
    </Tab.Navigator>
  );
}
