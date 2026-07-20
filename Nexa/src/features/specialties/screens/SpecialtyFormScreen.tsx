import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

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
  const { id } = useLocalSearchParams<{ id?: string }>();

  const {
    specialties,
    addSpecialty,
    updateSpecialty,
  } = useSpecialties();

  const editing = !!id;

  const [name, setName] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!editing) return;

    const specialty = specialties.find(
      item => item.id === id
    );

    if (!specialty) return;

    setName(specialty.name);
    setActive(specialty.active);

  }, [editing, id, specialties]);

  function handleSave() {

    if (!name.trim()) {

      Alert.alert(
        "Atenção",
        "Informe o nome da especialidade."
      );

      return;

    }

    if (editing) {

      updateSpecialty({

        id: String(id),

        name,

        active,

      });

    } else {

      addSpecialty({

        name,

        active,

      });

    }

    router.back();

  }

  return (

    <NexaScreen>

      <NexaText variant="title">

        {editing
          ? "Editar Especialidade"
          : "Nova Especialidade"}

      </NexaText>

      <NexaSpacer size="lg" />

      <NexaFormSection
        title="Informações"
      >

        <NexaInput
          label="Nome"
          value={name}
          onChangeText={setName}
          placeholder="Ex.: Unhas"
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
        title={
          editing
            ? "Salvar alterações"
            : "Cadastrar"
        }
        onPress={handleSave}
      />

    </NexaScreen>

  );

}