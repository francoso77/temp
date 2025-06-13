import React, { useState, useRef } from 'react'
import FormControl from '@mui/material/FormControl'
import { Typography, Autocomplete, TextField, InputAdornment, IconButton, Icon } from '@mui/material'
import Condicional from '../Condicional/Condicional'

interface mapKeyPressInterface {
  key: string
  onKey: (pesquisa: string) => void
}

interface ComboBoxInterface<T> {
  /** Recebe o foco automático */
  autoFocus?: boolean
  /** identificador do componente */
  id?: string
  /** Descrição que irá aparecer no campo. */
  label: string,
  /** Array de Objeto de Dados. Será utilizado no SetState como conjunto de dados */
  dados: { [key: string]: string | number | readonly string[] | undefined | any },
  /** Array de Objeto de Opções que serão apresentadas no ComboBox. */
  opcoes: Array<{ [key: string]: string | number | readonly string[] | undefined | any }>,
  /** Nome do CampoID, dentro de @opcoes, que será utilizado como Value. */
  campoID: string,
  /** Nome do Campo Descrição, dentro de @opcoes, que será apresentado ao usuário no ComboBox. */
  campoDescricao: string,
  /** Campo dentro de @dados que será atribuído o valor do CampoID de @opcoes */
  field: string,
  /** CallBack de setState de Dados - Utilizado somente quando OnChange for omitido*/
  setState?: React.Dispatch<React.SetStateAction<any>>
  /** Desabilitar seleção / Campo */
  disabled?: boolean,
  /** PlaceHolder Padrão HTML */
  placeholder?: string,
  /** Mapeamento de Funções KeyPress, recebe o código da tecla + função de CallBack (onkey) */
  mapKeyPress?: Array<mapKeyPressInterface>
  /** Conjunto de Erros - Recebe o campoID como chave */
  erros?: { [key: string]: string },
  /** CallBack de OnChange - não é realizado setState em caso de envio deste CallBack */
  onChange?: (v: T) => void,
  /** Valor Padrão Quando Não Selecinada Opção */
  valorPadraoCampoEmBranco?: number | string
  /** Mensagem Exibida Quando Não Selecinada Opção */
  mensagemPadraoCampoEmBranco?: string
  /** Função pra Detecção de KeyDown */
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement> | undefined
  /** Se permite uma opção fora da caixa de pesquisa / grupo de opções fornecidos - usuário digita nova opção */
  permitirNovaOpcao?: boolean
  /** Formatação do valor apresentado como option - Caso contrário apresenta o campo option[campoDescricao] */
  formatarOption?: (opcao: T) => string
  /* Quando Teclar ENTER ou clicar no ícone de pesquisa */
  onClickPesquisa?: (v: string) => void
  //teste
  onSelect?: (v: any) => void
  //usando referência
  Ref?: React.Ref<unknown> | undefined
  /**Quando o componente recebe o foco */
  onFocus?: (v: any) => void
  /**Define uma tamanho para a fonte */
  tamanhoFonte?: number
  /**Quando o componente perder o foco */
  onBlur?: (v: any) => void
  //usando referência
  inputRef?: React.Ref<unknown> | undefined
  //Definição de uma cor para o fundo do componente
  corFundo?: string
  corFonte?: string
  textAlign?: "left" | "right" | "center"
  labelAlign?: "left" | "right" | "center"
  //definições de borda
  boderRadius?: string
  borderWidth?: string
  borderColor?: string
  //minWidth?: number,
  // maxHeight?: number,
}

const onKey = (key: string, mapKeyPress: Array<mapKeyPressInterface>, pesquisa: string) => {
  if (mapKeyPress.length > 0) {
    let encontrou: boolean = false
    for (let contador: number = 0; contador < mapKeyPress.length && !encontrou; contador++) {
      if (mapKeyPress[contador].key === key) {
        encontrou = true
        mapKeyPress[contador].onKey(pesquisa)
      }
    }
  }
}


export default function ComboBox<T>(
  {
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
    onClickPesquisa = undefined,
    onSelect,
    Ref,
    inputRef,
    onFocus = undefined,
    tamanhoFonte = 16,
    onBlur,
    corFundo = "#010108",
    corFonte = '#fff',
    textAlign = 'left',
    labelAlign = 'left',
    boderRadius = '1',
    borderColor = '#3a3a3a',
    borderWidth = '1',
    //minWidth = 300,
    // maxHeight = 35,
  }: ComboBoxInterface<T>) {


  const exibirIconePesquisa = () => {
    return (
      <InputAdornment position={'start'}>
        <IconButton
          sx={{ margin: 0, padding: 0 }}
          onClick={() => {
            if (onClickPesquisa) {
              onClickPesquisa(pesquisa)
            }
          }}
        >
          <Icon sx={{ margin: 0, padding: 0 }}>search</Icon>
        </IconButton>
      </InputAdornment>
    )
  }

  const [pesquisa, setPesquisa] = useState('')
  const chaveLista = useRef(0)

  return (
    <>
      <Autocomplete
        sx={{
          fontSize: tamanhoFonte,
          color: corFonte,
          // minWidth: minWidth,
          // maxHeight: maxHeight,
          borderRadius: boderRadius,
          bgcolor: corFundo,

        }}
        componentsProps={{
          paper: {
            sx: {
              border: `${borderWidth}px solid ${borderColor}`,
              borderRadius: boderRadius,
              bgcolor: corFundo || 'background.paper',
            },
          },
        }}
        autoFocus={autoFocus}
        ref={Ref}
        onSelect={(e) => {
          if (onSelect) {
            onSelect(e)
          }
        }}
        onFocus={(e) => {
          if (onFocus) {
            onFocus(e)
          }
        }}
        onBlur={(e) => {
          if (onBlur) {
            onBlur(e)
          }
        }}
        clearOnEscape
        disabled={disabled}
        value={dados[field]}
        //disablePortal
        id={id}
        onKeyDown={onKeyDown}
        getOptionLabel={(opcao) => {

          // Verifica se é um número e igual ao valor padrão
          if (typeof opcao === 'number' && opcao === valorPadraoCampoEmBranco) {
            return mensagemPadraoCampoEmBranco;

            // Verifica se é um número e tenta encontrar a correspondência
          } else if (typeof opcao === 'number') {
            const retorno = opcoes.find((v) => v[campoID] === opcao);
            return retorno ? String(retorno[campoDescricao]) : 'Sem Correspondência';

            // Verifica se é uma string e tenta encontrar a correspondência
          } else if (typeof opcao === 'string') {
            const retorno = opcoes.find((v) => v[campoID] === opcao);
            return retorno ? String(retorno[campoDescricao]) : opcao;

            // Verifica se é um objeto que contém a propriedade `campoDescricao`
          } else if (typeof opcao === 'object' && opcao !== null && campoDescricao in opcao) {
            return String(opcao[campoDescricao]);

            // Qualquer outro tipo de valor
          } else {
            return 'Erro na Opção....';
          }
        }}

        onChange={(_e, v) => {
          if (onChange) {
            onChange(v)
          } else if (setState) {
            const tmpDados = { ...dados }
            tmpDados[field] = v ? v[campoID] : valorPadraoCampoEmBranco
            setState({ ...tmpDados })
          }
        }
        }
        isOptionEqualToValue={(opcao, valor) => {
          const retorno = permitirNovaOpcao ? true : valor ? opcao[campoID] === (typeof valor === 'object' ? valor[campoID] : valor) : true
          return retorno
        }}
        options={opcoes}
        renderOption={(props, option) => {
          return (
            <li {...props} key={++chaveLista.current}>
              {formatarOption ? formatarOption(option) : option[campoDescricao]}
            </li>
          );
        }}
        inputValue={pesquisa}
        onInputChange={(_event: React.SyntheticEvent, value: string, reason: string) => {
          if (value) { setPesquisa(value) } else { setPesquisa('') }
        }}
        slotProps={{
          popper: {
            sx: {
              '& .MuiAutocomplete-listbox': {
                backgroundColor: corFundo || '#fff',
                color: '#fff',
              },
            },
          },
        }}

        renderInput=
        {
          (params) => (

            <FormControl sx={{ width: "100%" }} >
              <Condicional condicao={typeof label === 'string' && label.length > 0}>
                <Typography
                  variant='body2'
                  textAlign={labelAlign}
                  sx={{
                    //minWidth: minWidth,
                    // maxHeight: maxHeight,
                    // mt:
                    //   theme && theme.inputs && theme.inputs.marginTop
                    //     ? theme.inputs.marginTop
                    //     : 0,
                    fontSize: tamanhoFonte,
                    ml: 0,
                  }}
                >
                  {label}
                </Typography>
              </Condicional>

              <TextField
                {...params}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: boderRadius,
                    '& fieldset': {
                      borderColor: borderColor, // cor da borda normal
                      borderWidth: borderWidth,
                    },
                    '&:hover fieldset': {
                      borderColor: borderColor, // cor da borda no hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: borderColor, // cor da borda quando focado
                    },
                    backgroundColor: corFundo,
                  },
                  '& .MuiInputBase-input': {
                    fontSize: tamanhoFonte,
                    textAlign: textAlign,
                  },
                  '& .MuiInputBase-root.Mui-disabled': {
                    backgroundColor: '#c99999',
                    color: 'red', // Cor da fonte
                  },
                  '& .MuiInputBase-input.Mui-disabled': {
                    color: 'red', // Cor do input em si
                  },
                  '& .MuiFormLabel-root.Mui-disabled': {
                    color: 'red', // Cor do label
                  },
                  '& .MuiAutocomplete-endAdornment svg': {
                    color: corFonte, // ou qualquer outra cor (hex, rgb, theme.palette)
                  },
                }}
                size='small'
                placeholder={placeholder}
                type="text"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: onClickPesquisa ?
                    <>{exibirIconePesquisa()}</> : <></>
                }}
                onKeyDown={(ev) => onKey(ev.key, mapKeyPress, pesquisa)}
                inputRef={inputRef}
              />

              <Condicional condicao={typeof erros[field] !== 'undefined'}>
                <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
              </Condicional>

            </FormControl>
          )}
      />
    </>
  )
}