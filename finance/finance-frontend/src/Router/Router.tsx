import { createBrowserRouter } from "react-router-dom";

import Layout from '../app/Layout/Layout';
import { Welcome } from '../app/Layout/Welcome';
import Registrar from '../app/Registrar/Registrar';
import Login from '../app/Login/Login';
import { Categorias } from '../Views/Categorias/categorias';
import Testes from '../Views/Testes/testes';
import { Contas } from '../Views/Contas/contas';
import { Empresas } from '../Views/Empresas/empresas';
import { Transacoes } from '../Views/Transacoes/transacoes';
import PaginaTransacoes from '../Views/Transacoes/transacoesPage';

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
        path: "/testes",
        element: <Testes />,
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
      // {
      //   path: "/Testes",
      //   element: <Home />,
      // },
    ]
  },
]);
