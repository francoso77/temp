import React, { useState, useRef } from 'react'
import FormControl from '@mui/material/FormControl'
import { Typography, Autocomplete, TextField, InputAdornment, IconButton, Icon } from '@mui/material'
import { useTheme } from '@mui/material'
import Condicional from '../Condicional/Condicional'

interface mapKeyPressInterface {
  key: string
  onKey: (pesquisa: string) => void
}

interface ComboBoxInterface<T> {
  autoFocus?: boolean
  id?: string
  label: string
  dados: { [key: string]: any }
  opcoes: Array<{ [key: string]: any }>
  campoID: string
  campoDescricao: string
  field: string
  setState?: React.Dispatch<React.SetStateAction<any>>
  disabled?: boolean
  placeholder?: string
  mapKeyPress?: Array<mapKeyPressInterface>
  erros?: { [key: string]: string }
  onChange?: (v: T) => void
  valorPadraoCampoEmBranco?: number | string
  mensagemPadraoCampoEmBranco?: string
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
  permitirNovaOpcao?: boolean
  formatarOption?: (opcao: T) => string
  onClickPesquisa?: (v: string) => void
  onSelect?: (v: any) => void
  Ref?: React.Ref<unknown> | undefined
  onFocus?: (v: any) => void
  tamanhoFonte?: number
  onBlur?: (v: any) => void
  inputRef?: React.Ref<unknown> | undefined
  corFundo?: string
  textAlign?: "left" | "right" | "center"
  labelAlign?: "left" | "right" | "center"
}

const onKey = (key: string, mapKeyPress: Array<mapKeyPressInterface>, pesquisa: string) => {
  if (mapKeyPress.length > 0) {
    for (let i = 0; i < mapKeyPress.length; i++) {
      if (mapKeyPress[i].key === key) {
        mapKeyPress[i].onKey(pesquisa)
        break
      }
    }
  }
}

export default function ComboBox<T>({
  autoFocus,
  id,
  label,
  dados,
  opcoes,
  campoID,
  campoDescricao,
  field,
  setState,
  disabled = false,
  placeholder = label,
  mapKeyPress = [],
  erros = {},
  onChange,
  valorPadraoCampoEmBranco = 0,
  mensagemPadraoCampoEmBranco = 'Escolha Uma Opção',
  onKeyDown,
  permitirNovaOpcao = false,
  formatarOption = undefined,
  onClickPesquisa,
  onSelect,
  Ref,
  onFocus,
  onBlur,
  tamanhoFonte = 16,
  inputRef,
  corFundo = '',
  textAlign = 'left',
  labelAlign = 'left',
}: ComboBoxInterface<T>) {

  const [pesquisa, setPesquisa] = useState('')
  const theme = useTheme()
  const chaveLista = useRef(0)

  const exibirIconePesquisa = () => (
    <InputAdornment position="start">
      <IconButton
        sx={{ margin: 0, padding: 0 }}
        onClick={() => onClickPesquisa && onClickPesquisa(pesquisa)}
      >
        <Icon sx={{ margin: 0, padding: 0 }}>search</Icon>
      </IconButton>
    </InputAdornment>
  )

  return (
    <>
      <Autocomplete
        sx={{ fontSize: tamanhoFonte }}
        autoFocus={autoFocus}
        ref={Ref}
        onSelect={(e) => onSelect && onSelect(e)}
        onFocus={(e) => onFocus && onFocus(e)}
        onBlur={(e) => onBlur && onBlur(e)}
        clearOnEscape
        disabled={disabled}
        disablePortal
        id={id}
        onKeyDown={onKeyDown}
        options={opcoes}
        getOptionLabel={(opcao) => {
          if (!opcao) return ''
          if (typeof opcao === 'number' || typeof opcao === 'string') {
            const match = opcoes.find((o) => o[campoID] === opcao)
            return match ? String(match[campoDescricao]) : String(opcao)
          }
          if (typeof opcao === 'object' && opcao !== null) {
            return String(opcao[campoDescricao] ?? '')
          }
          return ''
        }}
        value={
          opcoes.find(
            (opt) =>
              opt[campoID] === dados[field] ||
              (typeof dados[field] === 'object' && opt[campoID] === dados[field]?.[campoID])
          ) || null
        }
        onChange={(_e, v) => {
          if (onChange) {
            onChange(v)
          } else if (setState) {
            const tmp = { ...dados }
            tmp[field] = v ? v[campoID] : valorPadraoCampoEmBranco
            setState(tmp)
          }
        }}
        isOptionEqualToValue={(option, value) => {
          if (!option || !value) return false
          return (
            option[campoID] === value ||
            option[campoID] === value[campoID]
          )
        }}
        renderOption={(props, option) => (
          <li {...props} key={option[campoID]}>
            {formatarOption ? formatarOption(option) : option[campoDescricao]}
          </li>
        )}
        inputValue={pesquisa}
        onInputChange={(_event, value) => setPesquisa(value || '')}
        renderInput={(params) => (
          <FormControl sx={{ width: '100%' }}>
            <Condicional condicao={!!label}>
              <Typography
                variant="body2"
                textAlign={labelAlign}
                sx={{
                  mt: theme?.inputs?.marginTop ?? 0,
                  fontSize: tamanhoFonte,
                }}
              >
                {label}
              </Typography>
            </Condicional>

            <TextField
              {...params}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: tamanhoFonte,
                  bgcolor: corFundo,
                  textAlign,
                },
              }}
              size="small"
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                startAdornment: onClickPesquisa ? <>{exibirIconePesquisa()}</> : <></>,
              }}
              onKeyDown={(ev) => onKey(ev.key, mapKeyPress, pesquisa)}
              inputRef={inputRef}
            />

            <Condicional condicao={!!erros[field]}>
              <Typography variant="caption" textAlign="left" color="warning.main">
                {erros[field]}
              </Typography>
            </Condicional>
          </FormControl>
        )}
      />
    </>
  )
}
