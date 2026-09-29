// src/screens/profile/ProfileScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { authRepository } from "@/repositories/auth/authRepository";

export const ProfileScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();

  const fullName = user?.name ?? "Not available";
  const email = user?.email ?? "Not available";
  const phone = user?.phone ?? "Not available";

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            try {
                await authRepository.logout();

                navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.Welcome }],
                });
            } catch (error) {
                console.log("Logout error:", error);

                navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.Welcome }],
                });
            }
         }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {fullName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{fullName}</Text>

        <View style={styles.card}>
          <ProfileRow label="Full Name" value={fullName} />
          <ProfileRow label="Email Address" value={email} />
          <ProfileRow label="Phone Number" value={phone} />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const ProfileRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#DFF8F2",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 28,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primary,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 34,
    fontWeight: "800",
  },
  name: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 28,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  rowLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  logoutButton: {
    marginTop: 32,
    height: 56,
    borderRadius: 30,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: theme.colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
});