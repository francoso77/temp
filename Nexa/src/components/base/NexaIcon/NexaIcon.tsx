import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors } from "@/theme";

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
};

export function NexaIcon({
  name,
  size = 22,
  color = Colors.text,
}: Props) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
    />
  );
}