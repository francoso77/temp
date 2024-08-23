import { useContext, useEffect, useRef, useState } from 'react';
import { ProducaoMalhariaInterface } from '../../../../jb_backend/src/interfaces/producaoMalhariaInterface';
import { TurnoType, TurnoTypes } from '../../types/turnoTypes';
import ClsCrud from '../../Utils/ClsCrudApi';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import ClsValidacao from '../../Utils/ClsValidacao';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import { MaquinaInterface } from '../../../../jb_backend/src/interfaces/maquinaInterface';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { Box, Dialog, Grid, IconButton, Input, OutlinedInput, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import ComboBox from '../../Componentes/ComboBox';
import InputText from '../../Componentes/InputText';
import InputCalc from '../../Componentes/InputCalc';
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';

interface DadosPecaInterface {
  nomeProduto: string | undefined
  peca: string
  peso: string
}

export function ProducaoMalharia() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const obterDataAtualSistema = (): string => {
    const dataAtual = DateTime.now()
    return clsFormatacao.dataISOtoDatetime(dataAtual.toFormat('dd/MM/yyyy'))
  }

  const ResetDadosPeca: DadosPecaInterface = {
    nomeProduto: '',
    peca: '',
    peso: ''
  }
  const ResetDados: ProducaoMalhariaInterface = {
    peca: '0',
    idMaquina: 0,
    idProduto: 0,
    dataProducao: obterDataAtualSistema(),
    turno: TurnoType.segundo,
    peso: 0,
    localizacao: '',
    idPessoa_revisador: 0,
    idPessoa_tecelao: 0,
    fechado: false,
    dataFechado: undefined,
    idTinturaria: null
  }

  const [open, setOpen] = useState(false)
  const [erros, setErros] = useState({})
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [producaoMalharia, setProducaoMalharia] = useState<ProducaoMalhariaInterface>(ResetDados)
  const [rsDadosPeca, setRsDadosPeca] = useState<DadosPecaInterface>(ResetDadosPeca)
  const [rsRevisador, setRsRevisador] = useState<Array<PessoaInterface>>([])
  const [rsTecelao, setRsTecelao] = useState<Array<PessoaInterface>>([])
  const [rsMaquina, setRsMaquina] = useState<Array<MaquinaInterface>>([])
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
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
        setRsRevisador(rs)
      })

    clsCrud.pesquisar({
      entidade: 'Pessoa',
      criterio: {
        tipoPessoa: 'T'
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<PessoaInterface>) => {
        setRsTecelao(rs)
      })

    clsCrud.pesquisar({
      entidade: 'Maquina',
      criterio: {
        ativo: true
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<MaquinaInterface>) => {
        setRsMaquina(rs)
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
        setRsProduto(rs)
      })

  }

  const novaPeca = (maquina: number) => {

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
      titulo: '',
      tituloAnterior: 'Produção Malharia',
      pathTitulo: '/',
      pathTituloAnterior: '/ProducaoMalharia'
    })
    irPara('/')
  }


  useEffect(() => {
    BuscarDados()
    if (firstFieldRef.current) {
      firstFieldRef.current.focus()
      firstFieldRef.current.select()
    }
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: -1.5, mr: -5, mb: -5 }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
            <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
              <ComboBox
                inputRef={firstFieldRef}
                opcoes={rsMaquina}
                campoDescricao="nome"
                campoID="idMaquina"
                dados={producaoMalharia}
                mensagemPadraoCampoEmBranco="Tear"
                field="idMaquina"
                label="Tear"
                erros={erros}
                setState={setProducaoMalharia}
                onFocus={(e) => e.target.select(1)}
                onBlur={(e) => novaPeca(producaoMalharia.idMaquina)}
                onKeyDown={(event) => btPulaCampo(event, 1)}
                tamanhoFonte={30}
                autoFocus
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: 2 }} >
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
                tamanhoFonte={30}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 2 }} >
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
                tamanhoFonte={30}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
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
                tamanhoFonte={30}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
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
                tamanhoFonte={30}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
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
                tamanhoFonte={30}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ mt: 2, pl: { md: 1 } }}>
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
                tamanhoFonte={50}
                textAlign={'center'}
                labelAlign={'center'}
                corFundo={'#cbdce9'}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
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
                tamanhoFonte={50}
                textAlign={'center'}
                labelAlign={'center'}
                corFundo={'#cbdce9'}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
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
                tamanhoFonte={50}
                textAlign={'center'}
                labelAlign={'center'}
                corFundo={'#cbdce9'}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>

        <Tooltip title={'Confirmar'}>
          <IconButton
            color="secondary"
            sx={{ mt: 0, mr: 5 }}
            onClick={() => btConfirmar()}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 70 }} />
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