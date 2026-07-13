import { router } from "expo-router";
import { View } from "react-native";

import {
  InfoCard,
  NexaButton,
  NexaScreen,
  NexaText,
} from "../../components";

import { Spacing } from "../../theme";

export default function NewAppointmentScreen() {
  return (
    <NexaScreen>
      <NexaText variant="title">
        Novo Agendamento
      </NexaText>

      <View style={{ height: Spacing.lg }} />

      <InfoCard
        icon="👤"
        title="Cliente"
      >
        <NexaText>
          Nenhum cliente selecionado.
        </NexaText>

        <View style={{ height: Spacing.md }} />

        <NexaButton
          title="Selecionar Cliente"
          onPress={() => router.push("/clients/select")}
        />
      </InfoCard>

      <View style={{ height: Spacing.lg }} />

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