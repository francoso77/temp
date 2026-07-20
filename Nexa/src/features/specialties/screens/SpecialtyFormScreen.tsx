import { router } from "expo-router";
import { useState } from "react";

import {
  NexaButton,
  NexaFormSection,
  NexaInput,
  NexaScreen,
  NexaSpacer,
  NexaSwitch,
  NexaText,
} from "@/components";

import { useSpecialties } from "../hooks/useSpecialties";

export function SpecialtyFormScreen() {

  const {

    addSpecialty,

  } = useSpecialties();

  const [

    name,

    setName,

  ] = useState("");

  const [

    active,

    setActive,

  ] = useState(true);

  function handleSave() {

    addSpecialty({

      name,

      active,

    });

    router.back();

  }

  return (

    <NexaScreen>

      <NexaText variant="title">

        Nova Especialidade

      </NexaText>

      <NexaSpacer size="lg" />

      <NexaFormSection
        title="Informações"
      >

        <NexaInput

          label="Nome"

          value={name}

          onChangeText={setName}

        />

        <NexaSpacer />

        <NexaSwitch

          label="Especialidade ativa"

          value={active}

          onValueChange={setActive}

        />

      </NexaFormSection>

      <NexaSpacer size="xl" />

      <NexaButton

        title="Salvar"

        onPress={handleSave}

      />

    </NexaScreen>

  );

}