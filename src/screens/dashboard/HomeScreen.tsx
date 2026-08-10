import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  DimensionValue
} from "react-native";
import { theme } from "@/theme/theme";
import { authApi } from "@/api/auth/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useHealthSetupStore } from "@/store/useHealthSetupStore";
import { ROUTES } from "@/constants/routes";
import { profileApi } from "@/api/profile/profileApi";
import { HealthMetadata } from "@/types/profile";
import { SafeAreaView } from "react-native-safe-area-context";
import { getViralLoadStatus } from "@/utils/viralLoad";
import { PregnancyStageImage } from "@/components/Pregnancy/PregnancyStageImage";
import { HealthTip } from "@/types/healthTip";
import { healthTipsApi } from "@/api/healthTips/healthTipsApi";
import { getCurrentHealthTip, stripHtml } from "@/utils/healthTips";
import { chatApi } from "@/api/chat/chatApi";
import { localNotificationService, LocalScheduledNotification } from "@/services/notifications/localNotificationService";
import { useFocusEffect } from "@react-navigation/native";


const DOCTOR_PHONE = "+2348059993533";
const openDoctorContact = () => {
  Alert.alert("Talk to a Doctor", "Choose an option", [
    {
      text: "WhatsApp",
      onPress: () =>
        Linking.openURL(`https://wa.me/2348059993533`),
    },
    {
      text: "Call",
      onPress: () =>
        Linking.openURL(`tel:${DOCTOR_PHONE}`),
    },
    { text: "Cancel", style: "cancel" },
  ]);
};

const openDoctorChat = () => {
  // console.log("👥 Auth Store Current User State:", useAuthStore().user);
  Alert.alert("Talk to a Doctor", "Coming soon");
};

const openExercise = () => {
  // console.log("👥 Local Storage 1:", localStorage.key(3));
  Alert.alert("Talk to a Doctor1");
};
const openLearnMore = () => {
  // console.log("👥 Local Storage 2:", localStorage.key(2));
  Alert.alert("Talk to a Doctor2");
};
const openScheduleVisit = () => {
  // console.log("👥 Local Storage 1:", localStorage.key(1));
  Alert.alert("Talk to a Doctor3");
};


export const HomeScreen = ({ navigation}: any) => {
    const { user, setUser, logout } = useAuthStore();
    const setup = useHealthSetupStore();
    const viralLoad = setup.viral_load ?? 0;
    const viralInfo = getViralLoadStatus(Number(viralLoad));
    const viralLoadStatus = viralLoad < 50 ? "Undetectable" : viralLoad < 1000 ? "Low" : "High";
    // const viralProgress = viralLoad < 50 ? "95%" : viralLoad < 1000 ? "60%" : "30%";
    const minLog = Math.log10(20);       // 1.301
    const maxLog = Math.log10(1000000);  // 6.0
    const currentLog = Math.log10(Math.min(1000000, Math.max(20, viralLoad)));
    const infectionPercent = ((currentLog - minLog) / (maxLog - minLog)) * 100;
    const viralProgress = `${Math.round(100 - infectionPercent)}%` as DimensionValue;
    const [chatUnreadCount, setChatUnreadCount] = useState(0);
    const [healthMetadata, setHealthMetadata] = useState<HealthMetadata | null>(null);
    const [todayTip, setTodayTip] = useState<HealthTip | null>(null);
    const pregnancyWeek = healthMetadata?.weeks_pregnant ?? 0;
    const pregnancyProgress = Math.min(
        100,
        Math.round((pregnancyWeek / 40) * 100)
    );
    console.log("Health Metadata:", healthMetadata);
    console.log("Health Setup Data:", setup);
    const trimesterLabel =
        healthMetadata?.trimester === 1
            ? "First Trimester"
        : healthMetadata?.trimester === 2
            ? "Second Trimester"
        : healthMetadata?.trimester === 3
            ? "Third Trimester"
    : "Pregnancy";

    const firstName = user?.name?.split(" ")[0] ?? "there";
    const [scheduledNotifications, setScheduledNotifications] = useState<
      LocalScheduledNotification[]
    >([]);
    const loadScheduledNotifications = useCallback(async () => {
      try {
        const notifications =
          await localNotificationService.getScheduledNotifications();

        setScheduledNotifications(notifications);
      } catch (error) {
        console.log("Scheduled notifications unavailable:", error);
      }
    }, []);
    useFocusEffect(
      useCallback(() => {
        loadScheduledNotifications();
      }, [loadScheduledNotifications])
    );
    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            const currentUser = useAuthStore.getState().user;
            const currentToken = useAuthStore.getState().token;

            if (!currentToken || !currentUser) {
            navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.Welcome }],
            });
            return;
            }

            try {
            const [userResponse, metadataResponse] = await Promise.allSettled([
                authApi.getAuthenticatedUser(),
                profileApi.getHealthMetadata(),
            ]);

            if (!isMounted) return;

            if (userResponse.status === "fulfilled") {
                const apiUser = userResponse.value.data.user;

                const existingUser = useAuthStore.getState().user;

                if (
                existingUser?.id !== apiUser.id ||
                existingUser?.name !== apiUser.name ||
                existingUser?.email !== apiUser.email ||
                existingUser?.phone !== apiUser.phone
                ) {
                await useAuthStore.getState().setUser({
                    id: apiUser.id,
                    name: apiUser.name,
                    email: apiUser.email,
                    phone: apiUser.phone,
                });
                }
            }

            if (metadataResponse.status === "fulfilled") {
                setHealthMetadata(metadataResponse.value.data);
            }

            if (
                userResponse.status === "rejected" &&
                (userResponse.reason as any)?.response?.status === 401
            ) {
                await useAuthStore.getState().logout();

                navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.Welcome }],
                });
            }
            } catch (error) {
            console.log("Dashboard load failed:", error);
            }
        };

        const loadHealthTips = async () => {
          try {
            const response = await healthTipsApi.getTips();
            const currentTip = getCurrentHealthTip(response.data.health_tips);
            setTodayTip(currentTip);
          } catch (error) {
            console.log("Health tips not available:", error);
          }
        };
        const loadChatUnread = async () => {
          try {
            const response = await chatApi.getUnreadCount();
            setChatUnreadCount(response.data.unread_count ?? 0);
          } catch (error) {
            console.log("Chat unread count unavailable:", error);
          }
        };
        
        loadDashboard();
        loadHealthTips();
        loadChatUnread();
        return () => {
            isMounted = false;
        };
        }, [navigation]);
  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.screen}>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.header}>
            <Text style={styles.menu}>☰</Text>

            <View>
                <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
                <Text style={styles.subGreeting}>
                You're doing great today
                </Text>
            </View>

            <View style={styles.bellWrapper}>
                <Text style={styles.bell}>🔔</Text>
                <View style={styles.notificationDot} />
            </View>
            </View>

            <View style={[styles.cardBase, styles.pregnancyCard]}>
            <View>
                <Text style={styles.week}>Week {pregnancyWeek}</Text>
                <Text style={styles.muted}>{trimesterLabel}</Text>
            </View>

            <PregnancyStageImage week={pregnancyWeek} />

            <Text style={styles.progressLabel}>Pregnancy Progress</Text>

            <View style={styles.progressTrack}>
                <View
                    style={[
                    styles.progressFill,
                    { width: `${pregnancyProgress}%` },
                    ]}
                />
            </View>

            <Text style={styles.progressPercent}>
                {pregnancyProgress}%
            </Text>

            <Text style={styles.infoText}>Baby size: Corn (30 cm)</Text>
            <Text style={styles.infoText}>
                E.D.D. Delivery date: {healthMetadata?.due_date ?? "Not available"}
            </Text>
            <Text style={styles.infoText}>
                L.M.P. Last Menstrual Period: {healthMetadata?.lmp_date ?? "Not available"}
            </Text>
            </View>

            <View style={[styles.cardBase, styles.card]}>
            <Text style={styles.centerText}>Viral Load Meter</Text>

            <View style={styles.viralTrack}>
                <View style={[styles.viralFill, { width: viralInfo.progress as DimensionValue }]} />
            </View>

            <Text style={styles.centerTextSmall}>
                {viralLoad || "Not recorded"} {viralLoad ? "copies/ml" : ""}
            </Text>
            <Text style={styles.boldCenter}>{viralInfo.status}</Text>

            <Text style={styles.viralMessage}>
                {viralInfo.message}
            </Text>

            <Text style={styles.infoText}>Last Check: 12 April, 2026</Text>
            <Text style={styles.infoText}>Next Test: 12 May, 2026</Text>

            <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate(ROUTES.EditHealthRecord)}>
                <Text style={styles.smallButtonText}>View More/ Edit Health</Text>
            </TouchableOpacity>
            </View>

            <View style={[styles.cardBase, styles.tipCard]}>
            <View style={styles.tipIcon}>
                <Text>💡</Text>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Today's Health Tip: {todayTip?.title ?? "-"}</Text>
                <Text style={styles.tipText}>
                  {todayTip
                    ? stripHtml(todayTip.content)
                    : "Stay hydrated by drinking 8-10 glasses of water daily. It helps with circulation and reduces swelling."
                  }
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.HealthTips)}>
                  <Text style={styles.link}>View More Tips →</Text>
                </TouchableOpacity>
            </View>
            </View>

            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.actionGrid}>
            <ActionCard icon="💬" label={ chatUnreadCount > 0 ? `Chat with Admin (${chatUnreadCount})` : "Chat with Admin"} onPress={() => navigation.navigate(ROUTES.ChatList)}/>
            <ActionCard icon="📅" label="Schedule Visit" onPress={() => navigation.navigate(ROUTES.ScheduleVisit)}/>
            <ActionCard icon="🏋️" label="Exercise" onPress={() => navigation.navigate(ROUTES.Exercise)}/>
            <ActionCard icon="📖" label="Education / Learn More" onPress={() => navigation.navigate(ROUTES.Education)}/>
            <ActionCard icon="💊" label="Medication" onPress={() => navigation.navigate(ROUTES.Medication)}/>
            <ActionCard icon="📞" label="Contact Support" onPress={() => navigation.navigate(ROUTES.Support)}/>
            </View>

            <Text style={styles.sectionTitle}>For You</Text>
            <Text style={styles.sectionSubTitle}>
            Based on your health profile
            </Text>

            <View style={styles.listCard}>
            <View style={styles.tipIcon}>
                <Text>🛡️</Text>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>
                Managing your condition during pregnancy
                </Text>
                <Text style={styles.tipText}>
                Personalized guidance for your journey
                </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
            </View>

            <View style={styles.quizCard}>
            <View style={styles.tipIcon}>
                <Text>💡</Text>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Did you know?</Text>
                <Text style={styles.tipText}>
                Test your pregnancy knowledge with today's quiz
                </Text>

                <TouchableOpacity
                    style={styles.quizButton}
                    onPress={() => navigation.navigate(ROUTES.Quiz)}
                    >
                    <Text style={styles.quizButtonText}>
                        Start Today's Quiz →
                    </Text>
                </TouchableOpacity>
            </View>
            </View>

            <Text style={styles.sectionTitle}>Upcoming Notifications</Text>

            {scheduledNotifications.length === 0 ? (
              <View style={styles.emptyNotificationCard}>
                <Text style={styles.emptyNotificationTitle}>No reminders set</Text>
                <Text style={styles.emptyNotificationText}>
                  Medication and exercise reminders you schedule will appear here.
                </Text>
              </View>
            ) : (
              scheduledNotifications.map((item) => (
                <UpcomingItem
                  key={item.id}
                  icon={item.type === "medication_reminder" ? "💊" : item.type === "visit_reminders" ? "📅" : "🏃"}
                  title={item.title}
                  time={item.time}
                />
              ))
            )}
            <View style={{ height: 90 }} />
        </ScrollView>

        <TouchableOpacity style={styles.floatingButton} onPress={openDoctorContact}>
            <Text style={styles.floatingButtonText}>💬 Talk to Doctor</Text>
        </TouchableOpacity>

        <View style={styles.bottomNav}>
            <BottomNavItem icon="🏠" label="Home" active />
            <BottomNavItem icon="📈" label="Track" onPress={openDoctorChat} />
            <BottomNavItem icon="🎧" label="Support" onPress={() => navigation.navigate(ROUTES.Support)} />
            <BottomNavItem icon="👤" label="Profile" onPress={() => navigation.navigate(ROUTES.Profile)} />
        </View>
        </View>
    </SafeAreaView>
  );
};

const ActionCard = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress}>
    <Text style={styles.actionIcon}>{icon}</Text>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const UpcomingItem = ({
  icon,
  title,
  time,
}: {
  icon: string;
  title: string;
  time: string;
}) => (
  <View style={styles.upcomingCard}>
    <View style={styles.tipIcon}>
      <Text>{icon}</Text>
    </View>

    <View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.tipText}>{time}</Text>
    </View>
  </View>
);

const BottomNavItem = ({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Text>{icon}</Text>
    <Text style={[styles.navLabel, active && styles.navLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#DFF8F2",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  menu: {
    fontSize: 22,
    color: theme.colors.text,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subGreeting: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  bellWrapper: {
    position: "relative",
  },
  bell: {
    fontSize: 20,
  },
  notificationDot: {
    position: "absolute",
    right: -2,
    top: -4,
    width: 9,
    height: 9,
    borderRadius: 10,
    backgroundColor: "#EF4444",
  },
  pregnancyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },
  week: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
  },
  muted: {
    color: "#6B7280",
    marginTop: 4,
  },
  babyIcon: {
    position: "absolute",
    right: 22,
    top: 18,
    fontSize: 54,
  },
  progressLabel: {
    marginTop: 24,
    color: "#6B7280",
    fontSize: 13,
  },
  progressTrack: {
    height: 7,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    marginTop: 8,
  },
  progressFill: {
    width: "60%",
    height: 7,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
  },
  progressPercent: {
    alignSelf: "flex-end",
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: -22,
  },
  infoText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 10,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    alignItems: "center",
  },
  centerText: {
    color: "#6B7280",
    fontSize: 13,
  },
  centerTextSmall: {
    fontSize: 11,
    color: theme.colors.text,
    marginTop: 6,
  },
  boldCenter: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.text,
  },
  viralTrack: {
    height: 6,
    width: "90%",
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 12,
  },
  viralFill: {
    height: 6,
    width: "95%",
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
  viralMessage: {
    textAlign: "center",
    fontSize: 13,
    color: theme.colors.text,
    marginTop: 14,
    lineHeight: 18,
  },
  smallButton: {
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  smallButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 12,
  },
  tipCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DDF8F3",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.text,
  },
  tipText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginTop: 8,
  },
  link: {
    color: theme.colors.primary,
    marginTop: 12,
    fontSize: 12,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 6,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 28,
  },
  actionCard: {
    width: "47%",
    height: 96,
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    padding: 18,
    justifyContent: "center",
  },
  actionIcon: {
    fontSize: 18,
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  arrow: {
    fontSize: 32,
    color: "#6B7280",
  },
  quizCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
  },
  quizButton: {
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  quizButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 12,
  },
  upcomingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  floatingButton: {
    position: "absolute",
    right: 16,
    bottom: 72,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 28,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  floatingButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
  bottomNav: {
    minHeight: 50,
    paddingBottom: Platform.OS === "android" ? 3 : 1,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  navLabelActive: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  cardBase: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  emptyNotificationCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFE8E1",
    padding: 16,
    marginBottom: 12,
  },
  emptyNotificationTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: theme.colors.text,
  },
  emptyNotificationText: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
  },
});