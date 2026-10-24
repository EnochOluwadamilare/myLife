import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { theme } from "@/theme/theme";

interface Props extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
}

export const AppButton = ({
  title,
  variant = "primary",
  style,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "primary" ? styles.primary : styles.secondary,
        style,
      ]}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 48,
    borderRadius: theme.radius.round,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  text: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});