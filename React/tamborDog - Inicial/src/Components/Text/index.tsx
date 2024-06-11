import React, { useEffect, useRef } from 'react';
import { OutlinedInput, Typography, IconButton, InputAdornment, Icon, FormControl, FormControlLabel, Checkbox } from '@mui/material';
import Condicional from '../Condicional/Condicional';
import MaskedInput, { Mask } from 'react-text-mask';
import * as Styled from './styles';

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
  setState: React.Dispatch<React.SetStateAction<any>>
  iconeEnd?: string,
  onClickIconeEnd?: () => void
  iconeStart?: string
  onClickIconeStart?: () => void
  mapKeyPress?: Array<mapKeyPressInterface>
  tipo?: 'text' | 'checkbox' | 'mask' | 'valor',
  autofocus?: boolean,
}
export default function Text({
  label,
  dados,
  field,
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
}: ComTextInterface) {

  const maskCEP: Mask | ((value: string) => Mask) = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]
  const maskCNPJ: Mask | ((value: string) => Mask) = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
  const maskCPF: Mask | ((value: string) => Mask) = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]

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

  if (tipo === 'checkbox') {

    return (
      <>
        <FormControlLabel
          sx={{ width: '100%', margin: '0 auto' }}
          label={label}
          labelPlacement='top'
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
            endAdornment={exibirIcone('end', iconeEnd, onClickIconeEnd)}
            startAdornment={exibirIcone('start', iconeStart, onClickIconeStart)}
            onKeyDown={(ev) => onKey(ev.key)}
            autoFocus={autofocus}
            inputRef={inputRef}
          />
          <Condicional condicao={typeof erros[field] !== 'undefined'}>
            <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
          </Condicional>
        </FormControl>
      </>
    )
  } else if (tipo === 'mask') {
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
          <Styled.TextCustom>
            <MaskedInput
              id='Mask'
              mask={(field === 'cep') ? maskCEP : (field === 'cpf') ? maskCPF : maskCNPJ}
              guide={false} // Define se a máscara é um guia rígido ou não
              keepCharPositions={true} // Mantém as posições dos caracteres em branco
              showMask // Mostra a máscara mesmo sem foco
              value={dados[field]}
              onChange={(e) => setState({ ...dados, [field]: e.target.value })}
              autoFocus={autofocus}
              placeholder={placeholder}
              disabled={disabled}
              type={type}

              render={(ref, props) => (
                <OutlinedInput
                  {...props}
                  sx={{ my: 0, py: 0, height: 40 }}
                  endAdornment={exibirIcone('end', iconeEnd, onClickIconeEnd)}
                  startAdornment={exibirIcone('start', iconeStart, onClickIconeStart)}
                  onKeyDown={(ev) => onKey(ev.key)}
                  inputRef={ref}
                />
              )}
            />
          </Styled.TextCustom>
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
            onChange={(e) => setState({ ...dados, [field]: e.target.value + 20 })}
            endAdornment={exibirIcone('end', iconeEnd, onClickIconeEnd)}
            startAdornment={exibirIcone('start', iconeStart, onClickIconeStart)}
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