import { Container, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClsCrud from '../../Utils/ClsCrudApi';
import { ModuloPermissaoInterface } from '../../Interfaces/sistema/moduloInterface';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import Condicional from '../../Componentes/Condicional/Condicional';
import { UsuarioType } from '../../types/usuarioTypes';
import DetalhePermissao from './DetalhePermissao';


interface PropsInterface {
  modulo: number
}
export default function ModulosPermissao({ modulo }: PropsInterface) {

  const ResetDados: ModuloPermissaoInterface = {
    idModulo: 0,
    permissao: ''
  }

  const clsCrud: ClsCrud = new ClsCrud()
  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPermissoes, setRsPermissoes] = useState<ModuloPermissaoInterface[]>([])
  const [permissao, setPermissao] = useState<ModuloPermissaoInterface>(ResetDados)
  const [openPermissao, setOpenPermissao] = useState<boolean>(false)


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Permissão',
      alinhamento: 'center',
      campo: 'permissao',

    },
  ]

  const BuscarDados = async () => {
    clsCrud
      .pesquisar({
        entidade: "ModuloPermissao",
        criterio: {
          idModulo: modulo
        },
        camposLike: ["idModulo"],
        campoOrder: ['permissao'],

      })
      .then((rs: Array<ModuloPermissaoInterface>) => {
        setRsPermissoes(rs)
      })
  }
  const pesquisarID = async (id: string | number): Promise<ModuloPermissaoInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "ModuloPermissao",
        criterio: {
          idModulo: id,
        },
        camposLike: ["idModuloPermissao"],
      })
      .then((rs: Array<ModuloPermissaoInterface>) => {
        return rs[0]
      })
  }

  const onEditar = (id: string | number) => {
    rsPermissoes.map((item) => {
      if (item.idModuloPermissao === id) {
        setPermissao(item)
        setOpenPermissao(true)
        setLocalState({ action: actionTypes.editando })
      } else {
        setLocalState({ action: actionTypes.pesquisando })
      }
    })
  }
  const onExcluir = async (id: string | number) => {

    setMensagemState({
      titulo: 'Exclusão de Permissão',
      exibir: true,
      mensagem: 'Confirma a exclusão da Permissão?',
      tipo: MensagemTipo.Warning,
      exibirBotao: "SN",
      cb: () => {
        clsCrud.excluir({
          entidade: "ModuloPermissao",
          criterio: {
            idModuloPermissao: id
          },
          camposLike: ["idModuloPermissao"],
          token: usuarioState.token
        })
          .then((rs) => {
            if (rs.ok) {
              BuscarDados()
              setLocalState({ action: actionTypes.pesquisando })
            } else {
              setMensagemState({
                titulo: 'Erro...',
                exibir: true,
                mensagem: 'Erro ao excluir permissão. Usuários associados!',
                tipo: MensagemTipo.Error,
                exibirBotao: true,
                cb: null
              })
            }
          })
      }
    })
  }
  const btIncluir = () => {
    setPermissao({ idModulo: modulo, permissao: '' })
    setOpenPermissao(true)
    setLocalState({ action: actionTypes.incluindo })
  }

  useEffect(() => {
    const carregarDados = async () => {
      await BuscarDados()
    }
    carregarDados()
  }, [localState])

  return (

    <Container sx={{ mt: 2 }}>
      <Paper variant="outlined" sx={{ padding: 2 }} >
        <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={10} md={11} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography component="h5" variant="h5" align="center">
              Lista das Permissões
            </Typography>
          </Grid>
          <Grid item xs={2} md={1}>
            <Tooltip title={'Incluir Permissão'}>
              <IconButton
                color="secondary"
                sx={{ margin: 0, padding: 0 }}
                onClick={() => btIncluir()}
              >
                <AddCircleIcon sx={{ fontSize: 50 }} />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <DataTable
              cabecalho={cabecalhoForm}
              dados={rsPermissoes}
              acoes={usuarioState.tipoUsuario === UsuarioType.admin ? [
                {
                  icone: "edit",
                  onAcionador: (rs: ModuloPermissaoInterface) =>
                    onEditar(rs.idModuloPermissao as number),
                  toolTip: "Editar",
                },
                {
                  icone: "delete",
                  onAcionador: (rs: ModuloPermissaoInterface) =>
                    onExcluir(rs.idModuloPermissao as number),
                  toolTip: "Excluir",
                },
              ] : []}
            />
          </Grid>
        </Grid>
        <Condicional condicao={openPermissao}>
          <Grid item xs={12}>
            <DetalhePermissao
              openPermissao={openPermissao}
              setOpenPermissao={setOpenPermissao}
              permissao={permissao}
              setPermissao={setPermissao}
              localState={localState}
              setLocalState={setLocalState}
            />
          </Grid>
        </Condicional>
      </Paper>
    </Container>
  )
}