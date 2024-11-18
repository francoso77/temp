import { useEffect, useRef, useState } from 'react'
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface'
import { CorInterface } from '../../../../jb_backend/src/interfaces/corInteface'
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import ClsApi from '../../Utils/ClsApi'
import ClsCrud from '../../Utils/ClsCrudApi'
import { Box, Grid, IconButton, Paper, SelectChangeEvent } from '@mui/material'
import ComboBox from '../../Componentes/ComboBox'
import InputText from '../../Componentes/InputText'
import CloseIcon from '@mui/icons-material/Close'
import { TipoProdutoTypes } from '../../types/tipoProdutoypes'
import OperatorSelect, { Operator } from '../../Componentes/OperatorSelect'

interface PesquisaInterface {
  idProduto: number
  idPessoa_fornecedor: number
  idCor: number
  idTipoProduto: number
  qtd: number
  operador: Operator

}

const dadosInterface: PesquisaInterface = {
  idProduto: 0,
  idCor: 0,
  idPessoa_fornecedor: 0,
  operador: ">",
  qtd: 0,
  idTipoProduto: 0
}

export const ConsultaEstoque = () => {

  const clsFormatacao = new ClsFormatacao()
  const clsApi = new ClsApi()
  const clsCrud = new ClsCrud()

  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const [rsProdutos, setRsProdutos] = useState<Array<ProdutoInterface>>([])
  const [rsCores, setRsCores] = useState<Array<CorInterface>>([])
  const [rsFornecedores, setRsFornecedores] = useState<Array<PessoaInterface>>([])
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [dados, setDados] = useState(dadosInterface)

  const handleOperatorChange = (event: SelectChangeEvent<Operator>) => {
    setDados({ ...dados, operador: event.target.value as Operator });
  };
  const BuscarDados = () => {

    clsCrud.pesquisar({
      entidade: 'Produto',
      campoOrder: ['nome'],
    })
      .then((rsProdutos: Array<ProdutoInterface>) => {
        setRsProdutos(rsProdutos)
      })

    clsCrud.pesquisar({
      entidade: 'Cor',
      campoOrder: ['nome'],
    })
      .then((rsCores: Array<CorInterface>) => {
        setRsCores(rsCores)
      })

    clsCrud.pesquisar({
      entidade: 'Pessoa',
      campoOrder: ['nome'],
    })
      .then((rsFornecedores: Array<PessoaInterface>) => {
        setRsFornecedores(rsFornecedores)
      })
  }

  const btFechar = () => {

  }

  const btPulaCampo = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter') {
      const nextField = fieldRefs.current[index];
      if (nextField) {
        const input = nextField.querySelector('input');
        if (input) {
          input.focus();
        }
      }
    }
  }

  const btPesquisar = () => {

    const produto = dados.idProduto !== 0 ? dados.idProduto : null
    const cor = dados.idCor !== 0 ? dados.idCor : null

    clsCrud.pesquisar(
      {
        entidade: "Estoque",
        criterio: {
          idProduto: produto,
          idCor: cor
        }
      }
    )
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      })
  }
  useEffect(() => {
    BuscarDados()
  }, [])

  return (
    <div>
      <Paper variant="outlined" sx={{ padding: 0.5, m: 0.5 }}>
        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: 0, mr: -5, mb: -5 }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 0.5 }}>
            <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
              <ComboBox
                opcoes={rsProdutos}
                campoDescricao="nome"
                campoID="idProduto"
                dados={dados}
                mensagemPadraoCampoEmBranco=""
                field="idProduto"
                label="Produtos"
                erros={erros}
                setState={setDados}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event) => btPulaCampo(event, 1)}
                onSelect={btPesquisar}

                tamanhoFonte={25}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 0.5 }} >
            <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
              <ComboBox
                opcoes={rsCores}
                campoDescricao="nome"
                campoID="idCor"
                dados={dados}
                mensagemPadraoCampoEmBranco=""
                field="idCor"
                label="Cores"
                erros={erros}
                setState={setDados}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event) => btPulaCampo(event, 2)}
                tamanhoFonte={25}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 0.5 }} >
            <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
              <ComboBox
                opcoes={TipoProdutoTypes}
                campoDescricao="descricao"
                campoID="idTipoProduto"
                dados={dados}
                mensagemPadraoCampoEmBranco=""
                field="idTipoProduto"
                label="Tipo Produto"
                erros={erros}
                setState={setDados}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event) => btPulaCampo(event, 3)}
                tamanhoFonte={25}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 0.5 }}>
            <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
              <ComboBox
                opcoes={rsFornecedores}
                campoDescricao="nome"
                campoID="idPessoa"
                dados={dados}
                mensagemPadraoCampoEmBranco=""
                field="idPessoa_fornecedor"
                label="Fornecedor"
                erros={erros}
                setState={setDados}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event: any) => btPulaCampo(event, 4)}
                tamanhoFonte={25}
              />
            </Box>
          </Grid>
          <Paper sx={{ padding: 1, ml: 1.5, mt: 1.5, width: '100%' }} variant="outlined" >
            <Grid container direction="row" spacing={2}>
              <Grid item xs={12} md={6} sx={{ mt: 0.5 }}>
                <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                  <OperatorSelect
                    value={dados.operador}
                    onChange={handleOperatorChange}
                    label='Operador'
                    tamanhoFonte={25}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ mt: 0.5 }}>
                <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                  <InputText
                    tipo='uppercase'
                    label="Quantidade"
                    dados={dados}
                    field="qtd"
                    setState={setDados}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 0)}
                    tamanhoFonte={25}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Paper>
      {JSON.stringify(dados)}
    </div>
  )
}