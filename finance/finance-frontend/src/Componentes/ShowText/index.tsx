import React from "react"
import { Box, Link, Typography } from "@mui/material"
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
      <Box >
        <Typography component={'span'} variant="subtitle2" color="secondary" >
          {titulo.concat(': ')}
          <Condicional condicao={tipo === "texto"}>
            <Typography component={'span'} variant="subtitle2" color="primary" sx={{ ml: 1 }}>
              {descricao}
            </Typography>
          </Condicional>
          <Condicional condicao={tipo === "whatsapp"}>
            <Link target="_blank"
              href={"https://wa.me/55".concat(
                new ClsFormatacao().somenteNumeros(descricao)
              )} sx={{ ml: 1 }}
            >
              <Typography component={'span'} variant="caption" color="primary" sx={{ ml: 1 }}>
                {descricao}
              </Typography>
            </Link>
          </Condicional>
        </Typography>
      </Box>
    </>
  )
}