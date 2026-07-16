import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import {
  Colors,
  Radius,
  Shadows,
  Spacing,
} from "../../../theme";

type Padding = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  padding?: Padding;
  shadow?: boolean;
  outlined?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  pressable?: boolean; // Nova propriedade
  onPress?: () => void; // Nova propriedade
};

const paddingMap = {
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
};

export function NexaCard({
  children,
  padding = "md",
  shadow = true,
  outlined = false,
  backgroundColor = Colors.surface,
  style,
  pressable = false,
  onPress,
}: Props) {
  // Estilos comuns que são aplicados tanto na View quanto no Pressable
  const baseStyles = [
    styles.card,
    {
      padding: paddingMap[padding],
      backgroundColor,
      borderWidth: outlined ? 1 : 0,
      borderColor: Colors.border,
    },
    shadow && Shadows.card,
    style,
  ];

  if (pressable) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          baseStyles,
          { opacity: pressed ? 0.9 : 1 }, // Efeito visual de clique
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={baseStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
});