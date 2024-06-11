import axios from 'axios';
import { dadosCepInterface } from '../interfaces/dadosCepInterface';

export let dados: dadosCepInterface = {
  _cep: '',
  _logradouro: '',
  _complemento: '',
  _bairro: '',
  _localidade: '',
  _uf: '',
}

export class ClsViaCep {

  public buscaCep(auxCep: string) {
    axios.get(auxCep)
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
          this.montaDados(dados)
        } else {
          console.log('erro na requisição!')
        }
      })
      .catch(erro => {
        console.log(erro.message)
      })
  }

  public montaDados(cep: dadosCepInterface): dadosCepInterface {
    return cep
  }
}

