import { Service } from "../models/Service";

export function duplicateServiceData(
  service: Service
): Omit<Service, "id"> {

  return {

    ...service,

    name: `${service.name} (Cópia)`,

    createdAt: new Date(),

    updatedAt: new Date(),

  };

}

export function findServiceById(
  services: Service[],
  id: string
) {

  return services.find(
    item => item.id === id
  );

}