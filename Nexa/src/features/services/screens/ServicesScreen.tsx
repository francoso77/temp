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
        Meus Serviços
      </NexaText>

      <NexaSpacer size="lg" />

      <NexaList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={(item) => (
          <ServiceCard service={item} />
        )}
        emptyTitle="Nenhum serviço cadastrado"
        emptyMessage="Cadastre seu primeiro serviço."
      />

      <NexaSpacer size="md" />

      <NexaButton
        title="Novo Serviço"
        onPress={() => router.push("/services/new")}
      />

    </NexaScreen>
  );
}