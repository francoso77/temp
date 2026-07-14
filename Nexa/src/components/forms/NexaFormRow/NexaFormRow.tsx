import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Spacing } from "../../../theme";

type Props = {
  children: ReactNode;
};

export function NexaFormRow({
  children,
}: Props) {
  return (
    <View style={styles.row}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
});