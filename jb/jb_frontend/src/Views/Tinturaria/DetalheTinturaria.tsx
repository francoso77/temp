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
import ClsApi from '../../Utils/ClsApi';
import { EstruturaInterface } from '../../../../jb_backend/src/interfaces/estruturaInterface';
import { EstoqueInterface } from '../../../../jb_backend/src/interfaces/estoqueInterface';

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
  const clsApi = new ClsApi()

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

  const MensagemErro = (erro: string) => {
    setMensagemState({
      titulo: 'Erro...',
      exibir: true,
      mensagem: erro.concat(' - Consulte Suporte'),
      tipo: MensagemTipo.Error,
      exibirBotao: true,
      cb: null
    })
  }
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
          MensagemErro('Erro no cadastro')
        }
      })
    // AtualizaPeca(rs.idMalharia as number, null, '', false)
    pesquisarPecaID(rs.idMalharia).then((rs) => {
      if (rs) {
        AtualizaGradeProdutos(rs, 'Excluir')
        MovimentaEstoque(rs, false)
      }
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
  const TemEstrutura = async (id: number): Promise<Array<EstruturaInterface> | null> => {
    try {
      const [estrutura] = await clsCrud.pesquisar({
        entidade: 'Estrutura',
        relations: ['detalheEstruturas'],
        criterio: { idProduto: id },
      });

      // Verifica se existe a estrutura e retorna detalheEstruturas ou um array vazio
      return estrutura?.detalheEstruturas ?? null;
    } catch (error) {
      MensagemErro('Produto sem estrutua definida')
      console.error('Erro ao buscar estrutura:', error)
      return []; // Retorna um array vazio em caso de erro
    }
  };


  const TemEstoque = async (id: number, cliente: number): Promise<EstoqueInterface | null> => {
    const rs = await clsCrud
      .pesquisar({
        entidade: 'Estoque',
        criterio: {
          idProduto: id,
          idPessoa_fornecedor: cliente,
        },
        having: "SUM(qtd) > 0",
        camposLike: ["idPessoa_fornecedor", "idProduto"],
      })

    if (rs[0]?.qtd > 0) {
      return rs[0];
    } else {
      // MensagemErro('Produto sem estoque')
      return null;
    }
  }

  const MovimentaEstoque = async (rs: ProducaoMalhariaInterface, fechado: boolean): Promise<boolean> => {
    try {
      const estrutura = await TemEstrutura(rs.idProduto as number)

      if (!estrutura) {
        MensagemErro('Produto sem estrutura')
        return false
      }

      for (const det of estrutura) {
        let estoque = await TemEstoque(det.idProduto, rsMaster.idPessoa_cliente)
        const estoqueZerado: EstoqueInterface = {
          idProduto: det.idProduto as number,
          idPessoa_fornecedor: rsMaster.idPessoa_cliente as number,
          idCor: null,
          qtd: 0
        }
        console.log(estoque, 'estoque')

        if (!estoque) {
          console.log('entrou aqui')
          // MensagemErro('Cliente sem estoque')
          // return false
          estoque = estoqueZerado
        }
        console.log(estoque, 'estoque zerado')
        if (fechado) {
          estoque.qtd -= (rs.peso * det.detalheEstruturas[0].qtd)
        } else {
          estoque.qtd += (rs.peso * det.detalheEstruturas[0].qtd)
        }

        const rsEstoque = await clsCrud.incluir({
          entidade: 'Estoque',
          criterio: estoque,
        })

        if (!rsEstoque.ok) {
          MensagemErro('Estoque não foi atualizado')
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Erro ao movimentar estoque:', error)
      return false
    }
  }

  const btConfirmar = () => {

    clsCrud.incluir({
      entidade: 'DetalheTinturaria',
      criterio: dados,
      localState: localState,
      setMensagemState: setMensagemState,
    }).then((rs) => {
      if (!rs.ok) {
        MensagemErro('Erro no cadastro')
      } else {
        setMasterLocalState({ action: actionTypes.pesquisando })
        setLocalState({ action: actionTypes.incluindo })
        LimpaPecas()
        AtualizaPeca(dados).then((rs) => {
          if (rs) {
            clsCrud.incluir({
              entidade: 'ProducaoMalharia',
              criterio: rs,
            })
          }
        })
      }
    })
  }

  const SomaPeca = async (rs: ProducaoMalhariaInterface) => {

    const podeMovimentarEstoque = await MovimentaEstoque(rs, true)

    if (podeIncluirDetalhe() && podeMovimentarEstoque) {

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

      AtualizaGradeProdutos(rs, 'Incluir')
      MovimentaEstoque(rs, true)
    }
  }

  const AtualizaGradeProdutos = async (rsMalharia: ProducaoMalhariaInterface, tipo: 'Incluir' | 'Excluir') => {
    try {
      const rs = await clsCrud.consultar({
        entidade: "ProducaoMalharia",
        joins: [{ tabelaRelacao: "producaomalharia.produto", relacao: "produto" }],
        criterio: { idMalharia: rsMalharia.idMalharia },
        select: ["peso AS total_peca", "nome AS produto_nome"],
      });

      setRsPecasSomadas((prevRsPecasSomadas) => {
        const tmpProducao = [...prevRsPecasSomadas]; // Cria uma cópia do estado anterior
        const produtoAtual = rs[0];
        const produtoExistente = tmpProducao.find((p) => p.produto_nome === produtoAtual.produto_nome);

        if (produtoExistente) {
          if (tipo === 'Incluir') {
            produtoExistente.total_peca += produtoAtual.total_peca;
            produtoExistente.qtd_peca += 1;
          } else {
            produtoExistente.total_peca -= produtoAtual.total_peca;
            produtoExistente.qtd_peca -= 1;
          }

          // Remove o produto se o total for zero
          if (produtoExistente.total_peca === 0) {
            return tmpProducao.filter((item) => item.produto_nome !== produtoAtual.produto_nome);
          }
        } else if (tipo === 'Incluir') {
          // Adiciona novo produto apenas no caso de inclusão
          tmpProducao.push({
            produto_nome: produtoAtual.produto_nome,
            total_peca: produtoAtual.total_peca,
            qtd_peca: 1,
          });
        }

        return tmpProducao;
      });
    } catch (error) {
      console.error("Erro ao atualizar a grade de produtos:", error);
    }
  };

  const LimpaPecas = async () => {
    const tinturaria = rsMaster.idTinturaria as number
    await clsApi.limpaPecas<Array<ProducaoMalhariaInterface>>({
      url: 'limpaPecas',
      method: 'post',
      tinturaria,
      mensagem: 'Limpeza de pecas ...',
      setMensagemState: setMensagemState
    })
  }

  const AtualizaPeca = async (rsDetalhes: Array<DetalheTinturariaInterface>): Promise<Array<ProducaoMalhariaInterface>> => {
    let tmpProducao: Array<ProducaoMalhariaInterface> = []

    const promises = rsDetalhes.map(async (det: DetalheTinturariaInterface) => {
      const rs = await pesquisarPecaID(det.idMalharia);
      if (rs) {
        rs.dataFechado = clsFormatacao.dataNormalParaDateTime(rsMaster.dataTinturaria);
        rs.fechado = true;
        rs.idTinturaria = rsMaster.idTinturaria;
        return rs;
      }
      // Se rs for null, retorna null para não adicionar nada ao tmpProducao
      return null;
    });

    // Aguarde a resolução de todas as promessas e filtre os valores nulos
    tmpProducao = (await Promise.all(promises)).filter((item): item is ProducaoMalhariaInterface => item !== null);

    return tmpProducao;
  }

  const pesquisarPecaID = async (id: number): Promise<ProducaoMalhariaInterface | null> => {
    try {
      const rs = await clsCrud.pesquisar({
        entidade: "ProducaoMalharia",
        criterio: {
          idMalharia: id,
        },
      });

      // Verifica se o resultado não está vazio e retorna o primeiro item ou null se estiver vazio
      return rs.length > 0 ? rs[0] : null;
    } catch (error) {
      console.error("Erro ao pesquisar PecaID:", error);
      // Retorna null ou lida com o erro conforme necessário
      return null;
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