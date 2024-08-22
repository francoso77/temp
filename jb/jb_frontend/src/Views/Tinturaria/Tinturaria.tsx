import { useState } from 'react'
import { TinturariaInterface } from '../../../../jb_backend/src/interfaces/tinturariaInterface'
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface'
import ClsCrud from '../../Utils/ClsCrudApi'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import ClsValidacao from '../../Utils/ClsValidacao'

export function Tinturaria() {

  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()
  const validarCampos = new ClsValidacao()

  const ResetDados: TinturariaInterface = {
    dataTinturaria: '',
    idPessoa_cliente: 0,
    idPessoa_fornecedor: 0,
    detalheTinturarias: []
  }
  const [tinturaria, setTinturaria] = useState<TinturariaInterface>(ResetDados)
  const [rsCliente, setRsCliente] = useState<Array<PessoaInterface>>([])
  const [rsFornecedor, setRsFornecedor] = useState<Array<PessoaInterface>>([])

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        criterio: {
          tipoPessoa: ['J', 'C']
        },
        notOrLike: 'I'
      }).then((rsClientes: Array<PessoaInterface>) => {
        if (rsClientes.length > 0) {
          setRsCliente(rsClientes)
        }
      })

    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        criterio: {
          tipoPessoa: ['F']
        },
      }).then((rsFornecedores: Array<PessoaInterface>) => {
        if (rsFornecedores.length > 0) {
          setRsFornecedor(rsFornecedores)
        }
      })
  }
  return (
    <>
    </>
  )
}