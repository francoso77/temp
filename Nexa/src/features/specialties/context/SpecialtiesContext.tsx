import {
  createContext,
  ReactNode,
  useState,
} from "react";

import { mockSpecialties } from "../data/mockSpecialties";
import { Specialty } from "../models/Specialty";

type ContextData = {

  specialties: Specialty[];

  addSpecialty: (
    specialty: Omit<Specialty, "id">
  ) => void;

  updateSpecialty: (
    specialty: Specialty
  ) => void;

  removeSpecialty: (
    id: string
  ) => void;

};

export const SpecialtiesContext =
  createContext({} as ContextData);

type Props = {
  children: ReactNode;
};

export function SpecialtiesProvider({
  children,
}: Props) {

  const [
    specialties,
    setSpecialties,
  ] = useState(mockSpecialties);

  function addSpecialty(
    specialty: Omit<Specialty, "id">
  ) {

    setSpecialties(old => [
      ...old,
      {
        id: Date.now().toString(),
        ...specialty,
      }
    ]);

  }

  function updateSpecialty(
    specialty: Specialty
  ) {

    setSpecialties(old =>

      old.map(item =>

        item.id === specialty.id
          ? specialty
          : item

      )

    );

  }

  function removeSpecialty(id: string) {

    setSpecialties(old =>

      old.map(item =>

        item.id === id
          ? {
            ...item,
            active: false,
          }
          : item

      )

    );

  }

  return (

    <SpecialtiesContext.Provider
      value={{
        specialties,
        addSpecialty,
        updateSpecialty,
        removeSpecialty,
      }}
    >
      {children}
    </SpecialtiesContext.Provider>

  );

}