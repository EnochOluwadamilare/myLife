import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "MYLIFE_AUTH_TOKEN";

export const secureStorage = {
  async saveToken(token: string) {
    await SecureStore.setItemAsync(
      TOKEN_KEY,
      token
    );
  },

  async getToken() {
    return SecureStore.getItemAsync(
      TOKEN_KEY
    );
  },

  async clearToken() {
    return SecureStore.deleteItemAsync(
      TOKEN_KEY
    );
  },
};