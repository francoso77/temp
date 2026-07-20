import {
  NexaButton,

  NexaList,

  NexaScreen,

  NexaSpacer,

  NexaText,
} from "../../../components";

import { AppointmentCard } from "../components/AppointmentCard";

import { useAppointments } from "../hooks/useAppointments";

export function AppointmentsScreen() {

  const {

    appointments,

  } = useAppointments();

  return (

    <NexaScreen>

      <NexaText variant="title">

        Agenda

      </NexaText>

      <NexaSpacer size="lg" />

      <NexaList

        data={appointments}

        keyExtractor={(item) => item.id}

        renderItem={(item) => (

          <AppointmentCard
            appointment={item}
          />

        )}

      />

      <NexaSpacer />

      <NexaButton

        title="Novo Agendamento"

        onPress={() => { }}

      />

    </NexaScreen>

  );

}