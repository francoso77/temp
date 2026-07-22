import { Service } from "../models/Service";
import { ServiceOrder } from "../types/ServiceOrder";

export function serviceSort(
  services: Service[],
  order: ServiceOrder
) {

  const data = [...services];

  switch (order) {

    case "price":

      return data.sort(
        (a, b) =>
          a.price - b.price
      );

    case "duration":

      return data.sort(
        (a, b) =>
          a.durationMinutes -
          b.durationMinutes
      );

    case "specialty":

      return data.sort((a, b) =>
        a.specialtyName.localeCompare(
          b.specialtyName
        )
      );

    default:

      return data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

  }

}