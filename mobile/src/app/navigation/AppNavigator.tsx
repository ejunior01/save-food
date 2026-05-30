import { AppStackParamList, AppTabParamList } from "./types";

import { AIRecognize } from "@ui/screens/AIRecognize";
import { AddFood } from "@ui/screens/AddFood";
import { Alerts } from "@ui/screens/Alerts";
import { BottomTabBar } from "@ui/components/BottomTabBar";
import { EditAccount } from "@ui/screens/EditAccount";
import { Home } from "@ui/screens/Home";
import { Household } from "@ui/screens/Household";
import { HouseholdProfile } from "@ui/screens/HouseholdProfile";
import { Insights } from "@ui/screens/Insights";
import { Inventory } from "@ui/screens/Inventory";
import { Profile } from "@ui/screens/Profile";
import React from "react";
import { RecipeDetail } from "@ui/screens/RecipeDetail";
import { Recipes } from "@ui/screens/Recipes";
import { Replenishment } from "@ui/screens/Replenishment";
import { ShoppingList } from "@ui/screens/ShoppingList";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={Home} />
      <HomeStack.Screen name="Recipes" component={Recipes} />
      <Stack.Screen
        name="Insights"
        component={Insights}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="Household"
        component={Household}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="Replenishment"
        component={Replenishment}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="EditAccount"
        component={EditAccount}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="HouseholdProfile"
        component={HouseholdProfile}
        options={{ presentation: "modal" }}
      />
    </HomeStack.Navigator>
  );
}

function TabsNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Alerts" component={Alerts} />
      <Tab.Screen name="AddFood" component={AddFood} />
      <Tab.Screen name="Inventory" component={Inventory} />
      <Tab.Screen name="ShoppingList" component={ShoppingList} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
      <Stack.Screen
        name="AIRecognize"
        component={AIRecognize}
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack.Navigator>
  );
}
