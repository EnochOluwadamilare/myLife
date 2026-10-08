import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { medicationApi } from "@/api/medication/medicationApi";
import { MedicationReminder } from "@/types/medication";
import { medicationReminderService } from "@/services/reminders/medicationReminderService";

type Frequency = "daily" | "weekly" | "custom_schedule";

export const MedicationEditScreen = ({ route, navigation }: any) => {
  const { medicationId } = route.params;

  const [medication, setMedication] = useState<MedicationReminder | null>(null);

  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [timesPerDay, setTimesPerDay] = useState("1");
  const [scheduleTimes, setScheduleTimes] = useState("08:00");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadMedication = async () => {
      try {
        const response = await medicationApi.getMedication(medicationId);
        const item = response.data.medication;

        setMedication(item);
        setName(item.medication_name ?? "");
        setFrequency(item.frequency ?? "daily");
        setTimesPerDay(String(item.times_per_day ?? 1));
        setScheduleTimes(item.schedule_times?.join(", ") || "08:00");
        setStartDate(item.start_date ?? "");
        setEndDate(item.end_date ?? "");
      } catch (error) {
        console.log("Medication edit load error:", error);
        Alert.alert("Error", "Unable to load medication reminder.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadMedication();
  }, [medicationId, navigation]);

  const save = async () => {
    if (!name || !startDate) {
      Alert.alert("Missing fields", "Medication name and start date are required.");
      return;
    }

    const parsedTimes = scheduleTimes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (parsedTimes.length === 0) {
      Alert.alert("Missing time", "Please enter at least one reminder time.");
      return;
    }

    try {
      setSaving(true);

      const response = await medicationApi.updateMedication(medicationId, {
        medication_name: name,
        frequency,
        times_per_day: Number(timesPerDay),
        schedule_times: parsedTimes,
        start_date: startDate,
        end_date: endDate || null,
      });

      await medicationReminderService.rescheduleMedication(
        response.data.medication
      );

      Alert.alert("Saved", "Medication reminder updated and notifications rescheduled.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Unable to update medication reminder."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Medication</Text>
        <Text style={styles.subtitle}>
          Update your reminder time, frequency, and schedule.
        </Text>

        <Input label="Medication name" value={name} onChangeText={setName} />

        <Text style={styles.label}>Frequency</Text>
        <ChoiceRow
          value={frequency}
          onChange={setFrequency}
          options={[
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Custom", value: "custom_schedule" },
          ]}
        />

        <Input
          label="Times per day"
          value={timesPerDay}
          onChangeText={setTimesPerDay}
          keyboardType="numeric"
        />

        <Input
          label="Schedule times"
          value={scheduleTimes}
          onChangeText={setScheduleTimes}
          placeholder="08:00, 20:00"
        />

        <Input
          label="Start date"
          value={startDate}
          onChangeText={setStartDate}
          placeholder="YYYY-MM-DD"
        />

        <Input
          label="End date optional"
          value={endDate}
          onChangeText={setEndDate}
          placeholder="YYYY-MM-DD"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={save}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const Input = ({ label, ...props }: any) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  </>
);

const ChoiceRow = ({ value, onChange, options }: any) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {options.map((item: any) => (
      <TouchableOpacity
        key={item.value}
        style={[
          styles.choice,
          value === item.value && styles.choiceActive,
        ]}
        onPress={() => onChange(item.value)}
      >
        <Text
          style={[
            styles.choiceText,
            value === item.value && styles.choiceTextActive,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#DFF8F2",
  },
  container: {
    padding: 22,
    paddingBottom: 50,
  },
  back: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    color: theme.colors.text,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 18,
  },
  choice: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    marginRight: 10,
    marginBottom: 18,
  },
  choiceActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  choiceText: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  choiceTextActive: {
    color: theme.colors.white,
  },
  button: {
    marginTop: 24,
    height: 56,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: "900",
    fontSize: 16,
  },
});