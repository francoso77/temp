import {
  createContext,
  ReactNode,
  useState,
} from "react";

import { mockServices } from "../data/mockServices";
import { Service } from "../models/Service";
import {
  findServiceById as findById
} from "../services/services.service";

type ServicesContextData = {

  services: Service[];
  addService: (service: Omit<Service, "id">) => void;
  updateService: (service: Service) => void;
  removeService: (id: string) => void;
  findServiceById: (id: string) => Service | undefined;
  duplicateService: (id: string) => void;
  toggleService: (id: string) => void;
  findService(id: string): Service | undefined
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
  function findServiceById(
    id: string
  ) {

    return findById(
      services,
      id
    );

  }

  function duplicateService(
    id: string
  ) {

    const current =
      services.find(
        item => item.id === id
      );

    if (!current) return;

    addService({

      ...current,

      name:
        `${current.name} (Cópia)`,

      createdAt:
        new Date(),

      updatedAt:
        new Date(),

    });

  }
  function toggleService(
    id: string
  ) {

    setServices(old =>
      old.map(item =>
        item.id === id
          ? {
            ...item,
            active: !item.active,
            updatedAt: new Date(),
          }
          : item
      )
    );
  }

  function findService(id: string) {

    return services.find(
      item => item.id === id
    );

  }
  return (
    <ServicesContext.Provider
      value={{
        services,
        addService,
        updateService,
        removeService,
        findServiceById,
        duplicateService,
        toggleService,
        findService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}