import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import {
  Colors,
  Radius,
  Spacing,
} from "../../../theme";

import { NexaSpacer } from "../NexaSpacer"; // Importação do componente
import { NexaText } from "../NexaText";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type Props = {
  title?: string;
  children?: ReactNode;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function NexaButton({
  title,
  children,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  leftIcon,
  rightIcon,
}: Props) {
  const background = {
    primary: Colors.primary,
    secondary: Colors.surface,
    danger: Colors.danger,
    ghost: "transparent",
  }[variant];

  const textColor = {
    primary: Colors.white,
    secondary: Colors.text,
    danger: Colors.white,
    ghost: Colors.primary,
  }[variant];

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: background,
          opacity: pressed ? 0.85 : disabled ? 0.5 : 1,
          width: fullWidth ? "100%" : undefined,
          borderWidth: variant === "secondary" ? 1 : 0,
          borderColor: Colors.border,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && (
            <>
              {leftIcon}
              <NexaSpacer size="sm" horizontal />
            </>
          )}

          {children ? (
            children
          ) : (
            <NexaText weight="600" color={textColor}>
              {title}
            </NexaText>
          )}

          {rightIcon && (
            <>
              <NexaSpacer size="sm" horizontal />
              {rightIcon}
            </>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});