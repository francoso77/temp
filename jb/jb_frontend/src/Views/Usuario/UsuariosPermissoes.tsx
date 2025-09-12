import { Container, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import React, { useContext, useEffect, useState } from 'react';
import ClsCrud from '../../Utils/ClsCrudApi';
import { UsuarioInterface, UsuarioPermissaoInterface } from '../../Interfaces/sistema/usuarioInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { ModuloInterface, ModuloPermissaoInterface } from '../../Interfaces/sistema/moduloInterface';
import { CardPermissao } from '../../Componentes/CardPermissao';


interface PropsInterface {
  idUsuario: number
  openPermissao: boolean
  setOpenPermissao: React.Dispatch<React.SetStateAction<boolean>>
}

export interface PermissaoInterface {
  idModulo: number;
  idUsuario: number;
  idModuloPermissao: number;
  ativo: boolean;
  permissao: string;
}

export default function UsuariosPermissoes({ idUsuario, openPermissao, setOpenPermissao }: PropsInterface) {

  const clsCrud: ClsCrud = new ClsCrud()
  const [rsUsuario, setRsUsuario] = useState<UsuarioInterface>()
  const [rsModulos, setRsModulos] = useState<Array<ModuloInterface>>()
  const [rsPermissoes, setRsPermissoes] = useState<Array<ModuloPermissaoInterface>>()
  const [rsPermissoesUsuario, setRsPermissoesUsuario] = useState<Array<UsuarioPermissaoInterface>>()
  const { usuarioState, setUsuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [rsPermissoesCheck, setRsPermissoesCheck] = useState<PermissaoInterface[]>([]);

  const btFechar = () => {
    setOpenPermissao(false)
  }

  const checkPermissao = async () => {

    let tmpAtivos: PermissaoInterface[] = []

    //console.log('rsPermissoes', rsPermissoes)

    rsPermissoes?.map((permissoes) => {
      tmpAtivos.push({
        idModulo: permissoes.idModulo,
        idModuloPermissao: Number(permissoes.idModuloPermissao ?? 0), // garante number
        idUsuario: idUsuario,
        ativo: false,
        permissao: permissoes.permissao,
      })
    })

    rsPermissoes?.map((permissoes) => {
      rsPermissoesUsuario?.map((permissoesUsuario) => {

        if (permissoes.idModuloPermissao === permissoesUsuario.idModuloPermissao) {
          tmpAtivos.map((item) => {
            if (item.idModuloPermissao === permissoes.idModuloPermissao) {
              item.ativo = true
            }
          })
        }
      })
    })

    //console.log('tmpAtivos', tmpAtivos)
    setRsPermissoesCheck(tmpAtivos)
  }


  const BuscarDados = async () => {
    clsCrud
      .pesquisar({
        entidade: "Usuario",
        criterio: {
          idUsuario: idUsuario
        },
        token: usuarioState.token
      })
      .then((rs: Array<UsuarioInterface>) => {
        //console.log('Usuario', rs)
        setRsUsuario(rs[0])
      })

    clsCrud
      .pesquisar({
        entidade: "Modulo",
        token: usuarioState.token
      })
      .then((rs: Array<ModuloInterface>) => {
        //console.log('Modulo', rs)
        setRsModulos(rs)
      })

    clsCrud
      .pesquisar({
        entidade: "ModuloPermissao",
        token: usuarioState.token
      })
      .then((rs: Array<ModuloPermissaoInterface>) => {
        //console.log('ModuloPermissao', rs)
        setRsPermissoes(rs)
      })

    clsCrud
      .pesquisar({
        entidade: "UsuarioPermissao",
        //relations: ['moduloPermissao', 'usuario'],
        criterio: {
          idUsuario: idUsuario
        },
        camposLike: ['idUsuario'],
        select: ['idModuloPermissao', 'idUsuario', 'idUsuarioPermissao'],
        token: usuarioState.token
      })
      .then((rs: Array<any>) => {
        //console.log('UsuarioPermissao', rs)
        setRsPermissoesUsuario(rs)
      })

  }

  useEffect(() => {
    BuscarDados()
  }, [])

  useEffect(() => {
    if (rsPermissoes && rsPermissoesUsuario) {
      checkPermissao()
    }
  }, [rsPermissoes, rsPermissoesUsuario])


  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  return (
    <>
      <Dialog
        open={openPermissao}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'>
        <Paper variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            m: 1,
            p: 1,
            backgroundColor: '#3c486b'
          }}>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: 'white', textAlign: 'center', fontSize: 25 }}>
              Ativando Permissões
            </Typography>
          </Grid>
          < Grid item xs={6} sx={{ display: 'flex', alignItems: 'left' }}>
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
        <Container maxWidth="md" sx={{ mt: 1 }}>
          <Paper variant="outlined" sx={{ padding: 1 }}>
            <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>

              <Grid item xs={12} md={12}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        border: "2px solid",
                        borderColor: "secondary.main",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        Usuário: {rsUsuario?.nome}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12}>
                {rsModulos?.map((item, index) => (
                  <CardPermissao
                    key={index}
                    modulo={item.modulo}
                    permissoes={rsPermissoesCheck.filter((p) => p.idModulo === item.idModulo)}
                  />
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Dialog>
    </>
  );
}