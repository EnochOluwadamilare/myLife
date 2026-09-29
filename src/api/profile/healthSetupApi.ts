import { apiClient } from "@/api/client";

export interface HealthSetupPayload {
    //   is_pregnant: boolean | null;
    expectedDeliveryDate?: string;
    weight?: number | null;
    height?: number | null;
    dob?: Date | string | null;
    gender?: string | null

    existing_health_conditions: string[];
    receiving_care: boolean | null;
    viral_load?: number | null;
    cd4_count?: number | null;
    genotype?: string;
    blood_group?: string
    preferences: {
        pregnancy_updates: boolean;
        daily_health_tips: boolean;
        exercise_reminders: boolean;
        doctor_consultation: boolean;
        notifications_enabled: boolean;
    };
}

export const healthSetupApi = {
  saveSetup(payload: HealthSetupPayload) {
    // API endpoint not available yet.
    // Replace this endpoint when backend provides it.
    return apiClient.post("/profile/health-setup", payload);
  },
};