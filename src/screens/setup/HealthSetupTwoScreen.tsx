// src/screens/setup/HealthSetupTwoScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { StepIndicator } from "@/components/Setup/StepIndicator";
import { useHealthSetupStore } from "@/store/useHealthSetupStore";
import { SafeAreaView } from "react-native-safe-area-context";

const suggestions = ["HIV", "Hypertension", "Asthma"];

export const HealthSetupTwoScreen = ({ navigation }: any) => {
  const { existing_health_conditions, receivingCare, viral_load, cd4_count, genotype, blood_group, updateSetup } =
    useHealthSetupStore();

  const [search, setSearch] = useState("");

  const toggleCondition = (condition: string) => {
    const exists = existing_health_conditions.includes(condition);

    updateSetup({
      existing_health_conditions: exists
        ? existing_health_conditions.filter((item) => item !== condition)
        : [...existing_health_conditions, condition],
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.stepLabel}>Step Indicator</Text>
      <StepIndicator step={2} />

      <Text style={styles.title}>Your health background</Text>

      <Text style={styles.subtitle}>
        This information stays private and safe.
      </Text>

      <Text style={styles.label}>Do you have any pre-existing conditions?</Text>

      <TextInput
        style={styles.input}
        placeholder="Search or select conditions"
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.suggestionLabel}>Suggestions:</Text>

      <View style={styles.chipRow}>
        {suggestions.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.chip,
              existing_health_conditions.includes(item) && styles.chipActive,
            ]}
            onPress={() => toggleCondition(item)}
          >
            <Text
              style={[
                styles.chipText,
                existing_health_conditions.includes(item) && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>
        Are you receiving care for a specific condition?
      </Text>

      <TouchableOpacity
        style={styles.radioRow}
        onPress={() => updateSetup({ receivingCare: true })}
      >
        <View style={[styles.radio, receivingCare === true && styles.radioActive]} />
        <Text style={styles.radioText}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.radioRow}
        onPress={() => updateSetup({ receivingCare: false })}
      >
        <View style={[styles.radio, receivingCare === false && styles.radioActive]} />
        <Text style={styles.radioText}>No</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Viral Load</Text>

      <TextInput
        style={styles.input}
        placeholder="Select load"
        keyboardType="numeric"
        value={viral_load != null ? viral_load.toString() : ''}
        onChangeText={(value) => updateSetup({ viral_load: Number(value) })}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(ROUTES.HealthSetupThree)}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#DFF8F2",
  },
  container: { backgroundColor: theme.colors.white, padding: 28 },
  back: { fontSize: 18, color: theme.colors.text, marginBottom: 32 },
  stepLabel: { fontSize: 13, fontWeight: "700", color: "#6B7280" },
  title: { fontSize: 28, fontWeight: "800", color: theme.colors.text },
  subtitle: { fontSize: 17, color: "#6B7280", marginTop: 24, marginBottom: 44 },
  label: { fontSize: 16, color: theme.colors.text, marginBottom: 16 },
  input: {
    height: 58,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  suggestionLabel: { color: "#6B7280", marginBottom: 12 },
  chipRow: { flexDirection: "row", gap: 10, marginBottom: 40 },
  chip: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
  },
  chipActive: { backgroundColor: theme.colors.primary },
  chipText: { color: theme.colors.text, fontSize: 15 },
  chipTextActive: { color: theme.colors.white },
  radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  radio: {
    width: 23,
    height: 23,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#6B7280",
    marginRight: 16,
  },
  radioActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  radioText: { fontSize: 16, color: theme.colors.text },
  button: {
    marginTop: "auto",
    height: 58,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: theme.colors.white, fontSize: 18, fontWeight: "700" },
});