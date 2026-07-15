export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  active: boolean;
  description?: string;
  color?: string;
  onlineBooking: boolean;
  advanceBookingHours: number;
}