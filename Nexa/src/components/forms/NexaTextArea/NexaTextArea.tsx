import { StyleSheet, TextInput } from "react-native";
import { Colors, Radius, Spacing, Typography } from "../../../theme";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function NexaTextArea({
  value,
  onChangeText,
  placeholder,
}: Props) {
  return (
    <TextInput
      multiline
      numberOfLines={5}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      textAlignVertical="top"
      style={styles.input}
    />
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