import { Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CustomButton from '../../Componentes/Button';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import InputText from '../../Componentes/InputText';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { AccountCard } from '../../Componentes/AccountCard';
import Condicional from '../../Componentes/Condicional/Condicional';
import { ContasFicha } from './contasFicha';
import { AccountInterface } from '../../Interfaces/account';


interface PesquisaInterface {
  name: string
}

export const ResetAccount: AccountInterface = {
  name: '',
  type: 'corrente',
  initialBalance: 0,
  color: '#b1a1a1',
  isDefault: false,
  userId: ''
}

interface SomatorioInterface extends AccountInterface {
  saldoAtual: number
}

export function Contas() {

  const [open, setOpen] = useState(false);

  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [contas, setContas] = React.useState<AccountInterface>(ResetAccount)
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ name: '' })
  const [rsPesquisa, setRsPesquisa] = useState<Array<SomatorioInterface>>([])
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const clsCrud = new ClsCrud()
  const { layoutState } = useContext(GlobalContext) as GlobalContextInterface

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
      cabecalho: 'Conta',
      alinhamento: 'center',
      campo: 'name',
    },
    {
      campo: 'type',
      cabecalho: 'Tipo',
      alinhamento: 'center',
    },
    {
      campo: 'initialBalance',
      cabecalho: 'Saldo Inicial',
      alinhamento: 'center',
      format: (arg: number) => arg.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    },
    {
      campo: 'saldoAtual',
      cabecalho: 'Saldo Atual',
      alinhamento: 'center',
      format: (arg: number) => arg.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    },
    {
      campo: 'isDefault',
      cabecalho: 'Status',
      alinhamento: 'center',
      format: (arg: boolean) => arg ? 'Padrão' : ''
    }


  ]

  const onEditar = (id: string | number) => {

    pesquisarID(id).then((rs) => {
      const contaConvertida = {
        ...rs,
        initialBalance: Number(rs.initialBalance),
      };
      setContas(contaConvertida)
      setLocalState({ action: actionTypes.editando })
      setOpen(true)
    })

  }
  const onExcluir = (id: string | number) => {

    pesquisarID(id).then((rs) => {

      if (rs.isDefault) {
        setMensagemState({
          titulo: 'Atenção',
          exibir: true,
          mensagem: 'A conta Padrão ' + rs.name + ', não pode ser excluida!',
          tipo: 'warning',
          exibirBotao: true,
          cb: null
        })
        return
      }

      setContas(rs)
      setLocalState({ action: actionTypes.pesquisando })
      setMensagemState({
        titulo: 'Exclusão',
        exibir: true,
        mensagem: 'Deseja realmente excluir a conta ' + rs.name + '?',
        tipo: 'warning',
        exibirBotao: 'SN',
        cb: (resposta) => {
          if (resposta) {
            clsCrud.excluir({
              entidade: "Account",
              criterio: {
                id: id,
                userId: usuarioState.idUsuario
              },
              setMensagemState: setMensagemState,
              token: usuarioState.token,
              msg: 'Excluindo conta ...',
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

  const pesquisarID = async (id: string | number): Promise<AccountInterface> => {
    return await clsCrud
      .pesquisar({
        entidade: "Account",
        criterio: {
          id: id,
          userId: usuarioState.idUsuario
        },
      })
      .then((rs: Array<AccountInterface>) => {
        return rs[0]
      })
  }
  const btPesquisar = async () => {
    const rs = await clsCrud.pesquisar({
      entidade: "Account",
      criterio: {
        name: "%".concat(pesquisa.name).concat("%"),
        userId: usuarioState.idUsuario
      },
      camposLike: ["name"],
      select: ["id", "name", "type", "initialBalance", "color", "isDefault"],
      msg: 'Pesquisando contas ...',
      setMensagemState: setMensagemState,
    });

    if (rs) {
      const contasComSaldo = await Promise.all(
        rs.map(async (conta) => {
          const saldo = await ApuraSaldo(conta.id as string);
          return {
            ...conta,
            saldoAtual: Number(conta.initialBalance) + saldo,
            initialBalance: Number(conta.initialBalance),
          };
        })
      );

      setRsPesquisa(contasComSaldo);
    }
  }


  const handleOpen = () => {
    setContas(ResetAccount)
    setLocalState({ action: actionTypes.incluindo })
    setOpen(true);
  }

  const ApuraSaldo = async (id: string): Promise<number> => {
    const rs = await clsCrud.pesquisar({
      entidade: "Transaction",
      relations: ['company', 'category', 'sector', 'account'],
      criterio: {
        accountId: id,
        userId: usuarioState.idUsuario
      },
      select: ["id", "description", "amount", "companyId", "categoryId", "sectorId", "date", "userId", "category.type"],
    });

    let receitas = 0;
    let despesas = 0;

    rs?.forEach((item) => {
      if (item.category?.type === 'Receita') {
        receitas += Number(item.amount);
      } else {
        despesas += Number(item.amount);
      }
    });

    return receitas - despesas;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    if (layoutState.contaPadrao === "") {
      setContas({ ...contas, isDefault: true })
      setOpen(true);
    } else {
      btPesquisar()
    }
  }, [])

  return (
    <>
      <Condicional condicao={rsPesquisa.length > 0}>
        <Grid container sx={{ p: 2 }}>

          {rsPesquisa.map((conta, i) => {
            return (
              <Grid key={i} item xs={12} sm={4} sx={{ p: 1 }}>
                <AccountCard
                  nome={conta.name}
                  tipo={conta.type}
                  saldoInicial={conta.initialBalance}
                  saldoAtual={conta.saldoAtual}
                  isPadrao={conta.isDefault}
                  corTopo={conta.color}
                  corFundo="rgba(255, 255, 255, 0.05)"
                  corFonte="#fff"
                  corBorda=" #3a3a3a"
                  onEdit={() => onEditar(conta.id as string)}
                  onDelete={() => onExcluir(conta.id as string)}
                />
              </Grid>
            )
          })}
        </Grid>
      </Condicional>
      <Condicional condicao={layoutState.contaPadrao !== ''}>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ m: 2, textAlign: 'left' }}>Lista de Contas</Typography>
          </Grid>
          <Grid item xs={6} sx={{ ml: 2 }}>
            <InputText
              label=""
              placeholder="Buscar contas..."
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
              Nova Conta
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
                  onAcionador: (rs: AccountInterface) =>
                    onEditar(rs.id as string),
                  toolTip: "Editar",
                },
                {
                  icone: DeleteTwoToneIcon,
                  corIcone: '#fff',
                  onAcionador: (rs: AccountInterface) =>
                    onExcluir(rs.id as string),
                  toolTip: "Excluir",
                },
              ]} />
          </Grid>
        </Grid>

      </Condicional>
      <Condicional condicao={localState.action !== actionTypes.pesquisando || layoutState.contaPadrao === ""}>
        <ContasFicha
          open={open}
          setOpen={setOpen}
          btPesquisar={btPesquisar}
          conta={localState.action !== actionTypes.incluindo ? contas : undefined}
          localState={localState}
        />
      </Condicional>
    </>
  );
}