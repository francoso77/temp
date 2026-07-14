import { InfoCard, NexaScreen, NexaSpacer, NexaText } from "../../components";

export default function Home() {
  return (
    <NexaScreen>
      <NexaText variant="title">
        Bom dia ☀️
      </NexaText>

      <NexaText variant="small">
        Sexta-feira, 10 de julho
      </NexaText>

      <NexaSpacer size="lg" />

      <InfoCard
        icon="📅"
        title="Hoje"
      >
        <NexaText>
          Você ainda não possui atendimentos cadastrados.
        </NexaText>
      </InfoCard>

      <InfoCard
        icon="💰"
        title="Receita Prevista"
      >
        <NexaText variant="title">
          R$ 0,00
        </NexaText>
      </InfoCard>

      <InfoCard
        icon="💬"
        title="Nexa"
      >
        <NexaText>
          Bem-vindo ao Nexa!
        </NexaText>

        <NexaText>
          Vamos organizar seu dia?
        </NexaText>
      </InfoCard>
    </NexaScreen>
  );
}