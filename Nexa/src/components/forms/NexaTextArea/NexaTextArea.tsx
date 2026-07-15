import { StyleSheet, TextInput, View } from "react-native";

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from "../../../theme";

import { NexaSpacer } from "../../base/NexaSpacer";
import { NexaText } from "../../base/NexaText";

type Props = {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
};

export function NexaTextArea({
  label,
  value,
  onChangeText,
  placeholder,
}: Props) {
  return (
    <View>

      {label && (
        <>
          <NexaText variant="small">
            {label}
          </NexaText>

          <NexaSpacer size="xs" />
        </>
      )}

      <TextInput
        multiline
        numberOfLines={5}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        textAlignVertical="top"
        style={styles.input}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: Typography.body,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
});