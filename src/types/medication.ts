// src/types/medication.ts

export interface MedicationReminder {
  id: number;
  user_id: number;
  medication_name: string;
  frequency: "daily" | "weekly" | "custom_schedule";
  times_per_day: number;
  schedule_times: string[];
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface MedicationListResponse {
  medications: MedicationReminder[];
  count: number;
}

export interface MedicationPayload {
  medication_name: string;
  frequency: "daily" | "weekly" | "custom_schedule";
  times_per_day: number;
  schedule_times?: string[];
  start_date: string;
  end_date?: string | null;
}

export interface DoseLogPayload {
  status: "taken" | "missed" | "late";
  notes?: string;
  taken_at?: string;
  device_id?: string;
}

export interface AdherenceSummary {
  total_medications: number;
  active_medications: number;
  overall_adherence_percentage: number;
  medications: {
    id: number;
    name: string;
    adherence_percentage: number;
    trend: string;
  }[];
  period: string;
}