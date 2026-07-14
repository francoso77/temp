import { Pressable, StyleSheet } from "react-native";

import { Colors, Radius } from "../../../theme";

import { NexaText } from "../../base/NexaText";

type Props = {
  onPress: () => void;
};

export function NexaFloatingButton({
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <NexaText
        color={Colors.white}
        weight="700"
      >
        +
      </NexaText>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  button: {

    position: "absolute",

    right: 24,

    bottom: 24,

    width: 60,

    height: 60,

    borderRadius: Radius.round,

    backgroundColor: Colors.primary,

    justifyContent: "center",

    alignItems: "center",

    elevation: 6,

  }

});