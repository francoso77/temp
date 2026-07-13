import { router } from "expo-router";

import { EmptyState, NexaButton, NexaScreen, NexaText } from "../../components";

export default function AgendaScreen() {
  return (
    <NexaScreen>
      <NexaText variant="title">
        Agenda
      </NexaText>

      <EmptyState
        emoji="📅"
        title="Nenhum horário agendado"
        description="Organize seu dia criando seu primeiro atendimento."
      />

      <NexaButton
        title="+ Novo Agendamento"
        onPress={() => router.push("/appointment/new")}
      />
    </NexaScreen>
  );
}

