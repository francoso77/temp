import React from 'react'
import { createBrowserRouter } from 'react-router-dom';
import Home from '../Home/Home';


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    // errorElement: <ErroAplicacao />,
    children: [
      // {
      //   path: "person",
      //   element: <Person />,
      //   errorElement: <ErroAplicacao />
      // },
      // {
      //   path: "ordem",
      //   element: <Ordem />,
      //   errorElement: <ErroAplicacao />
      // },
    ],
  },
  {
    // path: "*",
    // element: <ErroNavegacao />
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