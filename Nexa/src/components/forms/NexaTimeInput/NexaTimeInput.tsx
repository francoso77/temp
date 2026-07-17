import { NexaInput } from "@/components/base";
import { timeMask } from "@/utils/masks/time";

type Props = {

  label: string;

  value: string;

  onChangeText: (text: string) => void;

  placeholder?: string;

};

export function NexaTimeInput({

  label,

  value,

  onChangeText,

  placeholder = "08:00",

}: Props) {

  return (

    <NexaInput

      label={label}

      value={value}

      onChangeText={onChangeText}

      keyboardType="numeric"

      mask={timeMask}

      placeholder={placeholder}

      maxLength={5}

    />

  );

}