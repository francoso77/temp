import { useState } from "react";
import { Alert, View } from "react-native";

import {
  Button,

  Input,

  Screen,

  Typography
} from "../../components";

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

    <Screen>

      <Typography variant="title">

        Nova Cliente

      </Typography>

      <View style={{ height: Spacing.lg }} />

      <Input

        placeholder="Nome"

        value={name}

        onChangeText={setName}

      />

      <View style={{ height: Spacing.md }} />

      <Input

        placeholder="WhatsApp"

        value={phone}

        onChangeText={setPhone}

      />

      <View style={{ height: Spacing.md }} />

      <Input

        placeholder="Observações"

        value={notes}

        onChangeText={setNotes}

        multiline

      />

      <View style={{ height: Spacing.xl }} />

      <Button

        title="Salvar Cliente"

        onPress={handleSave}

      />

    </Screen>

  );

}