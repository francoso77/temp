import {
  View,
} from "react-native";

import {
  NexaSpacer,
  NexaText,
} from "@/components";

type Props = {

  title: string;

  subtitle?: string;

};

export function NexaPageHeader({

  title,

  subtitle,

}: Props) {

  return (

    <View>

      <NexaText variant="title">

        {title}

      </NexaText>

      {!!subtitle && (

        <>

          <NexaSpacer size="xs" />

          <NexaText
            color="#6B7280"
          >

            {subtitle}

          </NexaText>

        </>

      )}

      <NexaSpacer size="lg" />

    </View>

  );

}