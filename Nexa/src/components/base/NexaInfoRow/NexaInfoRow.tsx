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

};

export function NexaInfoRow({

  label,

  value,

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
      >

        {value}

      </NexaText>

    </View>

  );

}

const styles = StyleSheet.create({

  row: {

    flexDirection: "row",

    justifyContent:
      "space-between",

    marginBottom:
      Spacing.sm,

  },

});