import { router } from "expo-router";

import {
  NexaButton,
  NexaList,
  NexaPageHeader,
  NexaScreen,
} from "@/components";

import { SpecialtyCard } from "../components/SpecialtyCard";

import { useSpecialties } from "../hooks/useSpecialties";

export function SpecialtiesScreen() {

  const {

    specialties,

  } = useSpecialties();

  return (

    <NexaScreen>

      <NexaPageHeader

        title="Especialidades"

      />

      <NexaList

        data={specialties}

        keyExtractor={

          item => item.id

        }

        renderItem={item =>

          <SpecialtyCard

            specialty={item}

          />

        }

      />

      <NexaButton

        title="Nova Especialidade"

        onPress={() =>

          router.push("/specialties/new")

        }

      />

    </NexaScreen>

  );

}