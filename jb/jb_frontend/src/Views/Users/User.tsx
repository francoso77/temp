import { Container, Grid, IconButton, Paper, Typography, Tooltip } from '@mui/material';
import Text from '../../Componentes/Text';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { UserInterface } from '../../../../tambordog-backend/src/interfaces/userInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';



const ResetDados: UserInterface = {
  cpf: '',
  email: '',
  whatsapp: '',
  senha: '',
  ativo: true,
}

export default function User() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.incluindo })
  const [erros, setErros] = useState({})
  const [user, setUser] = useState<UserInterface>(ResetDados)


  const irpara = useNavigate()
  const btFechar = () => {
    irpara('/Login')
  }

  const btCancelar = () => {
    setErros({})
    setUser(ResetDados)
    btFechar()
    setLocalState({ action: actionTypes.incluindo })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eCPF('cpf', user, erros, retorno, false)
    retorno = validaCampo.eTelefone('whatsapp', user, erros, retorno, false)
    retorno = validaCampo.naoVazio('senha', user, erros, retorno, 'A senha não pode ser vázio')
    retorno = validaCampo.eEmail('email', user, erros, retorno, false)
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
        entidade: "User",
        criterio: {
          cpf: user.cpf
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
          entidade: "User",
          criterio: user
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
                dados={user}
                field="ativo"
                setState={setUser}
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2 }}>
              <InputText
                label="CPF"
                mask="cpf"
                // onChange={() => TemCPF()}
                setState={setUser}
                dados={user}
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
                label="WhatsApp"
                setState={setUser}
                dados={user}
                field="whatsapp"
                erros={erros}
                type="tel"
                mask='tel'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2 }}>
              <Text
                field="senha"
                label="Senha"
                dados={user}
                setState={setUser}
                tipo='pass'
                erros={erros}
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <Text
                label="E-mail"
                setState={setUser}
                dados={user}
                field="email"
                erros={erros}
                type="email"
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