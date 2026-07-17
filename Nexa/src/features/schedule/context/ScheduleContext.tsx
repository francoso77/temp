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

export const ScheduleContext =
  createContext({} as ContextData);

type Props = {

  children: ReactNode;

};

export function ScheduleProvider({
  children,
}: Props) {

  const [availability, setAvailability] =
    useState(mockAvailability);

  return (

    <ScheduleContext.Provider
      value={{
        availability,
        setAvailability,
      }}
    >
      {children}
    </ScheduleContext.Provider>

  );

}