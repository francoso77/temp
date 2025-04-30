import { useContext, useEffect, useRef, useState } from 'react'
import { ProducaoMalhariaInterface } from '../../../../jb_backend/src/interfaces/producaoMalhariaInterface'
import { TurnoType, TurnoTypes } from '../../types/turnoTypes'
import ClsCrud from '../../Utils/ClsCrudApi'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import ClsValidacao from '../../Utils/ClsValidacao'
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface'
import { MaquinaInterface } from '../../../../jb_backend/src/interfaces/maquinaInterface'
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface'
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
  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [producaoMalharia, setProducaoMalharia] = useState<ProducaoMalhariaInterface>(ResetDados)
  const [rsDadosPeca, setRsDadosPeca] = useState<DadosPecaInterface>(ResetDadosPeca)
  const [rsRevisador, setRsRevisador] = useState<Array<PessoaInterface>>([])
  const [rsTecelao, setRsTecelao] = useState<Array<PessoaInterface>>([])
  const [rsMaquina, setRsMaquina] = useState<Array<MaquinaInterface>>([])
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  const [rsMeses, setRsMeses] = useState<Array<any>>([])
  const [rsTotais, setRsTotais] = useState<DadosTotaisInterface>(ResetDadosTotais)
  const [selectedValue, setSelectedValue] = useState<MesPesquisado>({ mes: "" })



  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])
  const firstFieldRef = useRef<HTMLInputElement>(null)

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
  const BuscarDados = () => {

    clsCrud.pesquisar({
      entidade: 'Pessoa',
      criterio: {
        tipoPessoa: 'R'
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<PessoaInterface>) => {
        setRsRevisador(rs && rs.length > 0 ? rs : [])
      })

    clsCrud.pesquisar({
      entidade: 'Pessoa',
      criterio: {
        tipoPessoa: 'T'
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<PessoaInterface>) => {
        setRsTecelao(rs && rs.length > 0 ? rs : [])
      })

    clsCrud.pesquisar({
      entidade: 'Maquina',
      criterio: {
        ativo: true
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<MaquinaInterface>) => {
        setRsMaquina(rs && rs.length > 0 ? rs : [])
      })

    clsCrud.pesquisar({
      entidade: 'Produto',
      criterio: {
        tipoProduto: 9,
        ativo: true
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<ProdutoInterface>) => {
        setRsProduto(rs && rs.length > 0 ? rs : [])
      })

    clsCrud.consultar({
      entidade: 'ProducaoMalharia',
      joins: [{ tabelaRelacao: 'producaomalharia.produto', relacao: 'produto' }],
      tipoOrder: 'DESC',
      groupBy: 'mes',
      campoOrder: ['mes'],
      select: ['CONCAT( LPAD(MONTH(dataProducao), 2, "0"), "/",YEAR(dataProducao)) AS mes']
    })
      .then((rs: Array<any>) => {
        setRsMeses(rs || []);
        if (rs && rs.length > 0) {
          setSelectedValue({ mes: rs[0].mes });
        } else {
          setSelectedValue({ mes: '' });
        }
      })
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
        if (rs.length > 0) {
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
                  mensagem: 'Peça lançada com sucesso!',
                  exibir: true,
                  exibirBotao: true,
                  cb: null,
                  tipo: MensagemTipo.Ok,
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
                mensagem: 'Falha de comunicação lançamento não realizado!',
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
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Produção Malharia',
      pathTitulo: '/',
      pathTituloAnterior: '/ProducaoMalharia'
    })
    irPara('/')
  }

  useEffect(() => {
    BuscarDados()
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
      <Paper variant="outlined" sx={{ padding: 1, m: 1 }}>
        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
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
        <Paper variant="outlined" sx={{ p: 0.5, m: 1, bgcolor: 'greenyellow' }}>
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
            sx={{ mt: 0, mr: 5 }}
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
            <CheckCircleRoundedIcon sx={{ fontSize: 55 }} />
          </IconButton>
        </Tooltip>
      </Grid>

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