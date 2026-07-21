import {
  createContext,
  ReactNode,
  useState,
} from "react";

import { mockClients } from "../data/mockClients";
import { Client } from "../models/Client";

type ClientsContextData = {

  clients: Client[];

  addClient: (
    client: Omit<Client, "id">
  ) => void;

  updateClient: (
    client: Client
  ) => void;

  removeClient: (
    id: string
  ) => void;

};

export const ClientsContext =
  createContext({} as ClientsContextData);

type Props = {
  children: ReactNode;
};

export function ClientsProvider({
  children,
}: Props) {

  const [clients, setClients] =
    useState(mockClients);

  function addClient(
    client: Omit<Client, "id">
  ) {

    setClients(old => [

      ...old,

      {

        id: Date.now().toString(),

        ...client,

      },

    ]);

  }

  function updateClient(
    client: Client
  ) {

    setClients(old =>
      old.map(item =>
        item.id === client.id
          ? client
          : item
      )
    );

  }

  function removeClient(
    id: string
  ) {

    setClients(old =>
      old.filter(item =>
        item.id !== id
      )
    );

  }

  return (

    <ClientsContext.Provider

      value={{

        clients,

        addClient,

        updateClient,

        removeClient,

      }}

    >

      {children}

    </ClientsContext.Provider>

  );

}