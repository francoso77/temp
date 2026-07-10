import { router } from "expo-router";

import {
  Button,
  EmptyState,
  Screen,
  Typography,
} from "../../components";

export default function SelectClientScreen() {
  return (
    <Screen>
      <Typography variant="title">
        Selecionar Cliente
      </Typography>

      <EmptyState
        emoji="👤"
        title="Nenhuma cliente cadastrada"
        description="Cadastre sua primeira cliente para começar."
      />

      <Button
        title="Cadastrar Cliente"
        onPress={() => router.push("/clients/new")}
      />
    </Screen>
  );
}