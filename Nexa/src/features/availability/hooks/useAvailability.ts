import { useContext } from "react";

import { AvailabilityContext } from "../context/AvailabilityContext";
export function useAvailability() {

  return useContext(
    AvailabilityContext
  );

}