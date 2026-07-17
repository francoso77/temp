import { router } from "expo-router";

import { useServices } from "../hooks/useServices";

import {
  NexaButton,
  NexaList,
  NexaScreen,
  NexaSpacer,
  NexaText,
} from "../../../components";

import { ServiceCard } from "../components/ServiceCard";

export function ServicesScreen() {

  const { services } = useServices();

  return (
    <NexaScreen>

      <NexaText variant="title">
        Meus Atendimentos
      </NexaText>

      <NexaSpacer size="lg" />

      <NexaList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={(item) => (
          <ServiceCard service={item} />
        )}
        emptyTitle="Nenhum atendimento cadastrado"
        emptyMessage="Cadastre seu primeiro atendimento."
      />

      <NexaSpacer size="md" />

      <NexaButton
        title="Novo Atendimento"
        onPress={() => router.push("/services/new")}
      />

    </NexaScreen>
  );
}