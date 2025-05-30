import { Grid, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import CustomButton from '../../Componentes/Button';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import InputText from '../../Componentes/InputText';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { CompanyInterface } from '../../../../finance-backend/src/interfaces/company';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import Condicional from '../../Componentes/Condicional/Condicional';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { EmpresasFicha } from './empresasFicha';


interface PesquisaInterface {
  name: string
}

export const ResetCompany: CompanyInterface = {
  name: '',
}

export function Empresas() {

  const [open, setOpen] = useState(false);

  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [empresas, setEmpresas] = React.useState<CompanyInterface>(ResetCompany);
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ name: '' })
  const [rsPesquisa, setRsPesquisa] = useState<Array<CompanyInterface>>([])
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
      setEmpresas(rs)
      setLocalState({ action: actionTypes.editando })
      setOpen(true)
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setEmpresas(rs)
      setLocalState({ action: actionTypes.pesquisando })
      setMensagemState({
        titulo: 'Exclusão',
        exibir: true,
        mensagem: 'Deseja realmente excluir a empresa ' + rs.name + '?',
        tipo: 'warning',
        exibirBotao: 'SN',
        cb: (resposta) => {
          if (resposta) {
            clsCrud.excluir({
              entidade: "Company",
              criterio: { id: id },
              setMensagemState: setMensagemState,
              token: usuarioState.token,
              msg: 'Excluindo empresa ...',
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

  const pesquisarID = async (id: string | number): Promise<CompanyInterface> => {
    return await clsCrud
      .pesquisar({
        entidade: "Company",
        criterio: {
          id: id,
        },
      })
      .then((rs: Array<CompanyInterface>) => {
        return rs[0]
      })
  }
  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "Company",
        criterio: {
          name: "%".concat(pesquisa.name).concat("%"),
        },
        camposLike: ["name"],
        select: ["id", "name"],
        msg: 'Pesquisando empresas ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<CompanyInterface>) => {
        setRsPesquisa(rs)
      })
  }

  const handleOpen = () => {
    setLocalState({ action: actionTypes.incluindo })
    setEmpresas(ResetCompany)
    setOpen(true);
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ m: 1, textAlign: 'left' }}>Lista de Empresas</Typography>
        </Grid>
        <Grid item xs={6} sx={{ ml: 2 }}>
          <InputText
            label=""
            placeholder="Buscar empresas..."
            tipo="uppercase"
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
            Nova Empresa
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
                onAcionador: (rs: CompanyInterface) =>
                  onEditar(rs.id as string),
                toolTip: "Editar",
              },
              {
                icone: DeleteTwoToneIcon,
                corIcone: '#fff',
                onAcionador: (rs: CompanyInterface) =>
                  onExcluir(rs.id as string),
                toolTip: "Excluir",
              },
            ]} />
        </Grid>
      </Grid>
      <Condicional condicao={localState.action !== actionTypes.pesquisando}>
        <EmpresasFicha
          open={open}
          setOpen={setOpen}
          btPesquisar={btPesquisar}
          empresa={localState.action !== actionTypes.incluindo ? empresas : undefined}
          localState={localState}
        />
      </Condicional>
    </>
  );
}