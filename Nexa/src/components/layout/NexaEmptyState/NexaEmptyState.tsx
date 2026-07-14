import { StyleSheet, View } from "react-native";

import { NexaSpacer } from "../../base/NexaSpacer";
import { NexaText } from "../../base/NexaText";

type Props = {
  emoji: string;
  title: string;
  description: string;
};

export function NexaEmptyState({
  emoji,
  title,
  description,
}: Props) {
  return (
    <View style={styles.container}>

      <NexaText variant="title">
        {emoji}
      </NexaText>

      <NexaSpacer />

      <NexaText
        variant="h2"
      >
        {title}
      </NexaText>

      <NexaSpacer size="xs" />

      <NexaText>
        {description}
      </NexaText>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {

    alignItems: "center",

    justifyContent: "center",

    paddingVertical: 48,

  }

});