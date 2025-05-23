import React, { useState } from "react"
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import Condicional from '../Condicional/Condicional'

interface PropsInterface {
  label: string
  field: string
  setState: React.Dispatch<React.SetStateAction<any>>
  dados: Record<string, string | number>
  erros: Record<string, string>
}

/**
 * Formata o Texto de Acordo com a Máscara Fornecida
 * @param label - Label do Texto - O que é exibido para o usuário
 * @param setState - setState do Conjunto de Dados
 * @param dados - Dados Atuais a serem atualizados pelo setState
 * @param field - Nome do campo a ser atualizado no setState
 * @param erros - Objeto de Erro que caso exista o campo, será exibido
 * @returns void
 */
export default function InputPassword({
  label,
  field,
  setState,
  dados,
  erros,
}: PropsInterface) {
  const [exibirSenha, setExibirSenha] = useState("password")

  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel
        htmlFor={field}
        sx={{ backgroundColor: "white", paddingX: 1 }}
      >
        {label}
      </InputLabel>

      <OutlinedInput
        type={exibirSenha}
        id={field}
        value={dados[field]}
        onChange={(evento) =>
          setState({ ...dados, [field]: evento.target.value })
        }
        endAdornment={
          <InputAdornment position="start">
            <Condicional condicao={exibirSenha === "text"}>
              <VisibilityIcon onClick={() => setExibirSenha("password")} />
            </Condicional>

            <Condicional condicao={exibirSenha === "password"}>
              <VisibilityOffIcon onClick={() => setExibirSenha("text")} />
            </Condicional>
          </InputAdornment>
        }
      />

      <Condicional condicao={typeof erros[field] !== "undefined"}>
        <FormHelperText sx={{ color: "red" }}>{erros[field]}</FormHelperText>
      </Condicional>
    </FormControl>
  )
}
