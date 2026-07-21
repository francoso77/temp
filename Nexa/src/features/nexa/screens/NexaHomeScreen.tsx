import { router } from "expo-router";

import {
  NexaButton,
  NexaPageHeader,
  NexaScreen,
  NexaSpacer,
} from "@/components";

export function NexaHomeScreen() {

  return (

    <NexaScreen>

      <NexaPageHeader
        title="Nexa"
        subtitle="Central de gerenciamento"
      />

      <NexaButton
        title="Especialidades"
        onPress={() => router.push("/specialties")}
      />

      <NexaSpacer />

      <NexaButton
        title="Disponibilidade"
        onPress={() => router.push("/schedule")}
      />

      <NexaSpacer />

      <NexaButton
        title="Clientes"
        onPress={() => router.push("/clients")}
      />

      <NexaSpacer />

      <NexaButton
        title="Financeiro"
        onPress={() => { }}
        variant="secondary"
      />

    </NexaScreen>

  );

}