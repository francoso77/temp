import React from 'react'
import { createBrowserRouter } from 'react-router-dom';
import Home from '../views/Home/Home';
import ErroAplicacao from '../Layout/ErroAplicacao';
import Person from '../views/Person/Person';
import ErroNavegacao from '../Layout/ErroNavegacao';
import Layout from '../Layout/Layout';
import Ordem from '../views/Ordem/Ordem';
import Cao from '../views/Cao';
import Atleta from '../views/Atleta/Index';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErroAplicacao />,
    children: [
      {
        path: "person",
        element: <Person />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "atleta",
        element: <Atleta />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "ordem",
        element: <Ordem />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "cao",
        element: <Cao />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "home",
        element: <Home />,
        errorElement: <ErroAplicacao />
      },
    ],
  },
  {
    path: "*",
    element: <ErroNavegacao />
  },
  {

    path: "*",
    element: <Home />
  }

  /*
  {
    path: "/",
    element: <LayOut />,
    errorElement: <ErroAplicacao />,
    children: [
      {
        path: "cadastrocliente/:idCliente",
        element: <CadastroCliente />,
        errorElement: <ErroAplicacao />
      },
      {
        path: "cadastrofornecedor",
        element: <CadastroFornecedor />,
        errorElement: <ErroAplicacao />
      }
    ],
  },
  {
    path: "*",
    element: <ErroNavegacao />
  }
  */
]);