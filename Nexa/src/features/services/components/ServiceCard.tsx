import { View } from "react-native";

import { Service } from "../models/Service";

import {
  NexaButton,
  NexaCard,
  NexaSpacer,
  NexaText,
} from "../../../components";

type Props = {
  service: Service;
};

export function ServiceCard({
  service,
}: Props) {
  return (
    <NexaCard>

      <NexaText variant="h2">
        {service.name}
      </NexaText>

      <NexaSpacer size="xs" />

      <NexaText>
        Duração: {service.duration} min
      </NexaText>

      <NexaText>
        R$ {service.price.toFixed(2)}
      </NexaText>

      <NexaSpacer size="md" />

      <View
        style={{
          flexDirection: "row",
          gap: 12,
        }}
      >
        <NexaButton
          title="Editar"
          fullWidth={false}
          variant="secondary"
          onPress={() => { }}
        />

        <NexaButton
          title="Excluir"
          fullWidth={false}
          variant="danger"
          onPress={() => { }}
        />
      </View>

    </NexaCard>
  );
}