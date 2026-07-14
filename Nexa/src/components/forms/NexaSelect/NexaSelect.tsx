import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
} from "react-native";

import {
  Colors,
  Typography,
} from "../../../theme";

export type NexaTextVariant =
  | "display"
  | "title"
  | "h1"
  | "h2"
  | "body"
  | "small"
  | "caption";

type Props = {
  children: ReactNode;

  variant?: NexaTextVariant;

  color?: string;

  align?: "left" | "center" | "right";

  weight?:
  | "400"
  | "500"
  | "600"
  | "700";

  style?: StyleProp<TextStyle>;

  numberOfLines?: number;
};

export function NexaText({

  children,

  variant = "body",

  color = Colors.text,

  align = "left",

  weight,

  style,

  numberOfLines,

}: Props) {

  return (

    <Text

      numberOfLines={numberOfLines}

      style={[

        styles.base,

        styles[variant],

        {

          color,

          textAlign: align,

          fontWeight: weight,

        },

        style,

      ]}

    >

      {children}

    </Text>

  );

}

const styles = StyleSheet.create({

  base: {

    color: Colors.text,

  },

  display: {

    fontSize: Typography.display,

    fontWeight: "700",

  },

  title: {

    fontSize: Typography.title,

    fontWeight: "700",

  },

  h1: {

    fontSize: Typography.h1,

    fontWeight: "700",

  },

  h2: {

    fontSize: Typography.h2,

    fontWeight: "600",

  },

  body: {

    fontSize: Typography.body,

  },

  small: {

    fontSize: Typography.small,

    color: Colors.textSecondary,

  },

  caption: {

    fontSize: Typography.caption,

    color: Colors.textLight,

  },

});