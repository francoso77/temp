import { useContext } from "react";

import { SpecialtiesContext } from "../context/SpecialtiesContext";

export function useSpecialties() {

  return useContext(
    SpecialtiesContext
  );

}