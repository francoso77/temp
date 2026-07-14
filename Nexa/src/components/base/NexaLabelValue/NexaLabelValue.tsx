import { NexaSpacer, NexaText } from '@/components/base';
import { View } from "react-native";


type Props = {
  label: string;
  value: string;
};

export function NexaLabelValue({
  label,
  value,
}: Props) {
  return (
    <View>
      <NexaText variant="small">
        {label}
      </NexaText>

      <NexaSpacer size="xs" />

      <NexaText>
        {value}
      </NexaText>
    </View>
  );
}