import { Box, Grid, Link, Paper, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import ClsValidacao from '../../Utils/ClsValidacao';
import Text from '../../Componentes/Text';
import { Form, useNavigate } from 'react-router-dom';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import ClsApi from '../../Utils/ClsApi';
import Copyright from '../Layout/Copyright';
import MenuCls, { MenuOpcoesInterface } from '../Layout/ClsMenu';
import { RespostaPadraoInterface } from '../../../../finance-backend/src/interfaces/respostaPadrao.interface';
import { LoginInterface } from '../../../../finance-backend/src/interfaces/login';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CustomButton from '../../Componentes/Button';
import LoginIcon from '@mui/icons-material/Login';
import ClsCrud from '../../Utils/ClsCrudApi';




export default function Login() {

  const [erros, setErros] = useState({})
  const [dados, setDados] = useState({ email: '', senha: '' })
  const clsValidacao: ClsValidacao = new ClsValidacao()
  const { mensagemState, setMensagemState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const contextGlobal = useContext(GlobalContext) as GlobalContextInterface
  const clsApi = new ClsApi()
  const clsCrud = new ClsCrud()
  const navegar = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [contaPadrao, setContaPadrao] = useState<string | null>(null)

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let tmpErros: { [key: string]: string } = {}

    retorno = clsValidacao.eEmail("email", dados, tmpErros, retorno)
    retorno = clsValidacao.naoVazio("senha", dados, tmpErros, retorno)
    retorno = clsValidacao.tamanho("senha", dados, tmpErros, retorno, false, 6, 10, "Campo deve ter entre 6 e 10 caracteres")
    setErros(tmpErros)
    return retorno
  }

  const btEntrar = () => {

    let usuario: string = ""

    if (validarDados()) {

      clsApi.execute<RespostaPadraoInterface<LoginInterface>>({
        url: 'loginUsuario',
        method: 'post',
        email: dados.email,
        senha: dados.senha,
        mensagem: 'Verificando usuário e senha',
        setMensagemState: setMensagemState
      })
        .then(async (rs) => {


          if (rs.ok && rs.dados) {

            usuario = rs.dados.idUsuario

            contextGlobal.setUsuarioState({
              idUsuario: rs.dados.idUsuario,
              nomeUsuario: rs.dados.nomeUsuario,
              logado: true,
              token: rs.dados.token,
              emailUsuario: rs.dados.emailUsuario,
            })

            const MENU: Array<MenuOpcoesInterface> = [
              {
                id: '2',
                parentId: null,
                descricao: 'Dashboard',
                path: '/Cor',
                icon: 'color_lens',
                filhos: [],
                //permitido: rs.dados.permissoes.COR.PERMISSOES.MANUTENCAO.length > 0,
                permitido: true
              },
              {
                id: '3',
                parentId: null,
                descricao: 'Transações',
                path: '/Estrutura',
                icon: 'auto_awesome_motion_outlined',
                filhos: [],
                //permitido: rs.dados.permissoes.ESTRUTURA.PERMISSOES.MANUTENCAO.length > 0,
                permitido: true
              },
              {
                id: '4',
                parentId: null,
                descricao: 'Contas',
                path: '/Maquina',
                icon: 'miscellaneous_services',
                filhos: [],
                //permitido: rs.dados.permissoes.MAQUINA.PERMISSOES.MANUTENCAO.length > 0,
                permitido: true
              },
              {
                id: '5',
                parentId: null,
                descricao: 'Relatórios',
                path: '/Pessoa',
                icon: 'groups_rounded',
                filhos: [],
                //permitido: rs.dados.permissoes.PESSOA.PERMISSOES.MANUTENCAO.length > 0,
                permitido: true
              },
              {
                id: '6',
                parentId: null,
                descricao: 'Empresas',
                path: '/PrazoEntrega',
                icon: 'calendar_month_rounded',
                filhos: [],
                //permitido: rs.dados.permissoes.PRAZO.PERMISSOES.MANUTENCAO.length > 0,
                permitido: true
              },
              {
                id: '7',
                parentId: null,
                descricao: 'Categorias',
                path: '/categorias',
                icon: 'category_rounded',
                filhos: [],
                //permitido: rs.dados.permissoes.PRODUTO.PERMISSOES.MANUTENCAO.length > 0,
                permitido: true
              },
              {
                id: '8',
                parentId: null,
                descricao: 'Setores',
                path: '/setores',
                icon: 'source_two_tone_icon',
                filhos: [],
                //permitido: rs.dados.permissoes.PRODUTO.PERMISSOES.MANUTENCAO.length > 0,
                permitido: true
              },
              {
                id: '11',
                parentId: null,
                descricao: 'Configurações',
                path: '/Usuarios',
                icon: 'person_outline_outlined',
                filhos: [],
                permitido: true,
              }
            ]

            const contas = await clsCrud.pesquisar({
              entidade: "Account",
              criterio: {
                isDefault: true,
                userId: usuario,
              },
              select: ["id", "name", "isDefault", "userId"],
            })

            const idContaPadrao = contas.length > 0 ? contas[0].id as string : ""
            setContaPadrao(idContaPadrao)

            const clsMenu = new MenuCls(MENU)

            let local: string = "/contas"
            let titulo: string = "Contas"

            if (idContaPadrao !== "") {
              local = "/dashboard"
              titulo = "Dashboard"
            }

            contextGlobal.setLayoutState({
              ...layoutState,
              opcoesMenu: clsMenu.Menu,
              titulo: titulo,
              contaPadrao: idContaPadrao
            })
            navegar(local)

          } else {
            setMensagemState({
              ...mensagemState,
              exibir: true,
              tipo: MensagemTipo.Error,
              titulo: 'Validação',
              mensagem: 'Usário ou senha inválido!',
              exibirBotao: true
            })
          }

        }).catch(() => {
          setMensagemState({
            ...mensagemState,
            exibir: true,
            tipo: MensagemTipo.Error,
            titulo: 'Erro de conexão',
            mensagem: 'Não foi possível conectar ao servidor.',
            exibirBotao: true
          })
          navegar("/login")
        })
    }
  }

  return (

    <>
      <Form method='post' action='/Login'>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          height='90vh'

        >
          <Grid item xs={10} sm={8} md={6} lg={4}>
            <Paper sx={{ bgcolor: '#050416' }}>
              <Box
                sx={{ backgroundColor: 'primary.main', bgcolor: '#050416' }}
                textAlign='center'

              >
                <CurrencyExchangeIcon sx={{ fontSize: 150, color: "#8280d8" }} />

                <Typography component="p" variant="h6" color="white">
                  Versão
                  <Typography component="span" variant="body1" color="white">
                    &nbsp;1.00 -&nbsp;
                    <Typography component="span" variant="h6" color="white">
                      Release
                      <Typography component="span" variant="body1" color="white">
                        &nbsp;00001/01
                      </Typography>
                    </Typography>
                  </Typography>
                </Typography>
              </Box>
              <Box
                sx={{ backgroundColor: 'white', padding: 2, mx: 5, bgcolor: '#050416' }}
                textAlign='center'
              >
                <Typography variant="h4" fontFamily='sans-serif' fontWeight='bolder' color="primary.main">
                  FinanceControl
                </Typography>

                <Text
                  corFonte='#fff'
                  autofocus
                  label='E-mail'
                  tipo='text'
                  field='email'
                  dados={dados}
                  setState={setDados}
                  erros={erros}
                  autocomplete='email'
                />

                <Text
                  corFonte='#fff'
                  field="senha"
                  label="Senha"
                  tipo='pass'
                  type='password'
                  dados={dados}
                  setState={setDados}
                  erros={erros}
                  mapKeyPress={[{ key: 'Enter', onKey: btEntrar }]}
                  autocomplete='password'
                />
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item xs={12}>
                    <CustomButton
                      bgColor='#1976d2'
                      textColor='#ffffff'
                      icon={<LoginIcon />}
                      onClick={() => btEntrar()}
                      sx={{ width: '100%', mt: 1.5 }}
                    >
                      Entrar
                    </CustomButton>
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center", mt: 1.5, mb: 2 }}>
                    <Link href="/forgot-password" >Esqueci a senha</Link>
                  </Grid>
                </Grid>
                <Copyright />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Form>
    </>
  )
}
