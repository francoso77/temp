import {
  NexaCard,
  NexaInput,
  NexaSpacer,
  NexaSwitch,
  NexaText,
  NexaTimePicker,
} from "../../../components";

import { Availability } from "../models/Availability";

type Props = {
  availability: Availability;

  onChange: (
    availability: Availability
  ) => void;
};

export function AvailabilityCard({
  availability,
  onChange,
}: Props) {

  function update(
    field: keyof Availability,
    value: string | number | boolean
  ) {

    onChange({
      ...availability,
      [field]: value,
    });

  }

  return (

    <NexaCard>

      <NexaText variant="h2">
        {availability.label}
      </NexaText>

      <NexaSpacer />

      <NexaSwitch
        label="Trabalha neste dia"
        value={availability.enabled}
        onValueChange={(value) =>
          update("enabled", value)
        }
      />

      <NexaSpacer />

      <NexaTimePicker
        label="Início"
        value={availability.startTime}
        onChange={(value) =>
          update("startTime", value)
        }
      />

      <NexaSpacer />

      <NexaTimePicker
        label="Fim"
        value={availability.endTime}
        onChange={(value) =>
          update("endTime", value)
        }
      />

      <NexaSpacer />

      <NexaTimePicker
        label="Início do almoço"
        value={availability.lunchStart}
        onChange={(value) =>
          update("lunchStart", value)
        }
      />

      <NexaSpacer />

      <NexaTimePicker
        label="Fim do almoço"
        value={availability.lunchEnd}
        onChange={(value) =>
          update("lunchEnd", value)
        }
      />

      <NexaSpacer />

      <NexaInput
        label="Intervalo entre atendimentos (min)"
        keyboardType="numeric"
        value={String(availability.intervalMinutes)}
        onChangeText={(value) =>
          update(
            "intervalMinutes",
            Number(value.replace(/\D/g, "")) || 0
          )
        }
      />

    </NexaCard>

  );

}