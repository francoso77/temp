import { Container, Grid, IconButton, Paper, Typography, Tooltip } from '@mui/material';
import Text from '../../Componentes/Text';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { UsuarioInterface } from '../../../../jb_backend/src/interfaces/sistema/usuarioInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';



const ResetDados: UsuarioInterface = {
  cpf: '',
  senha: '',
  ativo: true,
  nome: '',
  tentativasLogin: 0
}

export default function Usuario() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.incluindo })
  const [erros, setErros] = useState({})
  const [usuario, setUsuario] = useState<UsuarioInterface>(ResetDados)


  const irpara = useNavigate()
  const btFechar = () => {
    irpara('/Login')
  }

  const btCancelar = () => {
    setErros({})
    setUsuario(ResetDados)
    btFechar()
    setLocalState({ action: actionTypes.incluindo })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eCPF('cpf', usuario, erros, retorno, false)
    retorno = validaCampo.naoVazio('nome', usuario, erros, retorno, 'Digite um nome para o usuário')
    retorno = validaCampo.naoVazio('senha', usuario, erros, retorno, 'A senha não pode ser vázio')
    setErros(erros)
    return retorno
  }

  const TemCPF = (): boolean => {
    // setMensagemState({
    //   ...mensagemState,
    //   titulo: '',
    //   exibir: true,
    //   mensagem: 'Pesquisando CPF...',
    //   tipo: MensagemTipo.Loading,
    // })

    let _cpf: boolean = false
    clsCrud
      .pesquisar({
        entidade: "Usuario",
        criterio: {
          cpf: usuario.cpf
        },
        select: ['cpf']
      })
      .then((rs: any) => {
        setMensagemState({
          ...mensagemState,
          titulo: '',
          exibir: false,
          mensagem: '',
        })
        console.log('lendo o rs', rs)
        if (rs) {
          console.log('entrou aqui - then')
          setMensagemState({
            ...mensagemState,
            titulo: 'Atenção',
            exibir: true,
            mensagem: 'CPF já cadastrado!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
          })
          _cpf = false
        } else {
          console.log('vazio')
          _cpf = true
        }

      }).catch(() => {
        setMensagemState({
          ...mensagemState,
          titulo: 'Erro de conexão',
          exibir: true,
          mensagem: 'Erro na conexão com banco de dados!',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
        });
        console.log('está vindo aqui - catch')
        _cpf = false
      })

    console.log('fim...', _cpf)
    return _cpf
  }

  const btConfirmar = () => {

    if (validarDados() && TemCPF()) {

      if (localState.action === actionTypes.incluindo) {
        clsCrud.incluir({
          entidade: "Usuario",
          criterio: usuario
        })
          .then((rs) => {
            if (rs.ok) {
              setMensagemState({
                ...mensagemState,
                titulo: 'Cadastro',
                exibir: true,
                mensagem: 'Usuário incluído com sucesso!',
                tipo: MensagemTipo.Ok,
                exibirBotao: true
              })
              btFechar()
              setLocalState({ action: actionTypes.incluindo })
            }
          }).catch(() => {
            setMensagemState({
              ...mensagemState,
              titulo: 'Erro de conexão',
              exibir: true,
              mensagem: 'Erro na conexão com banco de dados!',
              tipo: MensagemTipo.Error,
              exibirBotao: true,
            })
          })
      }
    }
  }

  return (

    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>

        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography component="h5" variant="h5" align="left">
              Cadastro de Usuários
            </Typography>
          </Grid>
          <Condicional condicao={localState.action !== 'pesquisando'}>
            <Grid item xs={12} sm={12} md={12} sx={{ textAlign: 'left' }}>
              <Text
                label="Ativo"
                tipo="checkbox"
                dados={usuario}
                field="ativo"
                setState={setUsuario}
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2 }}>
              <InputText
                label="CPF"
                mask="cpf"
                // onChange={() => TemCPF()}
                setState={setUsuario}
                dados={usuario}
                field="cpf"
                erros={erros}
                type='tel'
                disabled={localState.action === 'excluindo' ? true : false}
                min={14}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Nome"
                setState={setUsuario}
                dados={usuario}
                field="nome"
                erros={erros}
                type="text"
                tipo='uppercase'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2 }}>
              <Text
                field="senha"
                label="Senha"
                dados={usuario}
                setState={setUsuario}
                tipo='pass'
                erros={erros}
                disabled={localState.action === 'excluindo' ? true : false}
              />
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
              <Condicional condicao={localState.action === 'incluindo'}>
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
    </Container >
  )
}