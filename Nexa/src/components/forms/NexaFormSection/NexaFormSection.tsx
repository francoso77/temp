import { ReactNode } from "react";

import { NexaSection } from "../../layout/NexaSection";

type Props = {
  title: string;
  children: ReactNode;
};

export function NexaFormSection({
  title,
  children,
}: Props) {
  return (
    <NexaSection title={title}>
      {children}
    </NexaSection>
  );
}