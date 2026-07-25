// src/screens/auth/LoginScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { authRepository } from "@/repositories/auth/authRepository";

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await authRepository.login(email, password);
      navigation.replace(ROUTES.Home);
    } catch (error: any) {
      Alert.alert(
        "Login failed",
        error?.response?.data?.message || "Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/mylifelogosmall.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to continue your journey</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="example@mylife.ng"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={() => navigation.navigate(ROUTES.ForgotPassword)}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Log In"}</Text>
      </TouchableOpacity>

      <Text style={styles.or}>OR</Text>

      <Text style={styles.guest}>Continue as Guest</Text>

      <Text style={styles.footer}>
        Don't have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate(ROUTES.Register)}>
          Register
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 36,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 58,
    borderWidth: 1,
    borderColor: "#6B7280",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 22,
  },
  forgot: {
    alignSelf: "flex-end",
    color: theme.colors.primary,
    fontWeight: "700",
    marginBottom: 30,
  },
  button: {
    width: "100%",
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
  or: {
    marginVertical: 24,
    color: "#6B7280",
  },
  guest: {
    color: "#426B66",
    fontSize: 16,
    textDecorationLine: "underline",
    marginBottom: 32,
  },
  footer: {
    fontSize: 15,
    color: "#6B7280",
  },
  link: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
});