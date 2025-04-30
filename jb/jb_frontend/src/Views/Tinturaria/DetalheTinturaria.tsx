import { Grid, IconButton, Paper, TableContainer, Tooltip, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
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
import ClsRelatoriosProgramacao from '../../Utils/ClsRelatoriosProgramacao';
import { DetalheEstruturaInterface } from '../../../../jb_backend/src/interfaces/estruturaInterface';
import { EstoqueInterface } from '../../../../jb_backend/src/interfaces/estoqueInterface';
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';
import TabelaPecas from './TabelaPecas';

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
  const clsRelatorios = new ClsRelatoriosProgramacao()

  const DadosPeca: DadosPecaInterface = {
    peca: ''
  }

  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.editando })
  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [dados, setDados] = useState<Array<DetalheTinturariaInterface>>([])
  const [rsPecasSomadas, setRsPecasSomadas] = useState<Array<PecasSomadasInterface>>([])
  const [rsPessoas, setRsPessoas] = useState<Array<PessoaInterface>>([])
  const [PesquisaPeca, setPesquisaPeca] = useState<DadosPecaInterface>(DadosPeca)
  const [openPecas, setOpenPecas] = useState<boolean>(false)
  const [rsPecas, setRsPecas] = useState<Array<string>>([])
  const [rsListaPecas, setRsListaPecas] = useState<Array<string>>([])
  //const [pecaAux, setPecaAux] = useState<string>('')
  let auxPeca: string = ''

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
  const onExcluir = (rsDetalhe: DetalheTinturariaInterface) => {

    pesquisarPecaID(rsDetalhe.idMalharia).then((produto) => {
      const podeExcluir = produto ? MovimentaEstoque(produto, false) : null
      if (podeExcluir) {
        let tmpDetalhe: Array<DetalheTinturariaInterface> = []
        dados.forEach(det => {
          if (det.idMalharia !== rsDetalhe.idMalharia) {
            tmpDetalhe.push(det)
          }
        })

        setDados(tmpDetalhe)

        const removerItem = rsDetalhe.malharia.peca

        const tmpRsPecas = rsPecas.filter(peca => peca !== removerItem)

        setRsPecas(tmpRsPecas)


        clsCrud.excluir({
          entidade: "DetalheTinturaria",
          criterio: {
            idMalharia: rsDetalhe.idMalharia
          },
          token: usuarioState.token,
        })
          .then((rs) => {
            if (!rs.ok) {
              MensagemErro('Erro no cadastro')
            }
          })
      }
      if (produto) {
        AtualizaGradeProdutos(produto, 'Excluir')
      }
    })
  }

  const btCancelar = () => {
    setMasterLocalState({ action: actionTypes.pesquisando })
    setLocalState({ action: actionTypes.incluindo })
  }

  const podeIncluirDetalhe = (): boolean => {
    const indice = dados.findIndex(
      (v) => v.malharia.peca === auxPeca
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
    return indice < 0
  }
  const TemEstrutura = async (idProduto: number): Promise<Array<DetalheEstruturaInterface> | null> => {
    try {
      const [estrutura] = await clsCrud.pesquisar({
        entidade: 'Estrutura',
        relations: ['detalheEstruturas'],
        criterio: { idProduto: idProduto },
      })

      // Verifica se existe a estrutura e retorna detalheEstruturas ou um array vazio
      return estrutura?.detalheEstruturas ?? null;
    } catch (error) {
      MensagemErro('Produto sem estrutua definida')
      console.error('Erro ao buscar estrutura:', error)
      return null
    }
  }


  const TemEstoque = async (idProduto: number, cliente: number): Promise<EstoqueInterface> => {
    const rs = await clsCrud
      .pesquisar({
        entidade: 'Estoque',
        criterio: {
          idProduto: idProduto,
          idPessoa_fornecedor: cliente,
        },
      })
    //verifica se o resultado não está vazio e retorna o primeiro item   
    if (rs.length > 0) {
      return rs[0];
    } else {
      // MensagemErro('Produto sem estoque')
      const estoqueZerado: EstoqueInterface = {
        idProduto: idProduto,
        idPessoa_fornecedor: cliente,
        idCor: null,
        qtd: 0
      }
      return estoqueZerado
    }
  }

  const MovimentaEstoque = async (rs: ProducaoMalhariaInterface, fechado: boolean): Promise<boolean> => {
    try {
      const estrutura = await TemEstrutura(rs.idProduto as number)

      if (!estrutura) {
        MensagemErro('Produto sem estrutura')
        return false
      }

      const detalhes = estrutura.map(async (det) => {
        const estoque = await TemEstoque(det.idProduto, rsMaster.idPessoa_cliente)
        if (fechado) {
          estoque.qtd = Number((estoque.qtd - (rs.peso * det.qtd)).toFixed(2))
        } else {
          estoque.qtd = Number((estoque.qtd + (rs.peso * det.qtd)).toFixed(2))
        }
        const rsEstoque = await clsCrud.incluir({
          entidade: 'Estoque',
          criterio: estoque,
          token: usuarioState.token,
        })
        if (!rsEstoque.ok) {
          MensagemErro('Estoque não foi atualizado')
          return false
        }
        return true
      })

      // Espera todas as promessas serem resolvidas
      const results = await Promise.all(detalhes)

      // Verifica se alguma das promessas retornou false
      return results.every(result => result === true)

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
      token: usuarioState.token,
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
              token: usuarioState.token,
            })
          }
        })
      }
    })
  }

  const SomaPeca = async (rs: ProducaoMalhariaInterface) => {

    let tmpDetalhe: Array<DetalheTinturariaInterface> = []

    const podeMovimentarEstoque = await MovimentaEstoque(rs, true)

    if (podeIncluirDetalhe() && podeMovimentarEstoque) {

      tmpDetalhe.push({
        idTinturaria: rsMaster.idTinturaria as number,
        idMalharia: rs.idMalharia as number,
        malharia: rs,

      })

      setDados((prevDados) => {
        if (!prevDados.some(item => item.idMalharia === rs.idMalharia)) {
          return [...prevDados, ...tmpDetalhe];
        }
        return prevDados;
      });

      AtualizaGradeProdutos(rs, 'Incluir')
      AtualizaListaDePecas()

    }
  }

  const AtualizaGradeProdutos = async (rsMalharia: ProducaoMalhariaInterface, tipo: 'Incluir' | 'Excluir') => {
    try {
      const rs = await clsCrud.consultar({
        entidade: "ProducaoMalharia",
        joins: [{ tabelaRelacao: "producaomalharia.produto", relacao: "produto" }],
        criterio: { idMalharia: rsMalharia.idMalharia },
        select: ["ROUND(SUM(peso),2) AS total_peca", "nome AS produto_nome"]
      });

      if (!rs || rs.length === 0) return;

      setRsPecasSomadas((prevRsPecasSomadas) => {
        // Criar um novo array sem modificar referências
        let tmpProducao = prevRsPecasSomadas.map((item) => ({ ...item }));

        const produtoAtual = rs[0];
        const index = tmpProducao.findIndex((p) => p.produto_nome === produtoAtual.produto_nome);

        if (index !== -1) {
          // Produto já existe, atualiza valores
          if (tipo === 'Incluir') {
            tmpProducao[index].total_peca += produtoAtual.total_peca;
            tmpProducao[index].qtd_peca += 1;
          } else {
            tmpProducao[index].total_peca -= produtoAtual.total_peca;
            tmpProducao[index].qtd_peca -= 1;
          }

          // Remove o produto se o total for zero
          if (tmpProducao[index].total_peca === 0) {
            tmpProducao.splice(index, 1);
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
      const rs = await pesquisarPecaID(det.idMalharia)
      if (rs) {
        rs.dataFechado = clsFormatacao.dataNormalParaDateTime(rsMaster.dataTinturaria)
        rs.fechado = true
        rs.idTinturaria = rsMaster.idTinturaria
        return rs
      }
      // Se rs for null, retorna null para não adicionar nada ao tmpProducao
      return null
    });

    // Aguarde a resolução de todas as promessas e filtre os valores nulos
    tmpProducao = (await Promise.all(promises)).filter((item): item is ProducaoMalhariaInterface => item !== null)

    return tmpProducao
  }

  const pesquisarPecaID = async (id: number): Promise<ProducaoMalhariaInterface | null> => {
    try {
      const rs = await clsCrud.pesquisar({
        entidade: "ProducaoMalharia",
        criterio: {
          idMalharia: id,
        },
      })

      // Verifica se o resultado não está vazio e retorna o primeiro item ou null se estiver vazio
      return rs.length > 0 ? rs[0] : null
    } catch (error) {
      console.error("Erro ao pesquisar PecaID:", error)
      // Retorna null ou lida com o erro conforme necessário
      return null
    }
  }


  const btPesquisaPeca = async (peca: string = PesquisaPeca.peca) => {
    auxPeca = peca
    clsCrud.pesquisar({
      entidade: "ProducaoMalharia",
      criterio: {
        peca: peca,
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
      ],
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
        camposLike: ['idTinturaria'],
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

  const btSelecionarPecas = () => {
    setOpenPecas(!openPecas)
  }


  const AtualizaListaDePecas = () => {
    let tmpPecas = rsPecas

    if (PesquisaPeca.peca !== "") {
      tmpPecas.push(PesquisaPeca.peca)
      setRsPecas(tmpPecas)

    } else if (tmpPecas.length > 0) {

      rsListaPecas.forEach(peca => {
        if (!tmpPecas.includes(peca)) {
          tmpPecas.push(peca)
        }
      })
      setRsPecas(tmpPecas)
    } else {
      setRsPecas(rsListaPecas)
    }
    setRsListaPecas([])
  }


  const AtualizaGrade = () => {

    if (rsListaPecas.length > 0) {

      for (const item of rsListaPecas) {
        btPesquisaPeca(item)
      }
    }
  }

  useEffect(() => {
    BuscarDados()
    AtualizaSoma()
  }, [])

  useEffect(() => {
    if (rsListaPecas.length > 0) {
      AtualizaGrade()
    }
  }, [rsListaPecas])

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
              <Grid item xs={8} md={4} sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                <InputText
                  label=""
                  tipo="uppercase"
                  dados={PesquisaPeca}
                  field="peca"
                  setState={setPesquisaPeca}
                  iconeEnd='searchicon'
                  onClickIconeEnd={() => btPesquisaPeca()}
                  mapKeyPress={[{ key: 'Enter', onKey: btPesquisaPeca }]}
                  autoFocus
                />
                <Tooltip title={'Selecionar peças'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 2, ml: 2 }}
                    onClick={() => btSelecionarPecas()}
                  >
                    <FactCheckTwoToneIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Tooltip>
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
              />
            </TableContainer>
          </Grid>
          <Grid item xs={7} >
            <TableContainer component={Paper}>
              <DataTable
                cabecalho={cabecalhoPecas}
                dados={rsPecasSomadas}
                exibirPaginacao={false}
                temTotal={true}
                colunaSoma={['total_peca', 'qtd_peca']}
              />
            </TableContainer>
          </Grid>
          <Condicional condicao={masterLocalState.action !== actionTypes.excluindo}>

            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
              {/* <Tooltip title={'Romaneio'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: 2 }}
                  onClick={() => btRomaneio()}
                >
                  <PictureAsPdfRoundedIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip> */}
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
        <Condicional condicao={openPecas}>
          <Grid item xs={12}>
            <TabelaPecas
              openPecas={openPecas}
              setOpenPecas={setOpenPecas}
              rsPecas={rsPecas}
              setRsPecas={setRsPecas}
              rsListaPecas={rsListaPecas}
              setRsListaPecas={setRsListaPecas}
            />
          </Grid>
        </Condicional>
      </Paper >
    </>
  )
}