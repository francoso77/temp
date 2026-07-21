import { router } from "expo-router";
import { useMemo, useState } from "react";

import {
  NexaCrudHeader,
  NexaCrudList,
  NexaScreen,
} from "@/components";

import { ClientCard } from "../components/ClientCard";
import { useClients } from "../hooks/useClients";

export function ClientsScreen() {

  const { clients } = useClients();

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {

    const value = search.toLowerCase();

    return clients.filter(client =>

      client.name
        .toLowerCase()
        .includes(value)

    );

  }, [clients, search]);

  return (

    <NexaScreen>

      <NexaCrudHeader

        title="Clientes"

        subtitle="Gerencie sua carteira de clientes."

        search={search}

        onSearch={setSearch}

        newButtonTitle="Novo Cliente"

        onNew={() =>
          router.push("/clients/new")
        }

      />

      <NexaCrudList

        data={filtered}

        keyExtractor={item => item.id}

        renderItem={item => (

          <ClientCard

            client={item}

            onPress={() =>
              router.push(`/clients/${item.id}`)
            }

          />

        )}

        emptyTitle="Nenhum cliente"

        emptyDescription="Cadastre seu primeiro cliente."

      />

    </NexaScreen>

  );

}