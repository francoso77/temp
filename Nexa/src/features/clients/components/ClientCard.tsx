import { Pressable } from "react-native";

import {
  NexaBadge,

  NexaCard,

  NexaSpacer,

  NexaText,
} from "@/components";

import { Client } from "../models/Client";

type Props = {

  client: Client;

  onPress: () => void;

};

export function ClientCard({

  client,

  onPress,

}: Props) {

  return (

    <Pressable onPress={onPress}>

      <NexaCard>

        <NexaText variant="h2">

          {client.name}

        </NexaText>

        <NexaSpacer size="xs" />

        <NexaText>

          {client.phone}

        </NexaText>

        {!!client.email && (

          <>

            <NexaSpacer size="xs" />

            <NexaText>

              {client.email}

            </NexaText>

          </>

        )}

        <NexaSpacer size="sm" />

        <NexaBadge

          text={
            client.active
              ? "Ativo"
              : "Inativo"
          }

          variant={
            client.active
              ? "success"
              : "default"
          }

        />

      </NexaCard>

    </Pressable>

  );

}