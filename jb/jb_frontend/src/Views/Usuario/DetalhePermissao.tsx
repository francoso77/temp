import { Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import { ModuloPermissaoInterface } from '../../Interfaces/sistema/moduloInterface';
import InputText from '../../Componentes/InputText';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ClsValidacao from '../../Utils/ClsValidacao';



interface PropsInterface {
  openPermissao: boolean,
  setOpenPermissao: React.Dispatch<React.SetStateAction<boolean>>,
  permissao: ModuloPermissaoInterface
  setPermissao: React.Dispatch<React.SetStateAction<ModuloPermissaoInterface>>,
  localState: ActionInterface,
  setLocalState: React.Dispatch<React.SetStateAction<ActionInterface>>
}


export default function DetalhePermissao({ permissao, setPermissao, openPermissao, setOpenPermissao, localState, setLocalState }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud: ClsCrud = new ClsCrud()

  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [erros, setErros] = useState({})



  const buscarDados = () => {
    clsCrud.pesquisar({
      entidade: "ProducaoMalharia",
      criterio: {
        fechado: 0
      },
      relations: ['produto'],
      camposLike: ['fechado'],
      select: [
        'idTinturaria',
        'idMalharia',
        'peca',
        'idProduto',
        'produto.nome',
        'peso',
        'dataFechado',
        'fechado',
      ],
    }).then((rs: Array<any>) => {
      if (rs.length > 0) {
        //setDetalhePeca(rs)
      } else {
        setMensagemState({
          titulo: 'Aviso',
          exibir: true,
          mensagem: 'Não há peças em aberto!',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null
        })
      }
    })
  }

  const btFechar = () => {
    setPermissao({} as ModuloPermissaoInterface)
    setErros({})
    setOpenPermissao(false)
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('permissao', permissao, erros, retorno, 'A descrição da permissaodo do módulo não pode ser vázio')

    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    clsCrud
      .pesquisar({
        entidade: "ModuloPermissao",
        criterio: {
          permissao: permissao.permissao, modulo: permissao.idModulo,
        },
        setMensagemState: setMensagemState
      })
      .then((rs) => {
        if (rs.length > 0) {
          setMensagemState({
            titulo: 'Erro...',
            exibir: true,
            mensagem: 'Item já cadastrado!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        } else {
          if (validarDados()) {
            if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
              clsCrud.incluir({
                entidade: "ModuloPermissao",
                criterio: permissao,
                token: usuarioState.token
              })
                .then((rs) => {
                  if (rs.ok) {
                    setLocalState({ action: actionTypes.pesquisando })
                  } else {
                    setMensagemState({
                      titulo: 'Erro...',
                      exibir: true,
                      mensagem: 'Não foi possível incluir - Consulte Suporte',
                      tipo: MensagemTipo.Error,
                      exibirBotao: true,
                      cb: null
                    })
                  }
                  btFechar()
                })
                .catch((err) => {
                  setMensagemState({
                    titulo: 'Erro...',
                    exibir: true,
                    mensagem: 'Erro no cadastro - Consulte Suporte',
                    tipo: MensagemTipo.Error,
                    exibirBotao: true,
                    cb: null
                  })
                })
            }
          }
        }
      })
  }
  useEffect(() => {
    buscarDados()
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  return (
    <>
      <Dialog
        open={openPermissao}
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
              Cadastro da Permissão
            </Typography>
            <Tooltip title={'Fechar'} >
              <IconButton
                color="secondary"
                sx={{ color: 'white', marginLeft: 'auto' }}
                onClick={() => btFechar()}
              >
                <CancelRoundedIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Paper>
        <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
          <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12}>
              <InputText
                label="Descrição da Permissão do Módulo"
                dados={permissao}
                field="permissao"
                setState={setPermissao}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={35}
                onFocus={(e) => e.target.select()}
                autoFocus
              />
            </Grid>
            <Condicional condicao={['incluindo', 'editando', 'detalhes'].includes(localState.action)}>
              <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
                <Tooltip title={'Cancelar'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 3, ml: 2 }}
                    onClick={() => btFechar()}
                  >
                    <CancelRoundedIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={'Confirmar'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 3 }}
                    onClick={() => btConfirmar()}
                  >
                    <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Condicional>

          </Grid>
        </Paper >
      </Dialog >
    </>
  )
}