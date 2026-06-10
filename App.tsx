import { useEffect } from "react";
import { AppNavigator } from "@/navigation/AppNavigator";
import { initializeDatabase } from "@/database/init";
import { setupInterceptors } from "@/api/setupInterceptors";
import { useAuthStore } from "@/store/useAuthStore";


export default function App() {
  const bootstrapAsync =
    useAuthStore(
      (state) =>
        state.bootstrapAsync
    );

  useEffect(() => {
    initializeDatabase();
    setupInterceptors();
    bootstrapAsync();
  }, []);
  return <AppNavigator />;
}