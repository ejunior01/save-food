import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { AuthStack } from "./AuthStack";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  Auth: undefined;
};

export type RootStackNavigationProps =
  NativeStackNavigationProp<RootStackParamList>;

export type RootStackScreenProps<TRouteName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, TRouteName>;

export type RootStackRouteProps<TRouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, TRouteName>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{
          animationTypeForReplace: "pop",
        }}
      />
    </Stack.Navigator>
  );
}
