import { router } from "expo-router";

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
    <NexaCard
      pressable
      onPress={() =>
        router.push(`/services/${service.id}`)
      }
    >

      <NexaText variant="h2">
        {service.name}
      </NexaText>

      <NexaSpacer size="xs" />

      <NexaText variant="small">
        {service.category}
      </NexaText>

      <NexaSpacer size="xs" />

      <NexaText>
        {service.description}
      </NexaText>

      <NexaSpacer size="sm" />

      <NexaText>

        ⏱ {service.durationMinutes} min

      </NexaText>

      <NexaSpacer size="xs" />

      <NexaText>

        {new Intl.NumberFormat(
          "pt-BR",
          {
            style: "currency",
            currency: "BRL",
          }
        ).format(service.price)}

      </NexaText>

      <NexaSpacer size="sm" />

      <NexaBadge
        text={
          service.active
            ? "Ativo"
            : "Inativo"
        }
        variant={
          service.active
            ? "success"
            : "default"
        }
      />

    </NexaCard>
  );
}