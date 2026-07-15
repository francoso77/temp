import { useState } from "react";

import { mockServices } from "../data/mockServices";
import { Service } from "../models/Service";

export function useServices() {

  const [services, setServices] = useState<Service[]>(mockServices);

  function addService(service: Service) {

    setServices((current) => [
      ...current,
      service,
    ]);

  }

  function removeService(id: string) {

    setServices((current) =>
      current.filter((item) => item.id !== id)
    );

  }

  function updateService(service: Service) {

    setServices((current) =>
      current.map((item) =>
        item.id === service.id
          ? service
          : item
      )
    );

  }

  return {

    services,

    addService,

    removeService,

    updateService,

  };

}