import { createBrowserRouter } from "react-router-dom";
import Login from '../Login/Login';
import Layout from '../Layout/Layout';
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
import { ProducaoMalharia } from '../Views/ProducaoMalharia/ProducaoMalharia';
import { Tinturaria } from '../Views/Tinturaria/Tinturaria';
import GerenciadorPedido from '../Views/GerenciadorPedidos/Gerenciador';
import GeneratePDF from '../Views/testes/GeneratePDF';

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
      {
        path: "/ProducaoMalharia",
        element: <ProducaoMalharia />,
      },
      {
        path: "/Tinturaria",
        element: <Tinturaria />,
      },
      {
        path: "/GerenciadorPedido",
        element: <GerenciadorPedido />,
      },
      {
        path: "/Testes",
        element: <GeneratePDF />,
      },
    ]
  },
]);
