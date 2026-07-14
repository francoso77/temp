import { NexaText } from "../NexaText";

type Props = {
  name:
  | "calendar"
  | "client"
  | "money"
  | "service"
  | "home"
  | "chat";
};

const icons = {
  calendar: "📅",
  client: "👤",
  money: "💰",
  service: "💅",
  home: "🏠",
  chat: "💬",
};

export function NexaIcon({
  name,
}: Props) {
  return (
    <NexaText>
      {icons[name]}
    </NexaText>
  );
}