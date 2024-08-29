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

interface PropsInterface {
  rsMaster: TinturariaInterface
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

export default function DetalheTinturaria({ rsMaster, setMasterLocalState }: PropsInterface) {

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

  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.incluindo })
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [dados, setDados] = useState<Array<DetalheTinturariaInterface>>([])
  const [rsPecasSomadas, setRsPecasSomadas] = useState<Array<PecasSomadasInterface>>([])
  const [rsPessoas, setRsPessoas] = useState<Array<PessoaInterface>>([])
  const [PesquisaPeca, setPesquisaPeca] = useState<DadosPecaInterface>(DadosPeca)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof any>('nome')
  let sql: string = ''

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
      },
      setMensagemState: setMensagemState
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

    sql = `
    UPDATE producaomalharias 
    SET 
      idTinturaria = NULL,
      dataFechado = NULL,
      fechado = FALSE
    WHERE 
      idMalharia = ${rs.idMalharia};
    `
    clsCrud.query({
      entidade: "ProducaoMalharia",
      sql: sql,
    }).then((rs) => {
      AtualizaSoma()
    })

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

      sql = `
      UPDATE producaomalharias 
      SET 
        idTinturaria = ${rsMaster.idTinturaria},
        dataFechado = STR_TO_DATE(${rsMaster.dataTinturaria}, '%d%m%Y'),
        fechado = TRUE
      WHERE 
        idMalharia = ${rs.idMalharia};
      `
      clsCrud.query({
        entidade: "ProducaoMalharia",
        sql: sql,
      }).then((rs) => {
        AtualizaSoma()
      })
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
    sql = `
      SELECT 
          ROUND(SUM(pm.peso),2) AS total_peca,
          COUNT(pm.peso) AS qtd_peca,
          p.nome AS produto_nome
      FROM 
          producaomalharias pm
      INNER JOIN 
          produtos p ON p.idProduto = pm.idProduto
      WHERE 
          pm.idTinturaria = ${rsMaster.idTinturaria}
      GROUP BY p.nome;
    `
    clsCrud.query({
      entidade: "ProducaoMalharia",
      sql: sql,
    }).then((rs: Array<PecasSomadasInterface>) => {
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
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1.2} sx={{ alignItems: 'flex-start' }}>
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
          <Grid item xs={5}>
            <TableContainer component={Paper}>
              <DataTable
                cabecalho={cabecalhoForm}
                dados={dados}
                acoes={[
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
        </Grid>
      </Paper >
    </>
  )
}