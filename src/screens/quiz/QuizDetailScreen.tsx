import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { educationApi } from "@/api/education/educationApi";
import { QuizDetail, SubmitQuizAnswer } from "@/types/quiz";

const stripHtml = (html: string) => {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .trim();
};

export const QuizDetailScreen = ({ route, navigation }: any) => {
  const { quizId } = route.params;

  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await educationApi.getQuiz(quizId);
        setQuizDetail(response.data);
      } catch (error) {
        console.log("Quiz load error:", error);
        Alert.alert("Quiz unavailable", "Unable to load this quiz.");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  const submit = async () => {
    if (!quizDetail) return;

    const payload: SubmitQuizAnswer[] = Object.entries(answers).map(
      ([questionId, answer]) => ({
        question_id: Number(questionId),
        answer,
      })
    );

    if (payload.length !== quizDetail.questions.length) {
      Alert.alert("Incomplete", "Please answer all questions.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await educationApi.submitQuiz(quizId, payload);

      navigation.replace(ROUTES.QuizResult, {
        result: response.data,
      });
    } catch (error) {
      console.log("Quiz submit error:", error);
      Alert.alert("Error", "Unable to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };


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
            <Text style={styles.title}>
              {quizDetail?.quiz.title}
            </Text>

            <Text style={styles.subtitle}>
              {quizDetail?.quiz.description}
            </Text>

            {quizDetail?.questions.map((question, index) => (
              <React.Fragment key={question.id}>
                <Text style={styles.question}>
                  {index + 1}. {stripHtml(question.question_text)}
                </Text>

                {question.options.map((option, optionIndex) => {
                  const optionText = option.text;

                  return (
                    <TouchableOpacity
                      key={`${question.id}-${optionIndex}`}
                      style={[
                        styles.option,
                        answers[question.id] === optionText &&
                          styles.optionActive,
                      ]}
                      onPress={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: optionText,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          answers[question.id] === optionText &&
                            styles.optionTextActive,
                        ]}
                      >
                        {optionText}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </React.Fragment>
            ))}

            <TouchableOpacity
              style={styles.button}
              onPress={submit}
              disabled={submitting}
            >
              <Text style={styles.buttonText}>
                {submitting ? "Submitting..." : "Submit Quiz"}
              </Text>
            </TouchableOpacity>
          </>
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
  back: {
    marginBottom: 24,
    color: theme.colors.text,
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: "#6B7280",
  },
  question: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  option: {
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 16,
    marginBottom: 10,
  },
  optionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  optionTextActive: {
    color: theme.colors.white,
  },
  button: {
    marginTop: 28,
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
});