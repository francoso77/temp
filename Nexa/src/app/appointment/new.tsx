import { router } from "expo-router";

import {
  NexaButton,
  NexaInfoCard,
  NexaScreen,
  NexaSpacer,
  NexaText,
} from "../../components";


export default function NewAppointmentScreen() {
  return (
    <NexaScreen>
      <NexaText variant="title">
        Novo Agendamento
      </NexaText>

      <NexaSpacer size="lg" />

      <NexaInfoCard
        icon="👤"
        title="Cliente"
      >
        <NexaText>
          Nenhum cliente selecionado.
        </NexaText>

        <NexaSpacer size="md" />

        <NexaButton
          title="Selecionar Cliente"
          onPress={() => router.push("/clients/select")}
        />
      </NexaInfoCard>

      <NexaSpacer size="lg" />

      <NexaInfoCard
        icon="📅"
        title="Data e Horário"
      >
        <NexaText>
          Selecione um cliente para continuar.
        </NexaText>
      </NexaInfoCard>
    </NexaScreen>
  );
}