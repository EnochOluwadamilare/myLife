import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { authApi } from "@/api/auth/authApi";

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim()) {
      Alert.alert("Email required", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await authApi.forgotPassword(email.trim());

      Alert.alert(
        "Check your email",
        response.data?.message || "Password reset link sent to your email.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Request failed",
        error?.response?.data?.message ||
          "Unable to send password reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Forgot Password?</Text>

        <Text style={styles.subtitle}>
          Enter your email address and we’ll send you a password reset link.
        </Text>

        <Text style={styles.label}>Email Address</Text>

        <TextInput
          style={styles.input}
          placeholder="example@mylife.ng"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={submit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Text>
        </TouchableOpacity>
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
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  back: {
    position: "absolute",
    top: 24,
    left: 24,
    fontSize: 16,
    color: theme.colors.text,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: theme.colors.text,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    marginBottom: 36,
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  label: {
    color: theme.colors.text,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    height: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 24,
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
    fontWeight: "900",
    fontSize: 16,
  },
});