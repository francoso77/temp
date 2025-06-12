import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CustomButton from '../../Componentes/Button';
import InputText from '../../Componentes/InputText';
import TitleBar from '../../Componentes/BarraDeTitulo';
import { CompanyInterface } from '../../../../finance-backend/src/interfaces/company';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import ClsValidacao from '../../Utils/ClsValidacao';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { ResetCompany } from './empresa';



interface PropsInterface {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  btPesquisar?: () => void
  empresa?: CompanyInterface
  localState?: ActionInterface
}

export function EmpresasFicha({ open, setOpen, btPesquisar, empresa, localState }: PropsInterface) {

  const clsCrud = new ClsCrud()
  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [erros, setErros] = useState({});
  const [dados, setDados] = useState<CompanyInterface>(ResetCompany);
  const validaCampo: ClsValidacao = new ClsValidacao()


  const handleClose = () => {
    btPesquisar && btPesquisar()
    setDados(ResetCompany)
    setOpen(false)
  }

  const validarDados = () => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('name', dados, erros, retorno, 'Forneça um Descrição Válida')

    setErros(erros)
    return retorno
  }
  const handleConfirmar = () => {

    if (!validarDados()) {
      return
    }

    dados.userId = usuarioState.idUsuario

    clsCrud.incluir({
      entidade: 'Company',
      criterio: dados,
      setMensagemState: setMensagemState,
      token: usuarioState.token
    }).then((rs) => {
      if (rs.ok) {
        setMensagemState({
          titulo: 'Cadastro',
          exibir: true,
          mensagem: localState?.action === actionTypes.editando ? 'Alteração realizada com sucesso' : 'Cadastro realizado com sucesso',
          tipo: empresa ? MensagemTipo.Info : MensagemTipo.Ok,
          exibirBotao: true,
          cb: null
        })
      }
      handleClose()
    })
  }

  useEffect(() => {
    if (empresa) {
      setDados(empresa)
    }
  }, [empresa])

  return (
    <>
      <Dialog open={open} >
        <DialogTitle sx={{ bgcolor: '#050516', border: '1px solid #3a3a3a', }}>
          <TitleBar
            title="Cadastro de Empresas"
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
                label="Nome da empresa"
                type="text"
                setState={setDados}
                field="name"
                erros={erros}
                dados={dados}
                corFonte={localState?.action === actionTypes.excluindo ? '#c96a6a' : "#fff"}
                onFocus={(e) => e.target.select()}
                disabled={localState?.action === actionTypes.excluindo ? true : false}
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