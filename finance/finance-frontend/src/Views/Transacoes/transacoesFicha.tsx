import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CustomButton from '../../Componentes/Button';
import InputText from '../../Componentes/InputText';
import ComboBox from '../../Componentes/ComboBox';
import TitleBar from '../../Componentes/BarraDeTitulo';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import ClsValidacao from '../../Utils/ClsValidacao';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { CurrencyTextField } from '../../Componentes/InputCurrency';
import { ResetTransaction } from './transacoes';
import { TransactionInterface } from '../../../../finance-backend/src/interfaces/transaction';
import { TipoTransactionTypes } from '../../types/tipoTransactionTypes';
import { SetorTypes } from '../../types/setorTypes';
import { AccountInterface } from '../../../../finance-backend/src/interfaces/account';
import { CompanyInterface } from '../../../../finance-backend/src/interfaces/company';
import { CategoryInterface } from '../../../../finance-backend/src/interfaces/category';

interface PropsInterface {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  btPesquisar?: () => void
  transacao?: TransactionInterface
  localState?: ActionInterface
}

export function TransacoesFicha(
  {
    open,
    setOpen,
    btPesquisar,
    transacao,
    localState
  }: PropsInterface) {

  const clsCrud = new ClsCrud()
  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [erros, setErros] = useState({});
  const [dados, setDados] = useState<TransactionInterface>(ResetTransaction)
  const validaCampo: ClsValidacao = new ClsValidacao()
  const [rsContas, setRsContas] = useState<Array<AccountInterface>>([])
  const [rsEmpresas, setRsEmpresas] = useState<Array<CompanyInterface>>([])
  const [rsCategorias, setRsCategorias] = useState<Array<CategoryInterface>>([])
  const { layoutState } = useContext(GlobalContext) as GlobalContextInterface


  const handleClose = () => {
    btPesquisar && btPesquisar()
    setDados(ResetTransaction)
    setOpen(false)
  }

  const validarDados = () => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('description', dados, erros, retorno, 'Forneça um nome válido')
    retorno = validaCampo.naoVazio('type', dados, erros, retorno)
    retorno = validaCampo.naoVazio('companyId', dados, erros, retorno, 'Selecione uma empresa')
    retorno = validaCampo.naoVazio('categoryId', dados, erros, retorno, 'Selecione uma categoria')
    retorno = validaCampo.naoVazio('accountId', dados, erros, retorno, 'Selecione uma conta')
    retorno = validaCampo.naoVazio('amount', dados, erros, retorno, 'Forneça um valor valido')
    retorno = validaCampo.eData('date', dados, erros, retorno)

    setErros(erros)
    return retorno
  }

  const handleConfirmar = async () => {
    if (!validarDados()) return;

    const rs = await clsCrud.incluir({
      entidade: 'Transaction',
      criterio: dados,
      setMensagemState,
      token: usuarioState.token,
      localState,
    });

    if (rs.ok) {
      setMensagemState({
        titulo: 'Cadastro',
        exibir: true,
        mensagem:
          localState?.action === actionTypes.editando
            ? 'Alteração realizada com sucesso'
            : 'Cadastro realizado com sucesso',
        tipo: transacao ? MensagemTipo.Info : MensagemTipo.Ok,
        exibirBotao: true,
        cb: null,
      });
      handleClose();
    }
  };

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Account",
        campoOrder: ['name'],
        criterio: {
          id: layoutState.contaPadrao
        }
      })
      .then((rs: Array<AccountInterface>) => {
        setRsContas(rs)
      })

    clsCrud
      .pesquisar({
        entidade: "Category",
        campoOrder: ['name'],
      })
      .then((rs: Array<CategoryInterface>) => {
        setRsCategorias(rs)
      })

    clsCrud
      .pesquisar({
        entidade: "Company",
        campoOrder: ['name'],
      })
      .then((rs: Array<CompanyInterface>) => {
        setRsEmpresas(rs)
      })

  }

  useEffect(() => {
    BuscarDados()
  }, []);

  useEffect(() => {
    if (transacao) {
      setDados(transacao)
    }
  }, [transacao])

  return (
    <>
      <Dialog open={open} >
        <DialogTitle sx={{ bgcolor: '#050516', border: '1px solid #3a3a3a', }}>
          <TitleBar
            title="Nova Transação"
            onClose={handleClose}
            textColor='#fff'
            backgroundColor='#050516'
            fontSize='1.75rem'
          />
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#050516', borderRight: '1px solid #3a3a3a', borderLeft: '1px solid #3a3a3a', }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <InputText
                autoFocus
                label="Descrição"
                type="text"
                setState={setDados}
                field="description"
                erros={erros}
                dados={dados}
                corFonte={"#fff"}
                onFocus={(e) => e.target.select()}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: -3 }}>
              <CurrencyTextField
                label="Valor"
                setState={setDados}
                field="amount"
                erros={erros}
                dados={dados}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: -4 }}>
              <ComboBox
                label='Tipo'
                corFundo='#050516'
                corFonte={"#fff"}
                opcoes={TipoTransactionTypes}
                field='type'
                setState={setDados}
                dados={dados}
                campoID='idTipoTransactionType'
                campoDescricao='descricao'
                mensagemPadraoCampoEmBranco='Escolha um tipo'
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <ComboBox
                label='Setor'
                corFundo='#050516'
                corFonte={"#fff"}
                opcoes={SetorTypes}
                field='setor'
                setState={setDados}
                dados={dados}
                campoID='idSetorType'
                campoDescricao='descricao'
                mensagemPadraoCampoEmBranco='Escolha o setor'
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <ComboBox
                label='Conta'
                corFundo='#050516'
                corFonte={"#fff"}
                opcoes={rsContas}
                field='accountId'
                setState={setDados}
                dados={dados}
                campoID='id'
                campoDescricao='name'
                mensagemPadraoCampoEmBranco='Escolha uma conta'
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }} >
              <ComboBox
                label='Categoria'
                corFundo='#050516'
                corFonte={"#fff"}
                opcoes={rsCategorias}
                field='categoryId'
                setState={setDados}
                dados={dados}
                campoID='id'
                campoDescricao='name'
                mensagemPadraoCampoEmBranco='Escolha uma categoria'
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <ComboBox
                label='Empresa'
                corFundo='#050516'
                corFonte={"#fff"}
                opcoes={rsEmpresas}
                field='companyId'
                setState={setDados}
                dados={dados}
                campoID='id'
                campoDescricao='name'
                mensagemPadraoCampoEmBranco='Escolha uma empresa'
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: -3 }} >
              <InputText
                type='tel'
                tipo="date"
                label="Data"
                dados={dados}
                field="date"
                setState={setDados}
                erros={erros}
                onFocus={(e) => e.target.select()}
              />
              {/* <CustomDateInput
                label="Data"
                field="date"
                setState={setDados}
                dados={dados}
                erros={erros}
                colorConfig={{
                  fontColor: '#000',
                  borderColor: '#ccc',
                  backgroundColor: '#f9f9f9',
                }}
              /> */}

            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            bgcolor: '#050516',
            border: '1px solid #3a3a3a',
            justifyContent: 'center'

          }}>
          <CustomButton
            onClick={() => { handleClose() }}
            bgColor='#10355a'
            textColor='#000'
            iconPosition='start'
            icon={<i className="material-icons">cancel</i>}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            onClick={() => { handleConfirmar() }}
            bgColor='#1976d2'
            textColor='#000'
            iconPosition='start'
            icon={<i className="material-icons">{
              localState?.action === actionTypes.editando ? 'edit' : 'add'}</i>}
          >
            {localState?.action === actionTypes.editando ? 'Alterar' : 'Adicionar'}
          </CustomButton>
        </DialogActions>
      </Dialog>

    </>
  );
}