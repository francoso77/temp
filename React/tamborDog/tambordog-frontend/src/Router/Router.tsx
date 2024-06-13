import { createBrowserRouter } from "react-router-dom";
import Login from '../Login/Login';
import Atleta from '../Views/Crud/Atleta';
import Layout from '../Layout/Layout';
// import Cao from '../Views/Crud/Cao';
import EventosEmAberto from '../Views/Eventos/EventosEmAberto';
import EtapasRealizadas from '../Views/Etapas/EtapasRealizadas';
import Raca from '../Views/Crud/Raca';
import Categoria from '../Views/Crud/Categoria';
import User from '../Views/Users/User';
import Campeonato from '../Views/Crud/Campeonatos';
import Prova from '../Views/Crud/Provas';
import Inscricao from '../Views/Inscricoes/Inscricoes';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/Login",
        element: <Login />,
      },
      {
        path: "/Atleta",
        element: <Atleta />,
      },
      // {
      //   path: "/Cao",
      //   element: <Cao />,
      // },
      {
        path: "/EventosEmAberto",
        element: <EventosEmAberto />,
      },
      {
        path: "/EtapasRealizadas",
        element: <EtapasRealizadas />,
      },
      {
        path: "/Raca",
        element: <Raca />,
      },
      {
        path: "/Categoria",
        element: <Categoria />,
      },
      {
        path: "/User",
        element: <User />,
      },
      {
        path: "/Campeonato",
        element: <Campeonato />,
      },
      {
        path: "/Prova",
        element: <Prova />,
      },
    ]
  },
]);
