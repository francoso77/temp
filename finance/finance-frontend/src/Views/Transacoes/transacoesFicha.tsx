import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { TransactionInterface } from '../../Interfaces/transaction';
import { CompanyInterface } from '../../Interfaces/company';
import { CategoryInterface } from '../../Interfaces/category';
import { SectorInterface } from '../../Interfaces/sector';
import { iconMap } from '../../Utils/IconsMenuFooter';
import Condicional from '../../Componentes/Condicional/Condicional';


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

  const { layoutState } = useContext(GlobalContext) as GlobalContextInterface

  const ResetTransaction: TransactionInterface = {

    date: '',
    amount: 0,
    qtd: 0,
    price: 0,
    description: '',
    userId: '',
    categoryId: '',
    accountId: '',
    companyId: '',
    sectorId: '',
  }

  const clsCrud = new ClsCrud()
  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [erros, setErros] = useState({});
  const [dados, setDados] = useState<TransactionInterface>(ResetTransaction)
  const validaCampo: ClsValidacao = new ClsValidacao()
  const [rsSetores, setRsSetores] = useState<Array<SectorInterface>>([])
  const [rsEmpresas, setRsEmpresas] = useState<Array<CompanyInterface>>([])
  const [rsCategorias, setRsCategorias] = useState<Array<CategoryInterface>>([])
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])
  const [temReceita, setTemReceita] = useState(false)
  const handleClose = () => {
    btPesquisar && btPesquisar()
    setDados(ResetTransaction)
    setOpen(false)
    setTemReceita(false)
  }

  const validarDados = () => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('description', dados, erros, retorno, 'Forneça um nome válido')
    retorno = validaCampo.naoVazio('sectorId', dados, erros, retorno, 'Selecione um setor')
    retorno = validaCampo.naoVazio('companyId', dados, erros, retorno, 'Selecione uma empresa')
    retorno = validaCampo.naoVazio('categoryId', dados, erros, retorno, 'Selecione uma categoria')
    retorno = validaCampo.naoVazio('amount', dados, erros, retorno, 'Forneça um valor valido')
    retorno = validaCampo.eData('date', dados, erros, retorno)
    retorno = temReceita ? validaCampo.naoVazio('price', dados, erros, retorno, 'Forneça um valor válido') : true
    retorno = temReceita ? validaCampo.naoVazio('qtd', dados, erros, retorno, 'Forneça um valor válido') : true

    setErros(erros)
    return retorno
  }

  const handleConfirmar = async () => {
    dados.userId = usuarioState.idUsuario as string ?? ""
    dados.accountId = layoutState.contaPadrao as string ?? ""

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

  const btPulaCampo = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {

    if (event.key === 'Enter') {
      const nextField = fieldRefs.current[index];
      if (nextField) {
        const input = nextField.querySelector('input');
        if (input) {
          input.focus();
        }
      }
    }
  }
  const BuscarDados = () => {

    clsCrud
      .pesquisar({
        entidade: "Category",
        criterio: {
          userId: usuarioState.idUsuario,
        },
        campoOrder: ['name'],
      })
      .then((rs: Array<CategoryInterface>) => {
        setRsCategorias(rs)
      })

    clsCrud
      .pesquisar({
        entidade: "Company",
        criterio: {
          userId: usuarioState.idUsuario,
        },
        campoOrder: ['name'],
      })
      .then((rs: Array<CompanyInterface>) => {
        setRsEmpresas(rs)
      })

    clsCrud
      .pesquisar({
        entidade: "Sector",
        criterio: {
          userId: usuarioState.idUsuario,
        },
        campoOrder: ['name'],
      })
      .then((rs: Array<SectorInterface>) => {
        setRsSetores(rs)
      })

  }

  const HandleReceita = (name: string) => {

    if (name) {
      rsCategorias.find((c) => c.name === name)?.type === "Receita" ? setTemReceita(true) : setTemReceita(false)
    }
  }
  useEffect(() => {
    BuscarDados()
  }, []);

  useEffect(() => {
    if (transacao) {

      setTemReceita(transacao.categoryId ? rsCategorias.find((c) => c.id === transacao.categoryId)?.type === "Receita" : false)

      setDados(transacao)
    }
  }, [transacao])

  useEffect(() => {
    if (temReceita) {
      const qtd = Number(dados.qtd) || 0;
      const price = Number(dados.price) || 0;
      const amount = qtd * price;

      setDados(prev => ({
        ...prev,
        amount: Number(amount)
      }));
    }
  }, [dados.qtd, dados.price, temReceita]);


  return (
    <>
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: '#050516', border: '1px solid #3a3a3a' }}>
          <TitleBar
            icon={iconMap["SyncAltIcon"]}
            title="Nova Transação"
            onClose={handleClose}
            textColor='#fff'
            backgroundColor='#050516'
          />
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#050516', borderRight: '1px solid #3a3a3a', borderLeft: '1px solid #3a3a3a', }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
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
                  onKeyDown={(event: any) => btPulaCampo(event, 2)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                <ComboBox
                  label='Setor'
                  corFundo='#050516'
                  corFonte={"#fff"}
                  opcoes={rsSetores}
                  field='sectorId'
                  setState={setDados}
                  dados={dados}
                  campoID='id'
                  campoDescricao='name'
                  mensagemPadraoCampoEmBranco='Escolha o setor'
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 3)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
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
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => HandleReceita(e.target.value as string)} // opcional
                />
              </Box>
            </Grid>
            <Condicional condicao={temReceita}>
              <Grid item xs={6} sx={{ mt: -3 }}>
                <Box
                  sx={{ border: '1px solid #3a3a3a', borderRadius: '4px', p: 1, mt: 2 }}
                  ref={(el: any) => (fieldRefs.current[4] = el)}>
                  <InputText
                    label="Quantidade"
                    labelAlign='center'
                    textAlign='center'
                    setState={setDados}
                    field="qtd"
                    tipo='currency'
                    erros={erros}
                    dados={dados}
                    onFocus={(e) => e.target.select()}
                    disabled={temReceita ? false : true}
                    onKeyDown={(event: any) => btPulaCampo(event, 5)}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ mt: -3 }}>
                <Box
                  sx={{ border: '1px solid #3a3a3a', borderRadius: '4px', p: 1, mt: 2 }}
                  ref={(el: any) => (fieldRefs.current[5] = el)}>
                  <CurrencyTextField
                    label="Valor Unitário"
                    labelAlign='center'
                    textAlign='center'
                    setState={setDados}
                    field="price"
                    erros={erros}
                    dados={dados}
                    onFocus={(e) => e.target.select()}
                    disabled={temReceita ? false : true}
                    onKeyDown={(event: any) => btPulaCampo(event, 6)}
                  />
                </Box>
              </Grid>
            </Condicional>
            <Grid item xs={12} sx={{ mt: -2 }} >
              <Box ref={(el: any) => (fieldRefs.current[6] = el)}>
                <CurrencyTextField
                  label="Valor Total"
                  setState={setDados}
                  field="amount"
                  erros={erros}
                  dados={dados}
                  onFocus={temReceita ? (event: any) => btPulaCampo(event, 4) : (e) => e.target.select()}
                  disabled={temReceita ? true : false}
                  onKeyDown={(event: any) => btPulaCampo(event, 7)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <Box ref={(el: any) => (fieldRefs.current[7] = el)}>
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
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 8)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ mt: -3 }} >
              <Box ref={(el: any) => (fieldRefs.current[8] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Data"
                  dados={dados}
                  field="date"
                  setState={setDados}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 8)}
                />
              </Box>
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