import { Box, Container, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import { PessoaInterface } from '../../Interfaces/pessoaInterface';
import { PessoaType, PessoaTypes } from '../../types/pessoaTypes';
import { THEME } from '../../app/Layout/Theme';
import DialogPessoas from '../../Componentes/Dialog/DialogPessoas';
import { UsuarioType } from '../../types/usuarioTypes';


export default function Pessoa() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const [open, setOpen] = useState(true);
  const [selectedValue, setSelectedValue] = useState(PessoaTypes[1].descricao);

  const handleClose = (value: string) => {
    setOpen(false)
    setSelectedValue(value)

    const pessoaType = PessoaTypes.find((p) => p.idPessoaType === value)
    if (pessoaType) {
      pessoa.tipoPessoa = pessoaType.idPessoaType
    }

    setLocalState({ action: actionTypes.incluindo })
  }


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
    tipoPessoa: PessoaType.clienteJuridica,
    ativo: true,
  }

  interface PesquisaInterface {
    nome: string
  }
  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<PessoaInterface>>([])
  const [erros, setErros] = useState({})
  const [pessoa, setPessoa] = useState<PessoaInterface>(ResetDados)
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })

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
      format: (tipo) => PessoaTypes.find(t => t.idPessoaType === tipo)?.descricao.toUpperCase()
    },
    {
      cabecalho: 'Whatsapp',
      alinhamento: 'left',
      campo: 'whatsapp'
    },
  ]

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
      setSelectedValue(rs.tipoPessoa)
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
      retorno = validaCampo.eEmail('email', pessoa, erros, retorno)
      retorno = validaCampo.eTelefone('telefone', pessoa, erros, retorno, false)
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
        select: ["nome", "tipoPessoa"],
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
                localState: localState,
                cb: () => btPesquisar(),
                setMensagemState: setMensagemState,
                token: usuarioState.token
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
      ...layoutState,
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
            pessoa.endereco = clsCrud.tmp_eCEP.logradouro.toUpperCase()
            pessoa.bairro = clsCrud.tmp_eCEP.bairro.toUpperCase()
            pessoa.cidade = clsCrud.tmp_eCEP.localidade.toUpperCase()
            pessoa.uf = clsCrud.tmp_eCEP.uf.toUpperCase()
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

  useEffect(() => {
    const carregarDados = async () => {
      await btPesquisar()
    }
    carregarDados()
  }, [])

  return (

    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: -1.5, mr: -5, mb: -5 }}>
            <Tooltip title={'Fechar'}>
              <IconButton onClick={() => btFechar()}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={10} md={11}>
              <InputText
                label="Pesquisa"
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
            <Grid item xs={2} md={1}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 5, ml: { xs: 1, md: 2 } }}
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
                acoes={usuarioState.tipoUsuario === UsuarioType.admin ? [
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
                ] : []}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={localState.action === 'pessoa'}>
            <DialogPessoas
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
              tipo='pessoas'
            />
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} sm={3} md={3}  >
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  pl: 15,
                  //width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  backgroundColor: THEME.cores.cinzaFundo,
                  border: "1px solid",
                  borderColor: THEME.cores.cinzaTexto,
                  borderRadius: 2,
                  minWidth: 120 // largura mínima opcional, para não ficar apertado
                }}
              >
                <InputText
                  label="Ativo"
                  tipo="checkbox"
                  dados={pessoa}
                  field="ativo"
                  setState={setPessoa}
                  disabled={localState.action === 'excluindo' ? true : false}

                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
              <Box
                sx={{
                  mt: 3,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",   // alinha verticalmente
                  justifyContent: "center", // ou "flex-start" se quiser colado
                  backgroundColor: THEME.cores.cinzaFundo, // sua cor de fundo
                  border: "1px solid",
                  borderColor: THEME.cores.cinzaTexto, // cor da borda
                  borderRadius: 2, // cantos arredondados
                  p: 2.5 // padding interno
                }}
              >
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ fontSize: 22, fontWeight: "bold" }}
                >
                  Tipo de Pessoa:
                </Typography>

                <Typography
                  sx={{ color: THEME.palette.primary.main, fontSize: 20, ml: 2, mt: 0.5 }}
                >
                  {PessoaTypes.find((p) => p.idPessoaType === selectedValue)?.descricao}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={['C', 'F', 'J'].includes(pessoa.tipoPessoa) ? 4 : 3} sx={{ mt: 2, pl: { md: 1 } }}>
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
            <Condicional condicao={['C', 'F', 'J', 'V'].includes(pessoa.tipoPessoa)}>

              <Grid item xs={12} md={2} sx={{ mt: 2 }}>
                <InputText
                  label={pessoa.tipoPessoa === 'C' || pessoa.tipoPessoa === 'V' ? "CPF" : "CNPJ"}
                  mask={pessoa.tipoPessoa === 'C' || pessoa.tipoPessoa === 'V' ? "cpf" : "cnpj"}
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
            </Condicional>
            <Condicional condicao={['C', 'F', 'J'].includes(pessoa.tipoPessoa)}>
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
                  mapKeyPress={
                    [
                      { key: 'Enter', onKey: btBuscaCep },
                      { key: 'Tab', onKey: btBuscaCep },
                    ]
                  }
                />
              </Grid>
              <Grid item xs={12} md={10} sx={{ mt: 2, pl: { md: 1 } }}>
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
              <Grid item xs={9} md={5} sx={{ mt: 2, pl: { md: 1 } }}>
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
              <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
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
            </Condicional>
            <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
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
              <Grid item xs={3} md={1} sx={{ mt: 2, pl: { md: 1 } }}>
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
                    sx={{ mt: 3 }}
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
    </Container >
  )
}
