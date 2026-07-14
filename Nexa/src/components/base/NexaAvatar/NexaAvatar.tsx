import { StyleSheet, View } from "react-native";

import { Colors } from "../../../theme";

import { NexaText } from "../NexaText";

type Props = {
  name: string;
  size?: number;
};

export function NexaAvatar({
  name,
  size = 48,
}: Props) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <NexaText
        color={Colors.white}
        weight="700"
      >
        {initials}
      </NexaText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});