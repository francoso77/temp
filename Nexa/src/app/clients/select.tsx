import { router } from "expo-router";

import {
  EmptyState,
  NexaButton,
  NexaScreen,
  NexaText,
} from "../../components";


export default function SelectClientScreen() {
  return (
    <NexaScreen>
      <NexaText variant="title">
        Selecionar Cliente
      </NexaText>

      <EmptyState
        emoji="👤"
        title="Nenhum cliente cadastrado"
        description="Cadastre seu primeiro cliente para começar."
      />

      <NexaButton
        title="Cadastrar Cliente"
        onPress={() => router.push("/clients/new")}
      />
    </NexaScreen>
  );
}