import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { AppNavigator } from "@/navigation/AppNavigator";
import { initializeDatabase } from "@/database/init";
import { setupInterceptors } from "@/api/setupInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import { startSyncEngine } from "@/sync/engine/syncEngine";
import * as Notifications from "expo-notifications";

export default function App() {
  const bootstrapAsync =
    useAuthStore(
      (state) =>
        state.bootstrapAsync
    );

  useEffect(() => {
    // Global notification handler so scheduled notifications play sound
    // and show banners even when the app is backgrounded.
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    initializeDatabase();
    setupInterceptors();
    bootstrapAsync();
    startSyncEngine();

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected || state.isInternetReachable) {
        startSyncEngine();
      }
    });

    return () => unsubscribe();
  }, []);
  return <AppNavigator />;
}