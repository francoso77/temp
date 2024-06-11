import { ClsViaCep, dados } from './utils/ClsViaCep';

const cep: ClsViaCep = new ClsViaCep();

cep.buscaCep('http://viacep.com.br/ws/35500530/json/')

