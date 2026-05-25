import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Biometric: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Alerts: undefined;
  AddFood: undefined;
  Inventory: undefined;
  ShoppingList: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  RecipeDetail: { recipeId: string };
  Recipes: undefined;
  Insights: undefined;
  Household: undefined;
  Replenishment: { itemId?: string } | undefined;
};

export type RootStackNavigationProps = NativeStackNavigationProp<RootStackParamList>;
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackNavigationProps = NativeStackNavigationProp<AuthStackParamList>;
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;
export type AuthStackRouteProps<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;

export type AppStackNavigationProps = NativeStackNavigationProp<AppStackParamList>;
export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;

export type AppTabScreenProps<T extends keyof AppTabParamList> = BottomTabScreenProps<AppTabParamList, T>;
