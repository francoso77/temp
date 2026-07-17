import { Service } from "../models/Service";

export const mockServices: Service[] = [
  {
    id: "1",
    name: "Manicure Tradicional",
    description: "Cutilagem, esmaltação e finalização.",
    category: "Unhas",
    price: 45,
    durationMinutes: 60,
    active: true,
    onlineBooking: true,
    minimumAdvanceHours: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "2",
    name: "Blindagem em Gel",
    description: "Blindagem com acabamento em gel e alta durabilidade.",
    category: "Unhas",
    price: 90,
    durationMinutes: 90,
    active: true,
    onlineBooking: true,
    minimumAdvanceHours: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "3",
    name: "Spa dos Pés",
    description: "Esfoliação, hidratação e massagem relaxante.",
    category: "Pés",
    price: 70,
    durationMinutes: 60,
    active: true,
    onlineBooking: true,
    minimumAdvanceHours: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "4",
    name: "Alongamento em Fibra",
    description: "Alongamento completo em fibra de vidro.",
    category: "Unhas",
    price: 180,
    durationMinutes: 180,
    active: true,
    onlineBooking: false,
    minimumAdvanceHours: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];