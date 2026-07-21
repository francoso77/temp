import { router } from "expo-router";
import { useMemo, useState } from "react";

import {
  NexaButton,
  NexaEmptyState,
  NexaPageHeader,
  NexaScreen,
  NexaSearchBar,
} from "@/components";

import { FlatList } from 'react-native';
import { SpecialtyCard } from "../components/SpecialtyCard";
import { useSpecialties } from "../hooks/useSpecialties";

export function SpecialtiesScreen() {
  const { specialties } = useSpecialties();

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return specialties;
    }

    return specialties.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
  }, [search, specialties]);

  return (
    <NexaScreen>

      <NexaPageHeader
        title="Especialidades"
        subtitle="Organize os tipos de atendimento oferecidos."
      />

      <NexaSearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Pesquisar especialidade..."
      />

      <NexaButton
        title="Nova Especialidade"
        onPress={() => router.push("/specialties/new")}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SpecialtyCard
            specialty={item}
            onPress={() =>
              router.push(`/specialties/${item.id}`)
            }
          />
        )}
        ListEmptyComponent={
          <NexaEmptyState
            emoji="📂"
            title="Nenhuma especialidade encontrada"
            subtitle="Cadastre a primeira especialidade."
          />
        }
        showsVerticalScrollIndicator={false}
      />

    </NexaScreen>
  );
}