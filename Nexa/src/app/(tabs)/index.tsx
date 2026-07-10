import { View } from "react-native";

import { Card, Screen, Typography } from "../../components";
import { Spacing } from "../../theme";

export default function Home() {
  return (
    <Screen>
      <Typography variant="title">
        Bom dia ☀️
      </Typography>

      <Typography variant="small">
        Sexta-feira, 10 de julho
      </Typography>

      <View style={{ height: Spacing.lg }} />

      <Card>
        <Typography variant="h2">
          📅 Hoje
        </Typography>

        <View style={{ height: 10 }} />

        <Typography>
          Você ainda não possui atendimentos cadastrados.
        </Typography>
      </Card>

      <Card>
        <Typography variant="h2">
          💰 Receita Prevista
        </Typography>

        <View style={{ height: 10 }} />

        <Typography variant="title">
          R$ 0,00
        </Typography>
      </Card>

      <Card>
        <Typography variant="h2">
          💬 Nexa
        </Typography>

        <View style={{ height: 10 }} />

        <Typography>
          Bem-vinda!
        </Typography>

        <Typography>
          Vamos organizar seu dia?
        </Typography>
      </Card>
    </Screen>
  );
}