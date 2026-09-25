import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { visitReminderService } from "@/services/reminders/visitReminderService";

const validateDate = (date: string): boolean => {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!dateMatch) return false;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);

  const testDate = new Date(year, month - 1, day, 12, 0, 0, 0);

  return (
    testDate.getFullYear() === year &&
    testDate.getMonth() === month - 1 &&
    testDate.getDate() === day
  );
};

const validateTime = (time: string): boolean => {
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time.trim().slice(0, 5));
  return !!timeMatch;
};

const validateDateTime = (
  date: string,
  time: string
): boolean => {
  if (!date || !time) return false;

  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time.trim().slice(0, 5));

  if (!dateMatch || !timeMatch) return false;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  const triggerDate = new Date(year, month - 1, day, hour, minute, 0, 0);

  return triggerDate.getTime() > Date.now();
};

export const ScheduleVisitScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState("Doctor Visit");
  const [hospitalName, setHospitalName] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [errors, setErrors] = useState<{
    date?: string;
    time?: string;
  }>({});

  const handleDateChange = (text: string) => {
    setVisitDate(text);
    const newErrors = { ...errors };

    if (text && !validateDate(text)) {
      newErrors.date = "Invalid date (YYYY-MM-DD)";
    } else {
      delete newErrors.date;
    }

    if (text && visitTime) {
      if (!validateDateTime(text, visitTime)) {
        newErrors.date = "Date/time must be in the future";
      }
    }

    setErrors(newErrors);
  };

  const handleTimeChange = (text: string) => {
    setVisitTime(text);
    const newErrors = { ...errors };

    if (text && !validateTime(text)) {
      newErrors.time = "Invalid time (HH:mm)";
    } else {
      delete newErrors.time;
    }

    if (text && visitDate) {
      if (!validateDateTime(visitDate, text)) {
        newErrors.time = "Date/time must be in the future";
      }
    }

    setErrors(newErrors);
  };

  const submit = async () => {
    if (!title || !hospitalName || !visitDate || !visitTime) {
      Alert.alert("Missing fields", "Please fill all fields.");
      return;
    }

    if (!validateDate(visitDate)) {
      Alert.alert("Invalid date", "Use format YYYY-MM-DD (e.g., 2026-07-25)");
      return;
    }

    if (!validateTime(visitTime)) {
      Alert.alert("Invalid time", "Use format HH:mm (e.g., 14:30)");
      return;
    }

    try {
      const reminder = await visitReminderService.scheduleVisitReminder({
        title,
        hospitalName,
        visitDate,
        visitTime,
      });

      if (reminder) {
        Alert.alert("Scheduled", "Hospital visit reminder has been set.");
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert("Scheduling failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Schedule Hospital Visit</Text>
        <Text style={styles.subtitle}>
          Set a local reminder for your next clinic or doctor visit.
        </Text>

        <Input label="Visit Title" value={title} onChangeText={setTitle} />
        <Input
          label="Hospital / Clinic Name"
          value={hospitalName}
          onChangeText={setHospitalName}
          placeholder="Example: Ibadan General Hospital"
        />
        <View>
          <Input
            label="Visit Date"
            value={visitDate}
            onChangeText={handleDateChange}
            placeholder="2026-07-22"
            hasError={!!errors.date}
          />
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>
        <View>
          <Input
            label="Visit Time"
            value={visitTime}
            onChangeText={handleTimeChange}
            placeholder="14:00"
            hasError={!!errors.time}
          />
          {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Schedule Reminder</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const Input = ({
  label,
  hasError,
  ...props
}: any) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        hasError && styles.inputError,
      ]}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  </>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#DFF8F2" },
  container: { padding: 22, paddingBottom: 50 },
  back: { fontSize: 16, color: theme.colors.text, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "900", color: theme.colors.text },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    color: "#6B7280",
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
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
    marginTop: -12,
    marginBottom: 12,
  },
  button: {
    marginTop: 24,
    height: 56,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: theme.colors.white, fontWeight: "900" },
});