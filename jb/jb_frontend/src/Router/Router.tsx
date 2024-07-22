import { createBrowserRouter } from "react-router-dom";
import Login from '../Login/Login';
import Layout from '../Layout/Layout';
import EventosEmAberto from '../Views/Eventos/EventosEmAberto';
import EtapasRealizadas from '../Views/Etapas/EtapasRealizadas';
import User from '../Views/Users/User';
import Cor from '../Views/Crud/Cor';
import UnidadeMedida from '../Views/Crud/UnidadeMedida';
import Maquina from '../Views/Crud/Maquina';
import Produto from '../Views/Crud/Produto';
import Pessoa from '../Views/Crud/Pessoa';
import Estrutura from '../Views/Crud/Estrutura';
import PrazoEntrega from '../Views/Crud/PrazoEntrega';
import Pedido from '../Views/Pedidos/Pedido';
import Entrada from '../Views/Entradas/Entrada';

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
        path: "/User",
        element: <User />,
      },
      {
        path: "/UnidadeMedida",
        element: <UnidadeMedida />,
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
      {
        path: "/Pedido",
        element: <Pedido />,
      },
      {
        path: "/Entrada",
        element: <Entrada />,
      },
    ]
  },
]);
