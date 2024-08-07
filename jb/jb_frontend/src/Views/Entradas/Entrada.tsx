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
import { DetalheEntradaInterface, EntradaInterface } from '../../../../jb_backend/src/interfaces/entradaInterface';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import DetalhePedido from './DetalheEntrada';


export default function Entrada() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: EntradaInterface = {
    dataEmissao: '',
    observacao: '',
    notaFiscal: '',
    idPessoa_fornecedor: 0
  }
  interface PesquisaInterface {
    itemPesquisa: string
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [entrada, setEntrada] = useState<EntradaInterface>(ResetDados)
  const [rsFornecedor, setRsFornecedor] = useState<Array<PessoaInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'dataEmissao',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Nota Fiscal',
      alinhamento: 'center',
      campo: 'notaFiscal',
      format: (nota) => clsFormatacao.notaFiscal(nota)
    },
    {
      cabecalho: 'Fornecedor',
      alinhamento: 'left',
      campo: 'nome_fornecedor',
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

  const pesquisarID = (id: string | number): Promise<EntradaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Entrada",
        criterio: {
          idEntrada: id,
        },
      })
      .then((rs: Array<EntradaInterface>) => {
        let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataEmissao)
        return {
          ...rs[0],
          dataEmissao: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
        }
      })
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setEntrada(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setEntrada(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const onDetalhe = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setEntrada(rs)
      setLocalState({ action: actionTypes.detalhes })
    })
  }
  const btIncluir = () => {
    setEntrada(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setEntrada(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataEmissao', entrada, erros, retorno)
    retorno = validaCampo.naoVazio('idPessoa_fornecedor', entrada, erros, retorno, 'Informe um fornecedor')
    retorno = validaCampo.naoVazio('notaFiscal', entrada, erros, retorno, 'Deve conter o número da nota fiscal')

    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "Entrada",
          criterio: entrada,
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
          entidade: "Entrada",
          criterio: {
            idEntrada: entrada.idEntrada
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
        e.*, 
        f.nome AS nome_fornecedor
      FROM 
        entradas e
      INNER JOIN 
        pessoas f ON f.idPessoa = e.idPessoa_fornecedor
      WHERE 
        e.notaFiscal LIKE '%${pesquisa.itemPesquisa}%'
      `;
    clsCrud
      .query({
        entidade: "Entrada",
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
      tituloAnterior: 'Entradas de produtos',
      pathTitulo: '/',
      pathTituloAnterior: '/Entrada'
    })
    irPara('/')
  }

  const BuscarDados = () => {
    let query: string = `
      SELECT 
          p.*
      FROM 
          pessoas p
      WHERE 
          p.tipoPessoa = 'F'
      `;
    clsCrud
      .query({
        entidade: "Pessoa",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rs: Array<PessoaInterface>) => {
        setRsFornecedor(rs)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  useEffect(() => {
    if (layoutState.titulo === "Entradas") {
      setLocalState({ action: actionTypes.pesquisando })
      setLayoutState({
        titulo: 'Entradas de produtos',
        tituloAnterior: 'Itens da Entrada',
        pathTitulo: '/Entrada',
        pathTituloAnterior: '/DetalheEntrada'
      })
    }
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
            <Grid item xs={10}>
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
            <Grid item xs={2}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 4, ml: 2 }}
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
                    onAcionador: (rs: EntradaInterface) =>
                      onEditar(rs.idEntrada as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: EntradaInterface) =>
                      onExcluir(rs.idEntrada as number),
                    toolTip: "Excluir",
                  },
                  {
                    icone: "auto_awesome_motion_outlined",
                    onAcionador: (rs: DetalheEntradaInterface) =>
                      onDetalhe(rs.idEntrada as number),
                    toolTip: "Itens",
                  },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                type='tel'
                tipo="date"
                label="Data"
                dados={entrada}
                field="dataEmissao"
                setState={setEntrada}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsFornecedor}
                campoDescricao="nome"
                campoID="idPessoa"
                dados={entrada}
                mensagemPadraoCampoEmBranco="Escolha um fornecedor"
                field="idPessoa_fornecedor"
                label="Fornecedor"
                erros={erros}
                setState={setEntrada}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                type='text'
                mask='nf'
                tipo='mac'
                label="Nota Fiscal"
                dados={entrada}
                field="notaFiscal"
                setState={setEntrada}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                type='text'
                tipo='uppercase'
                label="Observação"
                dados={entrada}
                field="observacao"
                setState={setEntrada}
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
              <DetalhePedido rsEntrada={entrada} />
            </Grid>
          </Condicional>
        </Grid>
      </Paper >
    </Container >
  )
}
