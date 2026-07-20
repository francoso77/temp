import {
  createContext,
  ReactNode,
  useState,
} from "react";

import { mockAvailability } from "../data/mockAvailability";
import { Availability } from "../models/Availability";

type ContextData = {

  availability: Availability[];

  setAvailability: React.Dispatch<
    React.SetStateAction<Availability[]>
  >;

};

export const AvailabilityContext =
  createContext({} as ContextData);

type Props = {

  children: ReactNode;

};

export function AvailabilityProvider({
  children,
}: Props) {

  const [availability, setAvailability] =
    useState(mockAvailability);

  return (

    <AvailabilityContext.Provider
      value={{
        availability,
        setAvailability,
      }}
    >
      {children}
    </AvailabilityContext.Provider>

  );

}