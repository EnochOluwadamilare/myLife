import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { ROUTES } from "@/constants/routes";
import { chatApi } from "@/api/chat/chatApi";
import { ChatItem } from "@/types/chat";

const DOCTOR_PHONE = "+2348059993533";

const openDoctorContact = () => {
  Alert.alert("Talk to a Doctor", "Choose an option", [
    {
      text: "WhatsApp",
      onPress: () => Linking.openURL("https://wa.me/2348059993533"),
    },
    {
      text: "Call",
      onPress: () => Linking.openURL(`tel:${DOCTOR_PHONE}`),
    },
    { text: "Cancel", style: "cancel" },
  ]);
};

export const ChatListScreen = ({ navigation }: any) => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadChats = useCallback(async () => {
    try {
      const response = await chatApi.getChats("active");

      setChats(response.data.chats ?? []);
      setUnreadCount(response.data.unread_count ?? 0);
    } catch (error) {
      console.log("Chat list error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const refresh = () => {
    setRefreshing(true);
    loadChats();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Doctor Chat</Text>

        <Text style={styles.subtitle}>
          Continue conversations started by your care team.
        </Text>

        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
            </Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : chats.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No doctor chat yet</Text>
            <Text style={styles.emptyText}>
              Your doctor or admin has not started a chat with you yet.
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              onPress={openDoctorContact}
            >
              <Text style={styles.emptyButtonText}>
                Use WhatsApp or Call Instead
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate(ROUTES.ChatDetail, {
                  chatId: chat.id,
                })
              }
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>Dr</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.subject}>
                  {chat.subject || "Doctor conversation"}
                </Text>

                <Text style={styles.message} numberOfLines={2}>
                  {chat.latest_message?.message || "No messages yet"}
                </Text>

                <Text style={styles.status}>
                  {chat.status.toUpperCase()}
                </Text>
              </View>

              {chat.latest_message?.is_read === false && (
                <View style={styles.dot} />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#DFF8F2" },
  container: { padding: 20, paddingBottom: 50 },
  back: { fontSize: 16, color: theme.colors.text, marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 22,
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  unreadBadge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 18,
  },
  unreadText: {
    color: theme.colors.white,
    fontWeight: "800",
    fontSize: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#DDF8F3",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.primary,
    fontWeight: "900",
  },
  subject: {
    fontSize: 15,
    fontWeight: "900",
    color: theme.colors.text,
  },
  message: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },
  status: {
    marginTop: 8,
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.secondary,
  },
  emptyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 20,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 22,
  },
  emptyButton: {
    marginTop: 18,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyButtonText: {
    color: theme.colors.white,
    fontWeight: "900",
  },
});