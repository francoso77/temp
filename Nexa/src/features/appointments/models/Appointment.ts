export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "finished"
  | "cancelled";

export type Appointment = {

  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: AppointmentStatus;
  paid: boolean;
};