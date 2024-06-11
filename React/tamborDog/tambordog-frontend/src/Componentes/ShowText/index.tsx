import React from "react"
import { Grid, Link, Typography } from "@mui/material"
import Condicional from '../Condicional/Condicional'
import ClsFormatacao from '../../Utils/ClsFormatacao'

interface PropsInterface {
  titulo: string
  descricao: string
  tipo?: "texto" | "whatsapp"
}

export default function ShowText({
  titulo,
  descricao,
  tipo = "texto",
}: PropsInterface) {
  return (
    <>
      <Typography variant="button" color="secondary" >
        {titulo.concat(': ')}
        <Condicional condicao={tipo === "texto"}>
          <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
            {descricao}
          </Typography>
        </Condicional>
        <Condicional condicao={tipo === "whatsapp"}>
          <Link target="_blank"
            href={"https://wa.me/55".concat(
              new ClsFormatacao().somenteNumeros(descricao)
            )} sx={{ ml: 1 }}
          >
            <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
              {descricao}
            </Typography>
          </Link>
        </Condicional>
      </Typography>
    </>
  )
}