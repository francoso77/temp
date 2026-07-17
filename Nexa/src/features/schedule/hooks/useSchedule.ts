import { useContext } from "react";

import { ScheduleContext } from "../context/ScheduleContext";

export function useSchedule() {

  return useContext(
    ScheduleContext
  );

}