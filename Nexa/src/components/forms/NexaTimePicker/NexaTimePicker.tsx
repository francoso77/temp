import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform } from "react-native";

import { NexaInput } from "@/components/base";

type Props = {

  label: string;

  value: string;

  onChange: (value: string) => void;

};

export function NexaTimePicker({

  label,

  value,

  onChange,

}: Props) {

  const [show, setShow] = useState(false);

  function parseTime() {

    const [hour, minute] = value
      ? value.split(":").map(Number)
      : [8, 0];

    const date = new Date();

    date.setHours(hour);

    date.setMinutes(minute);

    return date;

  }

  function handleChange(
    _: any,
    selected?: Date
  ) {

    setShow(false);

    if (!selected) return;

    const h = String(
      selected.getHours()
    ).padStart(2, "0");

    const m = String(
      selected.getMinutes()
    ).padStart(2, "0");

    onChange(`${h}:${m}`);

  }

  return (

    <>

      <NexaInput

        label={label}

        value={value}

        pressable

        onPress={() => setShow(true)}

        rightComponent={<></>}

      />

      {show && (

        <DateTimePicker

          mode="time"

          value={parseTime()}

          is24Hour

          display={
            Platform.OS === "ios"
              ? "spinner"
              : "default"
          }

          onChange={handleChange}

        />

      )}

    </>

  );

}