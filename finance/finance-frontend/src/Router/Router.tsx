import { createBrowserRouter } from "react-router-dom";

import Layout from '../app/Layout/Layout';
import { Welcome } from '../app/Layout/Welcome';
import Registrar from '../app/Registrar/Registrar';
import Login from '../app/Login/Login';
import { Testes } from '../Views/Testes/testes';

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
      }
      // {
      //   path: "/Testes",
      //   element: <Home />,
      // },
    ]
  },
]);
