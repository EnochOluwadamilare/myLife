import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHtml from "react-native-render-html";

import { theme } from "@/theme/theme";
import { educationApi } from "@/api/education/educationApi";
import { EducationModule } from "@/types/education";

export const EducationDetailScreen = ({ route, navigation }: any) => {
  const { moduleId } = route.params;
  const { width } = useWindowDimensions();

  const [module, setModule] = useState<EducationModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModule = async () => {
      try {
        const response = await educationApi.getModule(moduleId);

        setModule(response.data.module ?? response.data);
      } catch (error) {
        console.log("Education detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [moduleId]);

  const htmlContent = module?.content || module?.description || "";
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
            <Text style={styles.category}>{module?.category}</Text>
            <Text style={styles.title}>{module?.title}</Text>
            <ScrollView style={styles.contentContainer}>
              <RenderHtml
                contentWidth={width - 76} // Exact width balance accounting for screen padding (20*2) and card padding (18*2)
                source={{ html: htmlContent }}
                tagsStyles={htmlTagStyles} // Applies native text styles to HTML elements
              />
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const htmlTagStyles = {
  body: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 24,
  },
  p: {
    marginBottom: 12,
  },
  strong: {
    fontWeight: "800" as const,
  },
  em: {
    fontStyle: "italic" as const,
  },
  ul: {
    marginBottom: 12,
  },
  li: {
    marginBottom: 4,
  }
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
  back: {
    marginBottom: 24,
    color: theme.colors.text,
    fontSize: 16,
  },
  category: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 18,
  },
  content: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 18,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 24,
  },
  contentContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 18,
  },
});