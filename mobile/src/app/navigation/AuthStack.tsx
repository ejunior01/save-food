import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { Onboarding } from "@ui/screens/Onboarding";
import { RouteProp } from "@react-navigation/native";

type AuthStackParamList = {
  Onboarding: undefined;
};

export type AuthStackNavigationProps =
  NativeStackNavigationProp<AuthStackParamList>;

export type AuthStackScreenProps<TRouteName extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, TRouteName>;

export type AuthStackRouteProps<TRouteName extends keyof AuthStackParamList> =
  RouteProp<AuthStackParamList, TRouteName>;

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
  );
}
