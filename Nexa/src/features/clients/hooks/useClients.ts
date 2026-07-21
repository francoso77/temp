import { useContext } from "react";

import { ClientsContext } from "../context/ClientsContext";

export function useClients() {
  return useContext(
    ClientsContext
  );
}