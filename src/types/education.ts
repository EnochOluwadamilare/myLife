export interface EducationModule {
  id: number;
  title: string;
  slug: string;
  description: string;
  content_type: string;
  content: string;
  trimester_relevant?: number;
  category: string;
  version: number;
  is_published: boolean;
  language: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface EducationModulesResponse {
  modules: EducationModule[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}