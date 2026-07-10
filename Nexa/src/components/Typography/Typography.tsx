import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
} from "react-native";

import { Colors, Typography as Font } from "../../theme";

type Props = {
  children: ReactNode;
  variant?: "title" | "h1" | "h2" | "body" | "small";
  style?: StyleProp<TextStyle>;
};

export function Typography({
  children,
  variant = "body",
  style,
}: Props) {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
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

  title: {
    fontSize: Font.title,
    fontWeight: "700",
  },

  h1: {
    fontSize: Font.h1,
    fontWeight: "700",
  },

  h2: {
    fontSize: Font.h2,
    fontWeight: "600",
  },

  body: {
    fontSize: Font.body,
  },

  small: {
    fontSize: Font.small,
    color: Colors.textSecondary,
  },
});