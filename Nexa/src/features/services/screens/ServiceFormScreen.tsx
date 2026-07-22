import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import {
  NexaAppBar,
  NexaAutocomplete,
  NexaFormActions,
  NexaFormSection,
  NexaInput,
  NexaMoneyInput,
  NexaScreen,
  NexaSpacer,
  NexaSwitch,
  NexaTextArea,
} from "@/components";

import { useSpecialties } from "@/features/specialties/hooks/useSpecialties";

import { useServices } from "../hooks/useServices";

import {
  createEmptyServiceForm,
} from "../utils";

import {
  ServiceFormData,
} from "../types";

export function ServiceFormScreen() {

  const { addService } =
    useServices();

  const { specialties } =
    useSpecialties();

  const [form, setForm] =
    useState<ServiceFormData>(
      createEmptyServiceForm()
    );

  function updateField(
    field: keyof ServiceFormData,
    value: string | boolean
  ) {

    setForm(old => ({
      ...old,
      [field]: value,
    }));

  }

  function handleSave() {

    if (!form.specialtyId) {

      Alert.alert(
        "Especialidade",
        "Selecione uma especialidade."
      );

      return;

    }

    if (!form.name.trim()) {

      Alert.alert(
        "Atenção",
        "Informe o nome do atendimento."
      );

      return;

    }

    const specialty =
      specialties.find(
        item =>
          item.id === form.specialtyId
      );

    addService({

      specialtyId:
        form.specialtyId,

      specialtyName:
        specialty?.name ?? "",

      name:
        form.name,

      description:
        form.description,

      price: Number(
        form.price
          .replace("R$", "")
          .replace(/\./g, "")
          .replace(",", ".")
          .trim()
      ),

      durationMinutes: Number(
        form.durationMinutes
      ),

      active:
        form.active,

      onlineBooking:
        form.onlineBooking,

      minimumAdvanceHours:
        Number(
          form.minimumAdvanceHours
        ),

      createdAt:
        new Date(),

      updatedAt:
        new Date(),

    });

    router.back();

  }

  return (

    <NexaScreen>

      <NexaAppBar
        title="Novo Atendimento"
      />

      <NexaSpacer size="lg" />

      <NexaFormSection
        title="Informações"
      >

        <NexaAutocomplete
          label="Especialidade"
          items={specialties}
          value={form.specialtyId}
          labelKey="name"
          valueKey="id"
          onChange={(value) =>
            updateField(
              "specialtyId",
              value
            )
          }
        />

        <NexaSpacer />

        <NexaInput
          label="Nome do atendimento"
          value={form.name}
          onChangeText={(value) =>
            updateField(
              "name",
              value
            )
          }
          placeholder="Ex.: Blindagem em Gel"
        />

        <NexaSpacer />

        <NexaMoneyInput
          label="Valor"
          value={form.price}
          onChangeText={(value) =>
            updateField(
              "price",
              value
            )
          }
        />

        <NexaSpacer />

        <NexaInput
          label="Duração (minutos)"
          value={
            form.durationMinutes
          }
          onChangeText={(value) =>
            updateField(
              "durationMinutes",
              value
            )
          }
          keyboardType="numeric"
          placeholder="60"
        />

        <NexaSpacer />

        <NexaTextArea
          label="Descrição"
          value={
            form.description
          }
          onChangeText={(value) =>
            updateField(
              "description",
              value
            )
          }
          placeholder="Descreva este atendimento..."
        />

      </NexaFormSection>

      <NexaSpacer size="lg" />

      <NexaFormSection
        title="Configurações"
      >

        <NexaSwitch
          label="Atendimento ativo"
          value={form.active}
          onValueChange={(value) =>
            updateField(
              "active",
              value
            )
          }
        />

        <NexaSpacer />

        <NexaSwitch
          label="Disponível para agendamento online"
          value={
            form.onlineBooking
          }
          onValueChange={(value) =>
            updateField(
              "onlineBooking",
              value
            )
          }
        />

        <NexaSpacer />

        <NexaInput
          label="Antecedência mínima (horas)"
          value={
            form.minimumAdvanceHours
          }
          onChangeText={(value) =>
            updateField(
              "minimumAdvanceHours",
              value
            )
          }
          keyboardType="numeric"
        />

      </NexaFormSection>

      <NexaSpacer size="xl" />

      <NexaFormActions
        saveText="Salvar"
        onSave={handleSave}
        onCancel={() =>
          router.back()
        }
      />

    </NexaScreen>

  );

}