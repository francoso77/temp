import { useContext, useEffect, useRef, useState } from 'react'
import { ProducaoMalhariaInterface } from '../../Interfaces/producaoMalhariaInterface'
import { TurnoType, TurnoTypes } from '../../types/turnoTypes'
import ClsCrud from '../../Utils/ClsCrudApi'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import ClsValidacao from '../../Utils/ClsValidacao'
import { PessoaInterface } from '../../Interfaces/pessoaInterface'
import { MaquinaInterface } from '../../Interfaces/maquinaInterface'
import { ProdutoInterface } from '../../Interfaces/produtoInterface'
import { Box, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import ComboBox from '../../Componentes/ComboBox'
import InputText from '../../Componentes/InputText'
import InputCalc from '../../Componentes/InputCalc'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import { useNavigate } from 'react-router-dom'
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal'
import { MensagemTipo } from '../../ContextoGlobal/MensagemState'
import Condicional from '../../Componentes/Condicional/Condicional'
import LeaderboardTwoToneIcon from '@mui/icons-material/LeaderboardTwoTone'
import ContentCutTwoToneIcon from '@mui/icons-material/ContentCutTwoTone'
import Graficos from './Graficos'
import PerdasMalharia from './PerdasMalharia'
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface'
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable'
import AddCircleIcon from "@mui/icons-material/AddCircle"
import DeleteIcon from '@mui/icons-material/Delete'
import { UsuarioType } from '../../types/usuarioTypes'

interface DadosPecaInterface {
  nomeProduto: string | undefined
  peca: string
  peso: string
}

interface DadosTotaisInterface {
  mes: string
  pesoTotal: number
  qtdTotal: number
}

interface MesPesquisado {
  mes: string
}

interface PesquisaInterface {
  itemPesquisa: string
  idTecelao: number
  idProduto: number
  turno: TurnoType | number
}
export function ProducaoMalharia() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDadosPeca: DadosPecaInterface = {
    nomeProduto: '',
    peca: '',
    peso: ''
  }

  const ResetDadosTotais: DadosTotaisInterface = {
    mes: '',
    pesoTotal: 0,
    qtdTotal: 0
  }

  const ResetDados: ProducaoMalhariaInterface = {
    peca: '0',
    idMaquina: 0,
    idProduto: 0,
    dataProducao: clsFormatacao.obterDataAtualSistema(),
    turno: TurnoType.segundo,
    peso: 0,
    localizacao: '',
    idPessoa_revisador: 0,
    idPessoa_tecelao: 0,
    fechado: false,
    dataFechado: null,
    idTinturaria: null
  }

  const [open, setOpen] = useState(false)
  const [openGraficos, setOpenGraficos] = useState(false)
  const [openPerdas, setOpenPerdas] = useState(false)
  const [erros, setErros] = useState({})
  const { setMensagemState, setLayoutState, layoutState, usuarioState, mensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [producaoMalharia, setProducaoMalharia] = useState<ProducaoMalhariaInterface>(ResetDados)
  const [rsDadosPeca, setRsDadosPeca] = useState<DadosPecaInterface>(ResetDadosPeca)
  const [rsRevisador, setRsRevisador] = useState<Array<PessoaInterface>>([])
  const [rsTecelao, setRsTecelao] = useState<Array<PessoaInterface>>([])
  const [rsMaquina, setRsMaquina] = useState<Array<MaquinaInterface>>([])
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  const [rsMeses, setRsMeses] = useState<Array<any>>([])
  const [rsTotais, setRsTotais] = useState<DadosTotaisInterface>(ResetDadosTotais)
  const [selectedValue, setSelectedValue] = useState<MesPesquisado>({ mes: "" })
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsProducaoMalharia, setRsProducaoMalharia] = useState<Array<any>>([])
  const [producaoMalhariaAll, setProducaoMalhariaAll] = useState<Array<any>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '', idTecelao: 0, idProduto: 0, turno: TurnoType.segundo })


  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])
  const firstFieldRef = useRef<HTMLInputElement>(null)

  const cabecalhoProducaoMalharia: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Peça',
      alinhamento: 'left',
      campo: 'peca',
    },
    {
      cabecalho: 'Produção',
      alinhamento: 'center',
      campo: 'dataProducao',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Turno',
      alinhamento: 'center',
      campo: 'turno',
      format: (turno) => TurnoTypes.find(x => x.idTurno === turno)?.descricao
    },
    {
      cabecalho: 'Tecelão',
      alinhamento: 'center',
      campo: 'idPessoa_tecelao',
      format: (idPessoa_tecelao) => rsTecelao.find(x => x.idPessoa === idPessoa_tecelao)?.nome
    },
    {
      cabecalho: 'Produto',
      alinhamento: 'center',
      campo: 'idProduto',
      format: (idProduto) => rsProduto.find(x => x.idProduto === idProduto)?.nome
    },
    {
      cabecalho: 'Peso',
      alinhamento: 'right',
      campo: 'peso',
      format: (peso) => clsFormatacao.currency(peso)
    },
  ]

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      if (usuarioState.tipoUsuario !== UsuarioType.admin && rs.fechado) {
        setMensagemState({
          titulo: 'Produção Fechada',
          exibir: true,
          mensagem: 'Produção fechada, não pode ser alterada!',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null
        })
        return
      }
      setProducaoMalharia(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }

  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProducaoMalharia(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setProducaoMalharia(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }


  const pesquisarID = (id: string | number): Promise<ProducaoMalhariaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "ProducaoMalharia",
        criterio: {
          idMalharia: id,
        },
      })
      .then((rs: Array<ProducaoMalhariaInterface>) => {
        let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataProducao)
        return {
          ...rs[0],
          dataProducao: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
        }
      })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idMaquina', producaoMalharia, erros, retorno, 'Informe um tear')
    retorno = validaCampo.naoVazio('idProduto', producaoMalharia, erros, retorno, 'Informe um produto')
    retorno = validaCampo.naoVazio('turno', producaoMalharia, erros, retorno, 'Defina um turno')
    retorno = validaCampo.naoVazio('idPessoa_revisador', producaoMalharia, erros, retorno, 'Informe um revisador')
    retorno = validaCampo.naoVazio('idPessoa_tecelao', producaoMalharia, erros, retorno, 'Informe um tecelão')
    retorno = validaCampo.eData('dataProducao', producaoMalharia, erros, retorno)
    retorno = validaCampo.naoVazio('peso', producaoMalharia, erros, retorno, 'O peso deve ser maior que 0 (zero)')

    setErros(erros)
    return retorno
  }
  const loadDados = async () => {

    setMensagemState({
      ...mensagemState,
      titulo: 'Carregando dados...',
      exibir: true,
      tipo: MensagemTipo.Loading
    })

    try {

      const [revisadores, teceloes, maquinas, produtos, producao, meses] = await Promise.all([

        clsCrud.pesquisar({
          entidade: 'Pessoa',
          criterio: {
            tipoPessoa: 'R'
          },
          campoOrder: ['nome'],
          tipoOrder: 'ASC'
        }),
        clsCrud.pesquisar({
          entidade: 'Pessoa',
          criterio: {
            tipoPessoa: 'T'
          },
          campoOrder: ['nome'],
          tipoOrder: 'ASC'
        }),
        clsCrud.pesquisar({
          entidade: 'Maquina',
          criterio: {
            ativo: true
          },
          campoOrder: ['nome'],
          tipoOrder: 'ASC'
        }),
        clsCrud.pesquisar({
          entidade: 'Produto',
          criterio: {
            tipoProduto: 9,
            ativo: true
          },
          campoOrder: ['nome'],
          tipoOrder: 'ASC'
        }),
        clsCrud.pesquisar({
          entidade: 'ProducaoMalharia',
          tipoOrder: 'DESC',
          campoOrder: ['dataProducao'],
          select: ['idMalharia', 'dataProducao', 'peca', 'peso', 'idPessoa_tecelao', 'idMaquina', 'idProduto', 'fechado', 'turno']
        }),
        clsCrud.consultar({
          entidade: 'ProducaoMalharia',
          joins: [{ tabelaRelacao: 'producaomalharia.produto', relacao: 'produto' }],
          tipoOrder: 'DESC',
          groupBy: 'mes',
          campoOrder: ['mes'],
          select: ['CONCAT( LPAD(MONTH(dataProducao), 2, "0"), "/",YEAR(dataProducao)) AS mes']
        }),
      ]);

      if (meses && meses.length > 0) {
        setSelectedValue({ mes: meses[0].mes });
      } else {
        setSelectedValue({ mes: '' });
      }

      setRsRevisador(revisadores && revisadores.length > 0 ? revisadores : [])
      setRsTecelao(teceloes && teceloes.length > 0 ? teceloes : [])
      setRsMaquina(maquinas && maquinas.length > 0 ? maquinas : [])
      setRsProduto(produtos && produtos.length > 0 ? produtos : [])
      setRsProducaoMalharia(producao && producao.length > 0 ? producao : [])
      setProducaoMalhariaAll(producao && producao.length > 0 ? producao : [])
      setRsMeses(meses && meses.length > 0 ? meses : [])

      setMensagemState({
        ...mensagemState,
        exibir: false
      })
    } catch (error) {
      console.log(error)
      setMensagemState({
        ...mensagemState,
        titulo: 'Erro ao carregar dados',
        tipo: MensagemTipo.Error,
        exibir: true,
        exibirBotao: true
      })
    }
  }

  const Totalizador = async () => {
    try {
      const rs: DadosTotaisInterface[] = await clsCrud.consultar({
        entidade: 'ProducaoMalharia',
        joins: [{ tabelaRelacao: 'producaomalharia.produto', relacao: 'produto' }],
        tipoOrder: 'DESC',
        groupBy: 'mes',
        campoOrder: ['mes'],
        having: 'pesoTotal > 0',
        select: ['ROUND(SUM(peso),2) AS pesoTotal', 'COUNT(peso) AS qtdTotal', 'CONCAT( LPAD(MONTH(dataProducao), 2, "0"), "/",YEAR(dataProducao)) AS mes']
      });

      if (rs.length === 0) {
        return
      }

      if (selectedValue.mes === "") {
        setRsTotais({
          ...rsTotais,
          mes: rs[0]?.mes || '',
          pesoTotal: rs[0]?.pesoTotal || 0,
          qtdTotal: rs[0]?.qtdTotal || 0
        })
      } else {

        rs.forEach((periodo) => {
          if (periodo.mes === selectedValue.mes) {
            setRsTotais({
              ...rsTotais,
              mes: periodo.mes,
              pesoTotal: periodo.pesoTotal,
              qtdTotal: periodo.qtdTotal
            })
          }
        })
      }

    } catch (error) {
      console.error('Erro ao consultar dados:', error);
    }

  }

  const novaPeca = (maquina: number) => {

    if (maquina) {

      clsCrud.pesquisar({
        entidade: 'ProducaoMalharia',
        criterio: {
          idMaquina: maquina,
        },
        campoOrder: ['peca'],
      })
        .then((rs: Array<ProducaoMalhariaInterface>) => {
          let nomeMaquina: string = ''
          let ultimaPeca: string = ''
          rsMaquina.find(v => v.idMaquina === maquina ? nomeMaquina = v.nome : '')
          if (rs.length === 0) {
            ultimaPeca = nomeMaquina.concat('-').concat('1')
            setProducaoMalharia({ ...producaoMalharia, peca: ultimaPeca })
          } else {
            const sorteDados = rs.sort((a, b) => {
              const numA = parseInt(a.peca.split('-')[1], 10)
              const numB = parseInt(b.peca.split('-')[1], 10)
              return numA - numB
            })
            let ultimaPecaSorteada = sorteDados[sorteDados.length - 1]
            const [prefix, number] = ultimaPecaSorteada.peca.split('-')
            const novaPeca = `${prefix}-${parseInt(number, 10) + 1}`

            ultimaPeca = novaPeca
            setProducaoMalharia({ ...producaoMalharia, peca: ultimaPeca })
          }
        })
    }

  }

  const NomeProduto = (id: number, rs: ProdutoInterface[]): string | undefined => {
    const produto = rs.find((p) => p.idProduto === id)
    return produto ? produto.nome : undefined
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

  const btCancelar = () => {
    setOpen(false)
  }

  const btConfirmaInclusao = () => {

    clsCrud
      .pesquisar({
        entidade: "ProducaoMalharia",
        criterio: {
          peca: producaoMalharia.peca
        }
      }).then((rs) => {
        if (rs.length > 0 && localState.action === actionTypes.incluindo) {
          setMensagemState({
            titulo: 'Duplicidade',
            mensagem: 'Peça já informada!',
            exibir: true,
            exibirBotao: true,
            cb: null,
            tipo: MensagemTipo.Warning
          })
        } else {

          clsCrud
            .incluir({
              entidade: "ProducaoMalharia",
              criterio: producaoMalharia,
              token: usuarioState.token
            }).then((rs) => {
              if (rs.ok) {
                setMensagemState({
                  titulo: 'Produção...',
                  mensagem: localState.action === actionTypes.incluindo ? 'Peça incluida com sucesso!' : 'Peça alterada com sucesso!',
                  exibir: true,
                  exibirBotao: true,
                  cb: null,
                  tipo: localState.action === actionTypes.incluindo ? MensagemTipo.Ok : MensagemTipo.Info,
                })
                Totalizador()
                setProducaoMalharia(ResetDados)
                setRsDadosPeca(ResetDadosPeca)
                setOpen(false)

              } else {
                setMensagemState({
                  titulo: 'Erro...',
                  mensagem: 'Erro nos dados, peça não lançada!',
                  exibir: true,
                  exibirBotao: true,
                  cb: null,
                  tipo: MensagemTipo.Error
                })
              }
            }).catch((e) => {
              setMensagemState({
                titulo: 'Error',
                mensagem: 'Falha de comunicação lançamento não realizado - consulte suas permissões.',
                exibir: true,
                exibirBotao: true,
                cb: null,
                tipo: MensagemTipo.Error
              })
            })
        }
      })
  }

  const btGraficos = () => {
    setOpenGraficos(!openGraficos)
  }

  const btPerdas = () => {
    setOpenPerdas(!openPerdas)
  }
  const btConfirmar = () => {

    if (localState.action === actionTypes.editando) {
      const dia = producaoMalharia.dataProducao.substring(0, 2)
      const mes = producaoMalharia.dataProducao.substring(2, 4)
      const ano = producaoMalharia.dataProducao.substring(4, 8)
      const data = `${ano}-${mes}-${dia}`
      producaoMalharia.dataProducao = data
    } else if (localState.action === actionTypes.excluindo) {
      clsCrud
        .excluir({
          entidade: "ProducaoMalharia",
          criterio: {
            idMalharia: producaoMalharia.idMalharia
          },
          token: usuarioState.token
        }).then((rs) => {
          if (rs.ok) {
            setMensagemState({
              titulo: 'Produção...',
              mensagem: 'Peça excluida com sucesso!',
              exibir: true,
              exibirBotao: true,
              cb: btFechar,
              tipo: MensagemTipo.Error
            })
          }
        })

    }
    if (validarDados()) {
      setRsDadosPeca({
        nomeProduto: NomeProduto(producaoMalharia.idProduto, rsProduto),
        peca: producaoMalharia.peca,
        peso: producaoMalharia.peso.toString()
      })
      setOpen(true)
    }
  }

  const irPara = useNavigate()
  const btFechar = () => {

    if (['incluindo', 'editando', 'excluindo'].includes(localState.action)) {
      setLocalState({ action: actionTypes.pesquisando })
      loadDados()
    } else {

      setLayoutState({
        ...layoutState,
        titulo: '',
        tituloAnterior: 'Produção Malharia',
        pathTitulo: '/',
        pathTituloAnterior: '/ProducaoMalharia'
      })
      irPara('/')
    }
  }

  const filtrarProducaoMalharia = (producaoMalharia: any[], pes: PesquisaInterface) => {

    const termo = pes.itemPesquisa.trim().toUpperCase()
    let filtrados = [...producaoMalharia]

    if (termo !== '') {
      const pareceData = /\d+\/\d*/.test(termo) // reconhece fragmentos como "27/", "10/2025" etc.

      filtrados = filtrados.filter(malharia => {
        if (pareceData) {
          // 🔎 Comparação com data parcial
          const dataProducao = malharia.dataProducao
          if (!dataProducao) return false

          const dataFormatada = new Date(dataProducao)
            .toLocaleDateString('pt-BR')
            .toUpperCase()

          // Permite busca parcial como "27/" ou "10/2025"
          return dataFormatada.includes(termo)
        } else {
          const peca = malharia.peca
          return peca.includes(termo)
        }
      })
    }

    if (pes.idTecelao && pes.idTecelao > 0) {
      filtrados = filtrados.filter(
        (malharia) => malharia.idPessoa_tecelao === pes.idTecelao
      )
    }

    if (pes.idProduto && pes.idProduto > 0) {
      filtrados = filtrados.filter(
        (malharia) => malharia.idProduto === pes.idProduto
      )
    }

    if (pes.turno && pes.turno > 0) {
      filtrados = filtrados.filter(
        (malharia) => malharia.turno === pes.turno
      )
    }

    return filtrados
  }

  const btPesquisar = () => {
    setRsProducaoMalharia(filtrarProducaoMalharia(producaoMalhariaAll, pesquisa))
  }

  useEffect(() => {
    const resultado = filtrarProducaoMalharia(producaoMalhariaAll, pesquisa)
    setRsProducaoMalharia(resultado)
  }, [pesquisa, producaoMalhariaAll])

  useEffect(() => {
    loadDados()
    Totalizador()
    if (firstFieldRef.current) {
      firstFieldRef.current.focus()
      firstFieldRef.current.select()
    }
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isDesktop = useMediaQuery('(min-width:960px)')

  return (
    <>
      <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
        <Paper variant="outlined" sx={{ padding: 1, m: 1, borderRadius: 2 }}>
          <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sx={{ textAlign: 'right', mt: 1 }}>
              <Tooltip title="Fechar lançamento">
                <IconButton onClick={() => btFechar()}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={2} >
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <ComboBox
                  inputRef={firstFieldRef}
                  opcoes={rsMaquina}
                  campoDescricao="nome"
                  campoID="idMaquina"
                  dados={producaoMalharia}
                  mensagemPadraoCampoEmBranco=""
                  field="idMaquina"
                  label="Tear"
                  erros={erros}
                  setState={setProducaoMalharia}
                  onFocus={(e) => e.target.select(1)}
                  onBlur={(e) => novaPeca(producaoMalharia.idMaquina)}
                  onKeyDown={(event) => btPulaCampo(event, 1)}
                  tamanhoFonte={25}
                  disabled={localState.action === 'excluindo'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}  >
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                <ComboBox
                  opcoes={rsProduto}
                  campoDescricao="nome"
                  campoID="idProduto"
                  dados={producaoMalharia}
                  mensagemPadraoCampoEmBranco="Escolha um produto"
                  field="idProduto"
                  label="Produtos"
                  erros={erros}
                  setState={setProducaoMalharia}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event) => btPulaCampo(event, 2)}
                  tamanhoFonte={25}
                  disabled={localState.action === 'excluindo'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}  >
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                <ComboBox
                  opcoes={TurnoTypes}
                  campoDescricao="descricao"
                  campoID="idTurno"
                  dados={producaoMalharia}
                  mensagemPadraoCampoEmBranco="Qual o turno"
                  field="turno"
                  label="Turno"
                  erros={erros}
                  setState={setProducaoMalharia}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event) => btPulaCampo(event, 3)}
                  tamanhoFonte={25}
                  disabled={localState.action === 'excluindo'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} >
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <ComboBox
                  opcoes={rsRevisador}
                  campoDescricao="nome"
                  campoID="idPessoa"
                  dados={producaoMalharia}
                  mensagemPadraoCampoEmBranco="Escolha um revisador"
                  field="idPessoa_revisador"
                  label="Revisador"
                  erros={erros}
                  setState={setProducaoMalharia}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 4)}
                  tamanhoFonte={25}
                  disabled={localState.action === 'excluindo'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} >
              <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                <ComboBox
                  opcoes={rsTecelao}
                  campoDescricao="nome"
                  campoID="idPessoa"
                  dados={producaoMalharia}
                  mensagemPadraoCampoEmBranco="Escolha um tecelão"
                  field="idPessoa_tecelao"
                  label="Tecelão"
                  erros={erros}
                  setState={setProducaoMalharia}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event) => btPulaCampo(event, 7)}
                  tamanhoFonte={25}
                  disabled={localState.action === 'excluindo'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} >
              <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                <InputText
                  tipo='uppercase'
                  label="Localização"
                  dados={producaoMalharia}
                  field="localizacao"
                  setState={setProducaoMalharia}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 7)}
                  tamanhoFonte={25}
                  disabled={localState.action === 'excluindo'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={5} >
              <Box ref={(el: any) => (fieldRefs.current[6] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Data"
                  posicaoLabel={'bottom'}
                  dados={producaoMalharia}
                  field="dataProducao"
                  setState={setProducaoMalharia}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 7)}
                  tamanhoFonte={40}
                  textAlign={'center'}
                  labelAlign={'center'}
                  corFundo={'#cbdce9'}
                  disabled={localState.action === 'excluindo'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3} >
              <Box ref={(el: any) => (fieldRefs.current[7] = el)}>
                <InputText
                  tipo='currency'
                  scale={3}
                  label="Peso"
                  posicaoLabel={'bottom'}
                  dados={producaoMalharia}
                  field="peso"
                  setState={setProducaoMalharia}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 8)}
                  tamanhoFonte={40}
                  textAlign={'center'}
                  labelAlign={'center'}
                  corFundo={'#cbdce9'}
                  disabled={localState.action === 'excluindo'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} >
              <Box ref={(el: any) => (fieldRefs.current[8] = el)}>
                <InputText
                  tipo='number'
                  label="Peça"
                  posicaoLabel={'bottom'}
                  dados={producaoMalharia}
                  field="peca"
                  setState={setProducaoMalharia}
                  disabled={true}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  tamanhoFonte={40}
                  textAlign={'center'}
                  labelAlign={'center'}
                  corFundo={'#cbdce9'}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Graficos open={openGraficos} clickFechar={btGraficos} />
            </Grid>
            <Grid item xs={12}>
              <PerdasMalharia open={openPerdas} clickFechar={btPerdas} />
            </Grid>
          </Grid>
        </Paper>
        <Condicional condicao={isDesktop}>
          <Paper variant="outlined" sx={{ p: 0.5, m: 1, bgcolor: '#ffcc80' }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={4} >
                <ComboBox
                  opcoes={rsMeses}
                  campoDescricao="mes"
                  campoID="mes"
                  dados={selectedValue}
                  field="mes"
                  setState={setSelectedValue}
                  mensagemPadraoCampoEmBranco=""
                  label="Período"
                  erros={erros}
                  onBlur={Totalizador}
                  tamanhoFonte={40}
                  corFundo={'#cbdce9'}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} md={4} >
                <InputCalc
                  tipo='currency'
                  scale={2}
                  label="Peso Total"
                  posicaoLabel={'top'}
                  value={rsTotais?.pesoTotal.toString()}
                  disabled={true}
                  onFocus={(e) => e.target.select()}
                  tamanhoFonte={40}
                  textAlign={'center'}
                  labelAlign={'center'}
                  corFundo={'#cbdce9'}
                />
              </Grid>
              <Grid item xs={12} md={4} >
                <InputCalc
                  tipo='number'
                  label="Qtd Total"
                  posicaoLabel={'top'}
                  value={rsTotais?.qtdTotal}
                  disabled={true}
                  onFocus={(e) => e.target.select()}
                  tamanhoFonte={40}
                  textAlign={'center'}
                  labelAlign={'center'}
                  corFundo={'#cbdce9'}
                />
              </Grid>
            </Grid>
          </Paper>
        </Condicional>
        <Box sx={{ height: 20 }} />
        <Grid item xs={12} sx={{ textAlign: 'right' }}>

          <Tooltip title={'Perdas'}>
            <IconButton
              color="secondary"
              sx={{ mt: 0, mr: 5 }}
              onClick={() => btPerdas()}
            >
              <ContentCutTwoToneIcon sx={{ fontSize: 55 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={'Gráficos'}>
            <IconButton
              color="secondary"
              sx={{ mt: 0, mr: 15 }}
              onClick={() => btGraficos()}
            >
              <LeaderboardTwoToneIcon sx={{ fontSize: 55 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={'Confirmar'}>
            <IconButton
              color="secondary"
              sx={{ mt: 0, mr: 5 }}
              onClick={() => btConfirmar()}
            >
              {localState.action === 'excluindo' ? <DeleteIcon sx={{ fontSize: 55 }} /> : <CheckCircleRoundedIcon sx={{ fontSize: 55 }} />}

            </IconButton>
          </Tooltip>
        </Grid>
      </Condicional>
      <Condicional condicao={localState.action === actionTypes.pesquisando}>
        <Paper variant="outlined" sx={{ p: 0.5, m: 1 }}>
          <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sx={{ textAlign: 'right', mt: 1, mr: -5, mb: -5 }}>
              <Tooltip title={'Fechar'}>
                <IconButton onClick={() => btFechar()}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={6} md={4}>
              <InputText
                label='Buscar Peça e Data'
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
            <Grid item xs={6} md={2}>
              <ComboBox
                opcoes={TurnoTypes}
                campoDescricao="descricao"
                campoID="idTurno"
                dados={pesquisa}
                mensagemPadraoCampoEmBranco="Todos os turnos"
                field="turno"
                label="Turno"
                erros={erros}
                setState={setPesquisa}
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <ComboBox
                opcoes={rsTecelao}
                campoDescricao="nome"
                campoID="idPessoa"
                dados={pesquisa}
                mensagemPadraoCampoEmBranco="Todos os tecelões"
                field="idTecelao"
                label="Tecelão"
                erros={erros}
                setState={setPesquisa}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <ComboBox
                opcoes={rsProduto}
                campoDescricao="nome"
                campoID="idProduto"
                dados={pesquisa}
                mensagemPadraoCampoEmBranco="Todos os produtos"
                field="idProduto"
                label="Produto"
                erros={erros}
                setState={setPesquisa}
              />
            </Grid>
            <Grid item xs={2} md={1}>
              <Tooltip title={'Nova peça'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 5, ml: { xs: 1, md: 2 } }}
                  onClick={() => btIncluir()}
                >
                  <AddCircleIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} >
              <Box sx={{ height: 20 }}>
                <Typography variant="h5" align="left" sx={{ mb: 2 }}>
                  Últimos lançamentos
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} >
              <DataTable
                cabecalho={cabecalhoProducaoMalharia}
                dados={rsProducaoMalharia}
                acoes={usuarioState.tipoUsuario === UsuarioType.admin ?
                  [
                    {
                      icone: "edit",
                      onAcionador: (rs: ProducaoMalhariaInterface) =>
                        onEditar(rs.idMalharia as number),
                      toolTip: "Editar",
                    },
                    {
                      icone: "delete",
                      onAcionador: (rs: ProducaoMalhariaInterface) =>
                        onExcluir(rs.idMalharia as number),
                      toolTip: "Excluir",
                    },
                  ] : [
                    {
                      icone: "edit",
                      onAcionador: (rs: ProducaoMalhariaInterface) =>
                        onEditar(rs.idMalharia as number),
                      toolTip: "Editar",
                    },
                  ]}
              />
            </Grid>
          </Grid>
        </Paper>
      </Condicional>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'
      >
        <Paper variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            m: 1,
            p: 1.5,
            backgroundColor: '#3c486b'
          }}>
          <Grid item xs={12} container justifyContent={'center'} >
            <Typography sx={{ color: 'white', fontSize: 30, textAlign: 'center' }}>
              Confirma o lançamento?
            </Typography>
          </Grid>
        </Paper>
        <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
          <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} md={12} sx={{ mt: 1, pl: { md: 1 } }}>
              <InputCalc
                value={rsDadosPeca.nomeProduto}
                label="Produto"
                posicaoLabel={'bottom'}
                disabled={true}
                tamanhoFonte={40}
                textAlign={'center'}
                labelAlign={'center'}
                corFundo={'#cbdce9'}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 1, pl: { md: 1 } }}>
              <InputCalc
                value={rsDadosPeca.peca}
                label="Peça"
                posicaoLabel={'bottom'}
                disabled={true}
                tamanhoFonte={40}
                textAlign={'center'}
                labelAlign={'center'}
                corFundo={'#cbdce9'}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 1, pl: { md: 1 } }}>
              <InputCalc
                value={rsDadosPeca.peso}
                tipo={'currency'}
                label="Peso"
                posicaoLabel={'bottom'}
                disabled={true}
                tamanhoFonte={40}
                textAlign={'center'}
                labelAlign={'center'}
                corFundo={'#cbdce9'}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
              <Tooltip title={'Cancelar'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 1, ml: 2 }}
                  onClick={() => btCancelar()}
                >
                  <CancelRoundedIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={'Confirmar'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 1, ml: 2 }}
                  onClick={() => btConfirmaInclusao()}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
      </Dialog >
    </>
  )
}