import { Box, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
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
import InputText from '../../Componentes/InputText';
import ComboBox from '../../Componentes/ComboBox';
import { DetalheEstruturaInterface, EstruturaInterface } from '../../../../jb_backend/src/interfaces/estruturaInterface';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { CorInterface } from '../../../../jb_backend/src/interfaces/corInteface';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import ClsFormatacao from '../../Utils/ClsFormatacao';


interface PropsInterface {
  rsMaster: EstruturaInterface
  setRsMaster: React.Dispatch<React.SetStateAction<EstruturaInterface>>,
  masterLocalState: ActionInterface,
}


export default function DetalheEstrutura({ rsMaster, setRsMaster, masterLocalState }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: DetalheEstruturaInterface = {
    idEstrutura: null,
    idProduto: 0,
    idCor: null,
    qtd: 0,
    produto: {
      nome: '',
      idUnidade: 0,
      localizacao: '',
      largura: 0,
      gm2: 0,
      ativo: false,
      tipoProduto: TipoProdutoType.tecidoTinto
    },
    cor: {
      nome: '',
      nivel: 0
    }
  }

  const [indiceEdicao, setIndiceEdicao] = useState<number>(-1)
  const [open, setOpen] = useState(false);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface;
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando });
  const [erros, setErros] = useState({});
  const [detalheEstrutura, setDetalheEstrutura] = useState<DetalheEstruturaInterface>(ResetDados);
  const [rsCor, setRsCor] = useState<Array<CorInterface>>([]);
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([]);
  const [tipo, setTipo] = useState<TipoProdutoType>();
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'idProduto',
      format: (_v, rs: any) => rs.produto.nome
    },
    {
      cabecalho: 'Cor',
      alinhamento: 'left',
      campo: 'idCor',
      format: (_v, rs: any) => rs.idCor === null ? 'sem cor' : rs.cor.nome
    },
    {
      cabecalho: 'Qtd',
      alinhamento: 'left',
      campo: 'qtd',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
  ]

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    if (detalheEstrutura.idCor) {
      retorno = validaCampo.naoVazio('idCor', detalheEstrutura, erros, retorno, 'Escolha uma cor')
    }
    retorno = validaCampo.naoVazio('idProduto', detalheEstrutura, erros, retorno, 'Escolha um produto')
    retorno = validaCampo.naoVazio('qtd', detalheEstrutura, erros, retorno, 'Valor maior que 0')
    setErros(erros)
    return retorno
  }

  const onEditar = (rs: DetalheEstruturaInterface, indice: number) => {
    pegaTipo()
    setLocalState({ action: actionTypes.editando })
    setIndiceEdicao(indice)
    setDetalheEstrutura(rs)
    setOpen(true)
  }

  const onExcluir = (rs: DetalheEstruturaInterface) => {
    let tmpDetalhe: Array<DetalheEstruturaInterface> = []
    rsMaster.detalheEstruturas.forEach(det => {
      if (det.idDetalheEstrutura !== rs.idDetalheEstrutura) {
        tmpDetalhe.push(det)
      }
    })
    setRsMaster({ ...rsMaster, detalheEstruturas: tmpDetalhe })
  }

  const btIncluir = () => {
    if (rsMaster.idProduto !== 0 && rsMaster.idUnidade !== 0 && rsMaster.qtdBase !== 0) {
      setIndiceEdicao(-1)
      setOpen(true)
      BuscarDados()
      setDetalheEstrutura(ResetDados)
      setLocalState({ action: actionTypes.incluindo })
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe os dados do Produto base!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }

  const btCancelar = () => {
    setOpen(false)
    setErros({})
    setDetalheEstrutura(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const pegaTipo = () => {
    const auxTipo = rsProduto.find(produto => produto.idProduto === detalheEstrutura.idProduto)?.tipoProduto;
    if (auxTipo !== undefined) {
      setTipo(auxTipo);
    }
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

  const podeIncluirDetalhe = (): boolean => {
    const indice = rsMaster.detalheEstruturas.findIndex(
      (v, i) => v.idProduto === detalheEstrutura.idProduto && i !== indiceEdicao
    )

    if (indice >= 0) {
      setMensagemState({
        titulo: 'Aviso',
        exibir: true,
        mensagem: 'Produto já cadastrado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
    return indice < 0;
  }

  const btConfirmaInclusao = () => {

    if (validarDados() && podeIncluirDetalhe()) {
      setRsMaster({
        ...rsMaster, detalheEstruturas:
          [
            ...rsMaster.detalheEstruturas,

            {
              idEstrutura: rsMaster.idEstrutura as number,
              idProduto: detalheEstrutura.idProduto,
              idCor: detalheEstrutura.idCor,
              qtd: detalheEstrutura.qtd,
              produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalheEstrutura.idProduto)] },
              cor: { ...rsCor[rsCor.findIndex(v => v.idCor === detalheEstrutura.idCor)] }
            }
          ]
      })
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheEstrutura(ResetDados)
      setOpen(false)
    }
  }

  const btConfirmaAlteracao = () => {

    if (validarDados() && podeIncluirDetalhe()) {

      let tmpDetalheEstruturas: Array<DetalheEstruturaInterface> = [...rsMaster.detalheEstruturas]
      tmpDetalheEstruturas[indiceEdicao] = { ...detalheEstrutura, produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalheEstrutura.idProduto)] } }
      tmpDetalheEstruturas[indiceEdicao] = { ...detalheEstrutura, cor: { ...rsCor[rsCor.findIndex(v => v.idCor === detalheEstrutura.idCor)] } }

      setRsMaster({
        ...rsMaster,
        detalheEstruturas: [...tmpDetalheEstruturas]
      })
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheEstrutura(ResetDados)
      setOpen(false)
    }
  }

  const BuscarDados = () => {

    clsCrud
      .pesquisar({
        entidade: "Produto",
        campoOrder: ["nome"],
        comparador: 'N',
        criterio: {
          idProduto: rsMaster.idProduto
        },
        camposLike: ["idProduto"],
      })
      .then((rsProdutos: Array<ProdutoInterface>) => {
        setRsProduto(rsProdutos)
      })

    clsCrud
      .pesquisar({
        entidade: "Cor",
        campoOrder: ["nome"],
      })
      .then((rsCores: Array<CorInterface>) => {
        setRsCor(rsCores)
      })
  }

  useEffect(() => {
    BuscarDados()
    pegaTipo()
  }, [])


  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'>
        <Paper variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            m: 1,
            p: 1.5,
            backgroundColor: '#3c486b'
          }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'white' }}>
              Item da estrutura do produto
            </Typography>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action !== 'pesquisando'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                  <ComboBox
                    opcoes={rsProduto}
                    campoDescricao="nome"
                    campoID="idProduto"
                    dados={detalheEstrutura}
                    mensagemPadraoCampoEmBranco="Escolha um produto"
                    field="idProduto"
                    label="Produtos"
                    erros={erros}
                    setState={setDetalheEstrutura}
                    disabled={localState.action === 'excluindo' ? true : false}
                    onSelect={pegaTipo}
                    onKeyDown={
                      tipo === 10 ? (event) => btPulaCampo(event, 1)
                        : (event) => btPulaCampo(event, 2)
                    }
                  />
                </Box>
              </Grid>
              <Condicional condicao={[2, 3, 6, 7, 10, 11].includes(tipo as number)}>
                <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
                  <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                    <ComboBox
                      opcoes={rsCor}
                      campoDescricao="nome"
                      campoID="idCor"
                      dados={detalheEstrutura}
                      mensagemPadraoCampoEmBranco="Escolha uma cor"
                      field="idCor"
                      label="Cores"
                      erros={erros}
                      setState={setDetalheEstrutura}
                      disabled={localState.action === 'excluindo' ? true : false}
                      onSelect={pegaTipo}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(event) => btPulaCampo(event, 2)}
                      autoFocus
                    />
                  </Box>
                </Grid>
              </Condicional>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                  <InputText
                    tipo='currency'
                    scale={2}
                    label="Qtd"
                    dados={detalheEstrutura}
                    field="qtd"
                    setState={setDetalheEstrutura}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 0)}
                  />
                </Box>
              </Grid>
              <Condicional condicao={localState.action !== 'pesquisando'}>
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
                        onClick={localState.action === actionTypes.incluindo ?
                          () => btConfirmaInclusao() : () => btConfirmaAlteracao()}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                      </IconButton>
                    </Tooltip>
                  </Condicional>
                </Grid>
              </Condicional>
            </Grid>
          </Paper >
        </Condicional>
      </Dialog >
      <Paper sx={{ m: 0, p: 0 }}>
        <Grid item xs={12} sx={{ mb: 1, textAlign: 'center' }}>
          <Condicional condicao={masterLocalState.action !== actionTypes.excluindo}>
            <Tooltip title={'Incluir'}>
              <IconButton
                color="secondary"
                sx={{ mt: -1, ml: { xs: 1, md: 0.5 } }}
                onClick={() => btIncluir()}
              >
                <AddCircleIcon sx={{ fontSize: 50 }} />
              </IconButton>
            </Tooltip>
          </Condicional>
        </Grid>
        <Grid item xs={12}>
          <DataTable
            colunaSoma={['qtd']}
            temTotal={true}
            cabecalho={cabecalhoForm}
            dados={rsMaster.detalheEstruturas}
            acoes={masterLocalState.action === actionTypes.excluindo ? [] :
              [
                {
                  icone: "edit",
                  onAcionador: (rs: DetalheEstruturaInterface, indice: number) =>
                    onEditar(rs, indice),
                  toolTip: "Editar",
                },
                {
                  icone: "delete",
                  onAcionador: (rs: DetalheEstruturaInterface) =>
                    onExcluir(rs),
                  toolTip: "Excluir",
                },
              ]}
          />
        </Grid>
      </Paper>
    </>
  )
}