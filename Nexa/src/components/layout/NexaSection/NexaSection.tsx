import { ReactNode } from "react";
import { View } from "react-native";

import { NexaSpacer } from "../../base/NexaSpacer";
import { NexaText } from "../../base/NexaText";

type Props = {
  title: string;
  children: ReactNode;
};

export function NexaSection({
  title,
  children,
}: Props) {
  return (
    <View>

      <NexaText
        variant="h2"
      >
        {title}
      </NexaText>

      <NexaSpacer />

      {children}

    </View>
  );
}