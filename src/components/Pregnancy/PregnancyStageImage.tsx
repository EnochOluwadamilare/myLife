import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from "react-native";

interface Props {
  week: number;
  size?: number;
}

const pregnancyStageImages: Record<number, ImageSourcePropType> = {
  1: require("@/assets/illustrations/pregnancystage/1.png"),
  2: require("@/assets/illustrations/pregnancystage/2.png"),
  3: require("@/assets/illustrations/pregnancystage/3.png"),
  4: require("@/assets/illustrations/pregnancystage/4.png"),
  5: require("@/assets/illustrations/pregnancystage/5.png"),
  6: require("@/assets/illustrations/pregnancystage/6.png"),
  7: require("@/assets/illustrations/pregnancystage/7.png"),
  8: require("@/assets/illustrations/pregnancystage/8.png"),
  9: require("@/assets/illustrations/pregnancystage/9.png"),
};

const getPregnancyMonth = (week: number): number => {
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  if (week <= 13) return 3;
  if (week <= 17) return 4;
  if (week <= 22) return 5;
  if (week <= 26) return 6;
  if (week <= 30) return 7;
  if (week <= 35) return 8;
  return 9;
};

export const PregnancyStageImage = ({
  week,
  size = 72,
}: Props) => {
  const month = getPregnancyMonth(week);
  const image = pregnancyStageImages[month];

  return (
    <View style={styles.wrapper}>
      <Image
        source={image}
        style={{
          width: size,
          height: size,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right: 18,
    top: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});