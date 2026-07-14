import { useState } from "react";
import { Alert } from "react-native";

import {
  NexaButton,
  NexaInput,
  NexaScreen,
  NexaSpacer,
  NexaText
} from "../../components";

import { phoneMask } from '@/utils/masks/phone';

export default function NewClientScreen() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  function handleSave() {
    Alert.alert(
      "Cadastro",
      "Cliente salvo (temporariamente)."
    );
  }

  return (

    <NexaScreen>
      <NexaText variant="title">
        Novo Cliente
      </NexaText>

      <NexaSpacer size="lg" />

      <NexaInput
        label="Nome"
        required
        value={name}
        onChangeText={setName}
      />

      <NexaSpacer size="md" />

      <NexaInput
        label="WhatsApp"
        required
        keyboardType="phone-pad"
        value={phone}
        mask={phoneMask}
        onChangeText={setPhone}
      />

      <NexaSpacer size="md" />

      <NexaInput
        label="Observações"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <NexaSpacer size="xl" />

      <NexaText variant="small">
        Campos com * são obrigatórios.
      </NexaText>

      <NexaSpacer size="xl" />

      <NexaButton
        title="Salvar Cliente"
        onPress={handleSave}
      />

    </NexaScreen>
  );
}