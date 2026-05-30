import { createJSONStorage, persist } from "zustand/middleware";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPlan } from "@app/types";
import { create } from "zustand";

export type DietaryRestriction =
  | "sem_lactose"
  | "vegetariano"
  | "sem_gluten"
  | "diabetico"
  | "vegano"
  | "halal"
  | "sem_frutos_do_mar";

export interface IUserState {
  name: string;
  email: string;
  plan: UserPlan;
  avatarUri: string | null;
  houseName: string;
  adults: number;
  kids: number;
  pets: number;
  restrictions: DietaryRestriction[];
  setProfile: (data: { name: string; email: string; avatarUri?: string | null }) => void;
  setHousehold: (data: {
    houseName: string;
    adults: number;
    kids: number;
    pets: number;
    restrictions: DietaryRestriction[];
  }) => void;
  setPlan: (plan: UserPlan) => void;
  setAvatarUri: (uri: string | null) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  name: "",
  email: "",
  plan: "free" as UserPlan,
  avatarUri: null,
  houseName: "",
  adults: 1,
  kids: 0,
  pets: 0,
  restrictions: [] as DietaryRestriction[],
};

export const useUserStore = create<IUserState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setProfile: (data) =>
        set((s) => ({
          name: data.name,
          email: data.email,
          avatarUri: data.avatarUri !== undefined ? data.avatarUri : s.avatarUri,
        })),
      setHousehold: (data) => set(data),
      setPlan: (plan) => set({ plan }),
      setAvatarUri: (uri) => set({ avatarUri: uri }),
      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: "@despensacerta:user",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
