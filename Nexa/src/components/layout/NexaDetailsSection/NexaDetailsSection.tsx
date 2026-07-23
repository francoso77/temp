import {
  Fragment,
} from "react";

import {
  NexaInfoRow,
  NexaSpacer,
} from "@/components";

type Item = {

  label: string;

  value: string;

};

type Props = {

  items: Item[];

};

export function NexaDetailsSection({

  items,

}: Props) {

  return (

    <>

      {

        items.map((item, index) => (

          <Fragment key={item.label}>

            <NexaInfoRow

              label={item.label}

              value={item.value}

            />

            {

              index < items.length - 1 &&

              <NexaSpacer size="xs" />

            }

          </Fragment>

        ))

      }

    </>

  );

}