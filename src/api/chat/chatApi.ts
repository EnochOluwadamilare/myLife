import { apiClient } from "@/api/client";
import {
  ChatListResponse,
  ChatDetailResponse,
  SendChatMessageResponse,
  UnreadChatCountResponse,
} from "@/types/chat";

export const chatApi = {
  getChats(status?: "active" | "closed" | "archived") {
    return apiClient.get<ChatListResponse>("/chats", {
      params: {
        status,
        per_page: 20,
      },
    });
  },

  getChat(chatId: number | string) {
    return apiClient.get<ChatDetailResponse>(`/chats/${chatId}`, {
      params: {
        per_page: 50,
      },
    });
  },

  sendMessage(chatId: number | string, message: string) {
    return apiClient.post<SendChatMessageResponse>(
      `/chats/${chatId}/messages`,
      { message }
    );
  },

  getUnreadCount() {
    return apiClient.get<UnreadChatCountResponse>("/chats/unread/count");
  },
};