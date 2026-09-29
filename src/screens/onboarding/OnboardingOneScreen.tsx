import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import PregnancyTrack from "@/assets/illustrations/pregnancy2.svg";
import { ROUTES } from "@/constants/routes";
import { OnboardingScreenLayout } from "@/components/OnboardingScreenLayout/OnboardingScreenLayout";

type Props = NativeStackScreenProps<any>;

export const OnboardingOneScreen = ({ navigation }: Props) => {
  return (
    <OnboardingScreenLayout
      image={require("@/assets/images/pregnancy1.png")}
      title="Track your pregnancy every step of the way"
      description="Monitor your baby’s growth, know your stage, and stay informed with simple, clear insights based on your HIV status"
      onNext={() => navigation.navigate(ROUTES.OnboardingTwo)}
    />
  );
};