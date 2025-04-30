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
    corIcone: '#e15244',
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
      main: '#e15244'
    },
    secondary: {
      main: '#ba655d'
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