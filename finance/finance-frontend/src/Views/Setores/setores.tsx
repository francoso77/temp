import { Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CustomButton from '../../Componentes/Button';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import InputText from '../../Componentes/InputText';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { SectorInterface } from '../../../../finance-backend/src/interfaces/sector';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import Condicional from '../../Componentes/Condicional/Condicional';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { SetoresFicha } from './setoresFicha';


interface PesquisaInterface {
  name: string
}

export const ResetSetor: SectorInterface = {
  name: '',
  userId: ''
}

export function Setores() {

  const [open, setOpen] = useState(false);

  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [setores, setSetores] = React.useState<SectorInterface>(ResetSetor);
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ name: '' })
  const [rsPesquisa, setRsPesquisa] = useState<Array<SectorInterface>>([])
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const clsCrud = new ClsCrud()

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Nome',
      alinhamento: 'center',
      campo: 'name',
      //format: (arg: string) => arg.toUpperCase()
    }
  ]

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setSetores(rs)
      setLocalState({ action: actionTypes.editando })
      setOpen(true)
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setSetores(rs)
      setLocalState({ action: actionTypes.pesquisando })
      setMensagemState({
        titulo: 'Exclusão',
        exibir: true,
        mensagem: 'Deseja realmente excluir o setor ' + rs.name + '?',
        tipo: 'warning',
        exibirBotao: 'SN',
        cb: (resposta) => {
          if (resposta) {
            clsCrud.excluir({
              entidade: "Setor",
              criterio: {
                id: id,
                userId: usuarioState.idUsuario
              },
              setMensagemState: setMensagemState,
              token: usuarioState.token,
              msg: 'Excluindo setor ...',
            }).then((rs) => {
              if (rs.ok) {
                btPesquisar()
              }
            })
          }
        }
      })
    })
  }

  const pesquisarID = async (id: string | number): Promise<SectorInterface> => {
    return await clsCrud
      .pesquisar({
        entidade: "Sector",
        criterio: {
          id: id,
          userId: usuarioState.idUsuario
        },
      })
      .then((rs: Array<SectorInterface>) => {
        return rs[0]
      })
  }
  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "Sector",
        criterio: {
          name: "%".concat(pesquisa.name).concat("%"),
          userId: usuarioState.idUsuario
        },
        camposLike: ["name"],
        select: ["id", "name"],
        msg: 'Pesquisando setores ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<SectorInterface>) => {
        setRsPesquisa(rs)
      })
  }

  const handleOpen = () => {
    setLocalState({ action: actionTypes.incluindo })
    setSetores(ResetSetor)
    setOpen(true);
  }

  useEffect(() => {

    btPesquisar()
  }, [])

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ m: 1, textAlign: 'left' }}>Lista de Setores</Typography>
        </Grid>
        <Grid item xs={6} sx={{ ml: 2 }}>
          <InputText
            label=""
            placeholder="Buscar setores..."
            dados={pesquisa}
            field="name"
            setState={setPesquisa}
            iconeStart='searchicon'
            onClickIconeStart={() => { btPesquisar() }}
            mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
            autoFocus
            width={'100%'}

          />
        </Grid>
        <Grid item xs={5}>
          <CustomButton
            onClick={() => { handleOpen() }}
            bgColor='#1976d2'
            textColor='#000'
            iconPosition='start'
            icon={<i className="material-icons">add</i>}
            sx={{ mt: 2, ml: 1, textAlign: 'right' }}
          >
            Novo Setor
          </CustomButton>
        </Grid>
        <Grid item xs={12} sx={{ m: 2 }}>
          <DataTable
            backgroundColor='#050516'
            cabecalho={cabecalhoForm}
            dados={rsPesquisa}
            acoes={[
              {
                icone: EditOutlinedIcon,
                corIcone: '#fff',
                onAcionador: (rs: SectorInterface) =>
                  onEditar(rs.id as string),
                toolTip: "Editar",
              },
              {
                icone: DeleteTwoToneIcon,
                corIcone: '#fff',
                onAcionador: (rs: SectorInterface) =>
                  onExcluir(rs.id as string),
                toolTip: "Excluir",
              },
            ]} />
        </Grid>
      </Grid>
      <Condicional condicao={localState.action !== actionTypes.pesquisando}>
        <SetoresFicha
          open={open}
          setOpen={setOpen}
          btPesquisar={btPesquisar}
          setor={localState.action !== actionTypes.incluindo ? setores : undefined}
          localState={localState}
        />
      </Condicional>
    </>
  );
}