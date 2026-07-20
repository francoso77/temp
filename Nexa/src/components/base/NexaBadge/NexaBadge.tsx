import { StyleSheet, View } from "react-native";

import {
  Colors,
  Radius,
  Spacing,
} from "@/theme";

import { NexaText } from "../NexaText";

type Variant =
  | "success"
  | "danger"
  | "warning"
  | "primary"
  | "default";

type Props = {

  text: string;

  variant?: Variant;

};

export function NexaBadge({

  text,

  variant = "primary",

}: Props) {

  const background = {

    success: "#22C55E",

    danger: "#EF4444",

    warning: "#F59E0B",

    primary: Colors.primary,

    default: "#9CA3AF",

  }[variant];

  return (

    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
        }
      ]}
    >

      <NexaText
        variant="caption"
        weight="600"
        color={Colors.white}
      >

        {text}

      </NexaText>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    alignSelf: "flex-start",

    borderRadius: Radius.round,

    paddingHorizontal: Spacing.sm,

    paddingVertical: 4,

  }

});