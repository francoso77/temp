import { ReactNode } from "react";

import {
  NexaButton,
  NexaPageHeader,
  NexaSearchBar,
  NexaSpacer,
} from "@/components";

type Props = {

  title: string;

  subtitle?: string;

  search?: string;

  onSearch?: (text: string) => void;

  newButtonTitle?: string;

  onNew?: () => void;

  children?: ReactNode;

};

export function NexaCrudHeader({

  title,

  subtitle,

  search,

  onSearch,

  newButtonTitle,

  onNew,

  children,

}: Props) {

  return (

    <>

      <NexaPageHeader

        title={title}

        subtitle={subtitle}

      />

      {!!onSearch && (

        <>

          <NexaSearchBar

            value={search ?? ""}

            onChangeText={onSearch}

          />

          <NexaSpacer />

        </>

      )}

      {!!onNew && (

        <>

          <NexaButton

            title={newButtonTitle ?? "Novo"}

            onPress={onNew}

          />

          <NexaSpacer />

        </>

      )}

      {children}

    </>

  );

}