import { StyleSheet, View } from "react-native";

import { Colors, Radius, Spacing } from "../../../theme";
import { NexaText } from "../NexaText";

type Props = {
  text: string;
  color?: string;
};

export function NexaBadge({
  text,
  color = Colors.primary,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color,
        },
      ]}
    >
      <NexaText
        variant="caption"
        color={Colors.white}
        weight="600"
      >
        {text}
      </NexaText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.round,
  },
});