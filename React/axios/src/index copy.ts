//import { CalculadoraCls } from './utils/CalculadoraCls';

var primeiroValor: number = 0
const operadores: string[] = ['/', '*', '+', '-', 'C', '←', '=', '√', 'x²']
var operador: string = ''
var txtVisor: string = '0'
var temVirgula: boolean = false

function passaValor(bt: string): void {

  console.log('como tá o visor: ', txtVisor)
  console.log('tecla: ', bt)


  if (bt == ',') {
    temVirgula = true
  }
  if (!operadores.includes(bt)) {
    if (txtVisor == '0') {
      txtVisor = bt
    }
    else {
      // if (txtVisor == '0') {
      //   txtVisor = bt
      // } else if (bt == '0') {
      //   console.log('digitei zero')
      //   txtVisor = txtVisor.concat(bt)
      // } else {
      //   txtVisor = txtVisor.concat(bt)
      // }
      txtVisor = txtVisor.concat(bt)
    }
    formatar(bt)

  }

  else {

    limpaValor()
    if (bt == '←') {
      if (txtVisor.length == 0) {
        txtVisor = '0'
      } else {
        txtVisor = txtVisor.substring(0, txtVisor.length - 1)
        if (txtVisor.length == 0) txtVisor = '0'
      }
    }
    else if (bt == 'C') {
      txtVisor = '0'
    }
    else if (bt == '=') {
      if (!primeiroValor) {
        txtVisor = '0'
      } else {

        calcular(primeiroValor, parseFloat(txtVisor), operador)
        primeiroValor = 0
      }
    }
    else if (bt == '+') {
      primeiroValor = parseFloat(txtVisor)
      operador = '+'
      txtVisor = '0'
    }
    else if (bt == '-') {
      primeiroValor = parseFloat(txtVisor)
      operador = '-'
      txtVisor = '0'
    }
    else if (bt == '/') {
      primeiroValor = parseFloat(txtVisor)
      operador = '/'
      txtVisor = '0'
    }
    else if (bt == '*') {
      primeiroValor = parseFloat(txtVisor)
      operador = '*'
      txtVisor = '0'
    } else if (bt == '√') {
      if (txtVisor != '0') {
        primeiroValor = parseFloat(txtVisor)
        txtVisor = Math.sqrt(primeiroValor).toString()
      }
    } else if (bt == 'x²') {
      if (txtVisor != '0') {
        primeiroValor = parseFloat(txtVisor)
        txtVisor = (primeiroValor ** 2).toString()
      }
    }
    formatar(bt)
  }
}
function calcular(vr1: number, vr2: number, op: string): void {

  let resultado: number = 0
  if (op == '+') {
    resultado = vr1 + vr2
  } else if (op == '-') {
    resultado = vr1 - vr2
  } else if (op == '/') {
    if (vr1 == 0 || vr2 == 0) {
      resultado = 0
    } else {
      resultado = vr1 / vr2
    }
  } else if (op == '*') {
    resultado = vr1 * vr2
  }
  operador = ''
  txtVisor = resultado.toLocaleString('pt-br')
  formatar()
}
function formatar(bt?: string): void {
  const tela = document.querySelector('#txtVisor') as HTMLInputElement

  limpaValor()
  if (txtVisor == '0.') {
    if (bt) txtVisor = '0,'
    if (tela) tela.value = txtVisor

  } else {

    const valor: number = parseFloat(txtVisor)

    if (parseInt(txtVisor) != parseFloat(txtVisor)) {
      txtVisor = valor.toLocaleString('pt-br', { style: 'decimal', minimumFractionDigits: 0 })
    } else if (temVirgula && valor != 0) {
      txtVisor = valor.toLocaleString('pt-br', { style: 'decimal', minimumFractionDigits: 0 }).concat(',')
      temVirgula = false
    } else {
      if (txtVisor == '0.0') {
        txtVisor = '0,0'
      } else {

        txtVisor = valor.toLocaleString('pt-br', { style: 'decimal', minimumFractionDigits: 0 })
      }
    }
    if (tela) tela.value = txtVisor
  }

  console.log('resultado do visor - ', txtVisor)
}

function limpaValor(): void {
  if (txtVisor == ',') {
    txtVisor = '0,'
  }
  let vrString = txtVisor
  const tamanho: string[] = vrString.split('.')
  for (let x: number = 0; tamanho.length >= x; x++) {
    vrString = vrString.replace('.', '')
  }
  vrString = vrString.replace(',', '.')
  txtVisor = vrString

  console.log('valor tansformado ', txtVisor)
}
