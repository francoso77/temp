import { Dialog, Grid, IconButton, Paper, Tooltip } from '@mui/material';
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
import ShowText from '../../Componentes/ShowText';
import ComboBox from '../../Componentes/ComboBox';
import { DetalheEstruturaInterface, EstruturaInterface } from '../../../../jb_backend/src/interfaces/estruturaInterface';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { CorInterface } from '../../../../jb_backend/src/interfaces/corInteface';



interface PropsInterface {
  rsEstrutura: EstruturaInterface
}

export default function DetalheEstrutura({ rsEstrutura }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const ResetDados: DetalheEstruturaInterface = {
    idEstrutura: rsEstrutura.idEstrutura as number,
    idProduto: 0,
    idCor: 0,
    qtd: 0,
  }

  interface PesquisaInterface {
    nome: string
  }

  const [open, setOpen] = useState(true);
  const [selectedValue, setSelectedValue] = useState('');

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<DetalheEstruturaInterface>>([])
  const [nomeProduto, setNomeProduto] = useState<PesquisaInterface>({ nome: '' })
  const [erros, setErros] = useState({})
  const [detalheEstrutura, setDetalheEstrutura] = useState<DetalheEstruturaInterface>(ResetDados)
  const [rsCor, setRsCor] = useState<Array<CorInterface>>([])
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  // const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');
  const dadosTabela: Array<DetalheEstruturaInterface> = [];

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'nomeProduto'
    },
    {
      cabecalho: 'Cor',
      alinhamento: 'left',
      campo: 'nomeCor'
    },
    {
      cabecalho: 'Qtd',
      alinhamento: 'left',
      campo: 'qtd'
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

  const pesquisarID = (id: string | number): Promise<DetalheEstruturaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "DetalheEstrutura",
        criterio: {
          idDetalheEstrutura: id,
        },
      })
      .then((rs: Array<DetalheEstruturaInterface>) => {
        return rs[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setDetalheEstrutura(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setDetalheEstrutura(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const btIncluir = () => {
    setDetalheEstrutura(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setDetalheEstrutura(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const recebeDados = () => {
    dadosTabela.push(detalheEstrutura)
    console.log(dadosTabela)
    setRsPesquisa(dadosTabela)
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idProduto', detalheEstrutura, erros, retorno, 'Escolha um produto')
    retorno = validaCampo.naoVazio('idCor', detalheEstrutura, erros, retorno, 'Escolha uma cor')
    retorno = validaCampo.naoVazio('qtd', detalheEstrutura, erros, retorno, 'A quantidade deve ser maior que 0')
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "DetalheEstrutura",
          criterio: detalheEstrutura,
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
          entidade: "DetalheEstrutura",
          criterio: {
            idDetalheEstrutura: detalheEstrutura.idDetalheEstrutura
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
    btPesquisar()
  }

  const btPesquisar = () => {
    const query = `
    SELECT 
        de.*,
        p.nome AS nomeProduto,
        c.nome AS nomeCor
    FROM 
        detalheestruturas de
    INNER JOIN 
        estruturas e ON e.idEstrutura = de.idEstrutura
    INNER JOIN 
        produtos p ON p.idProduto = de.idProduto
    INNER JOIN 
        cores c ON c.idCor = de.idCor
    WHERE 
        de.idEstrutura = ${rsEstrutura.idEstrutura};
    `;
    clsCrud
      .query({
        entidade: "Estrutura",
        sql: query,
        msg: 'Pesquisando Estruturas ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      })
    // clsCrud
    //   .pesquisar({
    //     entidade: "DetalheEstrutura",
    //     criterio: {
    //       idEstrutura: rsEstrutura.idEstrutura,
    //     },
    //     select: ["idDetalheEstrutura", "idEstrutura", "idProduto", "idCord", "qtd"],
    //     msg: 'Pesquisando produtos ...',
    //     setMensagemState: setMensagemState
    //   })
    //   .then((rs: Array<any>) => {
    //     setRsPesquisa(rs)
    //   })
  }

  const BuscarDados = () => {

    let query: string = `
    SELECT 
        e.*,
        p.nome AS nomeProduto
    FROM 
        estruturas e
    INNER JOIN 
        produtos p ON p.idProduto = e.idProduto
    WHERE 
        e.idEstrutura = ${rsEstrutura.idEstrutura};
    `;

    clsCrud
      .query({
        entidade: "Estrutura",
        sql: query,
        msg: '',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setNomeProduto({ nome: rs[0].nomeProduto })
      })

    query = `
      SELECT 
          p.*
      FROM 
          produtos p
      INNER JOIN 
          tipoprodutos t ON t.idTipoProduto = p.idTipoProduto
      WHERE 
          t.estrutura = true;
      `;
    clsCrud
      .query({
        entidade: "Produto",
        sql: query,
        msg: '',
        setMensagemState: setMensagemState
      })
      .then((rsProdutos: Array<ProdutoInterface>) => {
        setRsProduto(rsProdutos)
      })

    clsCrud
      .pesquisar({
        entidade: "Cor",
      })
      .then((rsCores: Array<CorInterface>) => {
        setRsCor(rsCores)
      })
  }

  const irpara = useNavigate()
  const btFechar = () => {
    irpara('/Estrutura')
    setLocalState({ action: actionTypes.pesquisando })

    setLayoutState({
      titulo: 'Cadasto de Estruturas',
      tituloAnterior: 'Composição de Estrutura',
      pathTitulo: '/Estrutura',
      pathTituloAnterior: '/DetalheEstrutura'
    })
  }

  useEffect(() => {
    BuscarDados()
    setLayoutState({
      titulo: 'Composição de Estrutura',
      tituloAnterior: 'Cadasto de Estruturas',
      pathTitulo: '/DetalheEstrutura',
      pathTituloAnterior: '/Estrutura'
    })
  }, [])

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <Paper variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', m: 1, padding: 1.5 }}>

          <Grid item xs={4}>
            <ShowText
              titulo="Estrutura do produto"
              descricao={nomeProduto.nome} />
          </Grid>
          <Grid item xs={4}>
            <ShowText
              titulo="Qtd Base"
              descricao={rsEstrutura.qtdBase.toString()} />
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action === 'pesquisando'}>
          <Paper sx={{ display: 'flex', justifyContent: 'space-between', m: 1, padding: 1.5 }}>
            <Grid item xs={11}>
              <DataTable
                cabecalho={cabecalhoForm}
                dados={rsPesquisa}
                acoes={[
                  {
                    icone: "edit",
                    onAcionador: (rs: DetalheEstruturaInterface) =>
                      onEditar(rs.idDetalheEstrutura as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: DetalheEstruturaInterface) =>
                      onExcluir(rs.idDetalheEstrutura as number),
                    toolTip: "Excluir",
                  },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
            <Grid item xs={1}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 1, ml: { xs: 0, md: 0.5 } }}
                  onClick={() => btIncluir()}
                >
                  <AddCircleIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Paper>
        </Condicional>
        <Condicional condicao={localState.action === 'incluindo'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              {/*
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <IconButton onClick={() => btFechar()}>
                <CloseIcon />
              </IconButton>
            </Grid>*/}
              <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                <ComboBox
                  opcoes={rsProduto}
                  campoDescricao="nome"
                  campoID="idProduto"
                  dados={detalheEstrutura}
                  mensagemPadraoCampoEmBranco="Escolha um produto"
                  field="idProduto"
                  label="Produtos"
                  erros={erros}
                  setState={setDetalheEstrutura}
                />
              </Grid>
              <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
                <ComboBox
                  opcoes={rsCor}
                  campoDescricao="nome"
                  campoID="idCor"
                  dados={detalheEstrutura}
                  mensagemPadraoCampoEmBranco="Escolha uma cor"
                  field="idCor"
                  label="Cores"
                  erros={erros}
                  setState={setDetalheEstrutura}
                />
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  type='number'
                  label="Qtd"
                  dados={detalheEstrutura}
                  field="qtd"
                  setState={setDetalheEstrutura}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Condicional condicao={localState.action !== 'pesquisando'}>
                {/* <Grid item xs={12}>
                <DataTable
                cabecalho={cabecalhoForm}
                dados={rsPesquisa}
                acoes={[
                  {
                    icone: "edit",
                    onAcionador: (rs: DetalheEstruturaInterface) =>
                    onEditar(rs.idDetalheEstrutura as number),
                    toolTip: "Editar",
                    },
                    {
                      icone: "delete",
                      onAcionador: (rs: DetalheEstruturaInterface) =>
                      onExcluir(rs.idDetalheEstrutura as number),
                      toolTip: "Excluir",
                      },
                      ]}
                      order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
              </Grid> */}

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
                        onClick={() => recebeDados()}
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
        </Condicional>
      </Dialog>
    </>
  )
}