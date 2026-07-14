import { NexaInput } from '@/components/base';
import { phoneMask } from '@/utils/masks/phone';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
};

export function NexaPhoneInput(props: Props) {
  return (
    <NexaInput
      {...props}
      mask={phoneMask}
      keyboardType="phone-pad"
    />
  );
}