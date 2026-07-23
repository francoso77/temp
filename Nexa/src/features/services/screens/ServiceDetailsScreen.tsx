import {
  useLocalSearchParams
} from "expo-router";

import {
  useState,
} from "react";

import {
  NexaActionCard,
  NexaAppBar,
  NexaConfirmDialog,
  NexaDetailsSection,
  NexaScreen,
  NexaSpacer,
  NexaStatusBadge,
} from "@/components";

import {
  formatCurrency,
  formatDuration,
} from "@/utils";

import {
  useServiceDetails,
} from "../hooks";

export function ServiceDetailsScreen() {

  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const {
    service,
    edit,
    duplicate,
    toggle,
    remove,
  } = useServiceDetails(
    String(id)
  );

  const [
    confirmVisible,
    setConfirmVisible,
  ] = useState(false);

  if (!service) {

    return (
      <NexaScreen>

        <NexaAppBar
          title="Atendimento"
        />

      </NexaScreen>
    );

  }

  return (

    <NexaScreen>

      <NexaAppBar
        title="Atendimento"
      />

      <NexaSpacer />

      <NexaActionCard
        title={service.name}
        subtitle={service.specialtyName}
      >

        <NexaDetailsSection
          items={[
            {
              label: "Especialidade",
              value: service.specialtyName,
            },
            {
              label: "Valor",
              value: formatCurrency(service.price),
            },
            {
              label: "Duração",
              value: formatDuration(service.durationMinutes),
            },
            {
              label:
                "Agendamento online",
              value:
                service.onlineBooking
                  ? "Sim"
                  : "Não",
            },
            {
              label:
                "Antecedência",
              value:
                `${service.minimumAdvanceHours}h`,
            },
          ]}
        />

        <NexaSpacer />

        <NexaStatusBadge
          active={
            service.active
          }
        />

      </NexaActionCard>

      <NexaSpacer />

      <NexaActionCard
        title="Ações"
        actions={[
          {
            title: "Editar",
            onPress: edit,
          },
          {
            title: "Duplicar",
            onPress: duplicate,
          },
          {
            title:
              service.active
                ? "Desativar"
                : "Ativar",
            onPress: toggle,
          },
          {
            title: "Excluir",
            variant: "danger",
            onPress: () =>
              setConfirmVisible(
                true
              ),
          },
        ]}
      />

      <NexaConfirmDialog

        visible={
          confirmVisible
        }

        title="Excluir"

        message={
          "Deseja excluir este atendimento?"
        }

        confirmText="Excluir"

        onConfirm={() => {

          setConfirmVisible(
            false
          );

          remove();

        }}

        onCancel={() =>
          setConfirmVisible(
            false
          )
        }

      />

    </NexaScreen>

  );

}