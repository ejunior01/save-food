import 'react-native-reanimated';

import {
  HostGrotesk_400Regular,
  HostGrotesk_500Medium,
  HostGrotesk_600SemiBold,
  useFonts,
} from '@expo-google-fonts/host-grotesk';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Navigation } from '@app/navigation';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export function App() {
  const [isFontsLoaded] = useFonts({
    HostGrotesk_400Regular,
    HostGrotesk_500Medium,
    HostGrotesk_600SemiBold,
  });

  useEffect(() => {
    if (isFontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isFontsLoaded]);

  if (!isFontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
