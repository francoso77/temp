export type Service = {

  id: string;

  name: string;

  description: string;

  specialtyId: string;

  specialtyName: string;

  price: number;

  durationMinutes: number;

  active: boolean;

  onlineBooking: boolean;

  minimumAdvanceHours: number;

  createdAt: Date;

  updatedAt: Date;

};