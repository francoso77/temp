import { Screen, Typography } from "../../components";

export default function NewAppointmentScreen() {
  return (
    <Screen>
      <Typography variant="title">
        Novo Agendamento
      </Typography>

      <Typography>
        Em breve você poderá cadastrar um novo atendimento.
      </Typography>
    </Screen>
  );
}