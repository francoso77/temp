import { View } from "react-native";
import { Spacing } from "../../../theme";

type Size =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

type Props = {
  size?: Size;
  horizontal?: boolean;
};

const values = {
  xs: Spacing.xs,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
  xl: Spacing.xl,
};

export function NexaSpacer({
  size = "md",
  horizontal = false,
}: Props) {
  return (
    <View
      style={
        horizontal
          ? {
            width: values[size],
          }
          : {
            height: values[size],
          }
      }
    />
  );
}