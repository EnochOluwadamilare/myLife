import React, { useMemo, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { exerciseLibrary } from "@/data/exerciseLibrary";
import { HealthStatus, Trimester } from "@/types/exercise";

const trimesterFilters: { label: string; value: Trimester }[] = [
  { label: "All", value: "all" },
  { label: "1st", value: 1 },
  { label: "2nd", value: 2 },
  { label: "3rd", value: 3 },
];

const healthFilters: { label: string; value: HealthStatus }[] = [
  { label: "General", value: "general" },
  { label: "HIV", value: "hiv" },
  { label: "Hypertension", value: "hypertension" },
  { label: "Asthma", value: "asthma" },
  { label: "Diabetes", value: "diabetes" },
];

export const ExerciseScreen = ({ navigation }: any) => {
  const [trimester, setTrimester] = useState<Trimester>("all");
  const [healthStatus, setHealthStatus] = useState<HealthStatus>("general");

  const filteredExercises = useMemo(() => {
    return exerciseLibrary.filter((exercise) => {
      const trimesterMatch =
        trimester === "all" ||
        exercise.trimester.includes("all") ||
        exercise.trimester.includes(trimester);

      const healthMatch =
        exercise.healthStatus.includes("general") ||
        exercise.healthStatus.includes(healthStatus);

      return trimesterMatch && healthMatch;
    });
  }, [trimester, healthStatus]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require("@/assets/images/exercises/pregnancy-exercise.webp")} style={styles.bannerImage} resizeMode="contain"/>
        <Text style={styles.title}>Exercise</Text>
        <Text style={styles.subtitle}>
          Gentle pregnancy-safe movement based on trimester and health status.
        </Text>

        <Text style={styles.filterTitle}>Trimester</Text>
        <View style={styles.chipRow}>
          {trimesterFilters.map((item) => (
            <TouchableOpacity
              key={String(item.value)}
              style={[
                styles.chip,
                trimester === item.value && styles.chipActive,
              ]}
              onPress={() => setTrimester(item.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  trimester === item.value && styles.chipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.filterTitle}>Health status</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {healthFilters.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.chip,
                styles.healthChip,
                healthStatus === item.value && styles.chipActive,
              ]}
              onPress={() => setHealthStatus(item.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  healthStatus === item.value && styles.chipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>
          Recommended Exercises
        </Text>

        {filteredExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate(ROUTES.ExerciseDetail, {
                exerciseId: exercise.id,
              })
            }
          >
            <View style={styles.iconBox}>
              <Image style={styles.icon} source={exercise.image} resizeMode="contain"/>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{exercise.title}</Text>
              <Text style={styles.cardMeta}>
                {exercise.durationMinutes} mins · {exercise.intensity}
              </Text>
              <Text style={styles.cardDescription}>
                {exercise.description}
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Safety note</Text>
          <Text style={styles.warningText}>
            Stop exercising and contact a healthcare provider if you experience
            bleeding, chest pain, dizziness, severe headache, contractions, or
            reduced baby movement.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#DFF8F2",
  },
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  horizontalScroll: {
    marginBottom: 22,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#BFE8E1",
  },
  healthChip: {
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  chipTextActive: {
    color: theme.colors.white,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 14,
  },
  card: {
    flexDirection: "row",
    gap: 14,
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
  bannerImage: {
    width: "100%", 
    height: 180,
    marginBottom: 16,
  },
  icon: {
    width: 28,
    height: 28, 
    borderRadius: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  cardMeta: {
    marginTop: 5,
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  cardDescription: {
    marginTop: 7,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
  },
  arrow: {
    fontSize: 28,
    color: "#6B7280",
    alignSelf: "center",
  },
  warningBox: {
    marginTop: 20,
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  warningTitle: {
    fontWeight: "800",
    color: "#9A3412",
    marginBottom: 8,
  },
  warningText: {
    color: "#9A3412",
    fontSize: 13,
    lineHeight: 20,
  },
});