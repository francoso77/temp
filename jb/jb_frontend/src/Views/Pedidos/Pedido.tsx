import { Box, Chip, Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import ComboBox from '../../Componentes/ComboBox';
import { PessoaInterface } from '../../Interfaces/pessoaInterface';
import { PrazoEntregaInterface } from '../../Interfaces/prazoEntregaInterface';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { PedidoInterface } from '../../Interfaces/pedidoInterface';
import DetalhePedido from './DetalhePedido';
import { UsuarioType } from '../../types/usuarioTypes';
import { StatusType, StatusTypes } from '../../types/statusTypes';

export interface SomatorioPedidoInterface {
  total: string
  totalQtd: string
}

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
    statusPedido: StatusType.aberto,
    detalhePedidos: []
  }

  interface PesquisaInterface {
    itemPesquisa: string
  }

  const SomatorioDados: SomatorioPedidoInterface = {
    total: '',
    totalQtd: ''
  }

  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [pedido, setPedido] = useState<PedidoInterface>(ResetDados)
  const [rsPrazo, setRsPrazo] = useState<Array<PrazoEntregaInterface>>([])
  const [rsCliente, setRsCliente] = useState<Array<PessoaInterface>>([])
  const [rsVendedor, setRsVendedor] = useState<Array<PessoaInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [rsSomatorio, setRsSomatorio] = useState<SomatorioPedidoInterface>(SomatorioDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Pedido',
      alinhamento: 'center',
      campo: 'idPedido',
      largura: 15,
      format: (v) => clsFormatacao.numeroPadrao(v)
    },
    {
      cabecalho: 'Data',
      alinhamento: 'center',
      campo: 'dataPedido',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'left',
      //campo: 'nomeCliente'
      campo: 'idPessoa_cliente',
      format: (_v, rs: any) => rs.cliente.nome
    },
    {
      cabecalho: 'Vendedor',
      alinhamento: 'left',
      //campo: 'nomeVendedor'
      campo: 'idPessoa_vendedor',
      format: (_v, rs: any) => rs.vendedor.nome
    },
    {
      cabecalho: 'Status',
      alinhamento: 'center',
      campo: 'statusPedido', // O 'campo' ainda pode apontar para onde o status *deveria* estar para identificação
      render: (_valor: any, row: any) => { // O _valor aqui seria o que 'campo' aponta, mas não usaremos diretamente
        // 1. Encontrar o statusPedido real dentro de rsPedido
        const pedidoCorrespondente = rsPesquisa.find((p: any) => p.idPedido === row.idPedido);
        const statusCode = pedidoCorrespondente ? pedidoCorrespondente.statusPedido : undefined;

        // 2. Encontrar as informações completas do status (descrição e id)
        const statusInfo = StatusTypes.find(
          (status) => status.idStatus === statusCode
        );

        const descricaoStatus = statusInfo ? statusInfo.descricao : 'Desconhecido';

        // 3. Definir a cor do Chip com base no statusCode

        // Define a cor com base no tipo de status. Você pode ajustar as cores conforme sua necessidade.
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
        switch (statusCode) {
          case StatusType.aberto:
            color = 'success'; // Exemplo: azul para aberto
            break;
          case StatusType.producao:
            color = 'info'; // Exemplo: roxo para produção
            break;
          case StatusType.parcial:
            color = 'warning'; // Exemplo: laranja para parcial
            break;
          case StatusType.finalizado:
            color = 'error'; // Exemplo: verde para finalizado
            break;
          default:
            color = 'default'; // Cor padrão para qualquer outro caso
            break;
        }

        // 4. Retornar o componente Chip
        return (
          <Chip
            label={descricaoStatus}
            color={color}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      },
    },
  ]

  const pesquisarID = async (id: string | number): Promise<PedidoInterface> => {
    const rs = await clsCrud
      .pesquisar({
        entidade: "Pedido",
        relations: [
          "cliente",
          "vendedor",
          "prazoEntrega",
          "detalhePedidos",
          "detalhePedidos.produto",
          "detalhePedidos.cor",
        ],
        criterio: {
          idPedido: id,
        },
      })
    let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataPedido)
    return {
      ...rs[0],
      dataPedido: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
    };
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setPedido(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }

  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setPedido(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setRsSomatorio({ total: '0', totalQtd: '0' })
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

  const AtualizaSomatorio = (rs: PedidoInterface) => {

    let totalQtd: number = 0
    let total: number = 0

    if (rs.detalhePedidos) {
      rs.detalhePedidos.forEach((detalhe) => {
        totalQtd = totalQtd + detalhe.qtdPedida
        total = total + (detalhe.qtdPedida * detalhe.vrUnitario)
      })
      setRsSomatorio({ total: total.toString(), totalQtd: totalQtd.toString() })
    }
  }

  const btConfirmar = () => {
    if (validarDados()) {
      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "Pedido",
          criterio: pedido,
          localState: localState,
          token: usuarioState.token,
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
          token: usuarioState.token,
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

  const formatDateTimeForMySQL = (dateString: string): string => {
    const [day, month, year] = dateString.split('/')
    return `${year}-${month}-${day} 00:00:00`
  }

  const btPesquisar = () => {

    const idCliente = rsCliente
      .filter(cliente => cliente.nome.includes(pesquisa.itemPesquisa))
      .map(cliente => cliente.idPessoa)

    const relations = [
      "cliente",
      "vendedor",
      "prazoEntrega",
      "detalhePedidos",
      "detalhePedidos.produto",
      "detalhePedidos.cor",
    ];

    const msg = 'Pesquisando dados ...'
    const setMensagem = setMensagemState

    let dadosPesquisa = {}
    let criterio = {}
    let camposLike = []
    let comparador = "L"

    const temNumero = /\d/.test(pesquisa.itemPesquisa)

    if (temNumero && pesquisa.itemPesquisa.includes('/')) {
      const formattedDateTime = formatDateTimeForMySQL(pesquisa.itemPesquisa)
      criterio = {
        dataPedido: formattedDateTime,
        //statusPedido: 1,
      }
      camposLike = ['dataPedido']
    } else if (temNumero) {

      criterio = {
        idPedido: pesquisa.itemPesquisa
      }
      camposLike = ['idPedido']
    } else {

      criterio = {
        idPessoa_cliente: idCliente,
        //statusPedido: 1,
      }
      camposLike = ['idPessoa_cliente']
      comparador = 'I'
    }

    dadosPesquisa = {
      entidade: "Pedido",
      relations,
      criterio,
      comparador,
      camposLike,
      msg,
      setMensagemState: setMensagem
    }

    clsCrud
      .pesquisar(dadosPesquisa)
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      });

  }

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Cadastro de Pedidos',
      pathTitulo: '/',
      pathTituloAnterior: '/Pedido'
    })
    irPara('/')
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
  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "PrazoEntrega",
        campoOrder: ["nome"],
        criterio: {
          nome: "%".concat("%"),
        },
        camposLike: ["nome"],
      })
      .then((rs: Array<PrazoEntregaInterface>) => {
        setRsPrazo(rs)
      })

    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        campoOrder: ['nome'],
        comparador: 'I',
        criterio: {
          tipoPessoa: ['J', 'C'],
        },
        camposLike: ['tipoPessoa'],
      })
      .then((rsClientes: Array<PessoaInterface>) => {
        setRsCliente(rsClientes)
      })

    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        campoOrder: ['nome'],
        criterio: {
          tipoPessoa: "V",
        },
        camposLike: ["tipoPessoa"],
      })
      .then((rsVendedores: Array<PessoaInterface>) => {
        setRsVendedor(rsVendedores)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  return (

    <Container maxWidth="md" sx={{ mt: 0 }}>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: -1.5, mr: -5, mb: -5 }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={10} md={11}>
              <InputText
                label="Buscar por pedido, data ou cliente"
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
            <Grid item xs={2} md={1}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 5, ml: { xs: 1, md: 2 } }}
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
                acoes={usuarioState.tipoUsuario === UsuarioType.admin ? [
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
                ] : []}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Data"
                  dados={pedido}
                  field="dataPedido"
                  setState={setPedido}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  autoFocus
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={5} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
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
                  disabled={localState.action === 'excluindo' ? true : false}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 2)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={5} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
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
                  disabled={localState.action === 'excluindo' ? true : false}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 3)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
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
                  disabled={localState.action === 'excluindo' ? true : false}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 4)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                <InputText
                  type='text'
                  tipo='uppercase'
                  label="Observação"
                  dados={pedido}
                  field="observacao"
                  setState={setPedido}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <DetalhePedido
                rsMaster={pedido}
                setRsMaster={setPedido}
                masterLocalState={localState}
                setRsSomatorio={setRsSomatorio}
              />
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Metros Total"
                labelAlign='center'
                dados={rsSomatorio}
                field="totalQtd"
                setState={setRsSomatorio}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
              />
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Valor Total Pedido"
                labelAlign='center'
                dados={rsSomatorio}
                field="total"
                setState={setRsSomatorio}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
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
    </Container >
  )
}
