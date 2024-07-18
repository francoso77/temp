import { Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import ComboBox from '../../Componentes/ComboBox';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { UnidadeMedidaInterface } from '../../../../jb_backend/src/interfaces/unidadeMedidaInteface';
import { TipoProdutoInterface } from '../../../../jb_backend/src/interfaces/tipoProdutoInterface';


export default function Produto() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const ResetDados: ProdutoInterface = {
    nome: '',
    idUnidade: 0,
    localizacao: '',
    largura: 0,
    gm2: 0,
    ativo: false,
    idTipoProduto: 0,

  }
  interface PesquisaInterface {
    nome: string
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<ProdutoInterface>>([])
  const [erros, setErros] = useState({})
  const [produto, setProduto] = useState<ProdutoInterface>(ResetDados)
  const [rsUnidade, setRsUnidade] = useState<Array<UnidadeMedidaInterface>>([])
  const [rsTipoProduto, setRsTipoProduto] = useState<Array<TipoProdutoInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'produto_nome'
    },
    {
      cabecalho: 'Unidade',
      alinhamento: 'left',
      campo: 'unidadeMedida_sigla',
    },
    {
      cabecalho: 'Tipo Produto',
      alinhamento: 'left',
      campo: 'tipoProduto_nome',
    },
    {
      cabecalho: 'Localização',
      alinhamento: 'left',
      campo: 'localizacao',
    },
    {
      cabecalho: 'Ativo',
      alinhamento: 'left',
      campo: 'ativo',
      format: (v: boolean) => { return v ? 'Sim' : 'Não' }
    },
  ]

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const pesquisarID = (id: string | number): Promise<ProdutoInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Produto",
        criterio: {
          idProduto: id,
        },
      })
      .then((rs: Array<ProdutoInterface>) => {
        return rs[0]
      })
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProduto(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProduto(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setProduto(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setProduto(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('nome', produto, erros, retorno, 'Nome do produto não pode ser vázio')
    retorno = validaCampo.naoVazio('idUnidade', produto, erros, retorno, 'Informe uma Unidade')
    retorno = validaCampo.naoVazio('idTipoProduto', produto, erros, retorno, 'Informe um Tipo')

    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    clsCrud
      .pesquisar({
        entidade: "Produto",
        criterio: {
          nome: "%".concat(produto.nome).concat("%"),
        },
        camposLike: ["nome"],
        select: ["nome"],
        msg: 'Pesquisando produtos ...',
        setMensagemState: setMensagemState
      })
      .then((rs) => {
        if (rs.length > 0 && localState.action === actionTypes.incluindo) {
          setMensagemState({
            titulo: 'Erro...',
            exibir: true,
            mensagem: 'Item já cadastrado!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        } else {

          if (validarDados()) {

            if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
              clsCrud.incluir({
                entidade: "Produto",
                criterio: produto,
                localState: localState.action,
                cb: () => btPesquisar(),
                setMensagemState: setMensagemState
              })
                .then((rs) => {
                  if (rs.ok) {
                    setLocalState({ action: actionTypes.pesquisando })
                  } else {
                    setMensagemState({
                      titulo: 'Erro...',
                      exibir: true,
                      mensagem: 'Erro no cadastro - Consulte Suporte',
                      tipo: MensagemTipo.Error,
                      exibirBotao: true,
                      cb: null
                    })
                  }
                })
            } else if (localState.action === actionTypes.excluindo) {
              clsCrud.excluir({
                entidade: "Produto",
                criterio: {
                  idProduto: produto.idProduto
                },
                cb: () => btPesquisar(),
                setMensagemState: setMensagemState
              })
                .then((rs) => {
                  if (rs.ok) {
                    setLocalState({ action: actionTypes.pesquisando })
                  } else {
                    setMensagemState({
                      titulo: 'Erro...',
                      exibir: true,
                      mensagem: 'Erro no cadastro - Consulte Suporte',
                      tipo: MensagemTipo.Error,
                      exibirBotao: true,
                      cb: null
                    })
                  }
                })
            }
          }
        }
      })
  }

  const btPesquisar = () => {
    const query = `
      SELECT 
          p.*,
          p.nome AS produto_nome,
          um.sigla AS unidadeMedida_sigla,
          t.nome AS tipoProduto_nome
      FROM 
          produtos p
      INNER JOIN 
          tipoprodutos t ON t.idTipoProduto = p.idTipoProduto
      INNER JOIN 
          unidademedidas um ON um.idUnidade = p.idUnidade
      WHERE 
          p.nome LIKE '%${pesquisa.nome}%' ;
      `;
    clsCrud
      .query({
        entidade: "Produto",
        sql: query,
        msg: 'Pesquisando Produtos ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      })
  }
  // const btPesquisar = () => {
  //   clsCrud
  //     .query({
  //       entidade: "Produto",
  //       criterio: {
  //         nome: "%".concat(pesquisa.nome).concat("%"),
  //       },
  //       camposLike: ["nome"],
  //       joins: [
  //         { tabelaRelacao: 'produto.tipoProduto', relacao: 'tipoProduto' },
  //         { tabelaRelacao: 'produto.unidadeMedida', relacao: 'unidadeMedida' },
  //       ],
  //       select: [
  //         "idProduto",
  //         "produto.nome",
  //         "unidadeMedida.sigla",
  //         "tipoProduto.nome",
  //         "localizacao",
  //         "largura",
  //         "gm2",
  //         "ativo",
  //       ],
  //       msg: 'Pesquisando produtos ...',
  //       setMensagemState: setMensagemState
  //     })
  //     .then((rs: Array<any>) => {
  //       setRsPesquisa(rs)
  //     })
  // }
  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Cadastro de Produtos',
      pathTitulo: '/',
      pathTituloAnterior: '/Produto'
    })
    irPara('/')
  }

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "UnidadeMedida",
        criterio: {
          nome: "%".concat("%"),
        },
        camposLike: ["nome"],
      })
      .then((rs: Array<UnidadeMedidaInterface>) => {
        setRsUnidade(rs)
      })

    clsCrud
      .pesquisar({
        entidade: "TipoProduto",
        criterio: {
          nome: "%".concat("%"),
        },
        camposLike: ["nome"],
      })
      .then((rs: Array<TipoProdutoInterface>) => {
        setRsTipoProduto(rs)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  return (

    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>

        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={11}>
              <InputText
                label="Pesquisa"
                tipo="uppercase"
                dados={pesquisa}
                field="nome"
                setState={setPesquisa}
                iconeEnd='searchicon'
                onClickIconeEnd={() => btPesquisar()}
                mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
                autoFocus
              />
            </Grid>
            <Grid item xs={1}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 4, ml: { xs: 0, md: 2 } }}
                  onClick={() => btIncluir()}
                >
                  <AddCircleIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <DataTable
                cabecalho={cabecalhoForm}
                dados={rsPesquisa}
                acoes={[
                  {
                    icone: "edit",
                    onAcionador: (rs: ProdutoInterface) =>
                      onEditar(rs.idProduto as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: ProdutoInterface) =>
                      onExcluir(rs.idProduto as number),
                    toolTip: "Excluir",
                  },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          </Condicional>

          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Produto"
                tipo="uppercase"
                dados={produto}
                field="nome"
                setState={setProduto}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={80}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsUnidade}
                campoDescricao="sigla"
                campoID="idUnidade"
                dados={produto}
                mensagemPadraoCampoEmBranco="Escolha uma unidade de medida"
                field="idUnidade"
                label="Unidade"
                erros={erros}
                setState={setProduto}
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsTipoProduto}
                campoDescricao="nome"
                campoID="idTipoProduto"
                dados={produto}
                mensagemPadraoCampoEmBranco="Escolha um Tipo"
                field="idTipoProduto"
                label="Tipo de Produto"
                erros={erros}
                setState={setProduto}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Localização"
                tipo="uppercase"
                dados={produto}
                field="localizacao"
                setState={setProduto}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={10}
              />
            </Grid>
            <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                label="Largura"
                dados={produto}
                field="largura"
                setState={setProduto}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                scale={2}
              />
            </Grid>
            <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                label="G/M²"
                dados={produto}
                field="gm2"
                setState={setProduto}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                scale={2}
              />
            </Grid>
            <Grid item xs={3} md={3} sx={{ ml: 8, mt: 5 }}>
              <InputText
                label="Ativo"
                tipo="checkbox"
                dados={produto}
                field="ativo"
                setState={setProduto}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
              <Tooltip title={'Cancelar'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: 2 }}
                  onClick={() => btCancelar()}
                >
                  <CancelRoundedIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
              <Condicional condicao={['incluindo', 'editando'].includes(localState.action)}>
                <Tooltip title={'Confirmar'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 3, ml: 2 }}
                    onClick={() => btConfirmar()}
                  >
                    <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Tooltip>
              </Condicional>

              <Condicional condicao={localState.action === 'excluindo'}>
                <Tooltip title={'Excluir'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 3, ml: 2 }}
                    onClick={() => btConfirmar()}
                  >
                    <DeleteIcon sx={{ fontSize: 60 }} />
                  </IconButton>
                </Tooltip>
              </Condicional>
            </Grid>
          </Condicional>
        </Grid>
      </Paper >
      {/* {JSON.stringify(produto)} */}
    </Container >
  )
}
