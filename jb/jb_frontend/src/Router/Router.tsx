import { createBrowserRouter } from "react-router-dom";
import Login from '../Login/Login';
import Atleta from '../Views/Crud/Atleta';
import Layout from '../Layout/Layout';
import EventosEmAberto from '../Views/Eventos/EventosEmAberto';
import EtapasRealizadas from '../Views/Etapas/EtapasRealizadas';
import Categoria from '../Views/Crud/Categoria';
import User from '../Views/Users/User';
import Campeonato from '../Views/Crud/Campeonatos';
import Prova from '../Views/Crud/Provas';
import Cor from '../Views/Crud/Cor';
import UnidadeMedida from '../Views/Crud/UnidadeMedida';
import TipoProduto from '../Views/Crud/TipoProduto';
import Maquina from '../Views/Crud/Maquina';
import Produto from '../Views/Crud/Produto';
import Pessoa from '../Views/Crud/Pessoa';
import Estrutura from '../Views/Crud/Estrutura';
import PrazoEntrega from '../Views/Crud/PrazoEntrega';

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
        path: "/Cor",
        element: <Cor />,
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
      {
        path: "/UnidadeMedida",
        element: <UnidadeMedida />,
      },
      {
        path: "/TipoProduto",
        element: <TipoProduto />,
      },
      {
        path: "/Maquina",
        element: <Maquina />,
      },
      {
        path: "/Produto",
        element: <Produto />,
      },
      {
        path: "/Pessoa",
        element: <Pessoa />,
      },
      {
        path: "/Estrutura",
        element: <Estrutura />,
      },
      {
        path: "/PrazoEntrega",
        element: <PrazoEntrega />,
      },
    ]
  },
]);
