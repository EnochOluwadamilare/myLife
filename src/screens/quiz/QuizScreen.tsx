import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { educationApi } from "@/api/education/educationApi";
import { ActiveQuiz } from "@/types/quiz";

export const QuizScreen = ({ navigation }: any) => {
  const [quizzes, setQuizzes] = useState<ActiveQuiz[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const response = await educationApi.getActiveQuizzes();
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.log("Active quizzes error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Knowledge Quiz</Text>

        <Text style={styles.subtitle}>
          Test your pregnancy and HIV care knowledge.
        </Text>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : quizzes.length === 0 ? (
          <Text style={styles.empty}>No active quizzes available.</Text>
        ) : (
          quizzes.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate(ROUTES.QuizDetail, {
                  quizId: quiz.id,
                })
              }
            >
              <Text style={styles.cardTitle}>{quiz.title}</Text>

              <Text style={styles.description}>
                {quiz.description}
              </Text>

              <Text style={styles.meta}>
                {quiz.total_questions} questions · Passing score{" "}
                {quiz.passing_score}%
              </Text>

              <Text style={styles.start}>Start Quiz →</Text>
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
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: "#6B7280",
    fontSize: 15,
  },
  empty: {
    color: "#6B7280",
    fontSize: 15,
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
  meta: {
    marginTop: 12,
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  start: {
    marginTop: 14,
    color: theme.colors.primary,
    fontWeight: "800",
  },
});