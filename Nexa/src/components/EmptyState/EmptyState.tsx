import { StyleSheet, View } from "react-native";

import { Spacing } from "../../theme";
import { Typography } from "../Typography";

type Props = {
  emoji: string;
  title: string;
  description: string;
};

export function EmptyState({
  emoji,
  title,
  description,
}: Props) {
  return (
    <View style={styles.container}>
      <Typography variant="title">
        {emoji}
      </Typography>

      <View style={{ height: Spacing.sm }} />

      <Typography variant="h2">
        {title}
      </Typography>

      <View style={{ height: Spacing.xs }} />

      <Typography>
        {description}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
});