import { forwardRef, useState } from "react"
import FormControl from "@mui/material/FormControl"
import { OutlinedInput, Typography } from "@mui/material"
import { IMaskInput } from "react-imask"
import { useTheme } from "@mui/material"
import ClsFormatacao from '../../Utils/ClsFormatacao'
import Condicional from '../Condicional/Condicional'


interface InputTextInterface {
  posicaoLabel?: 'top' | 'bottom',
  corFundo?: string,
  corFonte?: string
  tamanhoFonte?: number
  value: any
  label: string
  disabled?: boolean
  type?: string
  min?: number | null
  max?: number | null
  scale?: number | null
  placeholder?: string
  tipo?:
  | "text"
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
  onFocus?: (v: any) => void
  textAlign?: "left" | "right" | "center"
  labelAlign?: "left" | "right" | "center"
  width?: "100%" | string
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
      // signed={true}
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



export default function InputCalc({
  posicaoLabel = 'top',
  corFundo = '',
  corFonte = '',
  tamanhoFonte = 16,
  value,
  label,
  disabled = false,
  type = "text",
  placeholder = label,
  tipo = "text",
  maxLength = null,
  mask = "",
  min = null,
  max = null,
  scale = null,
  autoFocus = false,
  unmask = false,
  onFocus = undefined,
  textAlign = "left",
  labelAlign = "left",
  width = "100%",
}: InputTextInterface) {
  const theme = useTheme()

  const clsFormatos: ClsFormatacao = new ClsFormatacao()

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
          }}
        >
          {label}
        </Typography>
      </Condicional>
      <OutlinedInput
        sx={{
          color: corFonte,
          fontSize: tamanhoFonte,
          backgroundColor: corFundo,
        }}
        onBlur={(e) => {
          let dado: any = e
          clsFormatos.currency(dado)
        }}
        autoFocus={autoFocus}
        value={value === null ? "" : value}
        size="small"
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        onFocus={(e) => {
          if (onFocus) {
            onFocus(e)
          }
        }}
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
    </FormControl>
  )

}