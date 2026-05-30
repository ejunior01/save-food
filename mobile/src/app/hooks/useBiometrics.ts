import * as LocalAuthentication from "expo-local-authentication";

import { useCallback, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_ENABLED = "@despensacerta:biometrics_enabled";
const KEY_OFFERED = "@despensacerta:biometrics_offered";

type State = {
  isAvailable: boolean;
  isEnabled: boolean;
  wasOffered: boolean;
  isReady: boolean;
};

export function useBiometrics() {
  const [state, setState] = useState<State>({
    isAvailable: false,
    isEnabled: false,
    wasOffered: false,
    isReady: false,
  });

  useEffect(() => {
    Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      AsyncStorage.getItem(KEY_ENABLED),
      AsyncStorage.getItem(KEY_OFFERED),
    ]).then(([hasHardware, isEnrolled, enabled, offered]) => {
      setState({
        isAvailable: hasHardware && isEnrolled,
        isEnabled: enabled === "true",
        wasOffered: offered === "true",
        isReady: true,
      });
    });
  }, []);

  const enable = useCallback(async () => {
    await Promise.all([
      AsyncStorage.setItem(KEY_ENABLED, "true"),
      AsyncStorage.setItem(KEY_OFFERED, "true"),
    ]);
    setState(prev => ({ ...prev, isEnabled: true, wasOffered: true }));
  }, []);

  const markOffered = useCallback(async () => {
    await AsyncStorage.setItem(KEY_OFFERED, "true");
    setState(prev => ({ ...prev, wasOffered: true }));
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Acesse o DespensaCerta com biometria",
      cancelLabel: "Cancelar",
      fallbackLabel: "Usar senha",
    });
    return result.success;
  }, []);

  return { ...state, enable, markOffered, authenticate };
}
