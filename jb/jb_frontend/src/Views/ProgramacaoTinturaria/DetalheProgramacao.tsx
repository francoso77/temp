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
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { CorInterface } from '../../../../jb_backend/src/interfaces/corInteface';
import { DetalheProgramacaoInterface, ProgramacaoInterface } from '../../../../jb_backend/src/interfaces/programacaoInterface';
import { RomaneioInterface, SomatorioProgramacaoInterface } from './ProgramacaoTinturaria';


interface PropsInterface {
  rsMaster: ProgramacaoInterface,
  setRsMaster: React.Dispatch<React.SetStateAction<ProgramacaoInterface>>,
  masterLocalState: ActionInterface,
  setRsSomatorio: React.Dispatch<React.SetStateAction<SomatorioProgramacaoInterface>>,
  rsRomaneio: RomaneioInterface[],
  setRsRomaneio: React.Dispatch<React.SetStateAction<RomaneioInterface[]>>,
  setHeadTableStatus: React.Dispatch<React.SetStateAction<boolean>>,
  headTableStatus: boolean,
  rsSomatorioTinturaria: SomatorioProgramacaoInterface
}


export default function DetalheProgramacao({
  rsMaster,
  setRsMaster,
  masterLocalState,
  setRsSomatorio,
  rsRomaneio,
  setRsRomaneio,
  setHeadTableStatus,
  headTableStatus,
  rsSomatorioTinturaria }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: DetalheProgramacaoInterface = {
    idProgramacao: null,
    idProduto: 0,
    produto: {
      nome: '',
      idUnidade: 0,
      localizacao: '',
      largura: 0,
      gm2: 0,
      ativo: false,
      tipoProduto: TipoProdutoType.tecidoTinto
    },
    idCor: 0,
    cor: {
      nome: '',
      nivel: 0
    },
    peso: 0,
    gm2: 0,
    largura: 1.45,
    qtdPeca: 0
  }

  const [indiceEdicao, setIndiceEdicao] = useState<number>(-1)
  const [open, setOpen] = useState(false);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [erros, setErros] = useState({})
  const [detalheProgramacao, setDetalheProgramacao] = useState<DetalheProgramacaoInterface>(ResetDados)
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  const [rsCor, setRsCor] = useState<Array<CorInterface>>([])
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

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
      format: (_v, rs: any) => rs.cor.nome
    },
    {
      cabecalho: 'Peso',
      alinhamento: 'right',
      campo: 'peso',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Gm2',
      alinhamento: 'right',
      campo: 'gm2',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Largura',
      alinhamento: 'right',
      campo: 'largura',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Qtd Peça',
      alinhamento: 'right',
      campo: 'qtdPeca',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
  ]

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idProduto', detalheProgramacao, erros, retorno, 'Escolha um produto')
    retorno = validaCampo.naoVazio('idCor', detalheProgramacao, erros, retorno, 'Escolha uma cor')
    retorno = validaCampo.naoVazio('peso', detalheProgramacao, erros, retorno, 'Informe o peso')
    retorno = validaCampo.naoVazio('qtdPeca', detalheProgramacao, erros, retorno, 'Quantas peças')
    retorno = validaCampo.naoVazio('gm2', detalheProgramacao, erros, retorno, 'Qual a gramatura')

    setErros(erros)
    return retorno
  }

  const onEditar = (rs: DetalheProgramacaoInterface, indice: number) => {

    editarSaldoRomaneio(rs)
    setLocalState({ action: actionTypes.editando })
    setIndiceEdicao(indice)
    setDetalheProgramacao(rs)
    setOpen(true)
    setHeadTableStatus(false)

  }

  const onExcluir = (rs: DetalheProgramacaoInterface) => {

    let tmpDetalhe: Array<DetalheProgramacaoInterface> = []
    rsMaster.detalheProgramacoes.forEach(det => {
      if (det.idProduto !== rs.idProduto || det.idCor !== rs.idCor) {
        tmpDetalhe.push(det)
      }
    })
    setRsMaster({ ...rsMaster, detalheProgramacoes: tmpDetalhe })
    AtualizaSomatorio(tmpDetalhe)
    AtualizaSaldoRomaneio(tmpDetalhe)
    setHeadTableStatus(false)
  }

  const btIncluir = () => {
    if (
      rsMaster.dataProgramacao !== "" &&
      rsMaster.idTinturaria !== 0
    ) {
      setIndiceEdicao(-1)
      setOpen(true)
      BuscarDados()
      setDetalheProgramacao(ResetDados)
      setLocalState({ action: actionTypes.incluindo })
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe os dados da Programação!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }

  const btCancelar = () => {
    setOpen(false)
    setErros({})
    setDetalheProgramacao(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
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

    const indice = rsMaster.detalheProgramacoes.findIndex(
      (v, i) => v.idProduto === detalheProgramacao.idProduto &&
        v.idCor === detalheProgramacao.idCor &&
        i !== indiceEdicao
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

  const temSaldo = (): boolean => {
    const saldo = rsRomaneio.filter(v => v.idProduto === detalheProgramacao.idProduto)
      .reduce((a, b) => a + b.saldo, 0)
    if (saldo < detalheProgramacao.peso) {
      setMensagemState({
        titulo: 'Aviso',
        exibir: true,
        mensagem: 'Romaneio sem saldo suficiente - Saldo restante: ' + clsFormatacao.currency(saldo),
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
    return saldo >= detalheProgramacao.peso
  }
  const btConfirmaInclusao = () => {

    if (validarDados() && podeIncluirDetalhe() && temSaldo()) {
      let tmpDetalhe: Array<DetalheProgramacaoInterface> = [...rsMaster.detalheProgramacoes]
      tmpDetalhe.push({
        idProgramacao: rsMaster.idProgramacao as number,
        idProduto: detalheProgramacao.idProduto,
        idCor: detalheProgramacao.idCor,
        peso: detalheProgramacao.peso,
        gm2: detalheProgramacao.gm2,
        qtdPeca: detalheProgramacao.qtdPeca,
        largura: detalheProgramacao.largura,
        produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalheProgramacao.idProduto)] },
        cor: { ...rsCor[rsCor.findIndex(v => v.idCor === detalheProgramacao.idCor)] },
      })

      setRsMaster({
        ...rsMaster, detalheProgramacoes:
          [
            ...rsMaster.detalheProgramacoes,

            {
              idProgramacao: rsMaster.idProgramacao as number,
              idProduto: detalheProgramacao.idProduto,
              idCor: detalheProgramacao.idCor,
              peso: detalheProgramacao.peso,
              gm2: detalheProgramacao.gm2,
              qtdPeca: detalheProgramacao.qtdPeca,
              largura: detalheProgramacao.largura,
              produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalheProgramacao.idProduto)] },
              cor: { ...rsCor[rsCor.findIndex(v => v.idCor === detalheProgramacao.idCor)] },
            }
          ]
      })
      AtualizaSomatorio(tmpDetalhe)
      AtualizaSaldoRomaneio(tmpDetalhe)
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheProgramacao(ResetDados)
      setOpen(false)
    }
  }

  const btConfirmaAlteracao = () => {
    if (validarDados() && podeIncluirDetalhe() && temSaldo()) {

      let tmpDetalhe: Array<DetalheProgramacaoInterface> = [...rsMaster.detalheProgramacoes]
      tmpDetalhe[indiceEdicao] = {
        ...detalheProgramacao,
        produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalheProgramacao.idProduto)] },
        cor: { ...rsCor[rsCor.findIndex(v => v.idCor === detalheProgramacao.idCor)] },
      }

      setRsMaster({
        ...rsMaster,
        detalheProgramacoes: [...tmpDetalhe]
      })
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheProgramacao(ResetDados)
      setOpen(false)
      AtualizaSomatorio(tmpDetalhe)
      AtualizaSaldoRomaneio(tmpDetalhe)
    }
  }

  const AtualizaSomatorio = (rs: Array<DetalheProgramacaoInterface>) => {

    let totalQtd: number = 0
    let total: number = 0

    if (rs) {
      rs.forEach((detalhe) => {
        totalQtd = totalQtd + detalhe.qtdPeca
        total = total + detalhe.peso
      })

      //Testa a cor da tabela de acordo com a quantidade de peças e peso

      if (total === Number(rsSomatorioTinturaria.total) &&
        totalQtd === Number(rsSomatorioTinturaria.totalQtd)) {
        setHeadTableStatus(!headTableStatus)
      }

      setRsSomatorio({ total: total.toString(), totalQtd: totalQtd.toString() })
    }
  }

  const AtualizaSaldoRomaneio = (rs: Array<DetalheProgramacaoInterface>) => {
    if (!rs) return

    const updatedRomaneio = rsRomaneio.map((romaneio) => {
      let saldo_programado_somado = 0

      rs.forEach((detalhe) => {
        if (romaneio.idProduto === detalhe.idProduto) {
          saldo_programado_somado += detalhe.peso
        }
      })

      return {
        ...romaneio,
        peso_programado: saldo_programado_somado,
        saldo: romaneio.peso_total - saldo_programado_somado
      }
    })
    setRsRomaneio(updatedRomaneio)
  }

  const editarSaldoRomaneio = (rs: DetalheProgramacaoInterface) => {
    rsRomaneio.forEach((romaneio) => {
      if (romaneio.idProduto === rs.idProduto) {
        romaneio.saldo = romaneio.saldo + rs.peso
      }
    })
    setRsRomaneio([...rsRomaneio])
  }

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Produto",
        campoOrder: ["nome"],
        criterio: {
          tipoProduto: TipoProdutoType.tecidoCru
        }
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
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'
      >
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
              Item da Programação
            </Typography>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action !== 'pesquisando'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={4} sx={{ mt: 2 }} >
                <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                  <ComboBox
                    opcoes={rsProduto}
                    campoDescricao="nome"
                    campoID="idProduto"
                    dados={detalheProgramacao}
                    mensagemPadraoCampoEmBranco="Escolha um produto"
                    field="idProduto"
                    label="Produtos"
                    erros={erros}
                    setState={setDetalheProgramacao}
                    disabled={localState.action === 'excluindo' ? true : false}
                    onKeyDown={(event) => btPulaCampo(event, 2)}
                    onFocus={(e) => e.target.select()}
                    autoFocus
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
                <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                  <ComboBox
                    opcoes={rsCor}
                    campoDescricao="nome"
                    campoID="idCor"
                    dados={detalheProgramacao}
                    mensagemPadraoCampoEmBranco="Qual cor"
                    field="idCor"
                    label="Cores"
                    erros={erros}
                    setState={setDetalheProgramacao}
                    disabled={localState.action === 'excluindo' ? true : false}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event) => btPulaCampo(event, 2)}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} md={1.5} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                  <InputText
                    tipo='currency'
                    scale={4}
                    label="Peso"
                    dados={detalheProgramacao}
                    field="peso"
                    setState={setDetalheProgramacao}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 3)}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} md={1.5} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                  <InputText
                    tipo='currency'
                    scale={4}
                    label="Qtd Peça"
                    dados={detalheProgramacao}
                    field="qtdPeca"
                    setState={setDetalheProgramacao}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 0)}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} md={1.5} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[6] = el)}>
                  <InputText
                    tipo='currency'
                    scale={4}
                    label="Gm²"
                    dados={detalheProgramacao}
                    field="gm2"
                    setState={setDetalheProgramacao}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 7)}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} md={1.5} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                  <InputText
                    tipo='currency'
                    scale={4}
                    label="Largura"
                    dados={detalheProgramacao}
                    field="largura"
                    setState={setDetalheProgramacao}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 6)}
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

      <Grid item xs={12} sx={{ mt: -3, mb: 1, textAlign: 'center' }}>
        <Condicional condicao={masterLocalState.action !== actionTypes.excluindo}>
          <Tooltip title={'Incluir'}>
            <IconButton
              color="secondary"
              sx={{ mt: 0 }}
              onClick={() => btIncluir()}
            >
              <AddCircleIcon sx={{ fontSize: 50 }} />
            </IconButton>
          </Tooltip>
        </Condicional>
      </Grid>
      <Grid item xs={12}>
        <DataTable
          backgroundColorHead='#d8961c'
          cabecalho={cabecalhoForm}
          dados={rsMaster.detalheProgramacoes.sort((a: DetalheProgramacaoInterface, b: DetalheProgramacaoInterface) => a.produto.nome.localeCompare(b.produto.nome))}
          exibirPaginacao={false}
          acoes={
            [
              {
                icone: "edit",
                onAcionador: (rs: DetalheProgramacaoInterface, indice: number) =>
                  onEditar(rs, indice),
                toolTip: "Editar",
              },
              {
                icone: "delete",
                onAcionador: (rs: DetalheProgramacaoInterface) =>
                  onExcluir(rs),
                toolTip: "Excluir",
              },
            ]}
        />
      </Grid>
    </>
  )
}