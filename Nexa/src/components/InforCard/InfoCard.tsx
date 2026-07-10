import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Spacing } from "../../theme";
import { Card } from "../Card";
import { Typography } from "../Typography";

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
    <Card>
      <View style={styles.header}>
        <Typography variant="h2">
          {icon} {title}
        </Typography>
      </View>

      <View style={styles.content}>
        {children}
      </View>
    </Card>
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