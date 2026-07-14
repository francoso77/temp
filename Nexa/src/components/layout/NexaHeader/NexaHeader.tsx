import { StyleSheet, View } from "react-native";

import { NexaSpacer } from "../../base/NexaSpacer";
import { NexaText } from "../../base/NexaText";

type Props = {
  title: string;
  subtitle?: string;
};

export function NexaHeader({
  title,
  subtitle,
}: Props) {
  return (
    <View style={styles.container}>
      <NexaText variant="title">
        {title}
      </NexaText>

      {subtitle && (
        <>
          <NexaSpacer size="xs" />

          <NexaText
            variant="small"
          >
            {subtitle}
          </NexaText>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});