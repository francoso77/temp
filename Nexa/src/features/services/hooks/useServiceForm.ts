import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { useSpecialties } from "@/features/specialties/hooks/useSpecialties";
import { useServices } from "./useServices";

export function useServiceForm() {

  const { addService } = useServices();
  const { specialties } = useSpecialties();

  const [specialtyId, setSpecialtyId] = useState("");

  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [duration, setDuration] =
    useState("");

  const [active, setActive] =
    useState(true);

  const [onlineBooking, setOnlineBooking] =
    useState(true);

  const [
    minimumAdvanceHours,
    setMinimumAdvanceHours,
  ] = useState("24");

  function save() {

    if (!specialtyId) {

      Alert.alert(
        "Especialidade",
        "Selecione uma especialidade."
      );

      return;

    }

    if (!name.trim()) {

      Alert.alert(
        "Nome",
        "Informe o atendimento."
      );

      return;

    }

    const specialty =
      specialties.find(
        item =>
          item.id === specialtyId
      );

    addService({

      specialtyId,

      specialtyName:
        specialty?.name ?? "",

      name,

      description,

      price: Number(

        price

          .replace("R$", "")

          .replace(/\./g, "")

          .replace(",", ".")

          .trim()

      ),

      durationMinutes:
        Number(duration),

      active,

      onlineBooking,

      minimumAdvanceHours:
        Number(
          minimumAdvanceHours
        ),

      createdAt: new Date(),

      updatedAt: new Date(),

    });

    router.back();

  }

  return {

    specialties,

    specialtyId,
    setSpecialtyId,

    name,
    setName,

    description,
    setDescription,

    price,
    setPrice,

    duration,
    setDuration,

    active,
    setActive,

    onlineBooking,
    setOnlineBooking,

    minimumAdvanceHours,
    setMinimumAdvanceHours,

    save,

  };

}