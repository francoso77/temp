import { useContext, useEffect, useRef, useState } from 'react'
import { ProdutoInterface } from '../../Interfaces/produtoInterface'
import { CorInterface } from '../../Interfaces/corInteface'
import { PessoaInterface } from '../../Interfaces/pessoaInterface'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import ClsApi from '../../Utils/ClsApi'
import ClsCrud from '../../Utils/ClsCrudApi'
import { Box, Collapse, Grid, IconButton, Paper, SelectChangeEvent, Stack, Tooltip, Typography } from '@mui/material'
import ComboBox from '../../Componentes/ComboBox'
import InputText from '../../Componentes/InputText'
import CloseIcon from '@mui/icons-material/Close'
import { TipoProdutoTypes } from '../../types/tipoProdutoypes'
import OperatorSelect, { Operator } from '../../Componentes/OperatorSelect'
import ContentPasteSearchTwoToneIcon from '@mui/icons-material/ContentPasteSearchTwoTone'
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable'
import { useNavigate } from 'react-router-dom'
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal'
import { FilterList } from '@mui/icons-material'

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


  const clsCrud = new ClsCrud()
  const clsApi = new ClsApi()
  const clsFormatacao = new ClsFormatacao()

  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const [rsProdutos, setRsProdutos] = useState<Array<ProdutoInterface>>([])
  const [rsCores, setRsCores] = useState<Array<CorInterface>>([])
  const [rsFornecedores, setRsFornecedores] = useState<Array<PessoaInterface>>([])
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [dados, setDados] = useState(dadosInterface)
  const { setMensagemState, setLayoutState, layoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [showFilters, setShowFilters] = useState(false);


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'idProduto',
      format: (_v, rs: any) => rsProdutos.find(v => v.idProduto === rs.idProduto)?.nome
    },
    {
      cabecalho: 'Cor',
      alinhamento: 'left',
      campo: 'idCor',
      format: (_v, rs: any) => rsCores.find(v => v.idCor === rs.idCor)?.nome
    },
    {
      cabecalho: 'Fornecedor',
      alinhamento: 'left',
      campo: 'idPessoa_fornecedor',
      format: (_v, rs: any) => rsFornecedores.find(v => v.idPessoa === rs.idPessoa_fornecedor)?.nome
    },
    {
      cabecalho: 'Estoque',
      alinhamento: 'right',
      campo: 'totalQtd',
      format: (_v, rs: any) => clsFormatacao.currency(rs.totalQtd)
    },
    {
      cabecalho: '',
      alinhamento: 'left',
      campo: ''
    },
  ]

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

    const idProduto = dados.idProduto !== 0 ? dados.idProduto : null
    const idCor = dados.idCor !== 0 ? dados.idCor : null
    const idFornecedor = dados.idPessoa_fornecedor !== 0 ? dados.idPessoa_fornecedor : null
    const tipoProduto = dados.idTipoProduto !== 0 ? dados.idTipoProduto : null
    const operador = dados.operador ? dados.operador : null
    const qtdComparar = dados.qtd !== 0 ? dados.qtd : null


    clsApi.execute<any>({
      method: 'post',
      url: 'produtosEmEstoque',
      idProduto,
      idCor,
      idFornecedor,
      tipoProduto,
      operador,
      qtdComparar
    })
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
        setShowFilters(false)
      })
  }

  const btLimpar = () => {
    setDados({ ...dadosInterface, qtd: 0 })
  }

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Consulta Estoques de Produtos',
      pathTitulo: '/',
      pathTituloAnterior: '/ConsultaEstoque'
    })
    irPara('/')
  }


  useEffect(() => {
    BuscarDados()
    setLayoutState({
      ...layoutState,
      titulo: 'Consulta Estoques de Produtos',
      tituloAnterior: '',
      pathTitulo: '/ConsultaEstoque',
      pathTituloAnterior: '/'
    })
  }, [])

  return (
    <div>
      <Paper variant="outlined" sx={{ padding: 1, m: 1, borderRadius: 2 }}>
        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: 1, mr: 1 }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={() => setShowFilters((prev) => !prev)}>
                  <FilterList color='warning' />
                </IconButton>
                <Typography variant="h5">Filtros de Análise</Typography>
                <Tooltip title={'Pesquisar'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 1.5, ml: 6 }}
                    onClick={() => btPesquisar()}
                  >
                    <ContentPasteSearchTwoToneIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Collapse in={showFilters}>
                <Paper variant="outlined" sx={{ padding: 1, m: 1, borderRadius: 2 }}>
                  <Grid container spacing={2} >
                    <Grid item xs={12} sm={4} sx={{ mt: -2 }}>
                      <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                        <ComboBox
                          opcoes={rsProdutos}
                          campoDescricao="nome"
                          campoID="idProduto"
                          dados={dados}
                          mensagemPadraoCampoEmBranco=""
                          field="idProduto"
                          label="Produtos"
                          setState={setDados}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event) => btPulaCampo(event, 1)}
                          tamanhoFonte={15}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ mt: -2 }}>
                      <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                        <ComboBox
                          opcoes={rsCores}
                          campoDescricao="nome"
                          campoID="idCor"
                          dados={dados}
                          mensagemPadraoCampoEmBranco=""
                          field="idCor"
                          label="Cores"
                          setState={setDados}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event) => btPulaCampo(event, 2)}
                          tamanhoFonte={15}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ mt: -2 }}>
                      <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                        <ComboBox
                          opcoes={TipoProdutoTypes}
                          campoDescricao="descricao"
                          campoID="idTipoProduto"
                          dados={dados}
                          mensagemPadraoCampoEmBranco=""
                          field="idTipoProduto"
                          label="Tipo Produto"
                          setState={setDados}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event) => btPulaCampo(event, 3)}
                          tamanhoFonte={15}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ mt: -2 }}>
                      <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                        <ComboBox
                          opcoes={rsFornecedores}
                          campoDescricao="nome"
                          campoID="idPessoa"
                          dados={dados}
                          mensagemPadraoCampoEmBranco=""
                          field="idPessoa_fornecedor"
                          label="Fornecedor"
                          setState={setDados}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 4)}
                          tamanhoFonte={15}
                        />
                      </Box>
                    </Grid>
                    <Paper sx={{ padding: 1, ml: 2, mt: 1, width: '100%' }} variant="outlined" >
                      <Grid container direction="row" spacing={2}>
                        <Grid item xs={12} md={6} sx={{ mt: -1 }}>
                          <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                            <OperatorSelect
                              value={dados.operador}
                              onChange={handleOperatorChange}
                              label='Operador'
                              tamanhoFonte={15}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ mt: -1 }} >
                          <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                            <InputText
                              tipo='uppercase'
                              label="Quantidade"
                              dados={dados}
                              field="qtd"
                              setState={setDados}
                              onFocus={(e) => e.target.select()}
                              onKeyDown={(event: any) => btPulaCampo(event, 0)}
                              tamanhoFonte={15}
                              onClickIconeEnd={() => btLimpar()}
                              iconeEnd='close_icon'
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Paper>
              </Collapse>
            </Stack>
          </Grid>
          <Grid item xs={12} >
            <DataTable
              cabecalho={cabecalhoForm}
              dados={rsPesquisa}
              acoes={[]}
              temTotal={true}
              colunaSoma={['totalQtd']}
              qtdColunas={6}

            />
          </Grid>
        </Grid>
      </Paper>
      {/* {JSON.stringify(dados)} */}
    </div>
  )
}