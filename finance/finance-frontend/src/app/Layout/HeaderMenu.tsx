import React, { useContext, useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { Avatar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CustomButton from '../../Componentes/Button';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ClsCrud from '../../Utils/ClsCrudApi';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import ClsApi from '../../Utils/ClsApi';
import { RespostaPadraoInterface } from '../../Interfaces/respostaPadrao.interface';
import { LoginInterface } from '../../Interfaces/login';
import Condicional from '../../Componentes/Condicional/Condicional';
import { ColorSelectList } from '../../Componentes/ColorSelect';
import { AccountInterface } from '../../Interfaces/account';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function HeaderMenu() {

  const [rsContas, setRsContas] = useState<Array<AccountInterface>>([])
  const clsCrud: ClsCrud = new ClsCrud()
  const clsApi: ClsApi = new ClsApi()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { usuarioState, setUsuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const navegar = useNavigate()

  const toggleDrawer = () => {
    setLayoutState({ ...layoutState, exibirMenu: !layoutState.exibirMenu })
  };

  const fecharLoading = () => {
    setMensagemState({ ...mensagemState, exibir: false })
    setLayoutState({ ...layoutState, exibirMenu: false })
  }

  const handleLogout = async () => {

    const Logout = await clsApi.execute<RespostaPadraoInterface<LoginInterface>>({
      method: 'post',
      url: 'logoutUsuario',
      token: usuarioState.token,
      email: usuarioState.emailUsuario
    })

    if (Logout.ok) {

      localStorage.removeItem('user')
      localStorage.removeItem('token')

      setUsuarioState({
        idUsuario: '0',
        nomeUsuario: '',
        logado: false,
        token: '',
        emailUsuario: '',
        fotoUsuario: ''
      })

      setLayoutState({ ...layoutState, contaPadrao: null })
      navegar('/')
    }
  }

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Account",
        criterio: { userId: usuarioState.idUsuario },
        campoOrder: ['name'],
      })
      .then((rs: Array<AccountInterface>) => {
        setRsContas(rs)
      })

  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    BuscarDados()
  }, [layoutState, usuarioState]);

  const handleItemChange = (selected: AccountInterface | null) => {
    setLayoutState({ ...layoutState, contaPadrao: selected?.id });
  };


  const handleNovaTransacao = () => {
    navegar('/transacoes/nova')
    setLayoutState({ ...layoutState, titulo: 'Transações', pathTitulo: '/transacoes' })
  }

  const handleUser = () => {
    navegar('/perfil')
    setLayoutState({ ...layoutState, titulo: 'Perfil', pathTitulo: '/perfil' })
  }


  return (
    <>
      <AppBar sx={{ bgcolor: '#010108' }} onLoad={fecharLoading}>
        <Toolbar sx={{ mb: 2, borderBottom: '0.5px solid #3a3a3a', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
          <Tooltip title='Menu'>
            <IconButton
              color='primary'
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <CurrencyExchangeIcon sx={{ width: isMobile ? 25 : 32, height: isMobile ? 25 : 32, color: "#8280d8" }} />
            </IconButton>
          </Tooltip>
          <Condicional condicao={!isMobile}>
            <Typography variant="h6" gutterBottom sx={{ m: '20px', color: ' #fff', textAlign: 'left' }}>
              FinanceControl
            </Typography>
            <Box >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ m: '20px', color: ' #fff', textAlign: 'left' }}>
                {layoutState.titulo}
              </Typography>
            </Box>
          </Condicional>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ mr: 1 }}>

            <ColorSelectList
              label="Contas"
              items={rsContas}
              onChange={handleItemChange}
              menuBgColor='#212121'
              corIcon='#fff'
              corTexto='#fff'
              minWidth={isMobile ? 100 : 220}
              maxHeight={isMobile ? 20 : 35}
              fontSize={isMobile ? 10 : 16}
              width={isMobile ? 10 : 16}
              height={isMobile ? 10 : 16}
            />
          </Box>
          <Box>
            <CustomButton
              onClick={handleNovaTransacao}
              bgColor='#1976d2'
              textColor='black'
              iconPosition='start'
              icon={<MonetizationOnIcon />}
              sx={{
                fontSize: isMobile ? 10 : 16,
                py: isMobile ? 0.3 : 0.65,
                px: isMobile ? 0.3 : 0.65
              }}

            >
              Nova Transação
            </CustomButton>
          </Box>
          <Box sx={{ marginRight: -2 }}>
            <Tooltip title={usuarioState.emailUsuario}>
              <IconButton
                size="large"
                edge="end"
                color="primary"
                sx={{ mr: 1 }}
                onClick={handleUser}
              >
                {usuarioState.fotoUsuario ? (
                  <Avatar
                    alt={usuarioState.nomeUsuario}
                    src={
                      usuarioState.fotoUsuario
                        ? `${usuarioState.fotoUsuario}`
                        : undefined
                    }
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircleTwoToneIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ marginRight: -2 }}>
            <Tooltip title='Sair'>
              <IconButton
                size="large"
                edge="end"
                color="primary"
                sx={{ mr: 1 }}
                onClick={handleLogout}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
}
