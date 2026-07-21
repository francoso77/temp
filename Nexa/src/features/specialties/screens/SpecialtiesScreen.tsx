import { router } from "expo-router";
import { useMemo, useState } from "react";

import {
  NexaCrudHeader,
  NexaCrudList,
  NexaScreen
} from "@/components";

import { SpecialtyCard } from '../components';
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

      <NexaCrudHeader

        title="Especialidades"

        subtitle="Organize os tipos de atendimento"

        search={search}

        onSearch={setSearch}

        newButtonTitle="Nova Especialidade"

        onNew={() =>

          router.push("/specialties/new")

        }

      />

      <NexaCrudList

        data={filtered}

        keyExtractor={(item) => item.id}

        renderItem={(item) => (

          <SpecialtyCard

            specialty={item}

            onPress={() => router.push(`/specialties/${item.id}`)}

          />

        )}

        emptyTitle="Nenhuma especialidade"

        emptyDescription="Cadastre sua primeira especialidade."

      />

    </NexaScreen>
  );
}