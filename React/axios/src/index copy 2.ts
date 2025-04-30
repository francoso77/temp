import axios from 'axios';
import { dadosCepInterface } from './interfaces/dadosCepInterface';



var dados: dadosCepInterface = {
  _cep: '',
  _logradouro: '',
  _complemento: '',
  _bairro: '',
  _localidade: '',
  _uf: '',
}

axios.get('http://viacep.com.br/ws/35500530/json/')
  .then(rs => {
    if (rs.statusText == 'OK') {
      dados = {
        _cep: rs.data.cep,
        _logradouro: rs.data.logradouro,
        _complemento: rs.data.complemento,
        _bairro: rs.data.bairro,
        _localidade: rs.data.localidade,
        _uf: rs.data.uf,
      }
      montaTabela(dados)
    }
  })
  .catch(erro => {
    console.log(erro.message)
  })

function montaTabela(dadosCep: dadosCepInterface) {

  console.log(dadosCep)
}