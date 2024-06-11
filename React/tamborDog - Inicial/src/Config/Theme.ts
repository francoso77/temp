import { createTheme } from "@mui/material"
import { ptBR } from '@mui/material/locale'

export const THEME = createTheme({
  components: {
    MuiIconButton: {
      defaultProps: {
        color: 'secondary',
        style: { height: '35px', width: '35px' }
      }
    }
  },
  menu: {
    corIcone: '#de8e1f',
    tamanhoIcone: 40
  },
  mensagens: {
    corWarning: 'orange',
    corError: 'red',
    corInfo: 'blue',
    corSuccess: 'green',
    corFundo: 'black',
    corTitulo: 'black',
    corMensagem: 'gray',
    tamanhoIcone: 50
  },
  palette: {
    primary: {
      main: '#de8e1f'
    },
    secondary: {
      main: '#f1d1a5'
    }
  }
}, ptBR);

declare module '@mui/material/styles' {
  interface Theme {
    menu: {
      corIcone: string;
      tamanhoIcone: number;
    },
    mensagens: {
      corWarning: string
      corError: string
      corInfo: string
      corSuccess: string
      corFundo: string
      corTitulo: string
      corMensagem: string
      tamanhoIcone: number
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    menu?: {
      corIcone?: string;
      tamanhoIcone?: number;
    },
    mensagens: {
      corWarning: string
      corError: string
      corInfo: string
      corSuccess: string
      corFundo: string
      corTitulo: string
      corMensagem: string
      tamanhoIcone: number
    };
  }
}