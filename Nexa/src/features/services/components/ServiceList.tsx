import { FlatList } from "react-native";

import { Service } from "../models/Service";

import { ServiceCard } from "./ServiceCard";

type Props = {

  services: Service[];

};

export function ServiceList({

  services,

}: Props) {

  return (

    <FlatList

      data={services}

      keyExtractor={item => item.id}

      renderItem={({ item }) => (

        <ServiceCard

          service={item}

        />

      )}

    />

  );

}