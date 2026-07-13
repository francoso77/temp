import { StyleSheet, View } from "react-native";

import { Spacing } from "../../theme";
import { NexaText } from '../base/NexaText';

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
      <NexaText variant="title">
        {emoji}
      </NexaText>

      <View style={{ height: Spacing.sm }} />

      <NexaText variant="h2">
        {title}
      </NexaText>

      <View style={{ height: Spacing.xs }} />

      <NexaText>
        {description}
      </NexaText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
});