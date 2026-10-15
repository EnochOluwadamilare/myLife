export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface SubmitQuizAnswer {
  question_id: number;
  answer: string;
}

export interface ActiveQuiz {
  id: number;
  module_id: string;
  title: string;
  description: string;
  passing_score: number;
  total_questions: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActiveQuizzesResponse {
  quizzes: ActiveQuiz[];
}

export interface QuizOption {
  text: string;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  options: QuizOption[];
  question_type: "single_choice" | string;
  order: number;
}

export interface QuizDetail {
  quiz: {
    id: number;
    title: string;
    description: string;
    passing_score: number;
    total_questions: number;
  };
  questions: QuizQuestion[];
}

export interface SubmitQuizAnswer {
  question_id: number;
  answer: string;
}

export interface SubmitQuizResponse {
  score: number;
  total: number;
  percentage: number;
  passed?: boolean;
  message?: string;
}

export interface SubmitQuizResponse {
  score: number;
  total: number;
  percentage: number;
  message?: string;
}