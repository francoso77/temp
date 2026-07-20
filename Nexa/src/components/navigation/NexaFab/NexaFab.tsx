import {
  Pressable,
  StyleSheet,
} from "react-native";

import {
  Colors,
  Radius,
  Shadows,
} from "@/theme";

import { NexaText } from "@/components";

type Props = {

  icon: string;

  onPress: () => void;

};

export function NexaFab({

  icon,

  onPress,

}: Props) {

  return (

    <Pressable

      onPress={onPress}

      style={styles.container}

    >

      <NexaText

        color={Colors.white}

        variant="h1"

      >

        {icon}

      </NexaText>

    </Pressable>

  );

}

const styles = StyleSheet.create({

  container: {

    position: "absolute",

    right: 24,

    bottom: 24,

    width: 60,

    height: 60,

    borderRadius: Radius.round,

    backgroundColor: Colors.primary,

    justifyContent: "center",

    alignItems: "center",

    ...Shadows.card,

  },

});