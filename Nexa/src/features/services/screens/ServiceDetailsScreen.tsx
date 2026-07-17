import { useLocalSearchParams } from "expo-router";

import {
  NexaButton,
  NexaCard,
  NexaScreen,
  NexaSpacer,
  NexaText,
} from "../../../components";

export function ServiceDetailsScreen() {

  const { id } = useLocalSearchParams();

  return (

    <NexaScreen>

      <NexaText variant="title">
        Atendimento
      </NexaText>

      <NexaSpacer size="lg" />

      <NexaCard>

        <NexaText>
          ID
        </NexaText>

        <NexaText weight="600">
          {id}
        </NexaText>

      </NexaCard>

      <NexaSpacer size="xl" />

      <NexaButton
        title="Editar"
        onPress={() => { }}
      />

      <NexaSpacer />

      <NexaButton
        variant="danger"
        title="Excluir"
        onPress={() => { }}
      />

    </NexaScreen>

  );

}