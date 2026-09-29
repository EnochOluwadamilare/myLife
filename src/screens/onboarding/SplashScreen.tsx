import React, { useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";

type Props = NativeStackScreenProps<any>;

export const SplashScreen = ({ navigation }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(ROUTES.OnboardingOne);
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/mylifelogosmall.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.brand}>
        myLife{"\n"}App
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  logo: {
    width: 120,
    height: 120,
  },
  brand: {
    position: "absolute",
    bottom: 70,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: theme.colors.white,
  },
});