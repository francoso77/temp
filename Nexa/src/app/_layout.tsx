import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppointmentsProvider } from '@/features/appointments/context/AppointmentsContext';
import { AvailabilityProvider } from '@/features/availability';
import { ServicesProvider } from "@/features/services/context/ServicesContext";
import { SpecialtiesProvider } from '@/features/specialties/context/SpecialtiesContext';

export default function RootLayout() {

  return (
    <SpecialtiesProvider>

      <ServicesProvider>

        <AvailabilityProvider>

          <AppointmentsProvider>

            <StatusBar style="dark" />

            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />

          </AppointmentsProvider>

        </AvailabilityProvider>

      </ServicesProvider>

    </SpecialtiesProvider>
  );

}