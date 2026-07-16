import { router } from "expo-router";
import { Pressable } from "react-native";

import {
  NexaBadge,
  NexaCard,
  NexaSpacer,
  NexaText,
} from "../../../components";

import { Service } from "../models/Service";

type Props = {
  service: Service;
};

export function ServiceCard({
  service,
}: Props) {
  return (
    <Pressable
      onPress={() =>
        router.push(`/services/${service.id}`)
      }
    >

      <NexaCard>

        <NexaText variant="h2">
          {service.name}
        </NexaText>

        <NexaSpacer size="xs" />

        <NexaText>

          {service.duration} min

        </NexaText>

        <NexaSpacer size="xs" />

        <NexaText>

          R$ {service.price}

        </NexaText>

        <NexaSpacer size="sm" />

        <NexaBadge
          text={service.active ? "Ativo" : "Inativo"}
          color={
            service.active
              ? "#2E7D32"
              : "#9E9E9E"
          }
        />

      </NexaCard>

    </Pressable>
  );
}