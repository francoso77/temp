import { Client } from "../models/Client";

export const mockClients: Client[] = [

  {

    id: "1",

    name: "Maria Oliveira",

    phone: "(37)99999-1111",

    email: "",

    notes: "",

    active: true,

    createdAt: new Date(),

    updatedAt: new Date(),

  },

  {

    id: "2",

    name: "Juliana Souza",

    phone: "(37)99999-2222",

    email: "",

    notes: "Cliente prefere atendimento pela manhã.",

    active: true,

    createdAt: new Date(),

    updatedAt: new Date(),

  },

];