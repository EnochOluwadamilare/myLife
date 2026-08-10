// src/screens/support/SupportScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { SUPPORT } from "@/constants/support";

export const SupportScreen = ({ navigation }: any) => {
  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Failed to open URL:", url, error);

      Alert.alert(
        "Unable to open",
        "No application is available to handle this action on your device."
      );
    }
  };

  const openWhatsApp = async () => {
    const appUrl = `whatsapp://send?phone=${SUPPORT.whatsapp}`;
    const webUrl = `https://wa.me/${SUPPORT.whatsapp}`;

    try {
      const canOpenApp = await Linking.canOpenURL(appUrl);

      if (canOpenApp) {
        await Linking.openURL(appUrl);
        return;
      }

      await Linking.openURL(webUrl);
    } catch (error) {
      console.error("WhatsApp error:", error);

      Alert.alert(
        "Unable to open WhatsApp",
        "Please make sure WhatsApp is installed or try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Support</Text>
        <Text style={styles.subtitle}>
          Get help with your myLife account, health records, reminders, and app usage.
        </Text>

        <SupportCard
          title="Update Health Records"
          value={SUPPORT.healthemail}
          button="Send Email"
          onPress={() => openUrl(`mailto:${SUPPORT.healthemail}`)}
        />

        <SupportCard
          title="Email Support"
          value={SUPPORT.email}
          button="Send Email"
          onPress={() => openUrl(`mailto:${SUPPORT.email}`)}
        />

        <SupportCard
          title="Call Support"
          value={SUPPORT.phone}
          button="Call Now"
          onPress={() => openUrl(`tel:${SUPPORT.phone}`)}
        />

        <SupportCard
          title="WhatsApp Support"
          value={SUPPORT.phone}
          button="Open WhatsApp"
          onPress={openWhatsApp}
        />

        <SupportCard
          title="Website"
          value={SUPPORT.website}
          button="Visit Website"
          onPress={() => openUrl(SUPPORT.website)}
        />
      </View>
    </SafeAreaView>
  );
};

const SupportCard = ({
  title,
  value,
  button,
  onPress,
}: {
  title: string;
  value: string;
  button: string;
  onPress: () => void;
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>

    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{button}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#DFF8F2",
  },
  container: {
    padding: 22,
  },
  back: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 18,
    marginBottom: 14,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: theme.colors.text,
  },
  cardValue: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 14,
  },
  button: {
    marginTop: 16,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: "900",
  },
});