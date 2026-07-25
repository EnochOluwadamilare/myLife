// src/screens/auth/RegisterScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { authRepository } from "@/repositories/auth/authRepository";
import DateTimePicker from '@react-native-community/datetimepicker';

export const RegisterScreen = ({ navigation }: any) => {
  const [showLmpPicker, setShowLmpPicker] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lmpDate, setLmpDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing fields", "Please complete all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await authRepository.register({
        name,
        email,
        phone,
        lmp_date: lmpDate,
        password,
        password_confirmation: confirmPassword,
        consent_given_for_data_sharing: consent,
      });

      navigation.replace(ROUTES.HealthSetupOne);
    } catch (error: any) {
      Alert.alert(
        "Registration failed",
        error?.response?.data?.message || "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Let's get you started on your journey.</Text>

      <Text style={styles.section}>Personal Information</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} placeholder="Firstname Lastname" value={name} onChangeText={setName} autoCapitalize="words" />

      <Text style={styles.label}>Email Address</Text>
      <TextInput style={styles.input} placeholder="example@mylife.ng" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} placeholder="+234..." value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Last Menstrual Period Date</Text>
      <TouchableOpacity 
        style={styles.inputContainer} 
        onPress={() => setShowLmpPicker(true)}
      >
        <Text style={[styles.inputText, !lmpDate && styles.placeholderText]}>
          {lmpDate 
            ? (typeof lmpDate === 'string' ? lmpDate : lmpDate) 
            : "Select your LMP date"}
        </Text>
      </TouchableOpacity>

      {/* Native Picker Element */}
      {showLmpPicker && (
        <DateTimePicker
          value={lmpDate ? new Date(lmpDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()} // LMP cannot be in the future
          onChange={(event, selectedDate) => {
            setShowLmpPicker(false); // Close immediately for Android stability
            
            if (event.type === 'set' && selectedDate) {
              // If your state handler expects a YYYY-MM-DD string:
              const formattedDate = selectedDate.toISOString().split("T")[0];
              setLmpDate(formattedDate);
              
              // OR if your state handler expects a raw Date object, use this instead:
              // setLmpDate(selectedDate);
            }
          }}
        />
      )}

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="********" secureTextEntry value={password} onChangeText={setPassword} />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput style={styles.input} placeholder="********" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}>
          <Text style={styles.check}>✓</Text>
        </View>
        <Text style={styles.consentText}>I agree to the Terms & Privacy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Create Account"}</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate(ROUTES.Login)}>
          Log in
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    padding: 24,
  },
  back: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 17,
    color: "#4F6F6B",
    marginTop: 12,
    marginBottom: 36,
  },
  section: {
    textAlign: "center",
    color: "#426B66",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    height: 58,
    borderWidth: 1,
    borderColor: "#426B66",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 28,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: theme.colors.primary,
  },
  check: {
    color: theme.colors.white,
    fontWeight: "800",
  },
  consentText: {
    fontSize: 16,
    color: theme.colors.text,
  },
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
  footer: {
    textAlign: "center",
    marginTop: 28,
    fontSize: 15,
    color: "#4F6F6B",
  },
  link: {
    color: theme.colors.primary,
    fontWeight: "700",
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
});