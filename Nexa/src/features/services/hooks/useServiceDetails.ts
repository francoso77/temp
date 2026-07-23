import { router } from "expo-router";

import {
  Alert,
} from "react-native";

import {
  NexaConfirmDialog,
} from "@/components";

import {
  useService,
} from "./useService";

export function useServiceDetails(
  id: string
) {

  const {

    service,

    removeService,

    duplicateService,

    toggleService,

  } = useService(id);

  function edit() {

    router.push(
      `/services/edit/${id}`
    );

  }

  function duplicate() {

    duplicateService(id);

    Alert.alert(
      "Sucesso",
      "Atendimento duplicado."
    );

  }

  function toggle() {

    toggleService(id);

  }

  function remove() {

    NexaConfirmDialog({

      title:
        "Excluir atendimento",

      message:
        "Deseja realmente excluir este atendimento?",

      destructive: true,

      confirmText:
        "Excluir",

      onConfirm() {

        removeService(id);

        router.back();

      },

    });

  }

  return {

    service,

    edit,

    duplicate,

    toggle,

    remove,

  };

}