import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ServicesProvider } from "@/features/services/context/ServicesContext";

export default function RootLayout() {
  return (
    <ServicesProvider>

      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

    </ServicesProvider>
  );
}