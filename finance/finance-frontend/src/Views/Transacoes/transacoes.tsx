import { Grid, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import CustomButton from '../../Componentes/Button';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import InputText from '../../Componentes/InputText';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { TransactionInterface } from '../../../../finance-backend/src/interfaces/transaction';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { TransacoesFicha } from './transacoesFicha';


interface PesquisaInterface {
  description: string
}

export const ResetTransaction: TransactionInterface = {
  description: '',
  type: 'Despesa',
  setor: 'Malharia',
  amount: 0,
  categoryId: '',
  accountId: '',
  companyId: '',
  date: ''
}

export function Transacoes() {

  const [open, setOpen] = useState(false);
  const clsFormatacao = new ClsFormatacao();
  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface;
  const [transacoes, setTransacoes] = React.useState<TransactionInterface>(ResetTransaction);
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ description: '' });
  const [rsPesquisa, setRsPesquisa] = useState<Array<TransactionInterface>>([]);
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando });
  const clsCrud = new ClsCrud()

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'date',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Descrição',
      alinhamento: 'left',
      campo: 'description',
    },
    {
      cabecalho: 'Setor',
      alinhamento: 'left',
      campo: 'setor',
    },
    {
      cabecalho: 'Empresa',
      alinhamento: 'left',
      campo: 'companyId',
      format: (_v, rs: any) => rs.company.name
    },
    {
      cabecalho: 'Categoria',
      alinhamento: 'left',
      campo: 'categoryId',
      format: (_v, rs: any) => rs.category.name
    },
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
    },
    {
      cabecalho: 'Valor',
      campo: 'amount',
      alinhamento: 'center',
      //format: (arg: number) => arg.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
      format: (amount) => clsFormatacao.currency(amount)
    },
  ]

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setTransacoes(rs)
      setLocalState({ action: actionTypes.editando })
      setOpen(true)
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setTransacoes(rs)
      setLocalState({ action: actionTypes.pesquisando })
      setMensagemState({
        titulo: 'Exclusão',
        exibir: true,
        mensagem: 'Deseja realmente excluir essa transação ' + rs.description + '?',
        tipo: 'warning',
        exibirBotao: 'SN',
        cb: (resposta) => {
          if (resposta) {
            clsCrud.excluir({
              entidade: "Transaction",
              criterio: { id: id },
              setMensagemState: setMensagemState,
              token: usuarioState.token,
              msg: 'Excluindo transação ...',
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

  const pesquisarID = async (id: string | number): Promise<TransactionInterface> => {
    return await clsCrud
      .pesquisar({
        entidade: "Transaction",
        criterio: {
          id: id,
        },
      })
      .then((rs: Array<TransactionInterface>) => {
        return rs[0]
      })
  }
  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "Transaction",
        criterio: {
          description: "%".concat(pesquisa.description).concat("%"),
        },
        camposLike: ["description"],
        select: ["id", "description", "type", "amount", "companyId", "categoryId", "setor", "date"],
        msg: 'Pesquisando transação ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<TransactionInterface>) => {
        setRsPesquisa(rs)
      })
  }

  const handleOpen = () => {
    setTransacoes(ResetTransaction)
    setLocalState({ action: actionTypes.incluindo })
    setOpen(true);
  }

  return (
    <>
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ m: 2, textAlign: 'left' }}>Todas as Transações</Typography>
        </Grid>
        <Grid item xs={6} sx={{ ml: 2 }}>
          <InputText
            label=""
            placeholder="Buscar transações..."
            tipo="uppercase"
            dados={pesquisa}
            field="description"
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
            Nova Transação
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
                onAcionador: (rs: TransactionInterface) =>
                  onEditar(rs.id as string),
                toolTip: "Editar",
              },
              {
                icone: DeleteTwoToneIcon,
                corIcone: '#fff',
                onAcionador: (rs: TransactionInterface) =>
                  onExcluir(rs.id as string),
                toolTip: "Excluir",
              },
            ]} />
        </Grid>
      </Grid>
      <Condicional condicao={localState.action !== actionTypes.pesquisando}>
        <TransacoesFicha
          open={open}
          setOpen={setOpen}
          btPesquisar={btPesquisar}
          transacao={localState.action !== actionTypes.incluindo ? transacoes : undefined}
          localState={localState}
        />
      </Condicional>
    </>
  );
}