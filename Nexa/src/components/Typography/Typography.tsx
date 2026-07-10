import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import { Colors, Typography as Font } from "../../theme";

type Props = {
  children: ReactNode;
  variant?: "title" | "h1" | "h2" | "body" | "small";
};

export function Typography({
  children,
  variant = "body",
}: Props) {
  return (
    <Text style={[styles.base, styles[variant]]}>
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