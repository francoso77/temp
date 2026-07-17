import {
  createContext,
  ReactNode,
  useState,
} from "react";

import { mockServices } from "../data/mockServices";
import { Service } from "../models/Service";

type ServicesContextData = {
  services: Service[];

  addService: (service: Omit<Service, "id">) => void;

  updateService: (service: Service) => void;

  removeService: (id: string) => void;
};

export const ServicesContext =
  createContext({} as ServicesContextData);

type Props = {
  children: ReactNode;
};

export function ServicesProvider({
  children,
}: Props) {

  const [services, setServices] =
    useState<Service[]>(mockServices);

  function addService(
    service: Omit<Service, "id">
  ) {

    const newService: Service = {
      id: Date.now().toString(),
      ...service,
    };
    setServices((old) => [...old, newService]);
  }

  function updateService(
    service: Service
  ) {

    setServices(old =>
      old.map(item =>
        item.id === service.id
          ? service
          : item
      )
    );

  }

  function removeService(
    id: string
  ) {

    setServices(old =>
      old.filter(item => item.id !== id)
    );

  }

  return (
    <ServicesContext.Provider
      value={{
        services,
        addService,
        updateService,
        removeService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}