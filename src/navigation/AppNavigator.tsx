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
      </Stack.Navigator>
    </NavigationContainer>
  );
};