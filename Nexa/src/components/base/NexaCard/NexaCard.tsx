import { ReactNode } from "react";
import {
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

type Padding =
  | "sm"
  | "md"
  | "lg";

type Props = {

  children: ReactNode;

  padding?: Padding;

  shadow?: boolean;

  outlined?: boolean;

  backgroundColor?: string;

  style?: StyleProp<ViewStyle>;

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

}: Props) {

  return (

    <View

      style={[

        styles.card,

        {

          padding: paddingMap[padding],

          backgroundColor,

          borderWidth: outlined ? 1 : 0,

          borderColor: Colors.border,

        },

        shadow && Shadows.card,

        style,

      ]}

    >

      {children}

    </View>

  );

}

const styles = StyleSheet.create({

  card: {

    borderRadius: Radius.md,

    marginBottom: Spacing.md,

  },

});