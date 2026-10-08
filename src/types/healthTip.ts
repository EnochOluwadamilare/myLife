export interface HealthTip {
  id: number;
  title: string;
  content: string;
  slug: string;
  from: string;
  to: string;
  active: string;
  created_at: string;
  updated_at: string;
}

export interface HealthTipsResponse {
  health_tips: HealthTip[];
}