import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CustomButton from '../../Componentes/Button';
import InputText from '../../Componentes/InputText';
import ComboBox from '../../Componentes/ComboBox';
import ColorPicker from '../../Componentes/ColorPicker';
import TitleBar from '../../Componentes/BarraDeTitulo';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import ClsValidacao from '../../Utils/ClsValidacao';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { AccountInterface } from '../../../../finance-backend/src/interfaces/account';
import ClsApi from '../../Utils/ClsApi';
import { CurrencyTextField } from '../../Componentes/InputCurrency';
import { CustomCheckbox } from '../../Componentes/CustomCheckbox';
import { ResetAccount } from './contas';
import { AccountTypes } from '../../types/accountTypes';


interface PropsInterface {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  btPesquisar?: () => void
  conta?: AccountInterface
  localState?: ActionInterface
}

export function ContasFicha({ open, setOpen, btPesquisar, conta, localState }: PropsInterface) {

  const clsCrud = new ClsCrud()
  const clsApi = new ClsApi()
  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [erros, setErros] = useState({});
  const [dados, setDados] = useState<AccountInterface>(ResetAccount);
  const validaCampo: ClsValidacao = new ClsValidacao()


  const handleClose = () => {
    btPesquisar && btPesquisar()
    setDados(ResetAccount)
    setOpen(false)
  }

  const validarDados = () => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('name', dados, erros, retorno, 'Forneça um nome válido')
    retorno = validaCampo.naoVazio('type', dados, erros, retorno)

    setErros(erros)
    return retorno
  }

  const handleConfirmar = async () => {
    if (!validarDados()) return;

    // Se essa conta está marcada como padrão, primeiro limpa os outros padrões
    if (dados?.isDefault) {
      try {
        const rsPadrao = await clsApi.execute<{ success: boolean; affected?: number }>({
          method: 'post',
          url: 'alterarPadrao',
          mensagem: 'Alterando Conta Padrão...',
          token: usuarioState.token,
          setMensagemState,
        });

        // Se a operação falhar, interrompe o processo
        if (!rsPadrao?.success) {
          setMensagemState({
            titulo: 'Erro',
            exibir: true,
            mensagem: 'Erro ao alterar conta padrão.',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null,
          });
          return;
        }
      } catch (error) {
        console.error('Erro ao alterar padrão:', error);
        setMensagemState({
          titulo: 'Erro',
          exibir: true,
          mensagem: 'Erro inesperado ao alterar conta padrão.',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null,
        });
        return;
      }
    }

    // Agora pode incluir ou editar a conta
    const rs = await clsCrud.incluir({
      entidade: 'Account',
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
        tipo: conta ? MensagemTipo.Info : MensagemTipo.Ok,
        exibirBotao: true,
        cb: null,
      });
      handleClose();
    }
  };


  useEffect(() => {
    if (conta) {
      setDados(conta)
    }
  }, [conta])

  return (
    <>
      <Dialog open={open} >
        <DialogTitle sx={{ bgcolor: '#050516', border: '1px solid #3a3a3a', }}>
          <TitleBar
            title="Cadastro de Contas"
            onClose={handleClose}
            textColor='#fff'
            backgroundColor='#050516'
            fontSize='1.75rem'
          />
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#050516', borderRight: '1px solid #3a3a3a', borderLeft: '1px solid #3a3a3a', }}>
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <InputText
                autoFocus
                label="Nome da conta"
                type="text"
                setState={setDados}
                field="name"
                erros={erros}
                dados={dados}
                corFonte={"#fff"}
                onFocus={(e) => e.target.select()}
              />
            </Grid>
            <Grid item xs={12} >
              <ComboBox
                label='Tipo'
                corFundo='#050516'
                corFonte={"#fff"}
                opcoes={AccountTypes}
                field='type'
                setState={setDados}
                dados={dados}
                campoID='idAccountType'
                campoDescricao='descricao'
                mensagemPadraoCampoEmBranco='Escolha um Tipo'
              />
            </Grid>

            <Grid item xs={12} >
              <CurrencyTextField
                label="Saldo inicial"
                setState={setDados}
                field="initialBalance"
                erros={erros}
                dados={dados}
              />
            </Grid>
            <Grid item xs={12} >
              <ColorPicker
                label="Escolha a cor"
                dados={dados}
                setState={setDados}
                field="color"
              />
            </Grid>
            <Grid item xs={12} >
              <CustomCheckbox
                setState={setDados}
                field="isDefault"
                dados={dados}
                label="Está é a conta Padrão?"
              />
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