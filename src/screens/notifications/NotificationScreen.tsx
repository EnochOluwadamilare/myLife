import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import {
  localNotificationService,
  LocalScheduledNotification,
} from "@/services/notifications/localNotificationService";

export const NotificationScreen = ({ navigation }: any) => {
  const [scheduledNotifications, setScheduledNotifications] = useState<
    LocalScheduledNotification[]
  >([]);

  const notifications = [
    {
      id: "1",
      icon: "💊",
      title: "Medication reminder",
      time: "Today · 08:30 AM",
      description: "Take your prenatal vitamin, antiretroviral drugs, and iron supplement.",
    },
    {
      id: "2",
      icon: "🏃",
      title: "Exercise reminder",
      time: "Tomorrow · 06:00 AM",
      description: "Gentle walking session is scheduled for this morning.",
    },
    {
      id: "3",
      icon: "📅",
      title: "Clinic reminder",
      time: "Wed, 25 Sep · 02:00 PM",
      description: "Do not forget your scheduled antenatal visit.",
    },
    {
      id: "4",
      icon: "💡",
      title: "Health tip",
      time: "Fri, 27 Sep · 09:00 AM",
      description: "Keep hydrated and monitor any unusual symptoms.",
    },
  ];

  useEffect(() => {
    const loadScheduledNotifications = async () => {
      try {
        const notifications = await localNotificationService.getScheduledNotifications();
        setScheduledNotifications(notifications);
      } catch (error) {
        console.log("Notification screen scheduled notifications unavailable:", error);
      }
    };

    loadScheduledNotifications();
  }, []);

  const mappedScheduledNotifications = scheduledNotifications.map((item) => ({
    id: item.id,
    icon:
      item.type === "medication_reminder"
        ? "💊"
        : item.type === "visit_reminders"
          ? "📅"
          : "🏃",
    title: item.title,
    time: item.time,
    description: item.body,
  }));

  const allNotifications =
    scheduledNotifications.length > 0
      ? [...mappedScheduledNotifications, ...notifications]
      : notifications;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Upcoming Notifications</Text>

        <Text style={styles.subtitle}>
          Your scheduled reminders and updates from myLife.
        </Text>

        {allNotifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        ))}
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
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#DDF8F3",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: theme.colors.text,
  },
  time: {
    marginTop: 6,
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
});
