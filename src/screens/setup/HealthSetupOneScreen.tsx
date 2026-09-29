import { useState } from 'react';
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform
} from "react-native";
import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { StepIndicator } from "@/components/Setup/StepIndicator";
import { useHealthSetupStore } from "@/store/useHealthSetupStore";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

export const HealthSetupOneScreen = ({ navigation }: any) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { /*isPregnant ,*/ weight, height, dob, expectedDeliveryDate, updateSetup } =
    useHealthSetupStore();

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={{ flex: 1 }}>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.stepLabel}>STEP INDICATOR</Text>
        <StepIndicator step={1} />

        <Text style={styles.title}>Let's understand your pregnancy</Text>

        <Text style={styles.subtitle}>
            This helps us personalize your journey.
        </Text>


        <Text style={styles.label}>Expected delivery date (optional)</Text>

        <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={expectedDeliveryDate}
        onChangeText={(value) =>
            updateSetup({ expectedDeliveryDate: value })
        }
        />

        <Text style={styles.label}>Weight (kg)</Text>

        <TextInput
        style={styles.input}
        placeholder="Enter your weight"
        keyboardType="numeric"
        value={weight !== null ? weight.toString() : ''}
        onChangeText={(value) =>
            updateSetup({ weight: parseFloat(value) || 0 })
        }
        />

        <Text style={styles.label}>Height (cm)</Text>

        <TextInput
        style={styles.input}
        placeholder="Enter your height"
        keyboardType="numeric"
        value={height !== null ? height.toString() : ''}
        onChangeText={(value) =>
            updateSetup({ height: parseFloat(value) || 0 })
        }
        />
        
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity 
            style={styles.inputContainer} 
            onPress={() => setShowDatePicker(true)}
            >
            <Text style={[styles.inputText, !dob && styles.placeholderText]}>
                {dob && !isNaN(new Date(dob).getTime()) 
                ? new Date(dob).toISOString().split("T")[0] 
                : "Select your date of birth"}
            </Text>
            </TouchableOpacity>

            {showDatePicker && (
            <DateTimePicker
                value={dob && !isNaN(new Date(dob).getTime()) ? new Date(dob) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()} // Prevents picking future dates for birth date
                onChange={(event, selectedDate) => {
                // Hide the picker immediately (critical for Android stability)
                setShowDatePicker(false); 
                
                if (event.type === 'set' && selectedDate) {
                    updateSetup({ dob: selectedDate });
                }
                }}
            />
            )}

        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(ROUTES.HealthSetupTwo)}
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
  container: {
    backgroundColor: theme.colors.white,
    padding: 28,
  },
  back: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 32,
  },
  inputContainer: {
    height: 58,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center", // Vertically centers the text inside the container
    marginBottom: 40,
    backgroundColor: theme.colors.white,
  },
  inputText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  placeholderText: {
    color: "#9CA3AF", // Classic placeholder gray color
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 17,
    color: "#6B7280",
    marginTop: 24,
    marginBottom: 44,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
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
  radioText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  input: {
    height: 58,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 40,
  },
  button: {
    marginTop: "auto",
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