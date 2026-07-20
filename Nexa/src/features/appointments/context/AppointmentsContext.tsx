import {
  createContext,
  ReactNode,
  useState,
} from "react";

import { mockAppointments } from "../data/mockAppointments";
import { Appointment } from "../models/Appointment";

type ContextData = {

  appointments: Appointment[];

  setAppointments: React.Dispatch<
    React.SetStateAction<Appointment[]>
  >;

};

export const AppointmentsContext =
  createContext({} as ContextData);

type Props = {

  children: ReactNode;

};

export function AppointmentsProvider({

  children,

}: Props) {

  const [

    appointments,

    setAppointments,

  ] = useState(mockAppointments);

  return (

    <AppointmentsContext.Provider
      value={{
        appointments,
        setAppointments,
      }}
    >

      {children}

    </AppointmentsContext.Provider>

  );

}