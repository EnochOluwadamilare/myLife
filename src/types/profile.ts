export interface HealthMetadata {
  lmp_date: string;
  due_date: string;
  weeks_pregnant: number;
  trimester: number;
  trimester_guidance: string;
  art_regimen?: {
    id: number;
    name: string;
    description: string;
    components: string[];
  };
  consent_status?: {
    given: boolean;
    timestamp: string;
    version: string;
  };
}