import React, { forwardRef, useState } from "react"
import FormControl from "@mui/material/FormControl"
import {
  OutlinedInput,
  Typography,
  IconButton,
  InputAdornment,
  Icon,
} from "@mui/material"
import Checkbox from "@mui/material/Checkbox/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import { IMaskInput } from "react-imask"
import { useTheme } from "@mui/material"
import ClsFormatacao from '../../Utils/ClsFormatacao'
import Condicional from '../Condicional/Condicional'


interface mapKeyPressInterface {
  key: string
  onKey: () => void
}

interface InputTextInterface {
  posicaoLabel?: 'top' | 'bottom',
  corFundo?: string,
  corFonte?: string
  tamanhoFonte?: number
  inputRef?: React.Ref<any> | undefined
  label: string
  disabled?: boolean
  type?: string
  min?: number | null
  max?: number | null
  scale?: number | null
  placeholder?: string
  dados: {
    [key: string]: string | number | readonly string[] | undefined | any
  }
  erros?: { [key: string]: string }
  field: string
  setState?: React.Dispatch<React.SetStateAction<any>>
  iconeEnd?: string
  onClickIconeEnd?: () => void
  iconeStart?: string
  onClickIconeStart?: () => void
  /** Função pra Detecção de KeyDown */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
  mapKeyPress?: Array<mapKeyPressInterface>
  tipo?:
  | "text"
  | "checkbox"
  | "number"
  | "float"
  | "uppercase"
  | "date"
  | "dateTime"
  | "currency"
  | "mac"
  maxLength?: number | null
  mask?: "tel" | "cnpj" | "cpf" | "cep" | "uf" | "mac" | "nf" | string
  autoFocus?: boolean
  unmask?: boolean
  onChange?: (v: any) => void
  afterChange?: (v: any) => void
  onFocus?: (v: any) => void
  onBlur?: (v: any) => void
  textAlign?: "left" | "right" | "center"
  labelAlign?: "left" | "right" | "center"
  width?: "100%" | string
  labelPlacement?: "top" | "start" | "end" | "bottom"
}

const MASK_DEFINITIONS = {
  "0": /[0-9]/,
  "#": /[1-9]/,
  "?": /[1-9 ]/,
  X: /[A-Z]/,
  x: /[a-z]/,
  a: /[A-Za-z]/,
  "*": /[A-Za-z0-9 ]/,
  m: /[A-Fa-f0-9]/, // Mac Address
  l: /[A-Za-z0-9#@$%&*(){}!]/,
}

const exibirIcone = (
  posicao: "start" | "end",
  icone: string,
  onclick: () => void
) => {
  if (icone.length > 0) {
    return (
      <InputAdornment position={posicao} sx={{ margin: 0, padding: 0 }}>
        <IconButton
          sx={{ margin: 0, padding: 0 }}
          onClick={() => {
            if (onclick) {
              onclick()
            }
          }}
        >
          <Icon sx={{ margin: 0, padding: 0 }}>{icone}</Icon>
        </IconButton>
      </InputAdornment>
    )
  }
}

const onKey = (key: string, mapKeyPress: Array<mapKeyPressInterface>) => {
  if (mapKeyPress.length > 0) {
    let encontrou: boolean = false
    for (
      let contador: number = 0;
      contador < mapKeyPress.length && !encontrou;
      contador++
    ) {
      if (mapKeyPress[contador].key === key) {
        encontrou = true
        mapKeyPress[contador].onKey()
      }
    }
  }
}

const TelMaskCustom = forwardRef((props: any, ref: any) => {
  const mascara9Digitos: string = "(##) #0000-0000"
  const mascara8Digitos: string = "(##) #000-00000"

  const [mask, setMask] = useState(mascara9Digitos)

  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask={mask}
      definitions={MASK_DEFINITIONS}
      onKeyUp={(e: any) => {
        if (e.target.value.trim().length <= 14) {
          setMask(mascara8Digitos)
        } else {
          setMask(mascara9Digitos)
        }
      }}
      inputRef={ref}
      onAccept={(value: any) =>
        onChange({ target: { name: props.name, value } })
      }
      overwrite
    />
  )
})

const TextMaskCustom = forwardRef((props: any, ref: any) => {
  const { onChange, mask, tipo, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask={
        mask === "nf"
          ? "000.000.000"
          : mask === "uf"
            ? "aa"
            : tipo === "date"
              ? "00/00/0000"
              : tipo === "dateTime"
                ? "00/00/0000 00:00:00"
                : mask === "cnpj"
                  ? "00.000.000/0000-00"
                  : mask === "cpf"
                    ? "000.000.000-00"
                    : mask === "cep"
                      ? "00.000-000"
                      : mask === "mac" || tipo === "mac"
                        ? "mmm:mmm:mmm:mmm:mmm:mmm"
                        : mask
      }
      definitions={MASK_DEFINITIONS}
      inputRef={ref}
      onAccept={(value: any) =>
        onChange({ target: { name: props.name, value } })
      }
      overwrite
    />
  )
})

const CurrencyMaskCustom = forwardRef((props: any, ref: any) => {
  const { onChange, mask, tipo, scale, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask={Number}
      scale={scale ? scale : 2}
      signed={true}
      padFractionalZeros={true}
      normalizeZeros={true}
      onAccept={(value: any) =>
        onChange({ target: { name: props.name, value } })
      }
      mapToRadix={["."]}
      radix={","}
      thousandsSeparator={"."}
      unmask
      inputRef={ref}
      overwrite
    />
  )
})

const converterDiaMesAno = (valor: string): string => {
  let retorno: string = valor

  if (valor.length === 10) {
    retorno = valor
      .substring(8, 10)
      .concat("/")
      .concat(valor.substring(5, 7))
      .concat("/")
      .concat(valor.substring(0, 4))
  }

  return retorno
}

const converterEmAnoMesDia = (valor: string): string => {
  let retorno: string = valor

  if (valor.length === 10) {
    retorno = valor
      .substring(6, 10)
      .concat("-")
      .concat(valor.substring(3, 5))
      .concat("-")
      .concat(valor.substring(0, 2))

    if (typeof Date.parse(retorno) !== "number") {
      retorno = ""
    }
  }

  return retorno
}

export default function InputText({
  posicaoLabel = 'top',
  corFundo = '',
  corFonte = '#fff',
  tamanhoFonte = 16,
  inputRef,
  label,
  dados,
  field,
  setState = () => { },
  disabled = false,
  type = "text",
  placeholder = label,
  iconeStart = "",
  onClickIconeStart = () => { },
  iconeEnd = "",
  onClickIconeEnd = () => { },
  onKeyDown,
  mapKeyPress = [],
  tipo = "text",
  erros = {},
  maxLength = null,
  mask = "",
  min = null,
  max = null,
  scale = null,
  autoFocus = false,
  unmask = false,
  onChange = undefined,
  afterChange = undefined,
  onFocus = undefined,
  onBlur = undefined,
  textAlign = "left",
  labelAlign = "left",
  width = "100%",
  labelPlacement = "end",
}: InputTextInterface) {
  const theme = useTheme()

  const clsFormatos: ClsFormatacao = new ClsFormatacao()

  const formatarDadosAoSair = (e: any) => {
    if (tipo === "date") {
      if (dados[field].length === 5) {
        setState({
          ...dados,
          [field]: converterEmAnoMesDia(
            clsFormatos.dataAbreviadaParaDataCompleta(dados[field])
          ),
        })
      }
    } else if (mask === "nf") {
      setState({
        ...dados,
        [field]: clsFormatos.notaFiscal(dados[field])
      })
    }
  }

  if (tipo === "checkbox") {
    return (
      <>
        <FormControlLabel
          sx={{
            width: width,
            '& .MuiFormControlLabel-label': {
              color: corFonte, // ou use 'primary.main', 'secondary.main', '#ff0000', etc.
            },
          }}
          label={label}
          labelPlacement={labelPlacement}
          control={
            <Checkbox
              color="primary"
              name={field}
              checked={dados[field]}
              onChange={(e) =>
                setState({ ...dados, [field]: e.target.checked })
              }
              disabled={disabled}
            />
          }
        />
        <Condicional condicao={typeof erros[field] !== "undefined"}>
          <Typography variant="caption" textAlign="left" color="warning.main">
            {erros[field]}
          </Typography>
        </Condicional>
      </>
    )
  } else {
    let valor: string = ""

    if (tipo === "date") {
      valor = converterDiaMesAno(dados[field])
    } else if (tipo !== "text") {
      valor = dados[field].toString()
    } else {
      valor = dados[field]
    }

    return (
      <FormControl sx={{ width: width }}>
        <Condicional condicao={posicaoLabel === 'top'}>

          <Typography
            variant="body2"
            textAlign={labelAlign}
            sx={{
              mt:
                theme && theme.inputs && theme.inputs.marginTop
                  ? theme.inputs.marginTop
                  : 0,
              fontSize: tamanhoFonte,
              color: corFonte
            }}
          >
            {label}
          </Typography>
        </Condicional>
        <OutlinedInput
          autoComplete='off'
          sx={{
            color: corFonte,
            fontSize: tamanhoFonte,
            // backgroundColor: corFundo,
            // border: '0.5px solid  #3a3a3a',
            // '&.Mui-disabled': {
            //   //color: '#aa1e1e', // Cor da fonte
            //   backgroundColor: '#c99999', // (opcional) Cor de fundo para desabilitado
            //   border: '0.5px solid  #3a3a3a',

            // },
            '& .MuiOutlinedInput-notchedOutline': {
              color: '#ccc', // Cor da borda
              borderColor: '#ccc', // (opcional) Cor da borda
              border: '0.5px solid  #3a3a3a',

            },

          }}
          inputRef={inputRef}
          name={field}
          onBlur={onBlur ? onBlur : (e) => formatarDadosAoSair(e)}
          autoFocus={autoFocus}
          value={valor === null ? "" : valor}
          size="small"
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          onFocus={(e) => {
            if (onFocus) {
              onFocus(e)
            }
          }}
          onChange={(e) => {
            const alterado: boolean =
              (typeof dados[field] === "number" &&
                dados[field].toString() !== e.target.value) ||
              dados[field] !== e.target.value

            if (alterado) {
              let novoValor: number | string = ""

              if (
                tipo === "number" ||
                tipo === "float" ||
                tipo === "currency"
              ) {
                novoValor =
                  tipo === "number"
                    ? parseInt(e.target.value)
                    : parseFloat(e.target.value)

                if (isNaN(novoValor)) novoValor = 0
              } else {
                novoValor =
                  tipo === "uppercase"
                    ? e.target.value.toUpperCase()
                    : tipo === "date"
                      ? converterEmAnoMesDia(e.target.value)
                      : e.target.value
              }

              if (onChange) {
                onChange(novoValor)
              } else {
                const novoState = {
                  ...dados,
                  [field]: novoValor,
                }

                setState(novoState)

                if (afterChange) {
                  afterChange(novoState)
                }
              }
            }
          }}
          endAdornment={exibirIcone("end", iconeEnd, onClickIconeEnd)}
          startAdornment={exibirIcone("start", iconeStart, onClickIconeStart)}
          onKeyDown={onKeyDown ? onKeyDown : (ev) => onKey(ev.key, mapKeyPress)}
          inputProps={{
            tipo: tipo,
            maxLength:
              tipo === "mac"
                ? 23
                : tipo === "date"
                  ? 10
                  : tipo === "dateTime"
                    ? 19
                    : mask === "nf"
                      ? 11
                      : mask === "uf"
                        ? 2
                        : mask === "tel"
                          ? 15
                          : mask === "cnpj"
                            ? 18
                            : mask === "cpf"
                              ? 14
                              : mask === "cep"
                                ? 10
                                : maxLength,
            mask: mask,
            min: min,
            max: max,
            scale: scale,
            unmask: unmask ? unmask : undefined,
            style: { textAlign: textAlign },
          }}
          inputComponent={
            tipo === "currency"
              ? CurrencyMaskCustom
              : tipo === "date" || tipo === "mac"
                ? TextMaskCustom
                : mask === "tel"
                  ? TelMaskCustom
                  : mask.length > 0
                    ? TextMaskCustom
                    : undefined
          }
        />
        <Condicional condicao={posicaoLabel === 'bottom'}>
          <Typography
            variant="body2"
            textAlign={labelAlign}
            sx={{
              mt:
                theme && theme.inputs && theme.inputs.marginTop
                  ? theme.inputs.marginTop
                  : 0,
              fontSize: tamanhoFonte,
            }}
          >
            {label}
          </Typography>
        </Condicional>
        <Condicional condicao={typeof erros[field] !== "undefined"}>
          <Typography variant="caption" textAlign="left" color="warning.main">
            {erros[field]}
          </Typography>
        </Condicional>
      </FormControl>
    )
  }
}