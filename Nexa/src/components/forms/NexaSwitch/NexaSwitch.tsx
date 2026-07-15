import { StyleSheet, Switch, View } from "react-native";

import { NexaText } from '@/components/base';
import { Colors, Spacing } from "../../../theme";

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function NexaSwitch({
  label,
  value,
  onValueChange,
}: Props) {
  return (
    <View style={styles.container}>
      <NexaText>
        {label}
      </NexaText>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: Colors.border,
          true: Colors.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
});