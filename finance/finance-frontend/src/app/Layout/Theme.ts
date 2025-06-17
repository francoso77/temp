import { createTheme } from "@mui/material"
import { ptBR } from '@mui/material/locale'

const enum CORES {
  laranja = "#DC7B3F",
  cinza = "#A0A0A0",
  verdeAgua = "#0FB1AD",
  verde = "#28a745",
  azulEscuro = "#3c486b",
  vermelho = "#e74c3c",
  cinzaClaro = "#F4F4F5",
  vermelhoNSC = '#e15244',
}

export const THEME = createTheme({

  typography: {
    fontFamily: ["Roboto", "Open Sans"].join(","),
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fff',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fff',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fff',
          },
        },
        input: {
          color: '#fff',
        },
      },
    },

    MuiIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#fff',
          '&.Mui-checked': {
            color: '#fff',
          },
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        regular: {
          height: "12px",
          // width: "20px",
          minHeight: "32px",
          "@media (min-width: 600px)": {
            minHeight: "48px",
          },
          // backgroundColor: ,
          // color: "red",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        color: "primary",
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'secondary',
        style: { height: '45px', width: '45px' }
      },
      styleOverrides: {
        root: {
          color: 'secondary', //' #DC7B3F', // cor padrão
          '&:hover': {
            color: 'rgb(8, 189, 221)', // cor ao passar o mouse
            backgroundColor: '#1976d2', // fundo ao passar o mouse
          },
          style: { height: '35px', width: '35px' }
        },
      },
    }
  },
  cores: {
    cinzaFundo: CORES.cinzaClaro,
    cinzaTexto: CORES.cinza,

  },
  inputs: {
    marginTop: 1,
  },
  menu: {
    corIcone: CORES.azulEscuro
  },
  mensagens: {
    corWarning: CORES.laranja,
    corError: CORES.vermelho,
    corInfo: CORES.verdeAgua,
    corSuccess: CORES.verde,
    corFundo: CORES.azulEscuro,
    corTitulo: CORES.verdeAgua,
    corMensagem: CORES.laranja,
    tamanhoIcone: 50,
  },
  palette: {
    primary: {
      main: CORES.cinzaClaro
      //main: CORES.vermelhoNSC
    },
    secondary: {
      main: CORES.azulEscuro
    },
    background: {
      default: CORES.azulEscuro,
    },
    action: {
      disabledBackground: CORES.azulEscuro,
      disabled: CORES.azulEscuro,
    },
  },
}, ptBR);

declare module "@mui/material/styles" {
  interface Theme {
    cores: {
      cinzaFundo: string
      cinzaTexto: string
    }
    menu: {
      corIcone: string
    }
    inputs: {
      marginTop: number
    }
    mensagens: {
      corWarning: string
      corError: string
      corInfo: string
      corSuccess: string
      corFundo: string
      corTitulo: string
      corMensagem: string
      tamanhoIcone: number
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    cores: {
      cinzaFundo: string
      cinzaTexto: string
    }

    inputs: {
      marginTop: number
    }
    menu: {
      corIcone: string
    }
    mensagens: {
      corWarning: string
      corError: string
      corInfo: string
      corSuccess: string
      corFundo: string
      corTitulo: string
      corMensagem: string
      tamanhoIcone: number
    }
  }
}