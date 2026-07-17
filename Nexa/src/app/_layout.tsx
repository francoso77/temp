import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ScheduleProvider } from "@/features/schedule/context/ScheduleContext";
import { ServicesProvider } from "@/features/services/context/ServicesContext";

export default function RootLayout() {

  return (

    <ServicesProvider>

      <ScheduleProvider>

        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />

      </ScheduleProvider>

    </ServicesProvider>

  );

}