import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";

export const QuizResultScreen = ({ route, navigation }: any) => {
  const { result } = route.params;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Completed</Text>

        <View style={styles.card}>
          <Text style={styles.score}>
            {result?.score ?? 0}/{result?.total ?? 0}
          </Text>

          <Text style={styles.percent}>
            {result?.percentage ?? 0}%
          </Text>

          <Text style={styles.message}>
            {result?.message ?? "Great effort. Keep learning!"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate(ROUTES.Education)}
        >
          <Text style={styles.buttonText}>Continue Learning</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate(ROUTES.Home)}
        >
          <Text style={styles.secondaryText}>Go Home</Text>
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 28,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 28,
    alignItems: "center",
    marginBottom: 28,
  },
  score: {
    fontSize: 42,
    fontWeight: "900",
    color: theme.colors.primary,
  },
  percent: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: 8,
  },
  message: {
    marginTop: 18,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 22,
  },
  button: {
    height: 56,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 14,
    height: 56,
    borderRadius: 30,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    color: theme.colors.white,
    fontWeight: "800",
  },
});