import { useContext } from "react";

import { AppointmentsContext } from "../context/AppointmentsContext";

export function useAppointments() {

  return useContext(
    AppointmentsContext
  );

}