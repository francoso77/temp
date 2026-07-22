import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useEffect,
  useState,
} from "react";


import {
  NexaAppBar,
  NexaConfirmDialog,
  NexaFormActions,
  NexaFormSection,
  NexaInput,
  NexaScreen,
  NexaSpacer,
  NexaSwitch,
  NexaTextArea
} from "@/components";

import { useClients } from "../hooks/useClients";

export function ClientFormScreen() {

  const { id } = useLocalSearchParams();
  const {
    clients,
    addClient,
    updateClient,
  } = useClients();

  const editing = !!id;
  const current = clients.find(
    item => item.id === id
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {

    if (!current) return;
    setName(current.name);
    setPhone(current.phone);
    setEmail(current.email);
    setNotes(current.notes);
    setActive(current.active);
  }, []);

  function handleSave() {

    if (!name.trim()) {

      NexaConfirmDialog({
        message: "Informe o nome.",
        confirmText: "OK",
        onConfirm() { }
      });

      return;
    }

    const payload = {
      name,
      phone,
      email,
      notes,
      active,
      createdAt: current?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };

    if (editing) {

      updateClient({
        id: String(id),
        ...payload,
      });

    } else {
      addClient(payload);
    }

    router.back();
  }

  return (

    <NexaScreen>

      <NexaAppBar
        title={
          editing
            ? "Editar Cliente"
            : "Novo Cliente"
        }
      />

      <NexaSpacer size="lg" />

      <NexaFormSection title="Dados">

        <NexaInput
          label="Nome"
          value={name}
          onChangeText={setName}
        />

        <NexaSpacer />

        <NexaInput
          label="Telefone"
          value={phone}
          onChangeText={setPhone}
        />

        <NexaSpacer />

        <NexaInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
        />

        <NexaSpacer />

        <NexaTextArea
          label="Observações"
          value={notes}
          onChangeText={setNotes}
        />

        <NexaSpacer />

        <NexaSwitch
          label="Cliente ativo"
          value={active}
          onValueChange={setActive}
        />

      </NexaFormSection>

      <NexaSpacer size="xl" />

      <NexaFormActions
        onSave={handleSave}
        onCancel={() => router.back()}
      />

    </NexaScreen>
  );
}