import { router } from "expo-router";
import { useState } from "react";

import {
  NexaButton,
  NexaFormSection,
  NexaInput,
  NexaMoneyInput,
  NexaScreen,
  NexaSpacer,
  NexaSwitch,
  NexaText,
  NexaTextArea,
} from "../../../components";

export function ServiceFormScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const [active, setActive] = useState(true);

  const [onlineBooking, setOnlineBooking] = useState(true);
  const [advanceBookingHours, setAdvanceBookingHours] = useState("24");

  function handleSave() {

    console.log({
      name,
      price,
      duration,
      description,
      active,
      onlineBooking,
      advanceBookingHours,
    });

    router.back();

  }

  return (
    <NexaScreen>
      <NexaText variant="title">
        Novo Serviço
      </NexaText>

      <NexaSpacer size="lg" />

      <NexaFormSection title="Informações">

        <NexaInput
          label="Nome do serviço"
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
          placeholder="Descreva este serviço..."
        />

      </NexaFormSection>

      <NexaSpacer size="lg" />

      <NexaFormSection title="Configurações">

        <NexaSwitch
          label="Serviço ativo"
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
          placeholder="24"
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