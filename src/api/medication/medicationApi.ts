import { apiClient } from "@/api/client";
import {
  MedicationListResponse,
  MedicationPayload,
  MedicationReminder,
  DoseLogPayload,
  AdherenceSummary,
} from "@/types/medication";

export const medicationApi = {
  getMedications() {
    return apiClient.get<MedicationListResponse>("/medications");
  },

  createMedication(payload: MedicationPayload) {
    return apiClient.post<{
      message: string;
      medication: MedicationReminder;
    }>("/medications", payload);
  },

  getMedication(id: number | string) {
    return apiClient.get<{ medication: MedicationReminder }>(
      `/medications/${id}`
    );
  },

  updateMedication(id: number | string, payload: Partial<MedicationPayload>) {
    return apiClient.put<{
      message: string;
      medication: MedicationReminder;
    }>(`/medications/${id}`, payload);
  },

  deactivateMedication(id: number | string) {
    return apiClient.delete(`/medications/${id}`);
  },

  logDose(id: number | string, payload: DoseLogPayload) {
    return apiClient.post(`/medications/${id}/log`, payload);
  },

  getAdherence(id: number | string) {
    return apiClient.get(`/medications/${id}/adherence`);
  },

  getAdherenceSummary() {
    return apiClient.get<AdherenceSummary>(
      "/medications/adherence/summary"
    );
  },
};