import React, { useContext, useEffect, useRef, useState } from 'react'
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface'
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface'
import { MaquinaInterface } from '../../../../jb_backend/src/interfaces/maquinaInterface'
import { PerdaMalhariaInterface } from '../../../../jb_backend/src/interfaces/perdaMalhariaInterface'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import ClsCrud from '../../Utils/ClsCrudApi'
import { Box, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import Condicional from '../../Componentes/Condicional/Condicional'
import ComboBox from '../../Componentes/ComboBox'
import InputText from '../../Componentes/InputText'
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable'
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface'
import ClsValidacao from '../../Utils/ClsValidacao'
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal'
import { MensagemTipo } from '../../ContextoGlobal/MensagemState'

interface PropsInterface {
  open: boolean
  clickFechar: () => void
}

export default function PerdasMalharia({ open = false, clickFechar }: PropsInterface) {

  const clsFormatacao = new ClsFormatacao()
  const clsCrud = new ClsCrud()
  const validaCampo: ClsValidacao = new ClsValidacao()

  const ResetDados: PerdaMalhariaInterface = {
    idPessoa_tecelao: 0,
    idProduto: 0,
    idMaquina: 0,
    dataPerda: clsFormatacao.obterDataAtualSistema(),
    qtd: 0,
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando });
  const [rsTecelao, setRsTecelao] = useState<Array<PessoaInterface>>([])
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  const [rsMaquina, setRsMaquina] = useState<Array<MaquinaInterface>>([])
  const [perda, setPerda] = useState<PerdaMalhariaInterface>(ResetDados)
  const [dadosTabela, setDadosTabela] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const cabecalhoPerda: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'dataPerda',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'idProduto',
      format: (_v, rs: any) => rs.produto.nome
    },
    {
      cabecalho: 'Qtd',
      alinhamento: 'left',
      campo: 'qtd',
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
  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataPerda', perda, erros, retorno)
    retorno = validaCampo.naoVazio('idPessoa_tecelao', perda, erros, retorno, 'Informe um tecelão')
    retorno = validaCampo.naoVazio('idMaquina', perda, erros, retorno, 'Informe um tear')
    retorno = validaCampo.naoVazio('idProduto', perda, erros, retorno, 'Informe um produto')
    retorno = validaCampo.naoVazio('qtd', perda, erros, retorno, 'Informe um valor')

    setErros(erros)
    return retorno
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      if (rs) {
        setPerda(rs)
      }
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      if (rs) {
        setPerda(rs)
      }
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const pesquisarID = (id: string | number): Promise<PerdaMalhariaInterface | null> => {
    return clsCrud
      .pesquisar({
        entidade: "PerdaMalharia",
        criterio: {
          idPerdaMalharia: id,
        },
      })
      .then((rs: Array<PerdaMalhariaInterface>) => {
        if (rs.length > 0) {
          let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataPerda)
          return {
            ...rs[0],
            dataPerda: clsFormatacao.dataISOtoDatetime(dt)
          }
        }
        return null; // Caso não encontre resultados
      });
  };

  const btCancelar = () => {
    setPerda(ResetDados)
    setErros({})
    setLocalState({ action: actionTypes.pesquisando })
  }

  const btConfirmar = async () => {
    const isIncluirOuEditar = validarDados() &&
      (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando)

    const params = {
      entidade: 'PerdaMalharia',
      criterio: isIncluirOuEditar ? perda : { idPerdaMalharia: perda.idPerdaMalharia },
      cb: btPesquisar,
      localState,
      setMensagemState,
    };

    const rs = await clsCrud[isIncluirOuEditar ? 'incluir' : 'excluir'](params)

    if (!rs.ok) {
      MensagemErro('Erro no cadastro da perda')
    } else {
      setLocalState({ action: actionTypes.pesquisando })
    }
  }

  const btIncluir = () => {
    setPerda(ResetDados)
    setErros({})
    setLocalState({ action: actionTypes.incluindo })
  }

  const btPesquisar = () => {
    clsCrud.pesquisar({
      entidade: 'PerdaMalharia',
      campoOrder: ['dataPerda'],
      tipoOrder: 'DESC',
      relations: ['tecelao', 'maquina', 'produto'],
      select: ['idPerdaMalharia', 'dataPerda', 'qtd', 'idPessoa_tecelao', 'idMaquina', 'idProduto'],
    }).then((rs: Array<any>) => {
      if (rs.length > 0) {
        setDadosTabela(rs)
      }
    })
  }
  const BuscarDados = () => {

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
      entidade: 'Produto',
      criterio: {
        ativo: true,
        tipoProduto: 9,
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<ProdutoInterface>) => {
        setRsProduto(rs)
      })

    clsCrud.pesquisar({
      entidade: 'Maquina',
      campoOrder: ['nome'],
    })
      .then((rs: Array<MaquinaInterface>) => {
        setRsMaquina(rs)
      })
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

  useEffect(() => {
    BuscarDados()
    btPesquisar()
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='xs'>
        <Paper variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            m: 1,
            p: 1.5,
            backgroundColor: '#3c486b'
          }}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ ml: 5, color: 'white', flexGrow: 1, textAlign: 'center' }}>
              Perdas Malharia
            </Typography>
            <Tooltip title={'Fechar'} >
              <IconButton
                color="secondary"
                sx={{ color: 'white', marginLeft: 'auto' }}
                onClick={() => clickFechar()}
              >
                <CancelRoundedIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action !== 'pesquisando'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={6} sx={{ mt: 1 }}>
                <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                  <InputText
                    type='tel'
                    tipo="date"
                    label="Data"
                    dados={perda}
                    field="dataPerda"
                    setState={setPerda}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onKeyDown={(event: any) => btPulaCampo(event, 1)}
                    onFocus={(e) => e.target.select()}
                    textAlign={'center'}
                    labelAlign={'center'}
                    autoFocus
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ mt: 1 }}>
                <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                  <ComboBox
                    opcoes={rsTecelao}
                    campoDescricao="nome"
                    campoID="idPessoa"
                    dados={perda}
                    mensagemPadraoCampoEmBranco="Escolha um tecelão"
                    field="idPessoa_tecelao"
                    label="Tecelão"
                    erros={erros}
                    setState={setPerda}
                    disabled={localState.action === 'excluindo' ? true : false}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event) => btPulaCampo(event, 2)}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ mt: 1 }}>
                <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                  <ComboBox
                    opcoes={rsProduto}
                    campoDescricao="nome"
                    campoID="idProduto"
                    dados={perda}
                    mensagemPadraoCampoEmBranco="Escolha um produto"
                    field="idProduto"
                    label="Produto"
                    erros={erros}
                    setState={setPerda}
                    disabled={localState.action === 'excluindo' ? true : false}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event) => btPulaCampo(event, 3)}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ mt: 1 }}>
                <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                  <ComboBox
                    opcoes={rsMaquina}
                    campoDescricao="nome"
                    campoID="idMaquina"
                    dados={perda}
                    mensagemPadraoCampoEmBranco="Escolha um tear"
                    field="idMaquina"
                    label="Tear"
                    erros={erros}
                    setState={setPerda}
                    disabled={localState.action === 'excluindo' ? true : false}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event) => btPulaCampo(event, 4)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                  <InputText
                    tipo='currency'
                    scale={2}
                    label="Qtd"
                    dados={perda}
                    field="qtd"
                    setState={setPerda}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 0)}
                    tamanhoFonte={30}
                    textAlign={'center'}
                    labelAlign={'center'}
                  />
                </Box>
              </Grid>
              <Condicional condicao={localState.action !== 'pesquisando'}>
                <Grid item xs={12} sx={{ mt: 1.5, textAlign: 'center' }}>
                  <Tooltip title={'Cancelar'}>
                    <IconButton
                      color="secondary"
                      sx={{ mt: 3, ml: 2 }}
                      onClick={() => btCancelar()}
                    >
                      <CancelRoundedIcon sx={{ fontSize: 50 }} />
                    </IconButton>
                  </Tooltip>
                  <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
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
                </Grid>
              </Condicional>
            </Grid>
          </Paper >
        </Condicional>
        <Condicional condicao={localState.action === actionTypes.pesquisando}>
          <Paper sx={{ m: 1, p: 0 }}>
            <Grid item xs={12} sx={{ mb: 1, textAlign: 'center' }}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: -1, ml: { xs: 1, md: 0.5 } }}
                  onClick={() => btIncluir()}
                >
                  <AddCircleIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <DataTable
                cabecalho={cabecalhoPerda}
                dados={dadosTabela}
                acoes={[
                  {
                    icone: "edit",
                    onAcionador: (rs: PerdaMalhariaInterface) =>
                      onEditar(rs.idPerdaMalharia as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: PerdaMalhariaInterface) =>
                      onExcluir(rs.idPerdaMalharia as number),
                    toolTip: "Excluir",
                  },
                ]}
              />
            </Grid>
          </Paper>
        </Condicional>
      </Dialog >
    </>
  )
}