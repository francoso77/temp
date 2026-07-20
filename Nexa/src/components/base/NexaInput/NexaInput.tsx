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

import {
  Colors,
  Radius,
  Spacing,
} from "../../../theme";

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

  pressable?: boolean;

  onPress?: () => void;

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

  pressable = false,

  onPress,

  editable = true,

  ...rest

}: Props) {

  function handleChange(text: string) {

    const value = mask ? mask(text) : text;

    onChangeText?.(value);

  }

  const content = (

    <View
      style={[
        styles.inputContainer,
        error && styles.errorBorder,
      ]}
    >

      {leftComponent}

      <TextInput

        {...rest}

        editable={pressable ? false : editable}

        keyboardType={keyboardType}

        placeholderTextColor={Colors.textLight}

        style={styles.input}

        onChangeText={handleChange}

      />

      {rightComponent}

    </View>

  );

  return (

    <View style={containerStyle}>

      {label && (

        <NexaText
          variant="small"
          weight="600"
          style={styles.label}
        >
          {label}
          {required && " *"}
        </NexaText>

      )}

      {pressable ? (

        <Pressable onPress={onPress}>
          {content}
        </Pressable>

      ) : content}

      {!!error && (

        <NexaText
          variant="caption"
          color={Colors.danger}
          style={styles.message}
        >
          {error}
        </NexaText>

      )}

      {!error && !!helperText && (

        <NexaText
          variant="caption"
          color={Colors.textSecondary}
          style={styles.message}
        >
          {helperText}
        </NexaText>

      )}

    </View>

  );

}

const styles = StyleSheet.create({

  label: {

    marginBottom: Spacing.xs,

  },

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

  errorBorder: {

    borderColor: Colors.danger,

  },

  input: {

    flex: 1,

    fontSize: 16,

    color: Colors.text,

    paddingVertical: Spacing.md,

  },

  message: {

    marginTop: Spacing.xs,

  },

});