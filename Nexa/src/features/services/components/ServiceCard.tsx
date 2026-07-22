import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import {
  NexaBadge,
  NexaCard,
  NexaSpacer,
  NexaText,
} from "@/components";


import { formatCurrency } from '@/utils/formatCurrency';
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
      <View style={styles.badges}>

        <NexaBadge
          text={service.specialtyName}
        />

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

      </View>

      <NexaSpacer size="md" />

      <NexaText variant="h2">
        {service.name}
      </NexaText>

      {service.description ? (
        <>
          <NexaSpacer size="xs" />

          <NexaText>
            {service.description}
          </NexaText>
        </>
      ) : null}

      <NexaSpacer size="md" />

      <NexaText>
        {service.durationMinutes} minutos
      </NexaText>

      <NexaSpacer size="xs" />

      <NexaText weight="700">
        {formatCurrency(service.price)}
      </NexaText>

    </NexaCard>
  );
}

const styles = StyleSheet.create({

  badges: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

  },

});