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
import { EstruturaInterface } from '../../../../jb_backend/src/interfaces/estruturaInterface';
import { UnidadeMedidaInterface } from '../../../../jb_backend/src/interfaces/unidadeMedidaInteface';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { SqlEstruturaInterface } from '../../../../jb_backend/src/interfaces/sqlEstruturaInterface';
import DetalheEstrutura from './DetalheEstrutura';


export default function Estrutura() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const ResetDados: EstruturaInterface = {
    idUnidade: 0,
    idProduto: 0,
    qtdBase: 0,
    detalheEstruturas: []
  }
  interface PesquisaInterface {
    nome: string
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<SqlEstruturaInterface>>([])
  const [erros, setErros] = useState({})
  const [estrutura, setEstrutura] = useState<EstruturaInterface>(ResetDados)
  const [rsUnidade, setRsUnidade] = useState<Array<UnidadeMedidaInterface>>([])
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'idProduto',
      format: (_v, rs: any) => rs.produto.nome
    },
    {
      cabecalho: 'Unidade',
      alinhamento: 'left',
      campo: 'idUnidade',
      format: (_v, rs: any) => rs.unidadeMedida.sigla
    },
    {
      cabecalho: 'Qtd Base',
      alinhamento: 'left',
      campo: 'qtdBase',
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

  const pesquisarID = (id: string | number): Promise<EstruturaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Estrutura",
        relations: [
          "produto",
          "unidadeMedida",
          "detalheEstruturas",
          "detalheEstruturas.produto",
          "detalheEstruturas.cor"
        ],
        criterio: {
          idEstrutura: id,
        },
      })
      .then((rs: Array<EstruturaInterface>) => {
        return rs[0]
      })
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setEstrutura(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setEstrutura(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  // const onDetalhe = (id: string | number) => {
  //   pesquisarID(id).then((rs) => {
  //     setEstrutura(rs)
  //     setSelectedValue(rsPesquisa[0].produto_nome);
  //     setLocalState({ action: actionTypes.detalhes })
  //     setLayoutState({
  //       titulo: 'Composição de Estrutura',
  //       tituloAnterior: 'Estruturas de Produtos',
  //       pathTitulo: '/DetalheEstrutura',
  //       pathTituloAnterior: '/Estrutura'
  //     })
  //   })
  // }
  const btIncluir = () => {
    setEstrutura(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setEstrutura(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('qtdBase', estrutura, erros, retorno, 'Informe uma quantidade Base')
    retorno = validaCampo.naoVazio('idUnidade', estrutura, erros, retorno, 'Informe uma Unidade')
    retorno = validaCampo.naoVazio('idProduto', estrutura, erros, retorno, 'Informe o Produto')

    setErros(erros)
    return retorno
  }

  const testaSoma = (): boolean => {
    let somaQtd: number = 0
    estrutura.detalheEstruturas.forEach((i) => {
      somaQtd = somaQtd + i.qtd
    }
    )

    if (somaQtd === 0) {
      return true
    } else {

      if (somaQtd > estrutura.qtdBase || somaQtd < estrutura.qtdBase) {
        setMensagemState({
          titulo: 'Aviso',
          exibir: true,
          mensagem: 'A soma das quantidades informadas deve ser igual Qtd Base.',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null
        })
      }
    }
    return somaQtd * 1.0 === estrutura.qtdBase * 1.0;
  }

  const btConfirmar = () => {

    clsCrud
      .pesquisar({
        entidade: "Estrutura",
        criterio: {
          idProduto: estrutura.idProduto,
        },
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

          if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
            if (validarDados() && testaSoma()) {

              clsCrud.incluir({
                entidade: "Estrutura",
                criterio: estrutura,
                localState: localState,
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
          } else if (localState.action === actionTypes.excluindo) {
            clsCrud.excluir({
              entidade: "Estrutura",
              criterio: {
                idEstrutura: estrutura.idEstrutura
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
      })
  }

  const btPesquisar = () => {

    clsCrud
      .pesquisar({
        entidade: "Estrutura",
        relations: [
          "produto",
          "unidadeMedida",
          "detalheEstruturas",
          "detalheEstruturas.produto",
          "detalheEstruturas.cor"
        ],
        criterio: {
          idEstrutura: "%".concat(pesquisa.nome).concat("%"),
        },
        camposLike: ["idEstrutura"],
        msg: 'Pesquisando estruturas ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      })
  }

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Estruturas de Produtos',
      pathTitulo: '/',
      pathTituloAnterior: '/Estruturas'
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
        entidade: "Produto",
        criterio: {
          nome: "%".concat("%"),
        },
        camposLike: ["nome"],
      })
      .then((rs: Array<ProdutoInterface>) => {
        setRsProduto(rs)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  return (

    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={10}>
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
            <Grid item xs={2}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 4, ml: 1 }}
                  onClick={() => btIncluir()}
                  disabled={localState.action === 'excluindo' ? true : false}
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
                    onAcionador: (rs: EstruturaInterface) =>
                      onEditar(rs.idEstrutura as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: EstruturaInterface) =>
                      onExcluir(rs.idEstrutura as number),
                    toolTip: "Excluir",
                  },
                  // {
                  //   icone: "auto_awesome_motion_outlined",
                  //   onAcionador: (rs: DetalheEstruturaInterface) =>
                  //     onDetalhe(rs.idEstrutura as number),
                  //   toolTip: "Estrutura",
                  // },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsProduto}
                campoDescricao="nome"
                campoID="idProduto"
                dados={estrutura}
                mensagemPadraoCampoEmBranco="Escolha um Tipo"
                field="idProduto"
                label="Produto"
                erros={erros}
                disabled={localState.action === 'excluindo' ? true : false}
                setState={setEstrutura}
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsUnidade}
                campoDescricao="sigla"
                campoID="idUnidade"
                dados={estrutura}
                mensagemPadraoCampoEmBranco="Escolha uma unidade de medida"
                field="idUnidade"
                label="Unidade"
                erros={erros}
                disabled={localState.action === 'excluindo' ? true : false}
                setState={setEstrutura}
              />
            </Grid>
            <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                type='number'
                label="Qtd Base"
                dados={estrutura}
                field="qtdBase"
                setState={setEstrutura}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <DetalheEstrutura
                rsMaster={estrutura}
                setRsMaster={setEstrutura}
                masterLocalState={localState}
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
          {/* <Condicional condicao={localState.action === 'detalhes'}>
            <Grid item xs={12}>
              <ShowText
                titulo='Estrutura do Produto'
                descricao={selectedValue}
              />
              <DetalheEstrutura rsEstrutura={estrutura} setEstruturaState={setLocalState} />
            </Grid>
          </Condicional> */}
        </Grid>
      </Paper >
    </Container >
  )
}


// clsCrud.incluirComDetalhe({
//   entidadeMaster: "Estrutura",
//   master: estrutura,
//   entidadeDetalhe: "DetalheEstrutura",
//   detalhes: rsDetalheEstrutura,
//   id: "idEstrutura",
//   localState: localState.action,
//   cb: () => btPesquisar(),
//   setMensagemState: setMensagemState
// })
//   .then((rs) => {
//     if (rs.ok) {
//       setLocalState({ action: actionTypes.pesquisando })
//     } else {
//       setMensagemState({
//         titulo: 'Erro...',
//         exibir: true,
//         mensagem: 'Erro no cadastro - Consulte Suporte',
//         tipo: MensagemTipo.Error,
//         exibirBotao: true,
//         cb: null
//       })
//     }
//   })