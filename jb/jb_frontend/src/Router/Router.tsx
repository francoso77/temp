import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from '../app/Login/Login';
import Layout from '../app/Layout/Layout';
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
import { ConsultaEstoque } from '../Views/Estoques/ConsultaEstoque';
import Home from '../Home';

// // Função para verificar se o usuário está autenticado
// const isAuthenticated = () => {
//   const token = localStorage.getItem("authToken");
//   return Boolean(token); // Retorna `true` se existir um token, caso contrário `false`.
// };

// // Componente para proteger as rotas
// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   return isAuthenticated() ? children : <Navigate to="/Login" />;
// };

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Login" />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Usuario",
    element: <Usuario />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      // Rotas públicas (rotaLivre)
      // {
      //   path: "/Login",
      //   element: <Login />,
      // },
      // {
      //   path: "/Usuario",
      //   element: <Usuario />,
      // },
      // Rotas protegidas
      {
        path: "/Cor",
        element: <Cor />,
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
        path: "/ProgramacaoDublagem",
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
        path: "/ConsultaEstoque",
        element: <ConsultaEstoque />,
      },
      {
        path: "/Testes",
        element: <Home />,
      },
    ]
  },
]);
