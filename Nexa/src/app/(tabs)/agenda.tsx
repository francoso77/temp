import { router } from "expo-router";

import { Button, EmptyState, Screen, Typography } from "../../components";

export default function AgendaScreen() {
  return (
    <Screen>
      <Typography variant="title">
        Agenda
      </Typography>

      <EmptyState
        emoji="📅"
        title="Nenhum horário agendado"
        description="Organize seu dia criando seu primeiro atendimento."
      />

      <Button
        title="+ Novo Agendamento"
        onPress={() => router.push("/appointment/new")}
      />
    </Screen>
  );
}

