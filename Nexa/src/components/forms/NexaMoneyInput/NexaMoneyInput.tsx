import { NexaInput } from '@/components/base';
import { moneyMask } from '@/utils/masks/money';


type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
};

export function NexaMoneyInput(props: Props) {
  return (
    <NexaInput
      {...props}
      mask={moneyMask}
      keyboardType="numeric"
    />
  );
}