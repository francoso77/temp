import { Box, Paper, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import CustomButton from '../../Componentes/Button';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import InputText from '../../Componentes/InputText';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { CategoryInterface } from '../../../../finance-backend/src/interfaces/category';
import ClsValidacao from '../../Utils/ClsValidacao';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import Condicional from '../../Componentes/Condicional/Condicional';
import { Categorias } from '../Categorias';


interface PesquisaInterface {
  name: string
}

const ResetDados: CategoryInterface = {
  name: '',
  type: 'both',
  color: '#000000',
}

export function Testes() {

  const [open, setOpen] = useState(false);

  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [categorias, setCategorias] = React.useState<CategoryInterface>(ResetDados);
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ name: '' })
  const [rsPesquisa, setRsPesquisa] = useState<Array<CategoryInterface>>([])
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Cor',
      alinhamento: 'left',
      campo: 'color'
    },
    {
      cabecalho: 'Categoria',
      alinhamento: 'left',
      campo: 'name'
    },
    {
      cabecalho: 'Tipo',
      alinhamento: 'center',
      campo: 'type'
    },

  ]

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setCategorias(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setCategorias(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const pesquisarID = async (id: string | number): Promise<CategoryInterface> => {
    return await clsCrud
      .pesquisar({
        entidade: "Category",
        criterio: {
          id: id,
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
    setOpen(true);
    setCategorias(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }

  return (
    <>
      <Box sx={{ mb: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ m: 2, textAlign: 'left' }}>Categorias</Typography>
        <Box>
          <InputText
            label=""
            placeholder="Pesquisar"
            tipo="uppercase"
            dados={pesquisa}
            field="name"
            setState={setPesquisa}
            iconeEnd='searchicon'
            onClickIconeEnd={() => { btPesquisar() }}
            mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
            autoFocus
            width={'50%'}
          />
          <CustomButton
            onClick={() => { handleOpen() }}
            bgColor='#1976d2'
            textColor='#000'
            iconPosition='start'
            icon={<i className="material-icons">add</i>}
            sx={{ ml: 1, mt: 2, textAlign: 'right' }}
          >
            Nova Categoria
          </CustomButton>
        </Box>
      </Box>
      <Condicional condicao={localState.action === actionTypes.incluindo}>
        <Paper sx={{ width: '95%', overflow: 'hidden', p: 1, m: 2 }}>
          <Categorias open={open} />
        </Paper>
      </Condicional>
      <Paper sx={{ width: '95%', overflow: 'hidden', p: 1, m: 2 }}>
        <DataTable
          backgroundColorHead='#1976d2'
          tituloTabela='Categorias'
          cabecalho={cabecalhoForm}
          dados={rsPesquisa}
          acoes={[
            {
              icone: "edit",
              onAcionador: (rs: CategoryInterface) =>
                onEditar(rs.id as string),
              toolTip: "Editar",
            },
            {
              icone: "delete",
              onAcionador: (rs: CategoryInterface) =>
                onExcluir(rs.id as string),
              toolTip: "Excluir",
            },
          ]} />
      </Paper>
    </>
  );
}