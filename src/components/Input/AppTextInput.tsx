import React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { theme } from "@/theme/theme";

interface Props extends TextInputProps {}

export const AppTextInput = (props: Props) => {
  return (
    <TextInput
      placeholderTextColor={theme.colors.textSecondary}
      style={styles.input}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.round,
    paddingHorizontal: theme.spacing.md,
    fontSize: 15,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
});