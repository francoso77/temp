import { ReactNode } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

import { Colors, Radius, Spacing } from "../../../theme";
import { NexaSpacer } from "../NexaSpacer";
import { NexaText } from "../NexaText";

type Props = Omit<TextInputProps, "onChangeText"> & {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  keyboardType?: KeyboardTypeOptions;
  mask?: (value: string) => string;
  onChangeText?: (value: string) => void;
  readOnly?: boolean;
  clearable?: boolean;
};

export function NexaInput({
  label,
  helperText,
  error,
  required = false,
  containerStyle,
  leftComponent,
  rightComponent,
  keyboardType = "default",
  mask,
  onChangeText,
  readOnly = false,
  clearable = false,
  value,
  ...rest
}: Props) {
  function handleChange(text: string) {
    const newValue = mask ? mask(text) : text;
    onChangeText?.(newValue);
  }

  function handleClear() {
    onChangeText?.("");
  }

  return (
    <View style={containerStyle}>
      {label && (
        <NexaText variant="small" weight="600" style={styles.label}>
          {label}
          {required && " *"}
        </NexaText>
      )}

      <View style={[styles.inputContainer, error && styles.errorBorder]}>
        {leftComponent}
        {leftComponent && <NexaSpacer size="sm" horizontal />}

        <TextInput
          {...rest}
          value={value}
          editable={!readOnly}
          keyboardType={keyboardType}
          placeholderTextColor={Colors.textLight}
          style={[styles.input, readOnly && styles.readOnlyInput]}
          onChangeText={handleChange}
        />

        {/* Lógica para clearable */}
        {clearable && value !== "" && value !== undefined && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <NexaText color={Colors.textSecondary}>✕</NexaText>
          </Pressable>
        )}

        {rightComponent && <NexaSpacer size="sm" horizontal />}
        {rightComponent}
      </View>

      {!!error && (
        <NexaText variant="caption" color={Colors.danger} style={styles.message}>
          {error}
        </NexaText>
      )}

      {!error && !!helperText && (
        <NexaText variant="caption" color={Colors.textSecondary} style={styles.message}>
          {helperText}
        </NexaText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: Spacing.xs },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  errorBorder: { borderColor: Colors.danger },
  input: { flex: 1, fontSize: 16, color: Colors.text, paddingVertical: Spacing.md },
  readOnlyInput: { color: Colors.textSecondary },
  message: { marginTop: Spacing.xs },
  clearButton: { padding: Spacing.xs },
});