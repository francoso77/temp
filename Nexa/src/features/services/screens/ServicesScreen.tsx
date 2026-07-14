import { Alert, FlatList } from "react-native";

import { mockServices } from "../data/mockServices";

import {
  NexaButton,
  NexaScreen,
  NexaSpacer,
  NexaText,
} from "../../../components";

import { ServiceCard } from '../components/ServiceCard';

export function ServicesScreen() {
  return (
    <NexaScreen>

      <NexaText variant="title">
        Meus Serviços
      </NexaText>

      <NexaSpacer size="lg" />

      <FlatList
        data={mockServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ServiceCard service={item} />
        )}
        showsVerticalScrollIndicator={false}
      />

      <NexaSpacer size="md" />

      <NexaButton
        title="Novo Serviço"
        onPress={() => Alert.alert("Em desenvolvimento")}
      />

    </NexaScreen>
  );
}