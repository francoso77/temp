import { Box, Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
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
import ComboBox from '../../Componentes/ComboBox';
import { ProdutoInterface } from '../../Interfaces/produtoInterface';
import { UnidadeMedidaInterface } from '../../Interfaces/unidadeMedidaInteface';
import { TipoProdutoType, TipoProdutoTypes } from '../../types/tipoProdutoypes';
import { UsuarioType } from '../../types/usuarioTypes';


export default function Produto() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const ResetDados: ProdutoInterface = {
    nome: '',
    idUnidade: 0,
    localizacao: '',
    largura: 0,
    preco: 0,
    gm2: 0,
    ativo: true,
    tipoProduto: TipoProdutoType.tecidoTinto

  }

  interface PesquisaInterface {
    nome: string
    tipo: TipoProdutoType | number
  }

  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<ProdutoInterface>>([])
  const [produtosAll, setProdutosAll] = useState<Array<ProdutoInterface>>([])
  const [erros, setErros] = useState({})
  const [produto, setProduto] = useState<ProdutoInterface>(ResetDados)
  const [rsUnidade, setRsUnidade] = useState<Array<UnidadeMedidaInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '', tipo: TipoProdutoType.todos })
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'nome'
    },
    {
      cabecalho: 'Unidade',
      alinhamento: 'left',
      campo: 'idUnidade',
      format: (_v, rs: any) => rs.unidadeMedida.sigla
    },
    {
      cabecalho: 'Tipo Produto',
      alinhamento: 'left',
      campo: 'tipoProduto',
      format: (tipo) => TipoProdutoTypes.find(t => t.idTipoProduto === tipo)?.descricao
    },
    {
      cabecalho: 'Localização',
      alinhamento: 'left',
      campo: 'localizacao',
    },
    {
      cabecalho: 'Ativo',
      alinhamento: 'left',
      campo: 'ativo',
      format: (v: boolean) => { return v ? 'Sim' : 'Não' }
    },
  ]

  const pesquisarID = (id: string | number): Promise<ProdutoInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Produto",
        criterio: {
          idProduto: id,
        },
      })
      .then((rs: Array<ProdutoInterface>) => {
        return rs[0]
      })
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProduto(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProduto(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setProduto(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setProduto(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('nome', produto, erros, retorno, 'Nome do produto não pode ser vázio')
    retorno = validaCampo.naoVazio('idUnidade', produto, erros, retorno, 'Informe uma Unidade')
    retorno = validaCampo.naoVazio('tipoProduto', produto, erros, retorno, 'Informe um Tipo')

    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {


    const jaExiste = produtosAll.some(p =>
      p.nome.toLowerCase() === produto.nome.toLowerCase() &&
      p.idProduto !== produto.idProduto
    )

    if (jaExiste && localState.action === actionTypes.incluindo) {
      setMensagemState({
        titulo: 'Erro...',
        exibir: true,
        mensagem: 'Item já cadastrado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
      return
    }

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "Produto",
          criterio: produto,
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
          entidade: "Produto",
          criterio: {
            idProduto: produto.idProduto
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

  const btPesquisar = () => {
    setRsPesquisa(filtrarProdutos(produtosAll, pesquisa))
  }

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Cadastro de Produtos',
      pathTitulo: '/',
      pathTituloAnterior: '/Produto'
    })
    irPara('/')
  }

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

  // --- FILTRO DE PESQUISA MAIS LIMPO E RÁPIDO ---
  const filtrarProdutos = (todos: ProdutoInterface[], filtro: PesquisaInterface) => {
    const nome = filtro.nome.trim().toLowerCase()
    const tipo = filtro.tipo

    if (!nome && (tipo === TipoProdutoType.todos || !tipo)) {
      // Nenhum filtro -> mostra tudo
      return todos
    }

    return todos.filter(p => {
      const matchNome = nome ? p.nome.toLowerCase().includes(nome) : true
      const matchTipo = tipo && tipo !== TipoProdutoType.todos ? p.tipoProduto === tipo : true
      return matchNome && matchTipo
    })
  }

  useEffect(() => {
    // Aplica filtro toda vez que pesquisa ou produtosAll mudar
    const resultado = filtrarProdutos(produtosAll, pesquisa)
    setRsPesquisa(resultado)
  }, [pesquisa, produtosAll])

  const loadDados = async () => {
    const [unidades, produtos] = await Promise.all([
      clsCrud.pesquisar({
        entidade: "UnidadeMedida",
        criterio: { nome: "%" },
        camposLike: ["nome"],
        campoOrder: ['nome'],
      }),
      clsCrud.pesquisar({
        entidade: "Produto",
        relations: ["unidadeMedida"],
        msg: 'Pesquisando produtos ...',
        setMensagemState: setMensagemState
      })
    ])

    setRsUnidade(unidades)
    setProdutosAll(produtos)
    setRsPesquisa(produtos) // <- já exibe tudo inicialmente
  }

  useEffect(() => {
    loadDados()
  }, []);

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
            <Grid item xs={6} md={8}>
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
            <Grid item xs={4} md={3}>
              <ComboBox
                opcoes={TipoProdutoTypes}
                campoDescricao="descricao"
                campoID="idTipoProduto"
                dados={pesquisa}
                mensagemPadraoCampoEmBranco="Todos os tipos"
                field="tipo"
                label="Tipo de Produto"
                erros={erros}
                setState={setPesquisa}
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
                    onAcionador: (rs: ProdutoInterface) =>
                      onEditar(rs.idProduto as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: ProdutoInterface) =>
                      onExcluir(rs.idProduto as number),
                    toolTip: "Excluir",
                  },
                ] : []}
              />
            </Grid>
          </Condicional>

          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <InputText
                  label="Produto"
                  tipo="uppercase"
                  dados={produto}
                  field="nome"
                  setState={setProduto}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={80}
                  autoFocus
                  onKeyDown={(event: any) => btPulaCampo(event, 1)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                <ComboBox
                  opcoes={rsUnidade}
                  campoDescricao="sigla"
                  campoID="idUnidade"
                  dados={produto}
                  mensagemPadraoCampoEmBranco="Escolha uma unidade de medida"
                  field="idUnidade"
                  label="Unidade"
                  erros={erros}
                  setState={setProduto}
                  onKeyDown={(event: any) => btPulaCampo(event, 2)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                <ComboBox
                  opcoes={TipoProdutoTypes}
                  campoDescricao="descricao"
                  campoID="idTipoProduto"
                  dados={produto}
                  mensagemPadraoCampoEmBranco="Escolha um Tipo"
                  field="tipoProduto"
                  label="Tipo de Produto"
                  erros={erros}
                  setState={setProduto}
                  onKeyDown={(event: any) => btPulaCampo(event, 3)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <InputText
                  label="Localização"
                  tipo="uppercase"
                  dados={produto}
                  field="localizacao"
                  setState={setProduto}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={10}
                  onKeyDown={(event: any) => btPulaCampo(event, 4)}
                />
              </Box>
            </Grid>
            <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                <InputText
                  tipo='currency'
                  label="Largura"
                  dados={produto}
                  field="largura"
                  setState={setProduto}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  scale={2}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 5)}
                />
              </Box>
            </Grid>
            <Grid item xs={2} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                <InputText
                  tipo='currency'
                  label="G/M²"
                  dados={produto}
                  field="gm2"
                  setState={setProduto}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  scale={6}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 7)}
                />
              </Box>
            </Grid>
            <Grid item xs={2} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[6] = el)}>
                <InputText
                  tipo='currency'
                  label="Preço"
                  dados={produto}
                  field="preco"
                  setState={setProduto}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  scale={2}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 7)}
                />
              </Box>
            </Grid>
            <Grid item xs={2} md={1} sx={{ ml: 8, mt: 5 }}>
              <Box ref={(el: any) => (fieldRefs.current[7] = el)}>
                <InputText
                  label="Ativo"
                  tipo="checkbox"
                  dados={produto}
                  field="ativo"
                  setState={setProduto}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Box>
            </Grid>
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
      {/* {JSON.stringify(produto)} */}
    </Container >
  )
}
