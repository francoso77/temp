import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Spacing } from "../../theme";
import { NexaCard } from '../base/NexaCard';
import { NexaText } from '../base/NexaText';
type Props = {
  icon: string;
  title: string;
  children: ReactNode;
};

export function InfoCard({
  icon,
  title,
  children,
}: Props) {
  return (
    <NexaCard>
      <View style={styles.header}>
        <NexaText variant="h2">
          {icon} {title}
        </NexaText>
      </View>

      <View style={styles.content}>
        {children}
      </View>
    </NexaCard>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.md,
  },

  content: {
    gap: Spacing.sm,
  },
});