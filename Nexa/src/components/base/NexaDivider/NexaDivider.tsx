import { StyleSheet, View } from "react-native";
import { Colors, Spacing } from "../../../theme";

type Props = {
  marginVertical?: number;
};

export function NexaDivider({
  marginVertical = Spacing.md,
}: Props) {
  return (
    <View
      style={[
        styles.divider,
        {
          marginVertical,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: "100%",
  },
});