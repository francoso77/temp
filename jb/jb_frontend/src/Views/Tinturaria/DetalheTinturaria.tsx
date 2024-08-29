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

interface PecasSomadasInterface {
  produto_nome: string,
  total_peca: number,
  qtd_peca: number
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

  const PecasSomadas: PecasSomadasInterface = {
    produto_nome: '',
    total_peca: 0,
    qtd_peca: 0
  }

  const [indiceEdicao, setIndiceEdicao] = useState<number>(-1)
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [detalheTinturaria, setDetalheTinturaria] = useState<DetalheTinturariaInterface>(ResetDados)
  const [dados, setDados] = useState<Array<DetalheTinturariaInterface>>([])
  const [rsPeca, setRsPeca] = useState<Array<ProducaoMalhariaInterface>>([])
  const [rsPecasSomadas, setRsPecasSomadas] = useState<Array<PecasSomadasInterface>>([])
  const [rsProducao, setRsProducao] = useState<ProducaoMalhariaInterface>()
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
      // format: (_v, rs: any) => rs.malharia.peca
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
      // format: (_v, rs: any) => rs.malharia.peca
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


  const btCancelar = () => {
    setDetalheTinturaria(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
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
        console.log('resultado do rs: ', rs)
        if (rs.length > 0) {
          console.log(rs)
        }
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
        setRsProducao(rs[0])
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

    // clsCrud
    //   .pesquisar({
    //     entidade: "ProducaoMalharia",
    //     relations: ['produto'],
    //     criterio: {
    //       idTinturaria: rsMaster.idTinturaria
    //     },
    //     camposLike: ['idTinturaria'],
    //   })
    //   .then((rs: Array<ProducaoMalhariaInterface>) => {
    //     console.log('pecas somadas: ', rs)
    //     setRsSomaPeca(rs)
    //   })

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
    }).then((rs) => {
      setRsPecasSomadas(rs)
    })
  }

  useEffect(() => {
    BuscarDados()
    AtualizaSoma()
  }, [])

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
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography >
              Informe a peça do Romaneio
            </Typography>
          </Grid>
          <Grid item xs={12} >
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
            <Grid item xs={5}>
              <DataTable
                cabecalho={cabecalhoForm}
                dados={dados}
                acoes={[
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
            <Grid item xs={7} sx={{ mt: { xs: -7, md: -7 } }}>
              <DataTable
                cabecalho={cabecalhoPecas}
                dados={rsPecasSomadas}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                exibirPaginacao={false}
                temTotal={true}
                qtdColunas={0}
                colunaSoma='total_peca'
              />
            </Grid>
          </Condicional>
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