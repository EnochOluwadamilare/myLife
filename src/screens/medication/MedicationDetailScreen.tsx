import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { medicationApi } from "@/api/medication/medicationApi";
import { MedicationReminder } from "@/types/medication";
import { medicationReminderService } from "@/services/reminders/medicationReminderService";
import { ROUTES } from "@/constants/routes";

export const MedicationDetailScreen = ({ route, navigation }: any) => {
  const { medicationId } = route.params;

  const [medication, setMedication] = useState<MedicationReminder | null>(null);
  const [adherence, setAdherence] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadMedication = async () => {
    try {
      const [medResponse, adherenceResponse] = await Promise.allSettled([
        medicationApi.getMedication(medicationId),
        medicationApi.getAdherence(medicationId),
      ]);

      if (medResponse.status === "fulfilled") {
        setMedication(medResponse.value.data.medication);
      }

      if (adherenceResponse.status === "fulfilled") {
        setAdherence(adherenceResponse.value.data);
      }
    } catch (error) {
      console.log("Medication detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedication();
  }, [medicationId]);

  const logDose = async (status: "taken" | "missed" | "late") => {
    try {
      await medicationApi.logDose(medicationId, {
        status,
        taken_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      });

      Alert.alert("Saved", `Dose marked as ${status}.`);
      loadMedication();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Unable to log dose."
      );
    }
  };

  const deactivate = () => {
    Alert.alert(
      "Deactivate reminder",
      "Do you want to deactivate this medication reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            await medicationApi.deactivateMedication(medicationId);
            await medicationReminderService.cancelMedication(medicationId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>
                {medication?.medication_name}
              </Text>

              <Text style={styles.meta}>
                {medication?.frequency} · {medication?.times_per_day} time(s)
              </Text>

              <Text style={styles.info}>
                Times: {medication?.schedule_times?.join(", ") || "Not set"}
              </Text>

              <Text style={styles.info}>
                Start: {medication?.start_date}
              </Text>

              <Text style={styles.info}>
                End: {medication?.end_date || "Ongoing"}
              </Text>
              <Text style={styles.info}>
                Start: {medication?.start_date}
              </Text>
            </View>

            {adherence && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Adherence</Text>

                <Text style={styles.adherence}>
                  {adherence.adherence_percentage ?? 0}%
                </Text>

                <Text style={styles.info}>
                  Taken: {adherence.total_taken ?? 0} · Missed:{" "}
                  {adherence.total_missed ?? 0} · Late:{" "}
                  {adherence.total_late ?? 0}
                </Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Log Dose</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => logDose("taken")}
            >
              <Text style={styles.buttonText}>Mark as Taken</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => logDose("late")}
            >
              <Text style={styles.buttonText}>Mark as Late</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={() => logDose("missed")}
            >
              <Text style={styles.buttonText}>Mark as Missed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deactivateButton}
              onPress={deactivate}
            >
              <Text style={styles.deactivateText}>Deactivate Reminder</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate(ROUTES.MedicationEdit, {
                  medicationId,
                })
              }
            >
              <Text style={styles.editButtonText}>Edit Reminder</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#DFF8F2" },
  container: { padding: 22, paddingBottom: 50 },
  back: { fontSize: 16, color: theme.colors.text, marginBottom: 24 },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 20,
    marginBottom: 18,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: theme.colors.text,
  },
  meta: {
    color: theme.colors.primary,
    fontWeight: "800",
    marginTop: 8,
  },
  info: {
    color: "#6B7280",
    marginTop: 10,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 14,
  },
  adherence: {
    fontSize: 34,
    fontWeight: "900",
    color: theme.colors.primary,
    marginTop: 8,
  },
  button: {
    height: 54,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  secondaryButton: {
    height: 54,
    borderRadius: 28,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  dangerButton: {
    height: 54,
    borderRadius: 28,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: "900",
  },
  deactivateButton: {
    alignItems: "center",
    paddingVertical: 14,
  },
  deactivateText: {
    color: "#B91C1C",
    fontWeight: "800",
  },
  editButton: {
    height: 54,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  editButtonText: {
    color: theme.colors.white,
    fontWeight: "900",
  },
});