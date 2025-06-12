import { createBrowserRouter } from "react-router-dom";

import Layout from '../app/Layout/Layout';
import { Welcome } from '../app/Layout/Welcome';
import Registrar from '../app/Registrar/Registrar';
import Login from '../app/Login/Login';
import { Categorias } from '../Views/Categorias/categorias';
import { Contas } from '../Views/Contas/contas';
import { Empresas } from '../Views/Empresas/empresa';
import { Transacoes } from '../Views/Transacoes/transacoes';
import PaginaTransacoes from '../Views/Transacoes/transacoesPage';
import Dashboard from '../Views/Dashboard/Dashboard';
import { ForgotPassword } from "../app/Registrar/ForgotPassword";
import { ResetPassword } from '../app/Registrar/ResetPassword';
import { Relatorios } from '../Views/Relatorios/relatorios';
import { Setores } from '../Views/Setores/setores';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      //Rotas públicas (rotasLivre)
      {
        path: "/welcome",
        element: <Welcome />,
      },
      //Rotas protegidas
      {
        path: "/registrar",
        element: <Registrar />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/categorias",
        element: <Categorias />,
      },
      {
        path: "/contas",
        element: <Contas />,
      },
      {
        path: "/empresas",
        element: <Empresas />,
      },
      {
        path: "/transacoes",
        element: <Transacoes />,
      },
      {
        path: "/transacoes/nova",
        element: <PaginaTransacoes />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/relatorios",
        element: <Relatorios />,
      },
      {
        path: "/setores",
        element: <Setores />,
      }
      // {
      //   path: "/Testes",
      //   element: <Home />,
      // },
    ]
  },
]);
