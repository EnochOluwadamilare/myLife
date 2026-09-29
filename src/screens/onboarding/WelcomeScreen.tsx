import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";

type Props = NativeStackScreenProps<any>;

export const WelcomeScreen = ({ navigation }: Props) => {
  const { user } = useAuthStore();
  useEffect(() => {
    if (user) {
      navigation.replace(ROUTES.Home);
    }
  }, [user, navigation]);
  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <Image
          source={require("../../assets/images/mylifelogobig.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.question}>
        Are you a new user?
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate(ROUTES.Register)}
      >
        <Text style={styles.primaryText}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles.or}>OR</Text>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate(ROUTES.Login)}
      >
        <Text style={styles.secondaryText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  logoArea: {
    marginBottom: 90,
  },
  logo: {
    width: 210,
    height: 210,
  },
  question: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 16,
  },
  primaryButton: {
    width: "100%",
    height: 48,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  or: {
    marginVertical: 14,
    fontSize: 14,
    color: theme.colors.text,
  },
  secondaryButton: {
    width: "100%",
    height: 48,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
});