import { StyleSheet, View } from "react-native";

import { Colors, Radius, Spacing } from "../../../theme";
import { NexaText } from "../NexaText";

type Variant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "default";

type Props = {
  text: string;
  color?: string;
  variant?: Variant;
};

const variantColors = {
  primary: Colors.primary,
  success: "#2E7D32",
  warning: "#F9A825",
  danger: "#C62828",
  default: "#9E9E9E",
};

export function NexaBadge({
  text,
  color,
  variant = "primary",
}: Props) {

  const backgroundColor =
    color ?? variantColors[variant];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
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