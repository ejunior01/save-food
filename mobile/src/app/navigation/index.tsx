import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { queryClient } from "@app/lib/queryClient";
import { AppDataProvider } from "@app/context/AppDataContext";
import { RootStack } from "./RootStack";

export function Navigation() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppDataProvider>
        <BottomSheetModalProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </BottomSheetModalProvider>
      </AppDataProvider>
    </QueryClientProvider>
  );
}
