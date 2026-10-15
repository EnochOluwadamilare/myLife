export type Trimester = 1 | 2 | 3 | "all";

export type HealthStatus =
  | "general"
  | "hiv"
  | "hypertension"
  | "asthma"
  | "diabetes";

export interface ExerciseItem {
  id: string;
  title: string;
  category: string;
  trimester: Trimester[];
  healthStatus: HealthStatus[];
  durationMinutes: number;
  intensity: "Low" | "Moderate";
  description: string;
  benefits: string[];
  steps: string[];
  safetyTips: string[];
  avoidIf: string[];
  image?: any;
  videoUrl?: string;
}