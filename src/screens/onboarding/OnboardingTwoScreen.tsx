import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import TailoredCare from "@/assets/illustrations/pregnancy2.svg";
import { ROUTES } from "@/constants/routes";
import { OnboardingScreenLayout } from "@/components/OnboardingScreenLayout/OnboardingScreenLayout";

type Props = NativeStackScreenProps<any>;

export const OnboardingTwoScreen = ({ navigation }: Props) => {
  return (
    <OnboardingScreenLayout
      image={require("@/assets/images/pregnancy2.png")}
      title="Get care tailored to you"
      description="Receive health tips, reminders, and guidance designed for your unique journey"
      onNext={() => navigation.navigate(ROUTES.Welcome)}
    />
  );
};