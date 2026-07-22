import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  NexaAppBar,
  NexaConfirmDialog,
  NexaFormActions,
  NexaFormSection,
  NexaInput,
  NexaScreen,
  NexaSpacer,
  NexaSwitch
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

      NexaConfirmDialog({
        title: "Atenção",
        message: "Informe o nome da especialidade.",
        confirmText: "OK",
        onConfirm() { }
      });

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

      <NexaAppBar

        title={
          editing
            ? "Editar Especialidade"
            : "Nova Especialidade"
        }

      />

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

      <NexaFormActions
        saveText={
          editing
            ? "Salvar alterações"
            : "Cadastrar"
        }
        onSave={handleSave}
        onCancel={() => router.back()}
      />

    </NexaScreen>

  );

}