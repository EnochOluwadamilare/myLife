import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HealthSetupState {
  //   isPregnant: boolean | null;
  expectedDeliveryDate: string;
  weight: number | null;
  height: number | null;
  dob: Date | string | null;
  gender: string | null,
 

  existing_health_conditions: string[];
  receivingCare: boolean | null;
  viral_load: number | null,
  cd4_count: number | null,
  genotype: string,
  blood_group: string,

  preferences: {
    pregnancy_updates: boolean,
    daily_health_tips: boolean,
    exercise_reminders: boolean,
    doctor_consultation: boolean,
    notifications_enabled: boolean,
 },

  updateSetup: (data: Partial<HealthSetupState>) => void;
  resetSetup: () => void;
}

export const useHealthSetupStore = create<HealthSetupState>()(
  persist(
    (set) => ({
      expectedDeliveryDate: "",
      weight: 0,
      height: 0,
      dob: new Date(0),
      gender: "f",

      existing_health_conditions: [],
      receivingCare: false,
      viral_load: 0,
      cd4_count: 0,
      genotype: "",
      blood_group: "",

      preferences: {
        pregnancy_updates: true,
        daily_health_tips: true,
        exercise_reminders: true,
        doctor_consultation: true,
        notifications_enabled: true,
      },

      updateSetup: (data) =>
        set((state) => ({ ...state, ...(data as Partial<HealthSetupState>) })),

      resetSetup: () =>
        set({
          expectedDeliveryDate: "",
          weight: 0,
          height: 0,
          dob: new Date(0),

          existing_health_conditions: [],
          receivingCare: false,
          viral_load: 0,
          cd4_count: 0,
          genotype: "",
          blood_group: "",

          preferences: {
            pregnancy_updates: true,
            daily_health_tips: true,
            exercise_reminders: true,
            doctor_consultation: true,
            notifications_enabled: true,
          },
        }),
    }),
    {
      name: "health_setup",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);