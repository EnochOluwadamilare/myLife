import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { educationApi } from "@/api/education/educationApi";
import { EducationModule } from "@/types/education";

export const EducationScreen = ({ navigation }: any) => {
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const response = await educationApi.getModules();
        setModules(response.data.modules);
      } catch (error) {
        console.log("Education modules error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Learn More</Text>
        <Text style={styles.subtitle}>
          Helpful pregnancy and HIV care information.
        </Text>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          modules.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate(ROUTES.EducationDetail, {
                  moduleId: item.id,
                })
              }
            >
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.readMore}>Read More →</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#DFF8F2",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 15,
    color: "#6B7280",
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },
  category: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.text,
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
  readMore: {
    marginTop: 14,
    color: theme.colors.primary,
    fontWeight: "800",
  },
});