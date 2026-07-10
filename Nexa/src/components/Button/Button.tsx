import { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Colors, Spacing } from "../../theme";
import { Typography } from "../Typography";

type ButtonProps = {
  title: string;
  onPress: () => void;
  children?: ReactNode;
};

export function Button({
  title,
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Typography variant="h2" style={styles.text}>
        {title}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 14,
    alignItems: "center",
  },

  pressed: {
    opacity: 0.85,
  },

  text: {
    color: "#FFF",
  },
});