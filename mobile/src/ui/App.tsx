import "react-native-reanimated";

import * as SplashScreen from "expo-splash-screen";

import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from "@expo-google-fonts/dm-sans";
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  JetBrainsMono_400Regular,
} from "@expo-google-fonts/jetbrains-mono";
import { Navigation } from "@app/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { AuthProvider, useAuth } from "@app/context/AuthContext";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isReady } = useAuth();
  const [isFontsLoaded, fontError] = useFonts({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    JetBrainsMono_400Regular,
  });

  useEffect(() => {
    if ((isFontsLoaded || fontError) && isReady) {
      SplashScreen.hideAsync();
    }
  }, [isFontsLoaded, fontError, isReady]);

  if ((!isFontsLoaded && !fontError) || !isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
