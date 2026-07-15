import { NexaInfoCard, NexaScreen, NexaSpacer, NexaText } from "../../components";

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

      <NexaInfoCard
        icon="📅"
        title="Hoje"
      >
        <NexaText>
          Você ainda não possui atendimentos cadastrados.
        </NexaText>
      </NexaInfoCard>

      <NexaInfoCard
        icon="💰"
        title="Receita Prevista"
      >
        <NexaText variant="title">
          R$ 0,00
        </NexaText>
      </NexaInfoCard>

      <NexaInfoCard
        icon="💬"
        title="Nexa"
      >
        <NexaText>
          Bem-vindo ao Nexa!
        </NexaText>

        <NexaText>
          Vamos organizar seu dia?
        </NexaText>
      </NexaInfoCard>
    </NexaScreen>
  );
}