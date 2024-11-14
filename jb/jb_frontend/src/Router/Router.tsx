import { createBrowserRouter } from "react-router-dom";
import Login from '../Login/Login';
import Layout from '../Layout/Layout';
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
import ProgramacaoDublagem from '../Views/GerenciadorPedidos/ProgramacaoDublagem';
import Usuario from '../Views/Usuario/Usuario';
import ProducaoDublagem from '../Views/ProducaoDublagen/ProducaoDublagem';
import Dashboard from '../Views/DashBoard/Dashboard';
import { ConsultaEstoque } from '../Views/testes/ConsultaEstoque';


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
        path: "/Usuario",
        element: <Usuario />,
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
        path: "/ProgramacaoPedido",
        element: <ProgramacaoDublagem />,
      },
      {
        path: "/ProducaoDublagem",
        element: <ProducaoDublagem />,
      },
      {
        path: "/Dashboard",
        element: <Dashboard />,
      },
      {
        path: "/Testes",
        element: <ConsultaEstoque />,
      },
    ]
  },
]);
