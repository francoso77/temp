import {
  StyleSheet,
  View,
} from "react-native";

import {
  Colors,
  Spacing,
} from "@/theme";

import {
  NexaText,
} from "@/components";

type Props = {

  label: string;

  value: string;

  multiline?: boolean;

};

export function NexaInfoRow({

  label,

  value,

  multiline,

}: Props) {

  return (

    <View style={styles.row}>

      <NexaText
        color={Colors.textSecondary}
      >

        {label}

      </NexaText>

      <NexaText

        weight="600"

        style={

          multiline && {

            flex: 1,

            textAlign: "right",

          }

        }

      >

        {value}

      </NexaText>

    </View>

  );

}

const styles = StyleSheet.create({

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.md,
  }

});