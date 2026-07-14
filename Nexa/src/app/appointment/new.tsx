import { router } from "expo-router";

import {
  InfoCard,
  NexaButton,
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

      <InfoCard
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
      </InfoCard>

      <NexaSpacer size="lg" />

      <InfoCard
        icon="📅"
        title="Data e Horário"
      >
        <NexaText>
          Selecione um cliente para continuar.
        </NexaText>
      </InfoCard>
    </NexaScreen>
  );
}