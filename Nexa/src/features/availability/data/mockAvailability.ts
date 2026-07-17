import { Availability } from "../models/Availability";

export const mockAvailability: Availability[] = [

  {
    id: "1",
    dayOfWeek: 1,
    label: "Segunda-feira",
    enabled: true,
    startTime: "08:00",
    endTime: "18:00",
    lunchStart: "12:00",
    lunchEnd: "13:00",
    intervalMinutes: 30,
  },

  {
    id: "2",
    dayOfWeek: 2,
    label: "Terça-feira",
    enabled: true,
    startTime: "08:00",
    endTime: "18:00",
    lunchStart: "12:00",
    lunchEnd: "13:00",
    intervalMinutes: 30,
  },

  {
    id: "3",
    dayOfWeek: 3,
    label: "Quarta-feira",
    enabled: true,
    startTime: "08:00",
    endTime: "18:00",
    lunchStart: "12:00",
    lunchEnd: "13:00",
    intervalMinutes: 30,
  },

  {
    id: "4",
    dayOfWeek: 4,
    label: "Quinta-feira",
    enabled: true,
    startTime: "08:00",
    endTime: "18:00",
    lunchStart: "12:00",
    lunchEnd: "13:00",
    intervalMinutes: 30,
  },

  {
    id: "5",
    dayOfWeek: 5,
    label: "Sexta-feira",
    enabled: true,
    startTime: "08:00",
    endTime: "18:00",
    lunchStart: "12:00",
    lunchEnd: "13:00",
    intervalMinutes: 30,
  },

  {
    id: "6",
    dayOfWeek: 6,
    label: "Sábado",
    enabled: true,
    startTime: "08:00",
    endTime: "14:00",
    lunchStart: "",
    lunchEnd: "",
    intervalMinutes: 30,
  },

  {
    id: "7",
    dayOfWeek: 0,
    label: "Domingo",
    enabled: false,
    startTime: "",
    endTime: "",
    lunchStart: "",
    lunchEnd: "",
    intervalMinutes: 30,
  },

];