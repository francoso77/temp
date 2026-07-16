import { useLocalSearchParams } from "expo-router";

import {
  NexaButton,
  NexaScreen,
  NexaSpacer,
  NexaText,
} from "../../../components";

export function ServiceDetailsScreen() {

  const { id } = useLocalSearchParams();

  return (

    <NexaScreen>

      <NexaText variant="title">
        Serviço
      </NexaText>

      <NexaSpacer size="lg" />

      <NexaText>

        ID:

      </NexaText>

      <NexaText>

        {id}

      </NexaText>

      <NexaSpacer size="xl" />

      <NexaButton
        title="Editar"
        onPress={() => { }}
      />

    </NexaScreen>

  );

}