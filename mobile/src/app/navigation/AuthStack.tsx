import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Splash } from "@ui/screens/Splash";
import { Onboarding } from "@ui/screens/Onboarding";
import { Biometric } from "@ui/screens/Biometric";
import { Login } from "@ui/screens/Login";
import { SignUp } from "@ui/screens/SignUp";
import { FamilySetup } from "@ui/screens/FamilySetup";
import { PlanPicker } from "@ui/screens/PlanPicker";
import { SignUpSuccess } from "@ui/screens/SignUpSuccess";
import { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Biometric" component={Biometric} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="FamilySetup" component={FamilySetup} />
      <Stack.Screen name="PlanPicker" component={PlanPicker} />
      <Stack.Screen name="SignUpSuccess" component={SignUpSuccess} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
