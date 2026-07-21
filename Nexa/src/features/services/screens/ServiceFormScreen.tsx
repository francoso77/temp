import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";

import {
  NexaAppBar,
  NexaAutocomplete,
  NexaButton,
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

export function ServiceFormScreen() {

  const { addService } = useServices();

  const { specialties } = useSpecialties();

  const [specialtyId, setSpecialtyId] = useState("");

  const [name, setName] = useState("");

  const [price, setPrice] = useState("");

  const [duration, setDuration] = useState("");

  const [description, setDescription] = useState("");

  const [active, setActive] = useState(true);

  const [onlineBooking, setOnlineBooking] =
    useState(true);

  const [
    advanceBookingHours,
    setAdvanceBookingHours,
  ] = useState("24");

  const selectedSpecialty = useMemo(() => {

    return specialties.find(

      item => item.id === specialtyId

    );

  }, [

    specialties,

    specialtyId,

  ]);

  function handleSave() {

    if (!specialtyId) {

      Alert.alert(

        "Especialidade",

        "Selecione uma especialidade."

      );

      return;

    }

    if (!name.trim()) {

      Alert.alert(

        "Atenção",

        "Informe o nome do atendimento."

      );

      return;

    }

    addService({

      specialtyId,

      specialtyName:
        selectedSpecialty?.name ?? "",

      name,

      description,

      price: Number(

        price

          .replace("R$", "")

          .replace(/\./g, "")

          .replace(",", ".")

          .trim()

      ),

      durationMinutes: Number(duration),

      active,

      onlineBooking,

      minimumAdvanceHours: Number(
        advanceBookingHours
      ),

      createdAt: new Date(),

      updatedAt: new Date(),

    });

    router.back();

  }

  return (

    <NexaScreen>

      <NexaAppBar
        title="Novo Atendimento"
      />

      <NexaFormSection title="Informações">

        <NexaAutocomplete

          label="Especialidade"

          items={specialties}

          value={specialtyId}

          labelKey="name"

          valueKey="id"

          onChange={setSpecialtyId}

        />

        <NexaSpacer />

        <NexaInput

          label="Nome do atendimento"

          value={name}

          onChangeText={setName}

          placeholder="Ex.: Blindagem em Gel"

        />

        <NexaSpacer />

        <NexaMoneyInput

          label="Valor"

          value={price}

          onChangeText={setPrice}

        />

        <NexaSpacer />

        <NexaInput

          label="Duração (minutos)"

          value={duration}

          onChangeText={setDuration}

          keyboardType="numeric"

          placeholder="60"

        />

        <NexaSpacer />

        <NexaTextArea

          label="Descrição"

          value={description}

          onChangeText={setDescription}

          placeholder="Descreva este atendimento..."

        />

      </NexaFormSection>

      <NexaSpacer size="lg" />

      <NexaFormSection title="Configurações">

        <NexaSwitch

          label="Atendimento ativo"

          value={active}

          onValueChange={setActive}

        />

        <NexaSpacer />

        <NexaSwitch

          label="Disponível para agendamento online"

          value={onlineBooking}

          onValueChange={setOnlineBooking}

        />

        <NexaSpacer />

        <NexaInput

          label="Antecedência mínima (horas)"

          value={advanceBookingHours}

          onChangeText={setAdvanceBookingHours}

          keyboardType="numeric"

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