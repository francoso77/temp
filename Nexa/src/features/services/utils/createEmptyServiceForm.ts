import { ServiceFormData } from "../types";

export function createEmptyServiceForm(): ServiceFormData {

  return {
    specialtyId: "",
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
    active: true,
    onlineBooking: true,
    minimumAdvanceHours: "24",
  };
}