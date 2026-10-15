import { apiClient } from "@/api/client";
import { EducationModulesResponse, EducationModule } from "@/types/education";
import { Quiz, SubmitQuizAnswer, SubmitQuizResponse } from "@/types/quiz";
import {
  ActiveQuizzesResponse,
  QuizDetail,
} from "@/types/quiz";

export const educationApi = {
  getModules() {
    return apiClient.get<EducationModulesResponse>("/education/modules");
  },

  getModule(id: number | string) {
    return apiClient.get<{ module: EducationModule }>(
      `/education/modules/${id}`
    );
  },

  getCategories() {
    return apiClient.get<{ categories: string[] }>("/education/categories");
  },
  
  getProgress() {
    return apiClient.get("/education/progress");
  },

  getActiveQuizzes() {
    return apiClient.get<ActiveQuizzesResponse>("/quizzes/active");
  },

  getQuiz(quizId: number | string) {
    return apiClient.get<QuizDetail>(`/education/quizzes/${quizId}`);
  },

  submitQuiz(quizId: number | string, answers: SubmitQuizAnswer[]) {
    return apiClient.post<SubmitQuizResponse>(
      `/education/quizzes/${quizId}/submit`,
      { answers }
    );
  },
};