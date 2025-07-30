import { Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CustomButton from '../../Componentes/Button';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import InputText from '../../Componentes/InputText';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { CategoryInterface } from '../../Interfaces/category';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import Condicional from '../../Componentes/Condicional/Condicional';
import { CategoriasFicha } from './categoriasFicha';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';


interface PesquisaInterface {
  name: string
}

export const ResetCategory: CategoryInterface = {
  name: '',
  type: 'Despesa',
  color: '#b1a1a1',
  userId: ''
}

export function Categorias() {

  const [open, setOpen] = useState(false);

  const { setMensagemState, mensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [categorias, setCategorias] = React.useState<CategoryInterface>(ResetCategory);
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ name: '' })
  const [rsPesquisa, setRsPesquisa] = useState<Array<CategoryInterface>>([])
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const clsCrud = new ClsCrud()

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Cor',
      alinhamento: 'center',
      campo: 'color',
      render: (valor: string) => (
        <div
          style={{
            backgroundColor: valor,
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: '1px solid #ccc',
            margin: '0 auto'

          }}
          title={valor}
        />
      )
    },
    {
      cabecalho: 'Categoria',
      alinhamento: 'center',
      campo: 'name',
      //format: (arg: string) => arg.toUpperCase()
    },
    {
      campo: 'type',
      cabecalho: 'Tipo',
      alinhamento: 'center',
      chipColor: (valor) => {
        switch (valor) {
          case 'Receita': return 'success';
          case 'Despesa': return 'error';
          default: return 'default';
        }
      },
      //chipLabel: (valor) => valor.toUpperCase() // Ex: transforma "ativo" em "ATIVO"
    }

  ]

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setCategorias(rs)
      setLocalState({ action: actionTypes.editando })
      setOpen(true)
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setCategorias(rs)
      setLocalState({ action: actionTypes.pesquisando })
      setMensagemState({
        titulo: 'Exclusão',
        exibir: true,
        mensagem: 'Deseja realmente excluir a categoria ' + rs.name + '?',
        tipo: 'warning',
        exibirBotao: 'SN',
        cb: (resposta) => {
          if (resposta) {
            clsCrud.excluir({
              entidade: "Category",
              criterio: {
                id: id,
                userId: usuarioState.idUsuario
              },
              setMensagemState: setMensagemState,
              token: usuarioState.token,
              msg: 'Excluindo categoria ...',
            }).then((rs) => {
              if (rs.ok) {
                setMensagemState({ ...mensagemState, exibir: false })

                btPesquisar()
              }
            })
          }
        }
      })
    })
  }

  const pesquisarID = async (id: string | number): Promise<CategoryInterface> => {
    return await clsCrud
      .pesquisar({
        entidade: "Category",
        criterio: {
          id: id,
          userId: usuarioState.idUsuario
        },
      })
      .then((rs: Array<CategoryInterface>) => {
        return rs[0]
      })
  }
  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "Category",
        criterio: {
          name: "%".concat(pesquisa.name).concat("%"),
          userId: usuarioState.idUsuario
        },
        camposLike: ["name"],
        select: ["id", "name", "type", "color"],
        msg: 'Pesquisando categrorias ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<CategoryInterface>) => {
        setRsPesquisa(rs)
      })
  }

  const handleOpen = () => {
    setCategorias(ResetCategory)
    setLocalState({ action: actionTypes.incluindo })
    setOpen(true);
  }

  useEffect(() => {

    btPesquisar()
  }, [])

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ m: 1, textAlign: 'left' }}>Lista de Categorias</Typography>
        </Grid>
        <Grid item xs={6} sx={{ ml: 2 }}>
          <InputText
            label=""
            placeholder="Buscar categorias..."
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
            sx={{ mt: 1, ml: 1, textAlign: 'right' }}
          >
            Nova Categoria
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
                onAcionador: (rs: CategoryInterface) =>
                  onEditar(rs.id as string),
                toolTip: "Editar",
              },
              {
                icone: DeleteTwoToneIcon,
                corIcone: '#fff',
                onAcionador: (rs: CategoryInterface) =>
                  onExcluir(rs.id as string),
                toolTip: "Excluir",
              },
            ]} />
        </Grid>
      </Grid>
      <Condicional condicao={localState.action !== actionTypes.pesquisando}>
        <CategoriasFicha
          open={open}
          setOpen={setOpen}
          btPesquisar={btPesquisar}
          categoria={localState.action !== actionTypes.incluindo ? categorias : undefined}
          localState={localState}
        />
      </Condicional>
    </>
  );
}