import { Grid, IconButton, Paper, TableContainer, Tooltip, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { DetalheTinturariaInterface, TinturariaInterface } from '../../../../jb_backend/src/interfaces/tinturariaInterface';
import { ProducaoMalhariaInterface } from '../../../../jb_backend/src/interfaces/producaoMalhariaInterface';
import ShowText from '../../Componentes/ShowText';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import Condicional from '../../Componentes/Condicional/Condicional';

interface PropsInterface {
  rsMaster: TinturariaInterface
  masterLocalState: ActionInterface,
  setMasterLocalState: React.Dispatch<React.SetStateAction<ActionInterface>>
}

interface DadosPecaInterface {
  peca: string
}

interface PecasSomadasInterface {
  produto_nome: string,
  total_peca: number,
  qtd_peca: number
}

export default function DetalheTinturaria({ rsMaster, masterLocalState, setMasterLocalState }: PropsInterface) {

  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  // const ResetDados: DetalheTinturariaInterface = {
  //   idTinturaria: 0,
  //   idMalharia: 0,
  //   malharia: {
  //     peca: '',
  //     idMaquina: 0,
  //     idProduto: 0,
  //     dataProducao: '',
  //     turno: TurnoType.segundo,
  //     peso: 0,
  //     localizacao: '',
  //     idPessoa_revisador: 0,
  //     idPessoa_tecelao: 0,
  //     fechado: false,
  //     dataFechado: undefined,
  //     idTinturaria: 0
  //   },
  // }

  const DadosPeca: DadosPecaInterface = {
    peca: ''
  }

  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.editando })
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [dados, setDados] = useState<Array<DetalheTinturariaInterface>>([])
  const [rsPecasSomadas, setRsPecasSomadas] = useState<Array<PecasSomadasInterface>>([])
  const [rsPessoas, setRsPessoas] = useState<Array<PessoaInterface>>([])
  const [PesquisaPeca, setPesquisaPeca] = useState<DadosPecaInterface>(DadosPeca)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof any>('nome')

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Relação de peças',
      alinhamento: 'center',
      campo: 'idMalharia',
      format: (_v, rs: any) => rs.malharia.peca
    },
  ]

  const cabecalhoPecas: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Tecido',
      alinhamento: 'left',
      campo: 'produto_nome',
    },
    {
      cabecalho: 'Peso',
      alinhamento: 'center',
      campo: 'total_peca',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Qtd',
      alinhamento: 'center',
      campo: 'qtd_peca',
      format: (qtd) => clsFormatacao.currency(qtd)
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

  const onExcluir = (rs: DetalheTinturariaInterface) => {

    let tmpDetalhe: Array<DetalheTinturariaInterface> = []
    dados.forEach(det => {
      if (det.idMalharia !== rs.idMalharia) {
        tmpDetalhe.push(det)
      }
    })
    setDados(tmpDetalhe)

    clsCrud.excluir({
      entidade: "DetalheTinturaria",
      criterio: {
        idMalharia: rs.idMalharia
      }
    })
      .then((rs) => {
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
    AtualizaPeca(rs.idMalharia as number, null, '', false)
  }

  const btCancelar = () => {
    setMasterLocalState({ action: actionTypes.pesquisando })
    setLocalState({ action: actionTypes.incluindo })
  }

  const podeIncluirDetalhe = (): boolean => {
    const indice = dados.findIndex(
      (v) => v.malharia.peca === PesquisaPeca.peca
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

  const btConfirmar = () => {

    clsCrud.incluir({
      entidade: 'DetalheTinturaria',
      criterio: dados,
      localState: localState,
      setMensagemState: setMensagemState,
    }).then((rs) => {
      if (!rs.ok) {
        setMensagemState({
          titulo: 'Erro...',
          exibir: true,
          mensagem: 'Erro no cadastro - Consulte Suporte',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null
        })
      } else {
        setMasterLocalState({ action: actionTypes.pesquisando })
        setLocalState({ action: actionTypes.incluindo })
      }
    })
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

      AtualizaPeca(rs.idMalharia as number, rsMaster.idTinturaria as number, rsMaster.dataTinturaria, true)
    }
  }

  const AtualizaPeca = (
    idMalharia: number | null,
    idTinturaria: number | null,
    data: string,
    fechado: boolean) => {

    clsCrud.pesquisar({
      entidade: 'ProducaoMalharia',
      criterio: {
        idMalharia: idMalharia
      }
    }).then((rs: Array<ProducaoMalhariaInterface>) => {
      let tmpProducao: ProducaoMalhariaInterface = rs[0]
      let dataFormatada = data !== '' ? clsFormatacao.dataFormatada(data) : ''
      if (tmpProducao.idMalharia) {
        tmpProducao.dataFechado = clsFormatacao.dataISOtoDatetime(dataFormatada)
        tmpProducao.fechado = fechado
        tmpProducao.idTinturaria = idTinturaria
      }
      clsCrud
        .incluir({
          entidade: "ProducaoMalharia",
          criterio: tmpProducao
        }).then((rs) => {
          if (rs.ok) {
            AtualizaSoma()
          }
        })
    })
  }

  const btPesquisaPeca = () => {
    clsCrud.pesquisar({
      entidade: "ProducaoMalharia",
      criterio: {
        peca: PesquisaPeca.peca,
        fechado: false
      },
      camposLike: ['peca', 'fechado'],
      select: [
        'idTinturaria',
        'idMalharia',
        'peca',
        'idProduto',
        'peso',
        'dataFechado',
        'fechado',
        'idMaquina',
        'dataProducao',
        'turno',
        'localizacao',
        'idPessoa_revisador',
        'idPessoa_tecelao',
      ]
    }).then((rs: Array<ProducaoMalhariaInterface>) => {
      if (rs.length > 0) {
        SomaPeca(rs[0])
      } else {
        setMensagemState({
          titulo: 'Aviso',
          exibir: true,
          mensagem: 'Peça já cadastrada ou inexistente!',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null
        })
      }
      setPesquisaPeca({ peca: '' })
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
        entidade: 'DetalheTinturaria',
        relations: ['malharia'],
        criterio: {
          idTinturaria: `${rsMaster.idTinturaria}`
        },
        camposLike: ['idTinturaria']
      }).then((rs: Array<DetalheTinturariaInterface>) => {
        if (rs.length > 0) {
          setLocalState({ action: actionTypes.editando })
          setDados(rs)
        }
      })
  }

  const AtualizaSoma = () => {
    clsCrud
      .consultar(
        {
          entidade: "ProducaoMalharia",
          joins: [
            { "tabelaRelacao": "producaomalharia.produto", "relacao": "produto" }
          ],
          criterio: {
            "idTinturaria": rsMaster.idTinturaria
          },
          groupBy: "nome",
          campoOrder: ["nome"],
          having: "total_peca > 0",
          select: ["ROUND(SUM(peso),2) AS total_peca", "COUNT(peso) AS qtd_peca", "nome AS produto_nome"]
        }
      ).then((rs: Array<any>) => {
        rs.forEach(v => v.qtd_peca = v.qtd_peca * 1.0)
        setRsPecasSomadas(rs)
      })
  }

  useEffect(() => {
    BuscarDados()
    AtualizaSoma()
  }, [])

  return (
    <>
      <Condicional condicao={masterLocalState.action !== actionTypes.excluindo}>
        <Paper variant="outlined" sx={{ display: { xs: '', md: 'flex' }, justifyContent: 'space-between', mb: 1.5, padding: 1.5 }}>
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
      </Condicional>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1.2} sx={{ alignItems: 'flex-start' }}>
          <Condicional condicao={masterLocalState.action !== actionTypes.excluindo}>
            <Grid item xs={12} container justifyContent={'center'}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography>
                  Informe a peça
                </Typography>
              </Grid>
              <Grid item xs={8} md={4} sx={{ mb: 1.5 }}>
                <InputText
                  label=""
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
            </Grid>
          </Condicional>
          <Grid item xs={5}>
            <TableContainer component={Paper}>
              <DataTable
                cabecalho={cabecalhoForm}
                dados={dados}
                acoes={masterLocalState.action === actionTypes.excluindo ? [] :
                  [
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
            </TableContainer>
          </Grid>
          <Grid item xs={7} >
            <TableContainer component={Paper}>
              <DataTable
                cabecalho={cabecalhoPecas}
                dados={rsPecasSomadas}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                exibirPaginacao={false}
                temTotal={true}
                colunaSoma={['total_peca', 'qtd_peca']}
              />
            </TableContainer>
          </Grid>
          <Condicional condicao={masterLocalState.action !== actionTypes.excluindo}>

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
              <Tooltip title={'Confirmar'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: 2 }}
                  onClick={() => btConfirmar()}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Condicional>
        </Grid>
      </Paper >
    </>
  )
}