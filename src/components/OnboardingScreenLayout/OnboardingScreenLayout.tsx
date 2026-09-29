import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import { theme } from "@/theme/theme";

interface Props {
  title: string;
  description: string;
  image: ImageSourcePropType;
  onNext: () => void;
}

export const OnboardingScreenLayout = ({
  title,
  description,
  image,
  onNext,
}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onNext} style={styles.nextButton}>
        <Text style={styles.nextText}>Next →</Text>
      </TouchableOpacity>

      <Image source={image} style={styles.image} resizeMode="contain" />

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      <Text style={styles.brand}>
        myLife{"\n"}App
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 70,
    alignItems: "center",
  },
  nextButton: {
    alignSelf: "flex-end",
  },
  nextText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  image: {
    width: 180,
    height: 180,
    marginTop: 90,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
    // textAlign: "left",
    width: "100%",
    lineHeight: 31,
  },
  description: {
    marginTop: 48,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    lineHeight: 22,
  },
  brand: {
    position: "absolute",
    bottom: 60,
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
});