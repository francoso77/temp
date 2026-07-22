import {
  NexaAppBar,
  NexaButton,
  NexaScreen,
  NexaSpacer,
} from "@/components";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ServiceFilter } from '../components/ServiceFilter';
import { ServiceList } from '../components/ServiceList';
import { ServiceSearch } from '../components/ServiceSearch';
import { useServices } from "../hooks/useServices";
import {
  ServiceFilter as Filter,
  ServiceOrder,
} from "../types";
import {
  serviceFilter,
  serviceSearch,
  serviceSort,
} from "../utils";




export function ServicesScreen() {

  const { services } = useServices();

  const [search, setSearch] = useState("");

  const [filter, setFilter] =
    useState<Filter>("all");

  const [order] =
    useState<ServiceOrder>("name");

  const data = useMemo(() => {

    return serviceSort(

      serviceFilter(

        serviceSearch(

          services,

          search

        ),

        filter

      ),

      order

    );

  }, [

    services,

    search,

    filter,

    order,

  ]);

  return (

    <NexaScreen>

      <NexaAppBar

        title="Atendimentos"

      />

      <NexaSpacer />

      <ServiceSearch

        value={search}

        onChange={setSearch}

      />

      <NexaSpacer />

      <ServiceFilter

        value={filter}

        onChange={setFilter}

      />

      <NexaSpacer />

      <ServiceList

        services={data}

      />

      <NexaSpacer />

      <NexaButton

        title="Novo Atendimento"

        onPress={() =>

          router.push("/services/new")

        }

      />

    </NexaScreen>

  );

}