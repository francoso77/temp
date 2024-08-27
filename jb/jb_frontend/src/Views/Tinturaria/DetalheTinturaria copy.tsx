import { Box, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
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
import InputText from '../../Componentes/InputText';
import ComboBox from '../../Componentes/ComboBox';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import InputCalc from '../../Componentes/InputCalc';
import { DetalheTinturariaInterface, TinturariaInterface } from '../../../../jb_backend/src/interfaces/tinturariaInterface';
import { TurnoType } from '../../types/turnoTypes';
import { ProducaoMalhariaInterface } from '../../../../jb_backend/src/interfaces/producaoMalhariaInterface';


interface PropsInterface {
  rsMaster: TinturariaInterface
  setRsMaster: React.Dispatch<React.SetStateAction<TinturariaInterface>>,
  masterLocalState: ActionInterface,
  // setRsSomatorio: React.Dispatch<React.SetStateAction<SomatorioEntradaInterface>>,
}

interface DadosPecaInterface {
  peca: string
}

export default function DetalheTinturaria({ rsMaster, setRsMaster, masterLocalState }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: DetalheTinturariaInterface = {
    idTinturaria: 0,
    idMalharia: 0,
    peca: {
      peca: '',
      idMaquina: 0,
      idProduto: 0,
      dataProducao: '',
      turno: TurnoType.segundo,
      peso: 0,
      localizacao: '',
      idPessoa_revisador: 0,
      idPessoa_tecelao: 0,
      fechado: false,
      dataFechado: undefined,
      idTinturaria: 0
    },
  }

  const DadosPeca: DadosPecaInterface = {
    peca: ''
  }
  const [indiceEdicao, setIndiceEdicao] = useState<number>(-1)
  const [open, setOpen] = useState(false);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [erros, setErros] = useState({})
  const [detalheTinturaria, setDetalheTinturaria] = useState<DetalheTinturariaInterface>(ResetDados)
  const [rsPeca, setRsPeca] = useState<Array<ProducaoMalhariaInterface>>([])
  const [rsProducao, setRsProducao] = useState<Array<ProducaoMalhariaInterface>>([])
  const [PesquisaPeca, setPesquisaPeca] = useState<DadosPecaInterface>(DadosPeca)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof any>('nome')
  const [tipo, setTipo] = useState<TipoProdutoType>()
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Peça',
      alinhamento: 'left',
      campo: 'peca',
      // format: (_v, rs: any) => rs.produto.nome
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

  // const pegaTipo = () => {
  //   let auxTipo: number | undefined = rsProduto.
  //     find(produto => produto.idProduto === detalheTinturaria.idProduto)?.tipoProduto;
  //   setTipo(auxTipo)
  // }

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    // retorno = validaCampo.naoVazio('idMalharia', detalheTinturaria, erros, retorno, 'cliente')
    // retorno = validaCampo.naoVazio('idPessoa_fornecedor', detalheTinturaria, erros, retorno, 'Informe uma tinturaria')
    // if (tipo === 10) {
    //   retorno = validaCampo.naoVazio('idCor', detalheEntrada, erros, retorno, 'Defina uma cor')
    //   retorno = validaCampo.naoVazio('qtdPecas', detalheEntrada, erros, retorno, 'Informe a quantidade peças')
    //   retorno = validaCampo.naoVazio('metro', detalheEntrada, erros, retorno, 'Qual a metragem')
    //   retorno = validaCampo.naoVazio('gm2', detalheEntrada, erros, retorno, 'Qual a gramatura')
    //   retorno = validaCampo.naoVazio('idPessoa_revisador', detalheEntrada, erros, retorno, 'Defina um revisador')
    //   retorno = validaCampo.naoVazio('idTinturaria', detalheEntrada, erros, retorno, 'Defina uma tinturaria')
    //   retorno = validaCampo.naoVazio('perdaMalharia', detalheEntrada, erros, retorno, 'Qtd perdida em malharia')
    //   retorno = validaCampo.naoVazio('perdaTinturaria', detalheEntrada, erros, retorno, 'Qtd perdida em tinturaria')

    // }
    setErros(erros)
    return retorno
  }

  const onEditar = (rs: DetalheTinturariaInterface, indice: number) => {

    setLocalState({ action: actionTypes.editando })
    setIndiceEdicao(indice)
    setDetalheTinturaria(rs)
    setOpen(true)
  }

  const onExcluir = (rs: DetalheTinturariaInterface) => {

    let tmpDetalhe: Array<DetalheTinturariaInterface> = []
    rsMaster.detalheTinturarias.forEach(det => {
      if (det.idDetalheTinturaria !== rs.idDetalheTinturaria) {
        tmpDetalhe.push(det)
      }
    })
    setRsMaster({ ...rsMaster, detalheTinturarias: tmpDetalhe })
    AtualizaSomatorio(tmpDetalhe)
  }

  const btIncluir = () => {
    if (
      rsMaster.dataTinturaria !== "" &&
      rsMaster.idPessoa_cliente !== 0 &&
      rsMaster.idPessoa_fornecedor !== 0
    ) {
      setIndiceEdicao(-1)
      setOpen(true)
      // BuscarDados()
      setDetalheTinturaria(ResetDados)
      setLocalState({ action: actionTypes.incluindo })
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe os dados do Romaneio!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }

  const btCancelar = () => {
    setOpen(false)
    setErros({})
    setDetalheTinturaria(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
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

  const podeIncluirDetalhe = (): boolean => {
    const indice = rsMaster.detalheTinturarias.findIndex(
      (v, i) => v.idMalharia === detalheTinturaria.idMalharia && i !== indiceEdicao
    )

    if (indice >= 0) {
      setMensagemState({
        titulo: 'Aviso',
        exibir: true,
        mensagem: 'Produto já cadastrado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
    return indice < 0;
  }

  const btConfirmaInclusao = () => {

    if (podeIncluirDetalhe()) {
      let tmpDetalhe: Array<DetalheTinturariaInterface> = [...rsMaster.detalheTinturarias]
      tmpDetalhe.push({
        idTinturaria: rsMaster.idTinturaria as number,
        idMalharia: detalheTinturaria.idMalharia,
        peca: { ...rsProducao[rsProducao.findIndex(v => v.idMalharia === detalheTinturaria.idMalharia)] },
      })
      console.log(tmpDetalhe)

      setRsMaster({
        ...rsMaster, detalheTinturarias:
          [
            ...rsMaster.detalheTinturarias,

            {
              idTinturaria: rsMaster.idTinturaria as number,
              idMalharia: detalheTinturaria.idMalharia,
              peca: { ...rsProducao[rsProducao.findIndex(v => v.idMalharia === detalheTinturaria.idMalharia)] },
            }
          ]
      })
      // AtualizaSomatorio(tmpDetalhe)
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheTinturaria(ResetDados)
      setOpen(false)
    }
  }

  const btConfirmaAlteracao = () => {

    if (validarDados() && podeIncluirDetalhe()) {

      let tmpDetalhe: Array<DetalheTinturariaInterface> = [...rsMaster.detalheTinturarias]
      tmpDetalhe[indiceEdicao] = {
        ...detalheTinturaria,
        peca: { ...rsProducao[rsProducao.findIndex(v => v.idMalharia === detalheTinturaria.idMalharia)] },
      }

      setRsMaster({
        ...rsMaster,
        detalheTinturarias: [...tmpDetalhe]
      })
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheTinturaria(ResetDados)
      setOpen(false)
      // AtualizaSomatorio(tmpDetalhe)
    }
  }

  const AtualizaSomatorio = (rs: Array<DetalheTinturariaInterface>) => {

    // let totalQtd: number = 0
    // let total: number = 0

    // if (rs) {
    //   rs.forEach((detalhe) => {
    //     totalQtd = totalQtd + detalhe.qtd
    //     total = total + (detalhe.qtd * detalhe.vrUnitario)
    //   })
    //   setRsSomatorio({ total: total.toString(), totalQtd: totalQtd.toString() })
    // }
  }

  const btTemPeca = () => {

    if (rsMaster.dataTinturaria === "" &&
      rsMaster.idPessoa_cliente === 0 &&
      rsMaster.idPessoa_fornecedor === 0) {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe os dados do Romaneio!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
    else {

      if (!PesquisaPeca.peca) {
        setMensagemState({
          titulo: 'Atenção',
          mensagem: 'Informe uma peça!',
          tipo: MensagemTipo.Warning,
          exibir: true,
          exibirBotao: true,
          cb: null
        })
      } else {

        clsCrud
          .pesquisar({
            entidade: "ProducaoMalharia",
            criterio: {
              peca: PesquisaPeca.peca,
              fechado: false
            },
            camposLike: ['peca', 'fechado']
          })
          .then((rsPecas: Array<ProducaoMalhariaInterface>) => {

            setRsPeca(rsPecas)
            console.log(rsPecas)
          })
      }
    }
  }

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "ProducaoMalharia",
        campoOrder: ['peca'],
        criterio: {
          fechado: false
        },
        camposLike: ['fechado']
      })
      .then((rsPecas: Array<ProducaoMalhariaInterface>) => {
        setRsProducao(rsPecas)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'>
        <Paper variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            m: 1,
            p: 1.5,
            backgroundColor: '#3c486b'
          }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'white' }}>
              informe a peça
            </Typography>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action !== 'pesquisando'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={5} sx={{ mt: 2 }}>
                <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                  <ComboBox
                    opcoes={rsProducao}
                    campoDescricao="peca"
                    campoID="idMalharia"
                    dados={detalheTinturaria}
                    mensagemPadraoCampoEmBranco="Escolha uma peça"
                    field="idMalharia"
                    label="Peça"
                    erros={erros}
                    setState={setDetalheTinturaria}

                  // onFocus={(e) => e.target.select()}
                  // onKeyDown={(event: any) => btPulaCampo(event, 1)}

                  />
                  {/* <InputText
                    label="Peça"
                    tipo="uppercase"
                    dados={PesquisaPeca}
                    field="peca"
                    setState={setPesquisaPeca}
                    iconeEnd='searchicon'
                    onClickIconeEnd={() => btTemPeca()}
                    mapKeyPress={[{ key: 'Enter', onKey: btTemPeca }]}
                  /> */}

                </Box>
              </Grid>
              <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>

                <InputCalc
                  label='Achou'
                  disabled={true}
                  value={''}
                  textAlign='right'

                />
              </Grid>
              <Condicional condicao={localState.action !== 'pesquisando'}>
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
                        onClick={localState.action === actionTypes.incluindo ?
                          () => btConfirmaInclusao() : () => btConfirmaAlteracao()}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                      </IconButton>
                    </Tooltip>
                  </Condicional>
                </Grid>
              </Condicional>
            </Grid>
          </Paper >
        </Condicional>
      </Dialog >

      <Paper sx={{ m: 0, p: 1, display: 'flex' }}>
        <Grid item xs={3} md={3} sx={{ mt: -3, textAlign: 'left' }}>
          <Box ref={(el: any) => (fieldRefs.current[0] = el)}>

            {/* <InputText
              label="Peça"
              tipo="uppercase"
              dados={PesquisaPeca}
              field="peca"
              setState={setPesquisaPeca}
              iconeEnd='searchicon'
              onClickIconeEnd={() => btTemPeca()}
              mapKeyPress={[{ key: 'Enter', onKey: btTemPeca }]}
            /> */}
          </Box>
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
        <Grid item xs={3} md={6} sx={{ mt: 2, ml: 2, textAlign: 'left' }}>
          <DataTable
            cabecalho={cabecalhoForm}
            dados={rsMaster.detalheTinturarias}
            acoes={['excluindo', 'editando'].includes(masterLocalState.action) ? [] :
              [
                {
                  icone: "edit",
                  onAcionador: (rs: DetalheTinturariaInterface, indice: number) =>
                    onEditar(rs, indice),
                  toolTip: "Editar",
                },
                {
                  icone: "delete",
                  onAcionador: (rs: DetalheTinturariaInterface) =>
                    onExcluir(rs),
                  toolTip: "Excluir",
                },
              ]}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
        </Grid>
      </Paper>
    </>
  )
}