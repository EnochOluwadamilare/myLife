import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { healthTipsApi } from "@/api/healthTips/healthTipsApi";
import { HealthTip } from "@/types/healthTip";
import { stripHtml } from "@/utils/healthTips";

export const HealthTipDetailScreen = ({ route, navigation }: any) => {
  const { tipId } = route.params;

  const [tip, setTip] = useState<HealthTip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTip = async () => {
      try {
        const response = await healthTipsApi.getTip(tipId);
        setTip(response.data);
      } catch (error) {
        console.log("Health tip detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTip();
  }, [tipId]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <>
            <Text style={styles.title}>{tip?.title}</Text>

            <Text style={styles.date}>
              Active: {tip?.from} → {tip?.to}
            </Text>

            <Text style={styles.content}>
              {stripHtml(tip?.content ?? "")}
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#DFF8F2" },
  container: { padding: 20, paddingBottom: 50 },
  back: { fontSize: 16, color: theme.colors.text, marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  date: {
    marginTop: 10,
    marginBottom: 22,
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  content: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 18,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 24,
  },
});