import {
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  Typography,
} from "@mui/material"
import Condicional from '../Condicional/Condicional'


interface PropsInputInterface {
  label: string
  field: any
  setState: React.Dispatch<React.SetStateAction<any>>
  dados: { [key: string]: string | number | readonly string[] | undefined | any }
  erros: Record<string, string>
  opcoes: Array<any>
  nomeCampoChaveOpcoes: string
  nomeCampoDescricaoOpcoes: string
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
export default function InputSelect({
  label,
  setState,
  dados,
  field,
  erros,
  opcoes,
  nomeCampoChaveOpcoes,
  nomeCampoDescricaoOpcoes,
}: PropsInputInterface) {
  return (
    <>
      <FormControl sx={{ width: "100%" }}>
        {/* <InputLabel
          htmlFor={campo}
          sx={{ backgroundColor: "white", paddingX: 1 }}
        >
          {label}
        </InputLabel> */}
        <Typography
          variant='body2'
          textAlign='left'
          sx={{ mt: 2 }}
        >
          {label}
        </Typography>
        <Select
          sx={{ my: 0, py: 0, height: 40 }}
          id={field}
          value={dados[field]}
          // label={label}
          onChange={(evento) =>
            setState({ ...dados, [field]: evento.target.value })
          }
        >
          {opcoes.map((v, indice) => (
            <MenuItem key={indice} value={v[nomeCampoChaveOpcoes]}>
              {v[nomeCampoDescricaoOpcoes]}
            </MenuItem>
          ))}
        </Select>

        <Condicional condicao={typeof erros[field] !== "undefined"}>
          <FormHelperText sx={{ color: "red" }}>{erros[field]}</FormHelperText>
        </Condicional>
      </FormControl>
    </>
  )
}
