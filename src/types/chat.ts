export interface ChatLatestMessage {
  id: number;
  message: string;
  is_read: boolean;
}

export interface ChatItem {
  id: number;
  admin_id: number;
  user_id: number;
  subject: string | null;
  status: "active" | "closed" | "archived";
  started_at: string;
  closed_at: string | null;
  latest_message?: ChatLatestMessage | null;
}

export interface ChatListResponse {
  chats: ChatItem[];
  count: number;
  unread_count: number;
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface ChatDetailResponse {
  chat: ChatItem;
  messages: ChatMessage[];
  pagination: {
    count: number;
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface SendChatMessageResponse {
  message: string;
  chat_message: ChatMessage;
}

export interface UnreadChatCountResponse {
  unread_count: number;
}