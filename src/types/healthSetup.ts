export interface HealthSetupPayload {
  weight: number | null;
  height: number | null;
  dob: string;
  existing_health_conditions: string[];
  gender: string | null;
  viral_load: number | null;
  cd4_count: number | null;
  genotype: string;
  bloodgroup: string;
  preferences: {
    pregnancy_updates: boolean;
    daily_health_tips: boolean;
    exercise_reminders: boolean;
    doctor_consultation: boolean;
    notifications_enabled: boolean;
  };
}