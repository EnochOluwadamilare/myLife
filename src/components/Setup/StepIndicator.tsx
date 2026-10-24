import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "@/theme/theme";

interface Props {
  step: 1 | 2 | 3;
}

export const StepIndicator = ({ step }: Props) => {
  return (
    <View style={styles.row}>
      {[1, 2, 3].map((item) => (
        <View
          key={item}
          style={[
            styles.dot,
            item === step && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 36,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6B7280",
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});