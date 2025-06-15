import { Chip, Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
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


export function Transacoes() {

  const { layoutState } = useContext(GlobalContext) as GlobalContextInterface

  const ResetTransaction: TransactionInterface = {

    date: '',
    amount: 0,
    description: '',
    userId: '',
    categoryId: '',
    accountId: '',
    companyId: '',
    sectorId: '',
  }

  const [open, setOpen] = useState(false);
  const clsFormatacao = new ClsFormatacao();
  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface;
  const [transacoes, setTransacoes] = React.useState<TransactionInterface>();
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ description: '' });
  const [rsPesquisa, setRsPesquisa] = useState<Array<TransactionInterface>>([]);
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando });
  const clsCrud = new ClsCrud()
  const [debouncedValue, setDebouncedValue] = useState("")

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
      alinhamento: 'center',
      campo: 'sector',
      format: (_v, rs: any) => rs.sector.name
    },
    {
      cabecalho: 'Empresa',
      alinhamento: 'center',
      campo: 'companyId',
      format: (_v, rs: any) => rs.company.name
    },
    {
      cabecalho: 'Categoria',
      alinhamento: 'center',
      campo: 'categoryId',
      format: (_v, rs: any) => rs.category.name
    },
    {
      campo: 'categoryId',
      cabecalho: 'Tipo',
      alinhamento: 'center',
      render: (_valor: number, row: any) => {
        const type = row?.category?.type;
        const isReceita = type === 'Receita';

        return (
          <Chip
            label={type}
            color={isReceita ? 'success' : 'error'}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      },
    },
    {
      campo: 'amount',
      cabecalho: 'Valor',
      alinhamento: 'right',
      render: (valor: number, row: any) => {
        const isReceita = row?.category?.type === 'Receita'
        return (
          <span
            style={{
              color: isReceita ? '#4caf50' : '#f44336',
              fontWeight: 'bold',
            }}
          >
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(valor)}
          </span>
        )
      }
    }
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
              criterio: {
                id: id,
                userId: usuarioState.idUsuario
              },
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
          userId: usuarioState.idUsuario,
        },
      })
      .then((rs: Array<TransactionInterface>) => {
        let dt: string = clsFormatacao.dataISOtoUser(rs[0].date)
        return {
          ...rs[0],
          date: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
        }
      })
  }

  const handleChange = (event: any) => {

    const value = pesquisa.description.concat(event)
    if (pesquisa.description === '') {
      setPesquisa({ description: value })

    } else {
      setPesquisa({ description: event })
    }

  };
  const onSearch = async (e: string) => {

    clsCrud
      .pesquisar({
        entidade: "Transaction",
        relations: ['company', 'category', 'sector', 'account'],
        token: usuarioState.token,
        criterio: {
          description: "%".concat(e).concat("%"),
          userId: usuarioState.idUsuario
        },
        camposLike: ["description"],
        select: ["id", "description", "amount", "companyId", "categoryId", "sectorId", "date", "userId", "category.type"],
        msg: 'Pesquisando transação ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      })
  }
  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "Transaction",
        relations: ['company', 'category', 'sector', 'account'],
        token: usuarioState.token,
        criterio: {
          description: "%".concat(pesquisa.description).concat("%"),
          userId: usuarioState.idUsuario
        },
        camposLike: ["description"],
        select: ["id", "description", "amount", "companyId", "categoryId", "sectorId", "date", "userId", "category.type"],
        msg: 'Pesquisando transação ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      })
  }

  const handleOpen = () => {
    setTransacoes(ResetTransaction)
    setLocalState({ action: actionTypes.incluindo })
    setOpen(true);
  }

  useEffect(() => {
    btPesquisar()
  }, [layoutState])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(pesquisa.description);
    }, 2); // Adicionando um atraso de 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [pesquisa.description]);

  useEffect(() => {
    if (debouncedValue) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

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
            dados={pesquisa}
            field="description"
            setState={setPesquisa}
            iconeStart='searchicon'
            onClickIconeStart={() => { btPesquisar() }}
            mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
            autoFocus
            width={'100%'}
            onChange={(e) => handleChange(e)}
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