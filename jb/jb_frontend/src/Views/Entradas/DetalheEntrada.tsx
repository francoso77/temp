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
import { ProdutoInterface } from '../../Interfaces/produtoInterface';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import InputCalc from '../../Componentes/InputCalc';
import { DetalheEntradaInterface, EntradaInterface } from '../../Interfaces/entradaInterface';
import { SomatorioEntradaInterface } from './Entrada';
import { CorInterface } from '../../Interfaces/corInteface';
import { PessoaInterface } from '../../Interfaces/pessoaInterface';
import { TinturariaInterface } from '../../Interfaces/tinturariaInterface';
import { PessoaType } from '../../types/pessoaTypes';


interface PropsInterface {
  rsMaster: EntradaInterface
  setRsMaster: React.Dispatch<React.SetStateAction<EntradaInterface>>,
  masterLocalState: ActionInterface,
  setRsSomatorio: React.Dispatch<React.SetStateAction<SomatorioEntradaInterface>>,
}


export default function DetalheEntrada({ rsMaster, setRsMaster, masterLocalState, setRsSomatorio }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: DetalheEntradaInterface = {
    idEntrada: null,
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
    qtd: 0,
    vrUnitario: 0,
    idCor: null,
    cor: {
      nome: '',
      nivel: 0
    },
    qtdPecas: 0,
    metro: 0,
    gm2: 0,
    idPessoa_revisador: null,
    revisador: {
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
      tipoPessoa: PessoaType.revisador,
      comissao: 0,
      ativo: false
    },
    idTinturaria: null,
    romaneio: {
      dataTinturaria: '',
      idPessoa_cliente: 0,
      idPessoa_fornecedor: 0,
    },
    perdaMalharia: 0,
    perdaTinturaria: 0
  }

  const [indiceEdicao, setIndiceEdicao] = useState<number>(-1)
  const [open, setOpen] = useState(false);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [erros, setErros] = useState({})
  const [detalheEntrada, setDetalheEntrada] = useState<DetalheEntradaInterface>(ResetDados)
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  const [rsCor, setRsCor] = useState<Array<CorInterface>>([])
  const [rsRevisador, setRsRevisador] = useState<Array<PessoaInterface>>([])
  const [rsTinturaria, setRsTinturaria] = useState<Array<TinturariaInterface>>([])
  const [tipo, setTipo] = useState<TipoProdutoType>()
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'idProduto',
      format: (_v, rs: any) => rs.produto.nome
    },
    {
      cabecalho: 'Qtd',
      alinhamento: 'right',
      campo: 'qtd',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Vr Unitário',
      alinhamento: 'right',
      campo: 'vrUnitario',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Total Item',
      alinhamento: 'right',
      campo: 'qtd',
      format: (_v, rs: any) => rs.qtd ?
        clsFormatacao.currency(rs.qtd * rs.vrUnitario) : ""
    },
  ]


  const pegaTipo = () => {
    const auxTipo = rsProduto.find(produto => produto.idProduto === detalheEntrada.idProduto)?.tipoProduto;
    if (auxTipo !== undefined) {
      setTipo(auxTipo);
    }
  }

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idProduto', detalheEntrada, erros, retorno, 'Escolha um produto')
    retorno = validaCampo.naoVazio('qtd', detalheEntrada, erros, retorno, 'Quantidade maior que 0')
    retorno = validaCampo.naoVazio('vrUnitario', detalheEntrada, erros, retorno, 'Valor maior que 0')
    setErros(erros)
    return retorno
  }

  const onEditar = (rs: DetalheEntradaInterface, indice: number) => {

    setLocalState({ action: actionTypes.editando })
    setIndiceEdicao(indice)
    setDetalheEntrada(rs)
    setOpen(true)
  }

  const onExcluir = (rs: DetalheEntradaInterface) => {

    let tmpDetalhe: Array<DetalheEntradaInterface> = []
    rsMaster.detalheEntradas.forEach(det => {
      if (det.idDetalheEntrada !== rs.idDetalheEntrada) {
        tmpDetalhe.push(det)
      }
    })
    setRsMaster({ ...rsMaster, detalheEntradas: tmpDetalhe })
    AtualizaSomatorio(tmpDetalhe)
  }

  const btIncluir = () => {
    if (
      rsMaster.dataEmissao !== "" &&
      rsMaster.notaFiscal !== "" &&
      rsMaster.idPessoa_fornecedor !== 0
    ) {
      setIndiceEdicao(-1)
      setOpen(true)
      BuscarDados()
      setDetalheEntrada(ResetDados)
      setLocalState({ action: actionTypes.incluindo })
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe os dados da Nota Fiscal!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }

  const btCancelar = () => {
    setOpen(false)
    setErros({})
    setDetalheEntrada(ResetDados)
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
    const indice = rsMaster.detalheEntradas.findIndex(
      (v, i) => v.idProduto === detalheEntrada.idProduto && i !== indiceEdicao
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
      let tmpDetalhe: Array<DetalheEntradaInterface> = [...rsMaster.detalheEntradas]
      tmpDetalhe.push({
        idEntrada: rsMaster.idEntrada as number,
        idProduto: detalheEntrada.idProduto,
        idCor: detalheEntrada.idCor,
        qtdPecas: detalheEntrada.qtdPecas,
        vrUnitario: detalheEntrada.vrUnitario,
        qtd: detalheEntrada.qtd,
        metro: detalheEntrada.metro,
        gm2: detalheEntrada.gm2,
        idPessoa_revisador: detalheEntrada.idPessoa_revisador,
        idTinturaria: detalheEntrada.idTinturaria,
        perdaMalharia: detalheEntrada.perdaMalharia,
        perdaTinturaria: detalheEntrada.perdaTinturaria,
        produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalheEntrada.idProduto)] },
        cor: { ...rsCor[rsCor.findIndex(v => v.idCor === detalheEntrada.idCor)] },
        revisador: { ...rsRevisador[rsRevisador.findIndex(v => v.idPessoa === detalheEntrada.idPessoa_revisador)] },
        romaneio: { ...rsTinturaria[rsTinturaria.findIndex(v => v.idTinturaria === detalheEntrada.idTinturaria)] },
      })

      setRsMaster({
        ...rsMaster, detalheEntradas:
          [
            ...rsMaster.detalheEntradas,

            {
              idEntrada: rsMaster.idEntrada as number,
              idProduto: detalheEntrada.idProduto,
              idCor: detalheEntrada.idCor,
              qtdPecas: detalheEntrada.qtdPecas,
              vrUnitario: detalheEntrada.vrUnitario,
              qtd: detalheEntrada.qtd,
              metro: detalheEntrada.metro,
              gm2: detalheEntrada.gm2,
              idPessoa_revisador: detalheEntrada.idPessoa_revisador,
              idTinturaria: detalheEntrada.idTinturaria,
              perdaMalharia: detalheEntrada.perdaMalharia,
              perdaTinturaria: detalheEntrada.perdaTinturaria,
              produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalheEntrada.idProduto)] },
              cor: { ...rsCor[rsCor.findIndex(v => v.idCor === detalheEntrada.idCor)] },
              revisador: { ...rsRevisador[rsRevisador.findIndex(v => v.idPessoa === detalheEntrada.idPessoa_revisador)] },
              romaneio: { ...rsTinturaria[rsTinturaria.findIndex(v => v.idTinturaria === detalheEntrada.idTinturaria)] },
            }
          ]
      })
      AtualizaSomatorio(tmpDetalhe)
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheEntrada(ResetDados)
      setOpen(false)
    }
  }

  const btConfirmaAlteracao = () => {

    if (validarDados() && podeIncluirDetalhe()) {

      let tmpDetalhe: Array<DetalheEntradaInterface> = [...rsMaster.detalheEntradas]
      tmpDetalhe[indiceEdicao] = {
        ...detalheEntrada,
        produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalheEntrada.idProduto)] },
        cor: { ...rsCor[rsCor.findIndex(v => v.idCor === detalheEntrada.idCor)] },
        revisador: { ...rsRevisador[rsRevisador.findIndex(v => v.idPessoa === detalheEntrada.idPessoa_revisador)] },
        romaneio: { ...rsTinturaria[rsTinturaria.findIndex(v => v.idTinturaria === detalheEntrada.idTinturaria)] },
      }

      setRsMaster({
        ...rsMaster,
        detalheEntradas: [...tmpDetalhe]
      })
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheEntrada(ResetDados)
      setOpen(false)
      AtualizaSomatorio(tmpDetalhe)

    }
  }

  const AtualizaSomatorio = (rs: Array<DetalheEntradaInterface>) => {

    let totalQtd: number = 0
    let total: number = 0

    if (rs) {
      rs.forEach((detalhe) => {
        totalQtd = totalQtd + detalhe.qtd
        total = total + (detalhe.qtd * detalhe.vrUnitario)
      })
      setRsSomatorio({ total: total.toString(), totalQtd: totalQtd.toString() })
    }
  }

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Produto",
        campoOrder: ["nome"],
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

    clsCrud
      .pesquisar({
        entidade: "Tinturaria",
        campoOrder: ["idTinturaria"],
      })
      .then((rsTinturarias: Array<TinturariaInterface>) => {
        setRsTinturaria(rsTinturarias)
      })

    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        campoOrder: ['nome'],
        criterio: {
          tipoPessoa: "R",
        },
        camposLike: ["tipoPessoa"],
      })
      .then((rsRevisadores: Array<PessoaInterface>) => {
        setRsRevisador(rsRevisadores)
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
              Item da Nota Fiscal
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
                    dados={detalheEntrada}
                    mensagemPadraoCampoEmBranco="Escolha um produto"
                    field="idProduto"
                    label="Produtos"
                    erros={erros}
                    setState={setDetalheEntrada}
                    disabled={localState.action === 'excluindo' ? true : false}
                    onSelect={pegaTipo}
                    // onClickPesquisa={(rs) => pesquisarProdutos(rs)}
                    onKeyDown={
                      tipo === 10 ? (event) => btPulaCampo(event, 1)
                        : (event) => btPulaCampo(event, 2)
                    }
                    onFocus={(e) => e.target.select()}
                    autoFocus
                  />
                </Box>
              </Grid>
              <Condicional condicao={[2, 3, 6, 10, 11].includes(tipo as number)}>
                <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
                  <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                    <ComboBox
                      opcoes={rsCor}
                      campoDescricao="nome"
                      campoID="idCor"
                      dados={detalheEntrada}
                      mensagemPadraoCampoEmBranco="Qual cor"
                      field="idCor"
                      label="Cores"
                      erros={erros}
                      setState={setDetalheEntrada}
                      disabled={localState.action === 'excluindo' ? true : false}
                      onSelect={pegaTipo}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(event) => btPulaCampo(event, 2)}
                    />
                  </Box>
                </Grid>
              </Condicional>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                  <InputText
                    tipo='currency'
                    scale={4}
                    label="Qtd"
                    dados={detalheEntrada}
                    field="qtd"
                    setState={setDetalheEntrada}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 3)}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                  <InputText
                    tipo='currency'
                    scale={4}
                    label="Vr Unitário"
                    dados={detalheEntrada}
                    field="vrUnitario"
                    setState={setDetalheEntrada}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={
                      tipo === 10 ? (event: any) => btPulaCampo(event, 4)
                        : (event: any) => btPulaCampo(event, 0)
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>

                <InputCalc
                  label='Total Item'
                  tipo='currency'
                  scale={4}
                  disabled={false}
                  value={(detalheEntrada.qtd * detalheEntrada.vrUnitario).toString()}

                />
              </Grid>
              <Condicional condicao={tipo === 10}>
                <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                  <Typography>
                    Detalhes de Tinturaria
                  </Typography>

                </Grid>
                <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
                  <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                      <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                        <InputText
                          tipo='number'
                          scale={0}
                          label="Qtd Peças"
                          dados={detalheEntrada}
                          field="qtdPecas"
                          setState={setDetalheEntrada}
                          disabled={localState.action === 'excluindo' ? true : false}
                          erros={erros}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 5)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                      <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                        <InputText
                          tipo='currency'
                          scale={4}
                          label="Metros"
                          dados={detalheEntrada}
                          field="metro"
                          setState={setDetalheEntrada}
                          disabled={localState.action === 'excluindo' ? true : false}
                          erros={erros}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 6)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                      <Box ref={(el: any) => (fieldRefs.current[6] = el)}>
                        <InputText
                          tipo='currency'
                          scale={4}
                          label="Gm²"
                          dados={detalheEntrada}
                          field="gm2"
                          setState={setDetalheEntrada}
                          disabled={localState.action === 'excluindo' ? true : false}
                          erros={erros}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 7)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
                      <Box ref={(el: any) => (fieldRefs.current[7] = el)}>
                        <InputText
                          tipo='currency'
                          scale={4}
                          label="Perda Malharia"
                          dados={detalheEntrada}
                          field="perdaMalharia"
                          setState={setDetalheEntrada}
                          disabled={localState.action === 'excluindo' ? true : false}
                          erros={erros}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 8)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
                      <Box ref={(el: any) => (fieldRefs.current[8] = el)}>
                        <InputText
                          tipo='currency'
                          scale={4}
                          label="Perda Tinturaria"
                          dados={detalheEntrada}
                          field="perdaTinturaria"
                          setState={setDetalheEntrada}
                          disabled={localState.action === 'excluindo' ? true : false}
                          erros={erros}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 9)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                      <Box ref={(el: any) => (fieldRefs.current[9] = el)}>
                        <ComboBox
                          opcoes={rsRevisador}
                          campoDescricao="nome"
                          campoID="idPessoa"
                          dados={detalheEntrada}
                          mensagemPadraoCampoEmBranco="Escolha um revisador"
                          field="idPessoa_revisador"
                          label="Revisadores"
                          erros={erros}
                          setState={setDetalheEntrada}
                          onKeyDown={(event: any) => btPulaCampo(event, 10)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                      <Box ref={(el: any) => (fieldRefs.current[10] = el)}>
                        <ComboBox
                          opcoes={rsTinturaria}
                          campoDescricao="idTinturaria"
                          campoID="idTinturaria"
                          dados={detalheEntrada}
                          mensagemPadraoCampoEmBranco="Escolha um romaneio"
                          field="idTinturaria"
                          label="Romaneio"
                          erros={erros}
                          setState={setDetalheEntrada}
                          onKeyDown={(event: any) => btPulaCampo(event, 0)}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Condicional>
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
      <Paper sx={{ m: 0, p: 1 }}>
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
            cabecalho={cabecalhoForm}
            dados={rsMaster.detalheEntradas}
            acoes={['excluindo', 'editando'].includes(masterLocalState.action) ? [] :
              [
                {
                  icone: "edit",
                  onAcionador: (rs: DetalheEntradaInterface, indice: number) =>
                    onEditar(rs, indice),
                  toolTip: "Editar",
                },
                {
                  icone: "delete",
                  onAcionador: (rs: DetalheEntradaInterface) =>
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