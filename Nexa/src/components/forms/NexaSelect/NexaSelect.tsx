import { Pressable, StyleSheet, View } from "react-native";

import { Colors, Radius, Spacing } from "../../../theme";
import { NexaText } from "../../base/NexaText";

export type NexaSelectOption = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
};

export function NexaSelect({
  label,
  value,
  placeholder = "Selecione...",
  onPress,
}: Props) {
  return (
    <View style={styles.container}>
      <NexaText variant="small">
        {label}
      </NexaText>

      <Pressable
        style={styles.select}
        onPress={onPress}
      >
        <NexaText
          color={value ? Colors.text : Colors.textSecondary}
        >
          {value || placeholder}
        </NexaText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },

  select: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    minHeight: 52,
  },
});