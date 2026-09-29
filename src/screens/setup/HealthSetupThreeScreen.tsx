import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { StepIndicator } from "@/components/Setup/StepIndicator";
import { useHealthSetupStore } from "@/store/useHealthSetupStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { profileApi } from "@/api/profile/profileApi";

export const HealthSetupThreeScreen = ({ navigation }: any) => {
  const setup = useHealthSetupStore();

  const finishSetup = async () => {
    const payload = {
        //   is_pregnant: setup.isPregnant,
        expectedDeliveryDate: setup.expectedDeliveryDate,
        weight: setup.weight,
        height: setup.height,
        dob: setup.dob,

        existing_health_conditions: setup.existing_health_conditions,
        receiving_care: setup.receivingCare,
        viral_load: setup.viral_load,
        cd4_count: setup.cd4_count,
        genotype: setup.genotype,
        blood_group: setup.blood_group,

        preferences: {
            pregnancy_updates: setup.preferences.pregnancy_updates,
            daily_health_tips: setup.preferences.daily_health_tips,
            exercise_reminders: setup.preferences.exercise_reminders,
            doctor_consultation: setup.preferences.doctor_consultation,
            notifications_enabled: setup.preferences.notifications_enabled,
        },
    };

    await profileApi.updateProfile(payload);
    setup.updateSetup(payload);

    console.log("Future API payload:", payload);

    Alert.alert("Setup saved", "Your setup has been saved locally for now.");

    navigation.replace(ROUTES.Home);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={{ flex: 1 }}>
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.stepLabel}>STEP INDICATOR</Text>
      <StepIndicator step={3} />

      <Text style={styles.title}>How can we support you?</Text>

      <Text style={styles.subtitle}>
        Choose what matters most to you.
      </Text>

      <CheckItem
        label="Pregnancy tracking updates"
        value={setup.preferences.pregnancy_updates}
        onPress={() =>
          setup.updateSetup({
            preferences: {
              ...setup.preferences,
              pregnancy_updates: !setup.preferences.pregnancy_updates,
            }
          })
        }
      />

      <CheckItem
        label="Daily health tips"
        value={setup.preferences.daily_health_tips}
        onPress={() =>
          setup.updateSetup({
            preferences: {
              ...setup.preferences,
              daily_health_tips: !setup.preferences.daily_health_tips,
            }
          })
        }
      />

      <CheckItem
        label="Exercise reminders"
        value={setup.preferences.exercise_reminders}
        onPress={() =>
          setup.updateSetup({
            preferences: {
                ...setup.preferences,
                exercise_reminders: !setup.preferences.exercise_reminders,
            },
          })
        }
      />

      <CheckItem
        label="Doctor consultation (WhatsApp)"
        value={setup.preferences.doctor_consultation}
        onPress={() =>
          setup.updateSetup({
            preferences: {
              ...setup.preferences,
              doctor_consultation: !setup.preferences.doctor_consultation,
            }
          })
        }
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Enable notifications</Text>

        <Switch
          value={setup.preferences.notifications_enabled}
          onValueChange={(value) =>
            setup.updateSetup({
                preferences: {
                    ...setup.preferences,
                    notifications_enabled: value,
                }
            })
          }
          thumbColor={theme.colors.white}
          trackColor={{
            false: "#D1D5DB",
            true: theme.colors.primary,
          }}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={finishSetup}>
        <Text style={styles.buttonText}>Finish Setup</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const CheckItem = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.checkRow} onPress={onPress}>
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && <Text style={styles.check}>✓</Text>}
      </View>

      <Text style={styles.checkText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#DFF8F2",
  },
  container: {  backgroundColor: theme.colors.white, padding: 28 },
  back: { fontSize: 18, color: theme.colors.text, marginBottom: 32 },
  stepLabel: { fontSize: 13, fontWeight: "700", color: "#6B7280" },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 17,
    color: "#6B7280",
    marginTop: 24,
    marginBottom: 36,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: { backgroundColor: theme.colors.primary },
  check: { color: theme.colors.white, fontWeight: "800", fontSize: 18 },
  checkText: { fontSize: 16, color: theme.colors.text },
  switchRow: {
    marginTop: 22,
    marginBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: { fontSize: 17, color: theme.colors.text },
  button: {
    height: 58,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});