import { Service } from "../models/Service";

export function serviceSearch(
  services: Service[],
  search: string
) {

  if (!search.trim()) {
    return services;
  }

  const term = search.toLowerCase();

  return services.filter(service =>
    service.name
      .toLowerCase()
      .includes(term)
  );

}