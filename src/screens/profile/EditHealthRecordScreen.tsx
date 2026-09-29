import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { profileApi } from "@/api/profile/profileApi";
import { useHealthSetupStore } from "@/store/useHealthSetupStore";

const conditionOptions = [
  "HIV",
  "Asthma",
  "Hypertension",
  "Type 2 Diabetes",
];

const genotypeOptions = ["AA", "AS", "SS", "AC", "SC"];
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const EditHealthRecordScreen = ({ navigation }: any) => {
  const setup = useHealthSetupStore();

  const [weight, setWeight] = useState(String(setup.weight ?? ""));
  const [height, setHeight] = useState(String(setup.height ?? ""));
  const [dob, setDob] = useState<Date | string | null>(
    setup.dob ? new Date(setup.dob) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<string | null>(setup.gender ?? null);
  const [conditions, setConditions] = useState<string[]>(
    setup.existing_health_conditions?.length
      ? setup.existing_health_conditions
      : ["HIV"]
  );
  const [viralLoad, setViralLoad] = useState(String(setup.viral_load ?? ""));
  const [cd4Counts, setCd4Counts] = useState(String(setup.cd4_counts ?? ""));
  const [genotype, setGenotype] = useState(setup.genotype ?? "");
  const [bloodgroup, setBloodgroup] = useState(setup.blood_group ?? "");

  const [pregnancyUpdates, setPregnancyUpdates] = useState(
    setup.preferences?.pregnancy_updates ?? true
  );
  const [dailyHealthTips, setDailyHealthTips] = useState(
    setup.preferences?.daily_health_tips ?? true
  );
  const [exerciseReminders, setExerciseReminders] = useState(
    setup.preferences?.exercise_reminders ?? true
  );
  const [doctorConsultation, setDoctorConsultation] = useState(
    setup.preferences?.doctor_consultation ?? true
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    setup.preferences?.notifications_enabled ?? true
  );

  const [loading, setLoading] = useState(false);

  const toggleCondition = (condition: string) => {
    if (condition === "HIV") return;

    setConditions((current) =>
      current.includes(condition)
        ? current.filter((item) => item !== condition)
        : [...current, condition]
    );
  };

  const save = async () => {
    const payload = {
      weight: weight ? Number(weight) : null,
      height: height ? Number(height) : null,
      dob: dob ? dob.toString() : null,
      existing_health_conditions: conditions.includes("HIV")
        ? conditions
        : ["HIV", ...conditions],
      gender,
      receiving_care: setup.receivingCare,
      viral_load: viralLoad ? Number(viralLoad) : null,
      cd4_counts: cd4Counts ? Number(cd4Counts) : null,
      genotype,
      bloodgroup,
      preferences: {
        pregnancy_updates: pregnancyUpdates,
        daily_health_tips: dailyHealthTips,
        exercise_reminders: exerciseReminders,
        doctor_consultation: doctorConsultation,
        notifications_enabled: notificationsEnabled,
      },
    };

    try {
      setLoading(true);

      setup.updateSetup(payload);

      try {
        await profileApi.updateProfile(payload);
      } catch (error) {
        console.log("Profile API not fully ready yet:", error);
      }

      Alert.alert("Saved", "Your health record has been updated.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Health Record</Text>
        <Text style={styles.subtitle}>
          Update your personal and medical details.
        </Text>

        <Text style={styles.section}>Basic Information</Text>

        <Input label="Date of Birth" placeholder="YYYY-MM-DD" value={dob} keyboardType="numeric" onChangeText={setDob} />
        <Input label="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
        <Input label="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.row}>
          <Choice label="Female" active={gender === 'f'} onPress={() => setGender('f')} />
          <Choice label="Male" active={gender === 'm'} onPress={() => setGender('m')} />
        </View>

        <Text style={styles.section}>Health Conditions</Text>

        <View style={styles.chipRow}>
          {conditionOptions.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.chip,
                conditions.includes(item) && styles.chipActive,
              ]}
              onPress={() => toggleCondition(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  conditions.includes(item) && styles.chipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.section}>HIV Health Details</Text>

        <Input label="Viral Load" value={viralLoad} onChangeText={setViralLoad} keyboardType="numeric" />
        <Input label="CD4 Count" value={cd4Counts} onChangeText={setCd4Counts} keyboardType="numeric" />

        <Text style={styles.label}>Genotype</Text>
        <View style={styles.chipRow}>
          {genotypeOptions.map((item) => (
            <Choice key={item} label={item} active={genotype === item} onPress={() => setGenotype(item)} />
          ))}
        </View>

        <Text style={styles.label}>Blood Group</Text>
        <View style={styles.chipRow}>
          {bloodGroupOptions.map((item) => (
            <Choice key={item} label={item} active={bloodgroup === item} onPress={() => setBloodgroup(item)} />
          ))}
        </View>

        <Text style={styles.section}>Preferences</Text>

        <Toggle label="Pregnancy updates" value={pregnancyUpdates} onValueChange={setPregnancyUpdates} />
        <Toggle label="Daily health tips" value={dailyHealthTips} onValueChange={setDailyHealthTips} />
        <Toggle label="Exercise reminders" value={exerciseReminders} onValueChange={setExerciseReminders} />
        <Toggle label="Doctor consultation" value={doctorConsultation} onValueChange={setDoctorConsultation} />
        <Toggle label="Notifications" value={notificationsEnabled} onValueChange={setNotificationsEnabled} />

        <TouchableOpacity style={styles.button} onPress={save} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const Input = ({ label, ...props }: any) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor="#9CA3AF" {...props} />
  </>
);

const Choice = ({ label, active, onPress }: any) => (
  <TouchableOpacity
    style={[styles.choice, active && styles.choiceActive]}
    onPress={onPress}
  >
    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const Toggle = ({ label, value, onValueChange }: any) => (
  <View style={styles.toggleRow}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#D1D5DB", true: theme.colors.primary }}
      thumbColor={theme.colors.white}
    />
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#DFF8F2",
  },
  container: {
    padding: 24,
    paddingBottom: 50,
  },
  back: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 15,
    color: "#6B7280",
  },
  section: {
    marginTop: 20,
    marginBottom: 16,
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#BFE8E1",
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  chipTextActive: {
    color: theme.colors.white,
  },
  choice: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#BFE8E1",
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
  toggleRow: {
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLabel: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: "600",
  },
  button: {
    marginTop: 28,
    height: 58,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
});