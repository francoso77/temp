import { router } from "expo-router";
import { View } from "react-native";

import {
  Button,
  InfoCard,
  Screen,
  Typography,
} from "../../components";

import { Spacing } from "../../theme";

export default function NewAppointmentScreen() {
  return (
    <Screen>
      <Typography variant="title">
        Novo Agendamento
      </Typography>

      <View style={{ height: Spacing.lg }} />

      <InfoCard
        icon="👤"
        title="Cliente"
      >
        <Typography>
          Nenhuma cliente selecionada.
        </Typography>

        <View style={{ height: Spacing.md }} />

        <Button
          title="Selecionar Cliente"
          onPress={() => router.push("/clients/select")}
        />
      </InfoCard>

      <View style={{ height: Spacing.lg }} />

      <InfoCard
        icon="📅"
        title="Data e Horário"
      >
        <Typography>
          Selecione uma cliente para continuar.
        </Typography>
      </InfoCard>
    </Screen>
  );
}