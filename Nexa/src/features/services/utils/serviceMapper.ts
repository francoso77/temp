import { Service } from "../models/Service";
import { ServiceFormData } from "../types";

export function serviceToForm(
  service: Service
): ServiceFormData {

  return {

    specialtyId: service.specialtyId,

    name: service.name,

    description: service.description,

    price: String(service.price),

    durationMinutes: String(
      service.durationMinutes
    ),

    active: service.active,

    onlineBooking: service.onlineBooking,

    minimumAdvanceHours: String(
      service.minimumAdvanceHours
    ),

  };

}