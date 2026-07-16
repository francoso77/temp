import { useContext } from "react";

import { ServicesContext } from "../context/ServicesContext";

export function useServices() {
  return useContext(ServicesContext);
}