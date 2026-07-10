import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Colors, Spacing } from "../../theme";

type Props = {
  children: ReactNode;
};

export function Card({ children }: Props) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,

    borderRadius: Spacing.radius,

    padding: Spacing.lg,

    marginBottom: Spacing.md,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },
});