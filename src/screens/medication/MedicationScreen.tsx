// src/screens/medication/MedicationScreen.tsx

import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { medicationApi } from "@/api/medication/medicationApi";
import {
  MedicationReminder,
  AdherenceSummary,
} from "@/types/medication";

export const MedicationScreen = ({ navigation }: any) => {
  const [medications, setMedications] = useState<MedicationReminder[]>([]);
  const [summary, setSummary] = useState<AdherenceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [medsResponse, summaryResponse] = await Promise.allSettled([
        medicationApi.getMedications(),
        medicationApi.getAdherenceSummary(),
      ]);

      if (medsResponse.status === "fulfilled") {
        setMedications(medsResponse.value.data.medications);
      }

      if (summaryResponse.status === "fulfilled") {
        setSummary(summaryResponse.value.data);
      }
    } catch (error) {
      console.log("Medication load error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Medications</Text>
            <Text style={styles.subtitle}>
              Track your ART and pregnancy medication reminders.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate(ROUTES.MedicationCreate)}
          >
            <Text style={styles.addText}>＋</Text>
          </TouchableOpacity>
        </View>

        {summary && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Overall adherence</Text>
            <Text style={styles.summaryValue}>
              {summary.overall_adherence_percentage}%
            </Text>
            <Text style={styles.summaryMeta}>
              {summary.active_medications} active medication(s)
            </Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : medications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No medication reminder yet</Text>
            <Text style={styles.emptyText}>
              Add your ART, vitamins, or other prescribed medication reminders.
            </Text>
          </View>
        ) : (
          medications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate(ROUTES.MedicationDetail, {
                  medicationId: item.id,
                })
              }
            >
              <View style={styles.iconBox}>
                <Text style={styles.icon}>💊</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>
                  {item.medication_name}
                </Text>

                <Text style={styles.cardMeta}>
                  {item.frequency} · {item.times_per_day} time(s) daily
                </Text>

                <Text style={styles.cardSub}>
                  {item.schedule_times?.join(", ") || "No schedule time"}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#DFF8F2" },
  container: { padding: 20, paddingBottom: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    color: theme.colors.white,
    fontSize: 26,
    fontWeight: "800",
  },
  summaryCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  summaryLabel: {
    color: "#E0FFFA",
    fontSize: 13,
    fontWeight: "700",
  },
  summaryValue: {
    color: theme.colors.white,
    fontSize: 36,
    fontWeight: "900",
    marginTop: 8,
  },
  summaryMeta: {
    color: "#E0FFFA",
    marginTop: 4,
  },
  card: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#DDF8F3",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 20 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: theme.colors.text,
  },
  cardMeta: {
    marginTop: 5,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  cardSub: {
    marginTop: 5,
    color: "#6B7280",
    fontSize: 13,
  },
  arrow: {
    fontSize: 28,
    color: "#6B7280",
  },
  emptyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    color: "#6B7280",
    lineHeight: 22,
  },
});