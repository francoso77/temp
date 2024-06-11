import React, { useEffect, useRef, forwardRef, useState } from 'react';
import { OutlinedInput, Typography, InputAdornment, FormControl, FormControlLabel, Checkbox, IconButton, Icon } from '@mui/material';
import Condicional from '../Condicional/Condicional';
import { IMaskInput } from 'react-imask';
// import * as Styled from './styles';
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

interface mapKeyPressInterface {
  key: string
  onKey: () => void
}

interface ComTextInterface {
  label: string,
  disabled?: boolean,
  type?: string,
  placeholder?: string,
  dados: { [key: string]: string | number | readonly string[] | undefined | any },
  erros?: { [key: string]: string },
  field: string,
  mask?: string,
  setState: React.Dispatch<React.SetStateAction<any>>
  iconeEnd?: string,
  onClickIconeEnd?: () => void
  iconeStart?: string
  onClickIconeStart?: () => void
  mapKeyPress?: Array<mapKeyPressInterface>
  tipo?: 'text' | 'checkbox' | 'mask' | 'valor' | 'pass',
  autofocus?: boolean,
  maxLength?: number
}

const MASK_DEFINITIONS = {
  "0": /[0-9]/,
  X: /[AZ]/,
  x: /[az]/,
  uma: /[A-Za-z]/,
  "*": /[A-Za-z0-9 ]/,
  l: /[A-Za-z0-9#@$%&*(){}!]/,
}

const MaskCustom = forwardRef((props: any, ref: any) => {
  const { onChange, mask, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask={mask}
      definitions={MASK_DEFINITIONS}
      inputRef={ref}
      onAccept={(value: any) => {
        onChange({ target: { name: props.name, value } })
      }}
      overwrite
    />
  )
})
export default function Text({
  label,
  dados,
  field,
  mask,
  setState,
  disabled = false,
  type = 'text',
  placeholder = label,
  iconeStart = '',
  onClickIconeStart = () => { },
  iconeEnd = '',
  onClickIconeEnd = () => { },
  mapKeyPress = [],
  tipo = 'text',
  erros = {},
  autofocus = false,
  maxLength
}: ComTextInterface) {

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autofocus, setState])

  const onKey = (key: string) => {
    if (mapKeyPress.length > 0) {
      let encontrou: boolean = false
      for (let contador: number = 0; contador < mapKeyPress.length && !encontrou; contador++) {
        if (mapKeyPress[contador].key === key) {
          encontrou = true
          mapKeyPress[contador].onKey()
        }
      }
    }
  }

  const exibirIcone = (posicao: 'start' | 'end', icone: string, onclick: () => void) => {
    if (icone.length > 0) {
      return (
        <InputAdornment position={posicao} sx={{ margin: 0, padding: 0 }}>
          <IconButton sx={{ margin: 0, padding: 0 }} onClick={() => {
            if (onclick) {
              onclick()
            }
          }}>
            <Icon sx={{ margin: 0, padding: 0 }}>{icone}</Icon>
          </IconButton>
        </InputAdornment>
      )
    }
  }
  const [exibirSenha, setExibirSenha] = useState("password")

  if (tipo === 'checkbox') {

    return (
      <>
        <FormControlLabel
          sx={{ width: '100%', margin: '0 auto' }}
          label={label}
          // labelPlacement='top'
          control={
            <Checkbox
              checked={dados[field]}
              onChange={(e) => setState({ ...dados, [field]: e.target.checked })}
              disabled={disabled}
            />
          }
        />
      </>
    )
  } else if (tipo === 'text') {
    return (
      <>
        <FormControl sx={{ width: '100%' }}>
          <Typography
            variant='body2'
            textAlign='left'
            sx={{ mt: 1 }}
          >
            {label}
          </Typography>
          <OutlinedInput
            value={dados[field]}
            sx={{ my: 0, py: 0, height: 40 }}
            placeholder={placeholder}
            disabled={disabled}
            type={type}
            onChange={(e) => setState({ ...dados, [field]: e.target.value })}
            onKeyDown={(ev) => onKey(ev.key)}
            autoFocus={autofocus}
            inputRef={inputRef}
            endAdornment={exibirIcone('end', iconeEnd, onClickIconeEnd)}
            startAdornment={exibirIcone('start', iconeStart, onClickIconeStart)}
            inputProps={{ maxLength: maxLength }}
          />
          <Condicional condicao={typeof erros[field] !== 'undefined'}>
            <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
          </Condicional>
        </FormControl>
      </>
    )
  } else if (tipo === 'pass') {
    return (
      <FormControl sx={{ width: '100%' }}>
        <Typography
          variant='body2'
          textAlign='left'
          sx={{ mt: 1 }}
        >
          {label}
        </Typography>
        <OutlinedInput
          id={field}
          value={dados[field]}
          sx={{ my: 0, py: 0, height: 40 }}
          placeholder={placeholder}
          disabled={disabled}
          type={exibirSenha}
          onChange={(e) => setState({ ...dados, [field]: e.target.value })}
          onKeyDown={(ev) => onKey(ev.key)}
          autoFocus={autofocus}
          inputRef={inputRef}
          endAdornment={
            <InputAdornment position="start">
              <Condicional condicao={exibirSenha === "text"}>
                <VisibilityOffIcon onClick={() => setExibirSenha("password")} />
              </Condicional>

              <Condicional condicao={exibirSenha === "password"}>
                <VisibilityIcon onClick={() => setExibirSenha("text")} />
              </Condicional>
            </InputAdornment>
          }
        />
        <Condicional condicao={typeof erros[field] !== 'undefined'}>
          <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
        </Condicional>
      </FormControl>
    )
  } else if (tipo === 'mask') {
    return (
      <>
        <FormControl sx={{ width: "100%" }}>
          <Typography
            variant='body2'
            textAlign='left'
            sx={{ mt: 1 }}
          >
            {label}
          </Typography>
          <OutlinedInput
            sx={{ my: 0, py: 0, height: 40 }}
            id={field}
            placeholder={placeholder}
            onChange={(evento) =>
              setState({ ...dados, [field]: evento.target.value })
            }
            value={dados[field]}
            inputProps={{ mask: mask }}
            inputComponent={mask ? MaskCustom : undefined}
            type={type}
            autoFocus={autofocus}
          />

          <Condicional condicao={typeof erros[field] !== 'undefined'}>
            <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
          </Condicional>
        </FormControl>
      </>
    )
  } else if (tipo === 'valor') {
    return (
      <>
        <FormControl sx={{ width: '100%' }}>
          <Typography
            variant='body2'
            textAlign='left'
            sx={{ mt: 1 }}
          >
            {label}
          </Typography>
          <OutlinedInput
            value={dados[field]}
            sx={{ my: 0, py: 0, height: 40 }}
            placeholder={placeholder}
            disabled={disabled}
            type={type}
            onChange={(e) => setState({ ...dados, [field]: e.target.value })}
            onKeyDown={(ev) => onKey(ev.key)}
            autoFocus={autofocus}
          />

          <Condicional condicao={typeof erros[field] !== 'undefined'}>
            <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
          </Condicional>
        </FormControl>
      </>
    )
  } else {
    return (<></>)
  }
}