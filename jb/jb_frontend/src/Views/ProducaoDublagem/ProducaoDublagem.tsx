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
import ClsFormatacao from '../../Utils/ClsFormatacao';
import ClsApi from '../../Utils/ClsApi';
import { DetalheProducaoDublagemInterface, ProducaoDublagemInterface } from '../../Interfaces/producaoDublagemInterface';
import { TipoColagemType, TipoColagemTypes } from '../../types/tipoColagemTypes';
import { DetalhePedidoInterface, PedidoInterface } from '../../Interfaces/pedidoInterface';
import DetalheProducaoDubalgem from './DetalheProducaoDublagem';
import { StatusType, StatusTypes } from '../../types/statusTypes';
import { UsuarioType } from '../../types/usuarioTypes';

export interface SomatorioProducaoDublagemInterface {
  total: string
}

export default function ProducaoDublagem() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()
  const clsApi = new ClsApi()

  const ResetDados: ProducaoDublagemInterface = {
    dataProducao: '',
    tipoColagem: TipoColagemType.cola,
    idPedido: 0,
    detalheProducaoDublagens: []
  }

  interface PesquisaInterface {
    itemPesquisa: string
  }

  const SomatorioDados: SomatorioProducaoDublagemInterface = {
    total: '',
  }

  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [producaoDublagem, setProducaoDublagem] = useState<ProducaoDublagemInterface>(ResetDados)
  const [rsPedido, setRsPedido] = useState<Array<PedidoInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [rsSomatorio, setRsSomatorio] = useState<SomatorioProducaoDublagemInterface>(SomatorioDados)
  const [rsQtdPedida, setRsQtdPedida] = useState<SomatorioProducaoDublagemInterface>(SomatorioDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [

    {
      cabecalho: 'Data',
      alinhamento: 'center',
      campo: 'dataProducao',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Pedido',
      alinhamento: 'center',
      campo: 'pedido',
      largura: 15,
      format: (v) => clsFormatacao.numeroPadrao(v)
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'left',
      campo: 'cliente'
      // campo: 'idPessoa_cliente',
      // format: (_v, rs: any) => rs.cliente.nome
    },
    {
      cabecalho: 'Status Pedido',
      alinhamento: 'center',
      campo: 'statusPedido', // O campo 'statusPedido' em sua 'row' deve conter o valor 'A', 'C', 'F', ou 'P'
      render: (_valor: string, row: any) => {
        // Encontra a descrição do status no array StatusPedidoTypes
        const statusInfo = StatusTypes.find(
          (status) => status.idStatus === row.statusPedido
        );

        const descricaoStatus = statusInfo ? statusInfo.descricao : 'Desconhecido';

        // Define a cor com base no tipo de status. Você pode ajustar as cores conforme sua necessidade.
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
        switch (row.statusPedido) {
          case StatusType.aberto:
            color = 'success'; // Exemplo: azul para aberto
            break;
          case StatusType.producao:
            color = 'info'; // Exemplo: roxo para produção
            break;
          case StatusType.finalizado:
            color = 'error'; // Exemplo: verde para finalizado
            break;
          case StatusType.parcial:
            color = 'warning'; // Exemplo: laranja para parcial
            break;
          default:
            color = 'default'; // Cor padrão para qualquer outro caso
        }

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
    {
      cabecalho: 'Metros Pedido',
      alinhamento: 'right',
      campo: 'metrosPedido',
      format: (v) => clsFormatacao.currency(v)
    },
    {
      cabecalho: 'Metros Cortados',
      alinhamento: 'right',
      campo: 'metros',
      format: (v) => clsFormatacao.currency(v)
    },
  ]

  const pesquisarID = async (id: string | number): Promise<ProducaoDublagemInterface> => {
    return await clsCrud
      .pesquisar({
        entidade: "ProducaoDublagem",
        relations: [
          "detalheProducaoDublagens",
          "detalheProducaoDublagens.detalhePecas",
        ],
        criterio: {
          idPedido: id,
        },
      })
      .then((rs: Array<ProducaoDublagemInterface>) => {
        let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataProducao)
        return {
          ...rs[0],
          dataProducao: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
        }
      })
  }

  const pedidoValido = async (pedido: number): Promise<boolean> => {

    const rs: Array<PedidoInterface> = await clsCrud.pesquisar({
      entidade: "Pedido",
      criterio: { idPedido: pedido }
    })

    return rs.length > 0 && rs[0].statusPedido !== StatusType.finalizado
  }


  const onEditar = async (pedido: number) => {

    if (await pedidoValido(pedido)) {

      pesquisarID(pedido).then((rs) => {
        setProducaoDublagem(rs)
        AtualizaSomatorio(rs)
        setLocalState({ action: actionTypes.editando })
      })
      btPesquisarQtd(pedido)
    } else {
      setMensagemState({
        titulo: 'Aviso...',
        exibir: true,
        mensagem: 'Pedido já finalizado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })

    }
  }

  const onExcluir = (pedido: number) => {
    pesquisarID(pedido).then((rs) => {
      setProducaoDublagem(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setRsSomatorio({ total: '0' })
    setRsQtdPedida({ total: '0' })
    setProducaoDublagem(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }

  const btCancelar = () => {
    setErros({})
    setProducaoDublagem(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataProducao', producaoDublagem, erros, retorno)
    retorno = validaCampo.naoVazio('idPedido', producaoDublagem, erros, retorno, 'Informe o pedido')
    retorno = validaCampo.naoVazio('tipoColagem', producaoDublagem, erros, retorno, 'Qual o tipo de colagem?')
    retorno = producaoDublagem.detalheProducaoDublagens.length > 0 ? true : false

    setErros(erros)
    return retorno
  }

  const AtualizaSomatorio = (rs: ProducaoDublagemInterface) => {

    let total: number = 0

    let tmpDetalhe = rs.detalheProducaoDublagens

    if (tmpDetalhe) {
      tmpDetalhe.forEach((detalhe) => {
        detalhe.detalhePecas.forEach((peca) => {
          total = total + peca.metros
        })
      })
      setRsSomatorio({ total: total.toString() })
    }
  }
  const verificaStatusPedido = async (pedido: number) => {


    try {
      let statusPedido: StatusType = StatusType.finalizado

      const rsPedido: PedidoInterface[] = await clsCrud.pesquisar({
        entidade: "Pedido",
        relations: ["detalhePedidos"],
        criterio: {
          idPedido: pedido
        }
      })

      if (rsPedido.length > 0) {
        let tmpPedido: PedidoInterface = rsPedido[0]
        let tmpDetalhe: Array<DetalhePedidoInterface> = tmpPedido.detalhePedidos

        producaoDublagem.detalheProducaoDublagens.forEach((detalhe: DetalheProducaoDublagemInterface) => {

          tmpDetalhe.forEach((detalhePedido: DetalhePedidoInterface) => {
            if (detalhe.idProduto === detalhePedido.idProduto) {
              detalhePedido.qtdAtendida = detalhe.metrosTotal
              if (detalhePedido.qtdAtendida >= detalhePedido.qtdPedida) {
                detalhePedido.statusItem = StatusType.finalizado
              } else if (detalhePedido.qtdAtendida < detalhePedido.qtdPedida && detalhePedido.qtdAtendida > 0) {
                detalhePedido.statusItem = StatusType.parcial
              } else {
                detalhePedido.statusItem = StatusType.producao
              }

            }
          })
        })

        const temPedidoAberto = tmpDetalhe.findIndex((rs: DetalhePedidoInterface) => rs.statusItem !== StatusType.finalizado)
        const temProducao = tmpDetalhe.findIndex((rs: DetalhePedidoInterface) => rs.statusItem === StatusType.parcial)

        if (temPedidoAberto < 0) {

          tmpPedido = { ...tmpPedido, statusPedido: statusPedido }
        } else if (temProducao === 0) {
          tmpPedido = { ...tmpPedido, statusPedido: StatusType.parcial }
        } else {
          tmpPedido = { ...tmpPedido, statusPedido: StatusType.producao }
        }

        await clsCrud.incluir({
          entidade: "Pedido",
          criterio: tmpPedido,
          token: usuarioState.token,
        })
      }
    } catch (error) {
      console.error("Erro ao verificar status do pedido:", error);
    }
  }

  const alterarStatusPedido = async (pedido: number) => {
    if (pedido === 0) {
      return
    }
    try {
      const rsPedido: PedidoInterface[] = await clsCrud.pesquisar({
        entidade: "Pedido",
        relations: ["detalhePedidos"],
        criterio: {
          idPedido: pedido
        }
      })

      if (rsPedido.length > 0) {
        let tmpPedido: PedidoInterface = rsPedido[0]
        let tmpDetalhe: Array<DetalhePedidoInterface> = tmpPedido.detalhePedidos

        tmpDetalhe.map((detalhe) => {

          detalhe.statusItem = StatusType.producao
          detalhe.qtdAtendida = 0
        })
        tmpPedido = { ...tmpPedido, statusPedido: StatusType.producao, detalhePedidos: tmpDetalhe }

        await clsCrud.incluir({
          entidade: "Pedido",
          criterio: tmpPedido,
          token: usuarioState.token,
        })
      }
    } catch (error) {
      console.error("Erro ao verificar status do pedido:", error);
    }
  }

  const btConfirmar = () => {
    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "ProducaoDublagem",
          criterio: producaoDublagem,
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
          entidade: "ProducaoDublagem",
          criterio: {
            idDublagem: producaoDublagem.idDublagem
          },
          token: usuarioState.token,
          cb: () => btPesquisar(),
          setMensagemState: setMensagemState
        })
          .then((rs) => {
            alterarStatusPedido(producaoDublagem.idPedido)
            setLocalState({ action: actionTypes.pesquisando })
            if (!rs.ok) {
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
    } else {
      setMensagemState({
        titulo: 'Atenção...',
        exibir: true,
        mensagem: 'Informe os dados do pedido e adicione produtos!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }

    verificaStatusPedido(producaoDublagem.idPedido)

  }

  const btPesquisar = () => {

    const campo = validaCampo.isValidDate(clsFormatacao.dataISOtoDatetime(pesquisa.itemPesquisa)) ? 'data' : 'nome'
    const itemPesquisa = campo === 'data'
      ? clsFormatacao.dataISOtoDatetime(pesquisa.itemPesquisa)
      : pesquisa.itemPesquisa

    clsApi.execute<Array<ProducaoDublagemInterface>>({
      url: 'corteProducaoDublagem',
      method: 'post',
      itemPesquisa,
      campo,
      mensagem: 'Pesquisando produção dublagem ...',
      setMensagemState: setMensagemState
    })
      .then((rs: Array<ProducaoDublagemInterface>) => {
        setRsPesquisa(rs)
      })
  }

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Produção Dublagem',
      pathTitulo: '/',
      pathTituloAnterior: '/ProducaoDublagem'
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

  const BuscarDados = async () => {
    try {
      const detalhes: Array<DetalhePedidoInterface> = await clsCrud.pesquisar({
        entidade: "ProducaoDublagem",
        select: ["idPedido"]
      });

      const ids = new Set(detalhes.map(d => d.idPedido));

      const rsPedidos: Array<PedidoInterface> = await clsCrud.pesquisar({
        entidade: "Pedido",
        criterio: {
          statusPedido: StatusType.producao
        },
        camposLike: ["statusPedido"],
        campoOrder: ["idPedido"],
        relations: ["detalhePedidos"],
        select: ["idPedido", "statusPedido"]
      });

      const dadosFiltrados = rsPedidos.filter(p => !ids.has(p.idPedido ?? null));
      setRsPedido(dadosFiltrados);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setRsPedido([]); // opcional: limpa os dados se erro
    }
  };


  const btPesquisarQtd = (pedido: number) => {
    if (pedido === 0) {
      return
    }
    clsCrud
      .pesquisar({
        entidade: "DetalhePedido",
        relations: [
          "produto",
        ],
        criterio: {
          idPedido: pedido,
        },
        camposLike: ['idPedido'],
      })
      .then((rs: Array<DetalhePedidoInterface>) => {
        if (rs.length > 0) {
          let total: number = 0
          rs.forEach((detalhe) => {
            total = total + detalhe.qtdPedida
          })
          setRsQtdPedida({ total: total.toString() })
        }
      })
  }
  useEffect(() => {
    BuscarDados()
    btPesquisar()
    setLayoutState({
      titulo: 'Produção Dublagem',
      tituloAnterior: '',
      pathTitulo: '/ProducaoDublagem',
      pathTituloAnterior: '/'
    })
  }, [])

  return (

    <Container maxWidth="xl" sx={{ mt: 0 }}>
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
                label="Buscar por data ou cliente"
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
                acoes={usuarioState.tipoUsuario === UsuarioType.admin ?
                  [
                    {
                      icone: "edit",
                      onAcionador: (rs: any) =>
                        onEditar(rs.pedido),
                      toolTip: "Editar",
                    },
                    {
                      icone: "delete",
                      onAcionador: (rs: any) =>
                        onExcluir(rs.pedido),
                      toolTip: "Excluir",
                    },
                  ] : [
                    {
                      icone: "edit",
                      onAcionador: (rs: any) =>
                        onEditar(rs.pedido),
                      toolTip: "Editar",
                    },
                  ]}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Data"
                  labelAlign='center'
                  textAlign='center'
                  dados={producaoDublagem}
                  field="dataProducao"
                  setState={setProducaoDublagem}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  autoFocus
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                <ComboBox
                  opcoes={rsPedido}
                  campoDescricao="idPedido"
                  campoID="idPedido"
                  dados={producaoDublagem}
                  mensagemPadraoCampoEmBranco="Escolha um pedido"
                  field="idPedido"
                  label="Pedido"
                  labelAlign='center'
                  textAlign='center'
                  erros={erros}
                  setState={setProducaoDublagem}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 2)}
                  onBlur={() => btPesquisarQtd(producaoDublagem.idPedido)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <ComboBox
                  opcoes={TipoColagemTypes}
                  campoDescricao="descricao"
                  campoID="idTipoColagem"
                  dados={producaoDublagem}
                  mensagemPadraoCampoEmBranco="Defina um tipo"
                  field="tipoColagem"
                  label="Tipo de Colagem"
                  labelAlign='center'
                  textAlign='center'
                  erros={erros}
                  setState={setProducaoDublagem}
                  disabled={localState.action === 'excluindo' ? true : false}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Qtd Pedida"
                labelAlign='center'
                dados={rsQtdPedida}
                field="total"
                setState={setRsQtdPedida}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
              />
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Qtd Cortada"
                labelAlign='center'
                dados={rsSomatorio}
                field="total"
                setState={setRsSomatorio}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
              />
            </Grid>

            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <DetalheProducaoDubalgem
                rsMaster={producaoDublagem}
                setRsMaster={setProducaoDublagem}
                masterLocalState={localState}
                setRsSomatorio={setRsSomatorio}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
              <Tooltip title={'Cancelar'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: 2 }}
                  onClick={() => btCancelar()}
                // onClick={producaoDublagem.idPedido !== 0 ? () => btConfirmar() :
                //   () => btCancelar()}
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
