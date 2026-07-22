import { Service } from "../models/Service";
import { ServiceFilter } from "../types/ServiceFilter";

export function serviceFilter(
  services: Service[],
  filter: ServiceFilter
) {

  switch (filter) {

    case "active":
      return services.filter(
        item => item.active
      );

    case "inactive":
      return services.filter(
        item => !item.active
      );

    default:
      return services;

  }

}