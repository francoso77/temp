import { useState } from "react";
import { Alert, View } from "react-native";

import {
  NexaButton,
  NexaInput,
  NexaScreen,
  NexaText
} from "../../components";

import { phoneMask } from '@/utils/masks/phone';
import { Spacing } from "../../theme";

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

      <View style={{ height: Spacing.lg }} />

      <NexaInput
        label="Nome"
        required
        value={name}
        onChangeText={setName}
      />

      <View style={{ height: Spacing.md }} />

      <NexaInput
        label="WhatsApp"
        required
        keyboardType="phone-pad"
        value={phone}
        mask={phoneMask}
        onChangeText={setPhone}
      />

      <View style={{ height: Spacing.md }} />

      <NexaInput
        label="Observações"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <View style={{ height: Spacing.xl }} />

      <NexaText variant="small">
        Campos com * são obrigatórios.
      </NexaText>

      <View style={{ height: Spacing.xl }} />

      <NexaButton
        title="Salvar Cliente"
        onPress={handleSave}
      />

    </NexaScreen>
  );
}