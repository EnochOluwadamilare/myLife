// src/navigation/AppNavigator.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ROUTES } from "@/constants/routes";

import { SplashScreen } from "@/screens/onboarding/SplashScreen";
import { OnboardingOneScreen } from "@/screens/onboarding/OnboardingOneScreen";
import { OnboardingTwoScreen } from "@/screens/onboarding/OnboardingTwoScreen";
import { WelcomeScreen } from "@/screens/onboarding/WelcomeScreen";

import { RegisterScreen } from "@/screens/auth/RegisterScreen";
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { ForgotPasswordScreen } from "@/screens/auth/ForgotPasswordScreen";

import { HealthSetupOneScreen } from "@/screens/setup/HealthSetupOneScreen";
import { HealthSetupTwoScreen } from "@/screens/setup/HealthSetupTwoScreen";
import { HealthSetupThreeScreen } from "@/screens/setup/HealthSetupThreeScreen";

import { HomeScreen } from "@/screens/dashboard/HomeScreen";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";
import { EditHealthRecordScreen } from "@/screens/profile/EditHealthRecordScreen";

import { EducationScreen } from "@/screens/education/EducationScreen";
import { EducationDetailScreen } from "@/screens/education/EducationDetailScreen";
import { QuizScreen } from "@/screens/quiz/QuizScreen";
import { QuizDetailScreen } from "@/screens/quiz/QuizDetailScreen";
import { QuizResultScreen } from "@/screens/quiz/QuizResultScreen";

import { ExerciseScreen } from "@/screens/exercise/ExerciseScreen";
import { ExerciseDetailScreen } from "@/screens/exercise/ExerciseDetailScreen";

import { MedicationScreen } from "@/screens/medication/MedicationScreen";
import { MedicationCreateScreen } from "@/screens/medication/MedicationCreateScreen";
import { MedicationDetailScreen } from "@/screens/medication/MedicationDetailScreen";
import { MedicationEditScreen } from "@/screens/medication/MedicationEditScreen";

import { HealthTipsScreen } from "@/screens/healthTips/HealthTipsScreen";
import { HealthTipDetailScreen } from "@/screens/healthTips/HealthTipDetailScreen";
import { ChatListScreen } from "@/screens/chat/ChatListScreen";
import { ChatDetailScreen } from "@/screens/chat/ChatDetailScreen";
import { NotificationScreen } from "@/screens/notifications/NotificationScreen";
import { ScheduleVisitScreen } from "@/screens/visits/ScheduleVisitScreen";
import { SupportScreen } from "@/screens/support/SupportScreen";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.Splash}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={ROUTES.Splash}
          component={SplashScreen}
        />

        <Stack.Screen
          name={ROUTES.OnboardingOne}
          component={OnboardingOneScreen}
        />

        <Stack.Screen
          name={ROUTES.OnboardingTwo}
          component={OnboardingTwoScreen}
        />

        <Stack.Screen
          name={ROUTES.Welcome}
          component={WelcomeScreen}
        />

        <Stack.Screen
          name={ROUTES.Register}
          component={RegisterScreen}
        />

        <Stack.Screen
          name={ROUTES.Login}
          component={LoginScreen}
        />
        <Stack.Screen name={ROUTES.ForgotPassword} component={ForgotPasswordScreen} />

        <Stack.Screen name={ROUTES.HealthSetupOne} component={HealthSetupOneScreen} />
        <Stack.Screen name={ROUTES.HealthSetupTwo} component={HealthSetupTwoScreen} />

        <Stack.Screen
          name={ROUTES.HealthSetupThree}
          component={HealthSetupThreeScreen}
        />

        <Stack.Screen
          name={ROUTES.Home}
          component={HomeScreen}
        />
        <Stack.Screen
          name={ROUTES.Profile}
          component={ProfileScreen}
        />
        <Stack.Screen
          name={ROUTES.EditHealthRecord}
          component={EditHealthRecordScreen}
        />
        <Stack.Screen name={ROUTES.Education} component={EducationScreen} />
        <Stack.Screen name={ROUTES.EducationDetail} component={EducationDetailScreen} />
        <Stack.Screen name={ROUTES.Quiz} component={QuizScreen} />
        <Stack.Screen name={ROUTES.QuizDetail} component={QuizDetailScreen} />
        <Stack.Screen name={ROUTES.QuizResult} component={QuizResultScreen} />

        <Stack.Screen
          name={ROUTES.Exercise}
          component={ExerciseScreen}
        />

        <Stack.Screen name={ROUTES.ExerciseDetail} component={ExerciseDetailScreen} />
        <Stack.Screen name={ROUTES.Medication} component={MedicationScreen} />
        <Stack.Screen name={ROUTES.MedicationCreate} component={MedicationCreateScreen} />
        <Stack.Screen name={ROUTES.MedicationDetail} component={MedicationDetailScreen} />
        <Stack.Screen name={ROUTES.MedicationEdit} component={MedicationEditScreen} />

        <Stack.Screen name={ROUTES.HealthTips} component={HealthTipsScreen} />
        <Stack.Screen name={ROUTES.HealthTipDetail} component={HealthTipDetailScreen} />
        <Stack.Screen name={ROUTES.ChatList} component={ChatListScreen} />
        <Stack.Screen name={ROUTES.ChatDetail} component={ChatDetailScreen} />
        <Stack.Screen name={ROUTES.Notifications} component={NotificationScreen} />
        <Stack.Screen name={ROUTES.ScheduleVisit} component={ScheduleVisitScreen} />
        <Stack.Screen name={ROUTES.Support} component={SupportScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};