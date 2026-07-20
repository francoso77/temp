import { Pressable } from "react-native";

import {
  NexaBadge,
  NexaCard,
  NexaSpacer,
  NexaText,
} from "@/components";

import { Specialty } from "../models/Specialty";

type Props = {
  specialty: Specialty;
  onPress?: () => void;
};

export function SpecialtyCard({
  specialty,
  onPress,
}: Props) {

  return (

    <Pressable onPress={onPress}>

      <NexaCard>

        <NexaText variant="h2">
          {specialty.name}
        </NexaText>

        <NexaSpacer size="sm" />

        <NexaBadge
          text={
            specialty.active
              ? "Ativa"
              : "Inativa"
          }
          color={
            specialty.active
              ? "#22C55E"
              : "#9CA3AF"
          }
        />

      </NexaCard>

    </Pressable>

  );

}