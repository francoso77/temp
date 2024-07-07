import { Container, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import { PessoaTypes } from '../../types/pessoaTypes';
import SimpleDialog, { pessoas } from '../../Componentes/Dialog';
import { THEME } from '../../Layout/Theme';


export default function Pessoa() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const [open, setOpen] = useState(true);
  const [selectedValue, setSelectedValue] = useState(pessoas[1].codigo);

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
    value === 'C' ? pessoa.tipoPessoa = PessoaTypes.clienteFisica
      : value === 'J' ? pessoa.tipoPessoa = PessoaTypes.clienteJuridica
        : value === 'F' ? pessoa.tipoPessoa = PessoaTypes.fornecedor
          : value === 'R' ? pessoa.tipoPessoa = PessoaTypes.revisador
            : value === 'T' ? pessoa.tipoPessoa = PessoaTypes.tecelao : pessoa.tipoPessoa = PessoaTypes.vendedor

    setLocalState({ action: actionTypes.incluindo })
  };

  const ResetDados: PessoaInterface = {
    nome: '',
    apelido: '',
    cpf_cnpj: '',
    endereco: '',
    numero: 0,
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    telefone: '',
    whatsapp: '',
    email: '',
    comissao: 0,
    tipoPessoa: PessoaTypes.clienteJuridica,
    ativo: true
  }
  interface PesquisaInterface {
    nome: string
  }
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<PessoaInterface>>([])
  const [erros, setErros] = useState({})
  const [pessoa, setPessoa] = useState<PessoaInterface>(ResetDados)
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Pessoa',
      alinhamento: 'left',
      campo: 'nome'
    },
    {
      cabecalho: 'Apelido',
      alinhamento: 'left',
      campo: 'apelido'
    },
    {
      cabecalho: 'Tipo',
      alinhamento: 'left',
      campo: 'tipoPessoa',
      format: (tipo) =>
        tipo === 'C' ? 'CLIENTE PF'
          : tipo === 'J' ? 'CLIENTE PJ'
            : tipo === 'F' ? 'FORNECEDOR'
              : tipo === 'R' ? 'REVISADOR'
                : tipo === 'T' ? 'TECELÃO' : 'VENDEDOR'
    },
    {
      cabecalho: 'Whatsapp',
      alinhamento: 'left',
      campo: 'whatsapp'
    },
  ]

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const pesquisarID = (id: string | number): Promise<PessoaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Pessoa",
        criterio: {
          idPessoa: id,
        },
      })
      .then((rs: Array<PessoaInterface>) => {
        return rs[0]
      })
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setPessoa(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setPessoa(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setPessoa(ResetDados)
    setLocalState({ action: actionTypes.pessoa })
    setOpen(true)
  }
  const btCancelar = () => {
    setErros({})
    setPessoa(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const btCheck = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}
    if (['C', 'F', 'J'].includes(pessoa.tipoPessoa)) {
      if (pessoa.tipoPessoa === 'C') {
        retorno = validaCampo.eCPF('cpf_cnpj', pessoa, erros, retorno)
      } else {
        retorno = validaCampo.eCNPJ('cpf_cnpj', pessoa, erros, retorno)
      }
    }
    setErros(erros)
    return retorno
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}
    retorno = validaCampo.naoVazio('nome', pessoa, erros, retorno, 'Nome da pessoa não pode ser vázio')
    retorno = validaCampo.eTelefone('telefone', pessoa, erros, retorno, false)
    retorno = validaCampo.eTelefone('whatsapp', pessoa, erros, retorno, false)
    if (['C', 'F', 'J'].includes(pessoa.tipoPessoa)) {
      if (pessoa.tipoPessoa === 'C') {
        retorno = validaCampo.eCPF('cpf_cnpj', pessoa, erros, retorno)
      } else {
        retorno = validaCampo.eCNPJ('cpf_cnpj', pessoa, erros, retorno)
      }
      retorno = validaCampo.naoVazio('cep', pessoa, erros, retorno, 'Informe um CEP válido')
      retorno = validaCampo.naoVazio('endereco', pessoa, erros, retorno, 'Informe um endereço')
      retorno = validaCampo.naoVazio('numero', pessoa, erros, retorno, 'Número inválido')
      retorno = validaCampo.naoVazio('bairro', pessoa, erros, retorno, 'Informe um bairro')
      retorno = validaCampo.naoVazio('cidade', pessoa, erros, retorno, 'Informe a cidade')
      retorno = validaCampo.eUF('uf', pessoa, erros, retorno, false)
    }
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        criterio: {
          nome: "%".concat(pessoa.nome).concat("%"),
          tipoPessoa: pessoa.tipoPessoa
        },
        camposLike: ["nome"],
        select: ["nome"],
        msg: 'Pesquisando pessoas ...',
        setMensagemState: setMensagemState
      })
      .then((rs) => {
        if (rs.length > 0 && localState.action === actionTypes.incluindo) {
          setMensagemState({
            titulo: 'Erro...',
            exibir: true,
            mensagem: 'Item já cadastrado!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        } else {

          if (validarDados()) {

            if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
              clsCrud.incluir({
                entidade: "Pessoa",
                criterio: pessoa,
                localState: localState.action,
                cb: () => btPesquisar(),
                setMensagemState: setMensagemState
              })
                .then((rs) => {
                  if (rs.ok) {
                    setLocalState({ action: actionTypes.pesquisando })
                  } else {
                    setMensagemState({
                      titulo: 'Erro...',
                      exibir: true,
                      mensagem: 'Erro no cadastro - Consulte Suporte',
                      tipo: MensagemTipo.Error,
                      exibirBotao: true,
                      cb: null
                    })
                  }
                })
            } else if (localState.action === actionTypes.excluindo) {
              clsCrud.excluir({
                entidade: "Pessoa",
                criterio: {
                  idPessoa: pessoa.idPessoa
                },
                cb: () => btPesquisar(),
                setMensagemState: setMensagemState
              })
                .then((rs) => {
                  if (rs.ok) {
                    setLocalState({ action: actionTypes.pesquisando })
                  } else {
                    setMensagemState({
                      titulo: 'Erro...',
                      exibir: true,
                      mensagem: 'Erro no cadastro - Consulte Suporte',
                      tipo: MensagemTipo.Error,
                      exibirBotao: true,
                      cb: null
                    })
                  }
                })
            }
          }
        }
      })
  }

  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        criterio: {
          nome: "%".concat(pesquisa.nome).concat("%"),
        },
        camposLike: ["nome"],
        // select: [
        //   "idPessoa",
        //   "nome",
        //   "telefone",
        //   "whatsapp",
        //   "email",
        //   'endereco',
        //   'numero',
        //   'bairro',
        //   'cidade',
        //   'uf',
        //   'cep',
        //   'apelido',
        //   'cpf_cnpj',
        //   'comissao',
        //   'tipoPessoa',
        //   'ativo'
        // ],
        msg: 'Pesquisando pessoas ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<PessoaInterface>) => {
        setRsPesquisa(rs)
      })
  }
  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Cadastro de Pessoas',
      pathTitulo: '/',
      pathTituloAnterior: '/Pessoa'
    })
    irPara('/')
  }

  const btBuscaCep = () => {
    if (!pessoa.cep || pessoa.cep.length < 10) {
      setMensagemState({
        titulo: "Erro...",
        exibir: true,
        mensagem: 'CEP inválido para pesquisa',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    } else {
      clsCrud.verificaCEP({ CEP: pessoa.cep, setMensagemState: setMensagemState })
        .then((temCep) => {
          if (temCep) {
            pessoa.endereco = clsCrud.tmp_eCEP.logradouro
            pessoa.bairro = clsCrud.tmp_eCEP.bairro
            pessoa.cidade = clsCrud.tmp_eCEP.localidade
            pessoa.uf = clsCrud.tmp_eCEP.uf
          }
          else {
            pessoa.endereco = ''
            pessoa.bairro = ''
            pessoa.cidade = ''
            pessoa.uf = ''
          }
        }).catch((e) => {
          setMensagemState({
            titulo: "Erro...",
            exibir: true,
            mensagem: 'Erro na conexão com o servidor de cep!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        })
    }
  }

  return (

    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>

        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={11}>
              <InputText
                label="Digite o nome"
                tipo="uppercase"
                dados={pesquisa}
                field="nome"
                setState={setPesquisa}
                iconeEnd='searchicon'
                onClickIconeEnd={() => btPesquisar()}
                mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
                autoFocus
              />
            </Grid>
            <Grid item xs={1}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: { xs: 0, md: 2 } }}
                  onClick={() => btIncluir()}
                >
                  <AddCircleIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <DataTable
                cabecalho={cabecalhoForm}
                dados={rsPesquisa}
                acoes={[
                  {
                    icone: "edit",
                    onAcionador: (rs: PessoaInterface) =>
                      onEditar(rs.idPessoa as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: PessoaInterface) =>
                      onExcluir(rs.idPessoa as number),
                    toolTip: "Excluir",
                  },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={localState.action === 'pessoa'}>
            <SimpleDialog
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
              tipo='pessoas'
            />
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={6} sm={6} md={6} sx={{ textAlign: 'left' }}>
              <InputText
                label="Ativo"
                tipo="checkbox"
                dados={pessoa}
                field="ativo"
                setState={setPessoa}
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} sx={{ textAlign: 'right', color: THEME.cores.cinzaTexto }}>
              <Typography variant="h6" component="div">
                Tipo de Pessoa: {pessoa.tipoPessoa === 'C' ? 'CLIENTE PF'
                  : pessoa.tipoPessoa === 'J' ? 'CLIENTE PJ'
                    : pessoa.tipoPessoa === 'F' ? 'FORNECEDOR'
                      : pessoa.tipoPessoa === 'R' ? 'REVISADOR'
                        : pessoa.tipoPessoa === 'T' ? 'TECELÃO' : 'VENDEDOR'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={['C', 'F', 'J'].includes(pessoa.tipoPessoa) ? 6 : 4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Nome"
                tipo="uppercase"
                dados={pessoa}
                field="nome"
                setState={setPessoa}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={50}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} md={['C', 'F', 'J'].includes(pessoa.tipoPessoa) ? 3 : 2} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Apelido"
                tipo="uppercase"
                dados={pessoa}
                field="apelido"
                setState={setPessoa}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={25}
              />
            </Grid>
            <Condicional condicao={['C', 'F', 'J'].includes(pessoa.tipoPessoa)}>
              <Grid item xs={12} md={3} sx={{ mt: 2 }}>
                <InputText
                  label={pessoa.tipoPessoa === 'C' ? "CPF" : "CNPJ"}
                  mask={pessoa.tipoPessoa === 'C' ? "cpf" : "cnpj"}
                  setState={setPessoa}
                  dados={pessoa}
                  field="cpf_cnpj"
                  erros={erros}
                  type='tel'
                  disabled={localState.action === 'excluindo' ? true : false}
                  mapKeyPress={
                    [
                      { key: 'Enter', onKey: btCheck },
                      { key: 'Tab', onKey: btCheck },
                    ]
                  }
                />
              </Grid>
              <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  label="CEP"
                  mask='cep'
                  dados={pessoa}
                  field="cep"
                  setState={setPessoa}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  iconeEnd='searchicon'
                  onClickIconeEnd={() => btBuscaCep()}
                  mapKeyPress={[{ key: 'Enter', onKey: btBuscaCep }]}
                />
              </Grid>
              <Grid item xs={12} md={9} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  label="Endereço"
                  tipo="uppercase"
                  dados={pessoa}
                  field="endereco"
                  setState={setPessoa}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={100}
                />
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  label="Número"
                  tipo="number"
                  type='tel'
                  dados={pessoa}
                  field="numero"
                  setState={setPessoa}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={9} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  label="Bairro"
                  tipo="uppercase"
                  dados={pessoa}
                  field="bairro"
                  setState={setPessoa}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={60}
                />
              </Grid>
              <Grid item xs={12} md={5} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  label="Cidade"
                  tipo="uppercase"
                  dados={pessoa}
                  field="cidade"
                  setState={setPessoa}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={60}
                />
              </Grid>
              <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  label="UF"
                  tipo="uppercase"
                  dados={pessoa}
                  field="uf"
                  setState={setPessoa}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={2}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  label="E-mail"
                  setState={setPessoa}
                  dados={pessoa}
                  field="email"
                  erros={erros}
                  type="email"
                  tipo="text"
                  disabled={localState.action === 'excluindo' ? true : false}
                />
              </Grid>
            </Condicional>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Telefone"
                setState={setPessoa}
                dados={pessoa}
                field="telefone"
                erros={erros}
                type="tel"
                mask='tel'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="WhatsApp"
                setState={setPessoa}
                dados={pessoa}
                field="whatsapp"
                erros={erros}
                type="tel"
                mask='tel'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Condicional condicao={pessoa.tipoPessoa === 'V'}>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  label="Comissão"
                  tipo="number"
                  type='tel'
                  dados={pessoa}
                  field="comissao"
                  setState={setPessoa}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
            </Condicional>
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
              <Tooltip title={'Cancelar'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: 2 }}
                  onClick={() => btCancelar()}
                >
                  <CancelRoundedIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
              <Condicional condicao={['incluindo', 'editando'].includes(localState.action)}>
                <Tooltip title={'Confirmar'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 3, ml: 2 }}
                    onClick={() => btConfirmar()}
                  >
                    <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Tooltip>
              </Condicional>

              <Condicional condicao={localState.action === 'excluindo'}>
                <Tooltip title={'Excluir'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 3, ml: 2 }}
                    onClick={() => btConfirmar()}
                  >
                    <DeleteIcon sx={{ fontSize: 60 }} />
                  </IconButton>
                </Tooltip>
              </Condicional>
            </Grid>
          </Condicional>
        </Grid>
      </Paper >
      {/* {JSON.stringify(pessoa)} */}
    </Container >
  )
}

{/* <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
      <InputMultiline
        label="Dados adicionais..."
        setState={setPessoa}
        dados={pessoa}
        field="adicionais"
        disabled={localState.action === 'excluindo' ? true : false}
      />
    </Grid> */}