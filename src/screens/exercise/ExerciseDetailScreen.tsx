import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { exerciseLibrary } from "@/data/exerciseLibrary";

import { TextInput } from "react-native";
import { exerciseReminderService } from "@/services/reminders/exerciseReminderService";

export const ExerciseDetailScreen = ({ route, navigation }: any) => {
  const { exerciseId } = route.params;
  const exercise = exerciseLibrary.find((item) => item.id === exerciseId);
  const [reminderTime, setReminderTime] = React.useState("17:00");
  const [scheduling, setScheduling] = React.useState(false);
  const defaultExercise = exercise ?? {
    id: "walking",
    title: "Gentle Walking",
    category: "Cardio",
    trimester: ["all"],
    healthStatus: ["general", "hiv", "hypertension", "diabetes"],
    durationMinutes: 20,
    intensity: "Low",
    description:
      "A safe, simple movement routine to support circulation, energy, and mood during pregnancy.",
    benefits: [
      "Supports blood circulation",
      "Helps reduce swelling",
      "Improves mood and energy",
      "Can support blood sugar control",
    ],
    steps: [
      "Wear comfortable shoes.",
      "Start slowly for 3–5 minutes.",
      "Walk at a pace where you can still talk.",
      "Slow down if you feel tired, dizzy, or breathless.",
      "End with gentle stretching.",
    ],
    safetyTips: [
      "Drink water before and after.",
      "Avoid walking under extreme heat.",
      "Stop if you feel chest pain, bleeding, dizziness, or contractions.",
    ],
    avoidIf: [
      "Severe dizziness",
      "Vaginal bleeding",
      "Severe abdominal pain",
      "Doctor advised bed rest",
    ],
    image: require("@/assets/images/exercises/walking.jpg"),
    videoUrl: "https://www.youtube.com/watch?v=LcG8eFuMnSU",
  };

  const scheduleReminder = async () => {
    try {
      setScheduling(true);

      await exerciseReminderService.scheduleExerciseReminder(
        exercise ?? defaultExercise,
        reminderTime
      );

      Alert.alert(
        "Reminder scheduled",
        `You will be reminded daily at ${reminderTime}.`
      );
    } catch (error) {
      console.log("Exercise reminder error:", error);
      Alert.alert("Error", "Unable to schedule exercise reminder.");
    } finally {
      setScheduling(false);
    }
  };

  const cancelReminder = async () => {
    await exerciseReminderService.cancelExerciseReminder(exercise?.id || defaultExercise.id);

    Alert.alert("Reminder cancelled", "Exercise reminder has been removed.");
  };

  if (!exercise) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <Text>Exercise not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const openVideo = () => {
    if (!exercise.videoUrl) {
      Alert.alert(
        "Video unavailable",
        "A video guide has not been added for this exercise yet."
      );
      return;
    }

    Linking.openURL(exercise.videoUrl);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.heroIcon}>🏃</Text>
          </View>

          <Image source={exercise.image} style={styles.bannerImage} resizeMode="contain"/>

          <Text style={styles.title}>{exercise.title}</Text>

          <Text style={styles.meta}>
            {exercise.category} · {exercise.durationMinutes} mins ·{" "}
            {exercise.intensity}
          </Text>

          <Text style={styles.description}>{exercise.description}</Text>

          <TouchableOpacity style={styles.videoButton} onPress={openVideo}>
            <Text style={styles.videoButtonText}>Watch Video Guide</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reminderBox}>
          <Text style={styles.reminderTitle}>Exercise Reminder</Text>

          <Text style={styles.reminderText}>
            Set a daily reminder time for this exercise.
          </Text>

          <TextInput
            style={styles.timeInput}
            value={reminderTime}
            onChangeText={setReminderTime}
            placeholder="17:00"
            keyboardType="numbers-and-punctuation"
          />

          <TouchableOpacity
            style={styles.reminderButton}
            onPress={scheduleReminder}
            disabled={scheduling}
          >
            <Text style={styles.reminderButtonText}>
              {scheduling ? "Scheduling..." : "Schedule Reminder"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelReminderButton}
            onPress={cancelReminder}
          >
            <Text style={styles.cancelReminderText}>Cancel Reminder</Text>
          </TouchableOpacity>
        </View>

        <Section title="Benefits" items={exercise.benefits} />
        <Section title="How to do it" items={exercise.steps} numbered />
        <Section title="Safety tips" items={exercise.safetyTips} />
        <Section title="Avoid this exercise if you have" items={exercise.avoidIf} warning />
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({
  title,
  items,
  numbered,
  warning,
}: {
  title: string;
  items: string[];
  numbered?: boolean;
  warning?: boolean;
}) => {
  return (
    <View style={[styles.sectionCard, warning && styles.warningCard]}>
      <Text style={[styles.sectionTitle, warning && styles.warningTitle]}>
        {title}
      </Text>

      {items.map((item, index) => (
        <Text
          key={`${title}-${index}`}
          style={[styles.itemText, warning && styles.warningText]}
        >
          {numbered ? `${index + 1}. ` : "• "}
          {item}
        </Text>
      ))}
    </View>
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
  back: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 22,
    marginBottom: 18,
    elevation: 3,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#DDF8F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  heroIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: theme.colors.text,
  },
  meta: {
    marginTop: 8,
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: "800",
  },
  description: {
    marginTop: 16,
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 23,
  },
  videoButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  videoButtonText: {
    color: theme.colors.white,
    fontWeight: "800",
  },
  sectionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 18,
    marginBottom: 14,
  },
  warningCard: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 12,
  },
  warningTitle: {
    color: "#9A3412",
  },
  itemText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 8,
  },
  warningText: {
    color: "#9A3412",
  },
  bannerImage: {
    width: "100%", 
    height: 180, 
    marginBottom: 16,
  },
  reminderBox: {
  marginTop: 20,
  backgroundColor: "#F0FDFA",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#BFE8E1",
  padding: 16,
},
reminderTitle: {
  fontSize: 16,
  fontWeight: "900",
  color: theme.colors.text,
},
reminderText: {
  marginTop: 6,
  color: "#6B7280",
  fontSize: 13,
  lineHeight: 20,
},
timeInput: {
  marginTop: 14,
  height: 50,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#BFE8E1",
  backgroundColor: theme.colors.white,
  paddingHorizontal: 14,
  fontSize: 15,
  color: theme.colors.text,
},
reminderButton: {
  marginTop: 14,
  height: 50,
  borderRadius: 25,
  backgroundColor: theme.colors.primary,
  alignItems: "center",
  justifyContent: "center",
},
reminderButtonText: {
  color: theme.colors.white,
  fontWeight: "900",
},
cancelReminderButton: {
  marginTop: 12,
  alignItems: "center",
},
cancelReminderText: {
  color: theme.colors.secondary,
  fontWeight: "800",
},
});