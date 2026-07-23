import {
  NexaBadge,
} from "@/components";

type Props = {
  active: boolean;
};

export function NexaStatusBadge({
  active,
}: Props) {

  return (

    <NexaBadge

      text={
        active
          ? "Ativo"
          : "Inativo"
      }

      variant={
        active
          ? "success"
          : "default"
      }

    />

  );

}