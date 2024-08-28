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
import ShowText from '../../Componentes/ShowText';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';


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
    malharia: {
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
  const [dados, setDados] = useState<Array<DetalheTinturariaInterface>>([])
  const [rsPeca, setRsPeca] = useState<Array<ProducaoMalhariaInterface>>([])
  const [rsSomaPeca, setRsSomaPeca] = useState<Array<ProducaoMalhariaInterface>>([])
  const [rsProducao, setRsProducao] = useState<ProducaoMalhariaInterface>()
  const [rsPessoas, setRsPessoas] = useState<Array<PessoaInterface>>([])
  const [PesquisaPeca, setPesquisaPeca] = useState<DadosPecaInterface>(DadosPeca)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof any>('nome')
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Peça',
      alinhamento: 'left',
      campo: 'idMalharia',
      format: (_v, rs: any) => rs.malharia.peca
    },
  ]

  const cabecalhoPecas: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Tecido',
      alinhamento: 'left',
      campo: 'idMalharia',
      format: (_v, rs: any) => rs.malharia.peca
    },
    {
      cabecalho: 'Peso',
      alinhamento: 'left',
      campo: 'idMalharia',
      format: (_v, rs: any) => rs.malharia.peca
    },
    {
      cabecalho: 'Qtd',
      alinhamento: 'left',
      campo: 'idMalharia',
      format: (_v, rs: any) => rs.malharia.peca
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

  const onEditar = (id: number) => { }
  const onExcluir = (id: number) => { }

  // const onExcluir = (rs: DetalheTinturariaInterface) => {

  //   let tmpDetalhe: Array<DetalheTinturariaInterface> = []
  //   rsMaster.detalheTinturarias.forEach(det => {
  //     if (det.idDetalheTinturaria !== rs.idDetalheTinturaria) {
  //       tmpDetalhe.push(det)
  //     }
  //   })
  //   setRsMaster({ ...rsMaster, detalheTinturarias: tmpDetalhe })
  //   // AtualizaSomatorio(tmpDetalhe)
  // }

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
    const indice = dados.findIndex(
      (v, i) => v.malharia.peca === PesquisaPeca.peca && i !== indiceEdicao
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

  // const btConfirmaInclusao = () => {

  //   if (podeIncluirDetalhe()) {
  //     console.log('pode incluir')
  //     console.log(detalheTinturaria.idMalharia)
  //     let tmpDetalhe: Array<DetalheTinturariaInterface> = [...rsMaster.detalheTinturarias]
  //     tmpDetalhe.push({
  //       idTinturaria: rsMaster.idTinturaria as number,
  //       idMalharia: detalheTinturaria.idMalharia,
  //       peca: { ...rsProducao[rsProducao.findIndex(v => v.idMalharia === detalheTinturaria.idMalharia)] },
  //     })
  //     console.log(tmpDetalhe)
  //     setRsMaster({
  //       ...rsMaster, detalheTinturarias:
  //         [
  //           ...rsMaster.detalheTinturarias,

  //           {
  //             idTinturaria: rsMaster.idTinturaria as number,
  //             idMalharia: detalheTinturaria.idMalharia,
  //             peca: { ...rsProducao[rsProducao.findIndex(v => v.idMalharia === detalheTinturaria.idMalharia)] },
  //           }
  //         ]
  //     })
  //   }
  // }

  const btFechar = () => {
    setOpen(false)

  }

  const btConfirmar = () => {

  }
  const SomaPeca = (rs: ProducaoMalhariaInterface) => {

    if (podeIncluirDetalhe()) {

      let tmpDetalhe: Array<DetalheTinturariaInterface> = []
      tmpDetalhe.push({
        idTinturaria: rsMaster.idTinturaria as number,
        idMalharia: rs.idMalharia as number,
        malharia: rs,

      })
      setDados([...dados,
      {
        idTinturaria: rsMaster.idTinturaria as number,
        idMalharia: rs.idMalharia as number,
        malharia: rs,
      }
      ])
    }

  }

  const btPesquisaPeca = () => {
    clsCrud.pesquisar({
      entidade: "ProducaoMalharia",
      criterio: {
        peca: PesquisaPeca.peca,
        fechado: false
      },
      camposLike: ['peca', 'fechado'],
    }).then((rs: Array<ProducaoMalhariaInterface>) => {
      if (rs.length > 0) {
        setRsProducao(rs[0])
        SomaPeca(rs[0])
        setPesquisaPeca({ peca: '' })
        // setRsProducao({
        //   ...rsProducao,
        //   idMalharia: rs[0].idMalharia,
        //   peca: rs[0].peca,
        //   idProduto: rs[0].idProduto,
        //   idMaquina: rs[0].idMaquina,
        //   dataProducao: rs[0].dataProducao,
        //   turno: rs[0].turno,
        //   peso: rs[0].peso,
        //   localizacao: rs[0].localizacao,
        //   idPessoa_revisador: rs[0].idPessoa_revisador,
        //   idPessoa_tecelao: rs[0].idPessoa_tecelao,
        //   fechado: true,
        //   dataFechado: rsMaster.dataTinturaria,
        //   idTinturaria: rsMaster.idTinturaria,
        // })

      } else {
        setMensagemState({
          titulo: 'Aviso',
          exibir: true,
          mensagem: 'peça já cadastrada!',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null
        })
      }
    })
  }


  const BuscarDados = () => {

    clsCrud
      .pesquisar({
        entidade: 'Pessoa',
        campoOrder: ['nome'],
      }).then((pessoas: Array<PessoaInterface>) => {
        setRsPessoas(pessoas)
      })


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
        setRsPeca(rsPecas)
      })

    clsCrud
      .pesquisar({
        entidade: "ProducaoMalharia",
        relations: ['produto'],
        criterio: {
          idTinturaria: rsMaster.idTinturaria
        },
        camposLike: ['idTinturaria'],
      })
      .then((rs: Array<ProducaoMalhariaInterface>) => {
        setRsSomaPeca(rs)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  // const theme = useTheme()
  // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Paper variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, padding: 1.5 }}>
        <Grid item xs={12}>
          <ShowText
            titulo="Cliente"
            descricao={
              rsPessoas.
                find((pessoa) => pessoa.idPessoa === rsMaster.idPessoa_cliente)?.nome || 'Cliente não encontrado!'
            }
          />
        </Grid>

        <Grid item xs={12}>
          <ShowText
            titulo="Tinturaria"
            descricao={
              rsPessoas.
                find(pessoa => pessoa.idPessoa === rsMaster.idPessoa_fornecedor)?.nome || 'Tinturaria não encontrada!'
            }
          />
        </Grid>
      </Paper>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid> */}
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography >
              Informe a peça do Romaneio
            </Typography>
          </Grid>
          <Grid item xs={11} >
            <InputText
              label="Peça"
              tipo="text"
              dados={PesquisaPeca}
              field="peca"
              setState={setPesquisaPeca}
              iconeEnd='searchicon'
              onClickIconeEnd={() => btPesquisaPeca()}
              mapKeyPress={[{ key: 'Enter', onKey: btPesquisaPeca }]}
              autoFocus
            />
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            {/* <Grid item xs={11} >
              <InputText
                label="Digite o nome"
                tipo="text"
                dados={pesquisa}
                field="nome"
                setState={setPesquisa}
                iconeEnd='searchicon'
                onClickIconeEnd={() => btPesquisar()}
                mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
                autoFocus
              />
            </Grid> */}
            <Grid item xs={1}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: { xs: 0, md: 2 } }}
                  onClick={() => btIncluir()}
                >
                  <AddCircleIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <DataTable
                cabecalho={cabecalhoForm}
                dados={dados}
                acoes={[
                  {
                    icone: "edit",
                    onAcionador: (rs: DetalheTinturariaInterface) =>
                      onEditar(rs.idDetalheTinturaria as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: DetalheTinturariaInterface) =>
                      onExcluir(rs.idDetalheTinturaria as number),
                    toolTip: "Excluir",
                  },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
            <Grid item xs={6}>
              <DataTable
                cabecalho={cabecalhoPecas}
                dados={dados}
                acoes={[

                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={localState.action !== 'pesquisando'}>
            {/* <Grid item xs={12} sm={12} md={12} sx={{ textAlign: 'left' }}>
              <InputText
                label="Ativo"
                tipo="checkbox"
                dados={cao}
                field="ativo"
                setState={setCao}
                disabled={localState.action === 'excluindo' ? true : false}
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
    </>
  )
}