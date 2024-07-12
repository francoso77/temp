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
import { StatusPedidoType } from '../../types/statusPedidoTypes';
import { DetalhePedidoInterface, PedidoInterface } from '../../../../jb_backend/src/interfaces/PedidoInterface';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import { PrazoEntregaInterface } from '../../../../jb_backend/src/interfaces/prazoEntregaInterface';
import ClsFormatacao from '../../Utils/ClsFormatacao';


export default function Pedido() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: PedidoInterface = {
    dataPedido: '',
    observacao: '',
    idPessoa_cliente: 0,
    idPessoa_vendedor: 0,
    idPrazoEntrega: 0,
    statusPedido: StatusPedidoType.aberto
  }
  interface PesquisaInterface {
    itemPesquisa: string
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [pedido, setPedido] = useState<PedidoInterface>(ResetDados)
  const [rsPrazo, setRsPrazo] = useState<Array<PrazoEntregaInterface>>([])
  const [rsCliente, setRsCliente] = useState<Array<PessoaInterface>>([])
  const [rsVendedor, setRsVendedor] = useState<Array<PessoaInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
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

  const pesquisarID = (id: string | number): Promise<PedidoInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Pedido",
        criterio: {
          idPedido: id,
        },
      })
      .then((rs: Array<PedidoInterface>) => {
        return rs[0]
      })
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setPedido(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setPedido(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const onDetalhe = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setPedido(rs)
      // setSelectedValue(rsPesquisa[0].produto_nome);
      setLocalState({ action: actionTypes.detalhes })
    })
  }
  const btIncluir = () => {
    setPedido(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setPedido(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataPedido', pedido, erros, retorno)
    retorno = validaCampo.naoVazio('idPessoa_cliente', pedido, erros, retorno, 'Informe um cliente')
    retorno = validaCampo.naoVazio('idPessoa_vendedor', pedido, erros, retorno, 'Informe um vendedor')
    retorno = validaCampo.naoVazio('idPrazoEntrega', pedido, erros, retorno, 'Defina um prazo')

    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    // clsCrud
    //   .pesquisar({
    //     entidade: "Pedido",
    //     criterio: {
    //       idPedido: pedido.idPedido,
    //     },
    //     msg: 'Pesquisando produtos ...',
    //     setMensagemState: setMensagemState
    //   })
    //   .then((rs) => {
    //     if (rs.length > 0 && localState.action === actionTypes.incluindo) {
    //       setMensagemState({
    //         titulo: 'Erro...',
    //         exibir: true,
    //         mensagem: 'Item já cadastrado!',
    //         tipo: MensagemTipo.Error,
    //         exibirBotao: true,
    //         cb: null
    //       })
    //     } else {

    //     }
    //   })
    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "Pedido",
          criterio: pedido,
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
          entidade: "Pedido",
          criterio: {
            idPedido: pedido.idPedido
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

  const btPesquisar = () => {
    const query = `
      SELECT 
          p.*
      FROM 
          pedidos p
      INNER JOIN
          pessoas pe ON pe.idPessoa ON p.idPessoa_cliente
      WHERE 
          pe.nome LIKE '%${pesquisa.itemPesquisa}%' ;
      `;
    clsCrud
      .query({
        entidade: "Pedido",
        sql: query,
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
      tituloAnterior: 'Cadastro de Pedidos',
      pathTitulo: '/',
      pathTituloAnterior: '/Pedido'
    })
    irPara('/')
  }

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "PrazoEntrega",
        criterio: {
          nome: "%".concat("%"),
        },
        camposLike: ["nome"],
      })
      .then((rs: Array<PrazoEntregaInterface>) => {
        setRsPrazo(rs)
      })

    let query: string = `
      SELECT 
          p.*
      FROM 
          pessoas p
      WHERE 
          p.tipoPessoa = 'J' OR
          p.tipoPessoa = 'C';
      `;
    clsCrud
      .query({
        entidade: "Pessoa",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rs: Array<PessoaInterface>) => {
        setRsCliente(rs)
      })
    query = `
      SELECT 
          p.*
      FROM 
          pessoas p
      WHERE 
          p.tipoPessoa = 'V'
      `;
    clsCrud
      .query({
        entidade: "Pessoa",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rs: Array<PessoaInterface>) => {
        setRsVendedor(rs)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  useEffect(() => {
    // if (layoutState.titulo === "Pedidos") {
    //   setLocalState({ action: actionTypes.pesquisando })
    //   setLayoutState({
    //     titulo: 'Pedidos',
    //     tituloAnterior: '',
    //     pathTitulo: '/Pedido',
    //     pathTituloAnterior: ''
    //   })
    // }
  },)


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
                field="itemPesquisa"
                setState={setPesquisa}
                iconeEnd='searchicon'
                onClickIconeEnd={() => btPesquisar()}
                mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={11} sx={{ mt: 2 }}>
              {/* <ComboBox
                opcoes={rsPesquisa}
                campoDescricao=""
                campoID=""
                dados={pedido}
                mensagemPadraoCampoEmBranco="Escolha um cliente"
                field="ItemPesquisa"
                label="Pesquisa"
                erros={erros}
                setState={setPedido}
                onClickPesquisa={btPesquisar}
              /> */}
            </Grid>
            <Grid item xs={1}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 6, mr: 1 }}
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
                    onAcionador: (rs: PedidoInterface) =>
                      onEditar(rs.idPedido as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: PedidoInterface) =>
                      onExcluir(rs.idPedido as number),
                    toolTip: "Excluir",
                  },
                  {
                    icone: "auto_awesome_motion_outlined",
                    onAcionador: (rs: DetalhePedidoInterface) =>
                      onDetalhe(rs.idPedido as number),
                    toolTip: "Pedido",
                  },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                type='tel'
                tipo='date'
                label="Data"
                dados={pedido}
                field="dataPedido"
                setState={setPedido}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} sm={5} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsCliente}
                campoDescricao="nome"
                campoID="idPessoa"
                dados={pedido}
                mensagemPadraoCampoEmBranco="Escolha um cliente"
                field="idPessoa_cliente"
                label="Cliente"
                erros={erros}
                setState={setPedido}
              />
            </Grid>
            <Grid item xs={12} sm={5} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsVendedor}
                campoDescricao="nome"
                campoID="idPessoa"
                dados={pedido}
                mensagemPadraoCampoEmBranco="Escolha um Vendedor"
                field="idPessoa_vendedor"
                label="Vendedor"
                erros={erros}
                setState={setPedido}
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsPrazo}
                campoDescricao="nome"
                campoID="idPrazoEntrega"
                dados={pedido}
                mensagemPadraoCampoEmBranco="Prazo de entrega"
                field="idPrazoEntrega"
                label="Prazo de entrega"
                erros={erros}
                setState={setPedido}
              />
            </Grid>
            <Grid item xs={12} md={8} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                type='text'
                tipo='uppercase'
                label="Observação"
                dados={pedido}
                field="observacao"
                setState={setPedido}
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
          <Condicional condicao={localState.action === 'detalhes'}>
            <Grid item xs={12}>
              detalhe pedido
              {/* <DetalhePedido rsPedido={Pedido} /> */}
              {/* <SimpleDialog
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
              tipo='dados'
              rsDados={rsPesquisa}
            /> */}
            </Grid>
          </Condicional>
        </Grid>
      </Paper >
    </Container >
  )
}
