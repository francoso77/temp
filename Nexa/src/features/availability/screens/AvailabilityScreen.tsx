import {
  NexaButton,
  NexaList,
  NexaScreen,
  NexaSpacer,
  NexaText,
} from "../../../components";

import { useSchedule } from "../hooks/useSchedule";

import { AvailabilityCard } from "../components/AvailabilityCard";
import { Availability } from "../models/Availability";

export function AvailabilityScreen() {

  const {
    availability,
    setAvailability,
  } = useSchedule();

  function handleChange(
    updated: Availability
  ) {

    setAvailability(old =>
      old.map(item =>
        item.id === updated.id
          ? updated
          : item
      )
    );

  }

  return (

    <NexaScreen>

      <NexaText variant="title">
        Disponibilidade
      </NexaText>

      <NexaSpacer size="lg" />

      <NexaList
        data={availability}
        keyExtractor={(item) => item.id}
        renderItem={(item) => (

          <AvailabilityCard
            availability={item}
            onChange={handleChange}
          />

        )}
      />

      <NexaSpacer />

      <NexaButton
        title="Salvar"
        onPress={() => { }}
      />

    </NexaScreen>

  );

}