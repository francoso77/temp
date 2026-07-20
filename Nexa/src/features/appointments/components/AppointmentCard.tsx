import {
  NexaBadge,

  NexaCard,

  NexaSpacer,

  NexaText,
} from "../../../components";

import { Appointment } from "../models/Appointment";

type Props = {

  appointment: Appointment;

};

export function AppointmentCard({

  appointment,

}: Props) {

  const badge = {

    scheduled: {
      text: "Agendado",
      color: "#2563EB",
    },

    confirmed: {
      text: "Confirmado",
      color: "#16A34A",
    },

    finished: {
      text: "Finalizado",
      color: "#7C3AED",
    },

    cancelled: {
      text: "Cancelado",
      color: "#DC2626",
    },

  }[appointment.status];

  return (

    <NexaCard>

      <NexaText variant="h2">

        {appointment.customerName}

      </NexaText>

      <NexaSpacer size="xs" />

      <NexaText>

        {appointment.serviceName}

      </NexaText>

      <NexaSpacer size="xs" />

      <NexaText>

        {appointment.startTime}
        {" - "}
        {appointment.endTime}

      </NexaText>

      <NexaSpacer size="sm" />

      <NexaBadge
        text={badge.text}
        color={badge.color}
      />

    </NexaCard>

  );

}