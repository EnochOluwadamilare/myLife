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
import { ROUTES } from "@/constants/routes";
import { healthTipsApi } from "@/api/healthTips/healthTipsApi";
import { HealthTip } from "@/types/healthTip";
import { sortTipsNewestFirst, stripHtml } from "@/utils/healthTips";

export const HealthTipsScreen = ({ navigation }: any) => {
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTips = async () => {
      try {
        const response = await healthTipsApi.getTips();
        setTips(sortTipsNewestFirst(response.data.health_tips));
      } catch (error) {
        console.log("Health tips error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Health Tips</Text>
        <Text style={styles.subtitle}>
          Helpful tips for your pregnancy and HIV care journey.
        </Text>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          tips.map((tip) => (
            <TouchableOpacity
              key={tip.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate(ROUTES.HealthTipDetail, {
                  tipId: tip.id,
                })
              }
            >
              <Text style={styles.cardTitle}>{tip.title}</Text>
              <Text style={styles.content} numberOfLines={2}>
                {stripHtml(tip.content)}
              </Text>
              <Text style={styles.date}>
                {tip.from} → {tip.to}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#DFF8F2" },
  container: { padding: 20, paddingBottom: 50 },
  back: { fontSize: 16, color: theme.colors.text, marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 18,
    marginBottom: 14,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: theme.colors.text,
  },
  content: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
  },
  date: {
    marginTop: 12,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
});