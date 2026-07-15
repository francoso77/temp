import { router } from "expo-router";

import { NexaButton, NexaEmptyState, NexaScreen, NexaText } from "../../components";
export default function SelectClientScreen() {
  return (
    <NexaScreen>
      <NexaText variant="title">
        Selecionar Cliente
      </NexaText>

      <NexaEmptyState
        emoji="👤"
        title="Nenhum cliente cadastrado"
        subtitle="Cadastre seu primeiro cliente para começar."
      />

      <NexaButton
        title="Cadastrar Cliente"
        onPress={() => router.push("/clients/new")}
      />
    </NexaScreen>
  );
}