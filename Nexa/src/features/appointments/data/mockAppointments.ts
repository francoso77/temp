import { Appointment } from "../models/Appointment";

export const mockAppointments: Appointment[] = [

  {
    id: "1",
    customerId: "1",
    customerName: "Maria Silva",
    serviceId: "1",
    serviceName: "Blindagem em Gel",
    professionalId: "1",
    date: "2026-07-25",
    startTime: "08:00",
    endTime: "09:00",
    price: 85,
    status: "scheduled",
    paid: true,
  },

  {
    id: "2",
    customerId: "2",
    customerName: "Ana Paula",
    serviceId: "2",
    serviceName: "Manutenção",
    professionalId: "1",
    date: "2026-07-25",
    startTime: "09:30",
    endTime: "10:30",
    price: 70,
    status: "confirmed",
    paid: false,
  },

];