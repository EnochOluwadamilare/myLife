import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/theme";
import { chatApi } from "@/api/chat/chatApi";
import { ChatItem, ChatMessage } from "@/types/chat";
import { useAuthStore } from "@/store/useAuthStore";

export const ChatDetailScreen = ({ route, navigation }: any) => {
  const { chatId } = route.params;

  const currentUser = useAuthStore((state) => state.user);

  const scrollRef = useRef<ScrollView>(null);

  const [chat, setChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadChat = useCallback(
    async (scrollToEnd = false) => {
      try {
        const response = await chatApi.getChat(chatId);

        setChat(response.data.chat);
        setMessages(response.data.messages ?? []);

        if (scrollToEnd) {
          setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 200);
        }
      } catch (error) {
        console.log("Chat detail error:", error);
      } finally {
        setLoading(false);
      }
    },
    [chatId]
  );

  useEffect(() => {
    loadChat(true);

    const interval = setInterval(() => {
      loadChat(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [loadChat]);

  const sendMessage = async () => {
    const trimmed = message.trim();

    if (!trimmed || sending) return;

    try {
      setSending(true);

      const response = await chatApi.sendMessage(chatId, trimmed);

      setMessages((current) => [
        ...current,
        response.data.chat_message,
      ]);

      setMessage("");

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.log("Send message error:", error);
      Alert.alert("Error", "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  const isClosed = chat?.status === "closed" || chat?.status === "archived";

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {chat?.subject || "Doctor Chat"}
            </Text>
            <Text style={styles.status}>
              {chat?.status || "loading"}
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            color={theme.colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((item) => {
                const isMine = item.sender_id === currentUser?.id;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.messageBubble,
                      isMine ? styles.myBubble : styles.theirBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isMine && styles.myMessageText,
                      ]}
                    >
                      {item.message}
                    </Text>

                    <Text
                      style={[
                        styles.messageTime,
                        isMine && styles.myMessageTime,
                      ]}
                    >
                      {new Date(item.created_at).toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {isClosed ? (
              <View style={styles.closedBox}>
                <Text style={styles.closedText}>
                  This chat has been closed.
                </Text>
              </View>
            ) : (
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Type your message..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                />

                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={sendMessage}
                  disabled={sending}
                >
                  <Text style={styles.sendText}>
                    {sending ? "..." : "Send"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: "#DFF8F2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#BFE8E1",
  },
  back: { fontSize: 28, color: theme.colors.text },
  title: {
    fontSize: 17,
    fontWeight: "900",
    color: theme.colors.text,
  },
  status: {
    marginTop: 3,
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 28,
  },
  messageBubble: {
    maxWidth: "78%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  myMessageText: { color: theme.colors.white },
  messageTime: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 10,
  },
  myMessageTime: { color: "#E0FFFA" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    padding: 12,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: "#BFE8E1",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: theme.colors.text,
    backgroundColor: "#F9FAFB",
  },
  sendButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendText: {
    color: theme.colors.white,
    fontWeight: "900",
  },
  closedBox: {
    padding: 18,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: "#BFE8E1",
  },
  closedText: {
    textAlign: "center",
    color: "#6B7280",
    fontWeight: "700",
  },
});