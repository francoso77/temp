import { NexaInput } from "@/components";

type Props = {

  value: string;

  onChange: (value: string) => void;

};

export function ServiceSearch({

  value,

  onChange,

}: Props) {

  return (

    <NexaInput

      label="Pesquisar"

      placeholder="Nome do atendimento..."

      value={value}

      onChangeText={onChange}

    />

  );

}