import { View } from "react-native";
import { InfoCard, Screen, Typography } from "../../components";
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

      <InfoCard
        icon="📅"
        title="Hoje"
      >
        <Typography>
          Você ainda não possui atendimentos cadastrados.
        </Typography>
      </InfoCard>

      <InfoCard
        icon="💰"
        title="Receita Prevista"
      >
        <Typography variant="title">
          R$ 0,00
        </Typography>
      </InfoCard>

      <InfoCard
        icon="💬"
        title="Nexa"
      >
        <Typography>
          Bem-vinda!
        </Typography>

        <Typography>
          Vamos organizar seu dia?
        </Typography>
      </InfoCard>
    </Screen>
  );
}