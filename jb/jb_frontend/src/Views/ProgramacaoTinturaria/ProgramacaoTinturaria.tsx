import { useContext, useEffect, useRef, useState } from 'react';
import { ProgramacaoInterface } from '../../Interfaces/programacaoInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { PessoaInterface } from '../../Interfaces/pessoaInterface';
import { TinturariaInterface } from '../../Interfaces/tinturariaInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { Box, Chip, Container, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import Condicional from '../../Componentes/Condicional/Condicional';
import InputText from '../../Componentes/InputText';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import ComboBox from '../../Componentes/ComboBox';
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom';
import ClsValidacao from '../../Utils/ClsValidacao';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import DetalheProgramacao from './DetalheProgramacao';
import { ProdutoInterface } from '../../Interfaces/produtoInterface';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import ClsRelatorioProgramacao from '../../Utils/ClsRelatorioProgramacao';
import { UsuarioType } from '../../types/usuarioTypes';



export interface SomatorioProgramacaoInterface {
  total: string
  totalQtd: string
}

export interface RomaneioInterface {
  idProduto: number
  peso_total: number
  peso_programado: number
  saldo: number
  qtd_peca: number
}

export default function ProgramacaoTinturaria() {

  const ResetDados: ProgramacaoInterface = {
    dataProgramacao: '',
    notaFiscal: '',
    idTinturaria: 0,
    msg: '',
    detalheProgramacoes: [],
  }


  interface DadosTinturariaInterface {
    tinturaria: string | null
    cliente: string | null
  }

  const dadosTinturaria: DadosTinturariaInterface = {
    tinturaria: null,
    cliente: null
  }
  interface PesquisaInterface {
    itemPesquisa: string
  }

  const SomatorioDados: SomatorioProgramacaoInterface = {
    total: '',
    totalQtd: ''
  }

  const RomaneioDados: RomaneioInterface = {
    idProduto: 0,
    peso_total: 0,
    peso_programado: 0,
    saldo: 0,
    qtd_peca: 0
  }

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud: ClsCrud = new ClsCrud()
  const clsFormatacao: ClsFormatacao = new ClsFormatacao()
  const clsRelatorios = new ClsRelatorioProgramacao()


  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [programacao, setProgramacao] = useState<ProgramacaoInterface>(ResetDados)
  const [rsClientes, setRsClientes] = useState<Array<PessoaInterface>>([])
  const [rsProdutos, setRsProdutos] = useState<Array<ProdutoInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [rsTinturaria, setRsTinturaria] = useState<Array<TinturariaInterface>>([])
  const [rsTinturariaGeral, setRsTinturariaGeral] = useState<Array<TinturariaInterface>>([])
  const [rsSomatorioTinturaria, setRsSomatorioTinturaria] = useState<SomatorioProgramacaoInterface>(SomatorioDados)
  const [rsSomatorio, setRsSomatorio] = useState<SomatorioProgramacaoInterface>(SomatorioDados)
  const [rsRomaneio, setRsRomaneio] = useState<Array<RomaneioInterface>>([RomaneioDados])
  const [rsDadosTinturaria, setRsDadosTinturaria] = useState<DadosTinturariaInterface>(dadosTinturaria)
  const [headTableStatus, setHeadTableStatus] = useState(false)
  const [open, setOpen] = useState(false)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'dataProgramacao',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Nota Fiscal',
      alinhamento: 'center',
      campo: 'notaFiscal',
      format: (nota) => clsFormatacao.notaFiscal(nota)
    },
    {
      cabecalho: 'Romaneio',
      alinhamento: 'left',
      campo: 'idTinturaria',
      //format: (_v, rs: any) => rs.clientes.nome
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'left',
      campo: 'idTinturaria', // 'idTinturaria' ainda é o campo principal da linha
      render: (_valor, row) => {
        // Acesse o nome do cliente usando o caminho correto
        // `row.romaneio.cliente`
        return row.romaneio?.cliente ?? 'N/A';
      },
    },
    {
      cabecalho: 'Status',
      alinhamento: 'center',
      campo: 'idTinturaria',
      render: (_valor: any, row: any) => { // O _valor aqui seria o que 'campo' aponta, mas não usaremos diretamente

        const statusCode = row.romaneio?.finalizado ?? undefined;

        const tiposStatus = [
          { idStatus: true, descricao: 'Programado' },
          { idStatus: false, descricao: 'Não Programado' },
        ]
        const statusInfo = tiposStatus.find(
          (status) => status.idStatus === statusCode
        );

        const descricaoStatus = statusInfo ? statusInfo.descricao : 'Desconhecido';

        // Define a cor com base no tipo de status. Você pode ajustar as cores conforme sua necessidade.
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
        switch (statusCode) {
          case true:
            color = 'error'; // Exemplo: azul para aberto
            break;
          case false:
            color = 'success'; // Exemplo: roxo para produção
            break;
          default:
            color = 'default'; // Cor padrão para qualquer outro caso
            break;
        }

        // 4. Retornar o componente Chip
        return (
          <Chip
            label={descricaoStatus}
            color={color}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      },
    }
  ]

  const cabecalhoRomaneio: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Artigo',
      alinhamento: 'left',
      campo: 'idProduto',
      format: (_v, rs: any) => rsProdutos.find(v => v.idProduto === rs.idProduto)?.nome
    },
    {
      cabecalho: 'Peças',
      alinhamento: 'center',
      campo: 'qtd_peca',
      format: (qtd) => clsFormatacao.currency(Number(qtd))
      //format: (_v, rs: any) => rs.clientes.nome
    },
    {
      cabecalho: 'Romaneio',
      alinhamento: 'center',
      campo: 'peso_total',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Programado',
      alinhamento: 'center',
      campo: 'peso_programado',
      format: (_v) => clsFormatacao.currency(Number(rsSomatorio.total))
      //format: (_v, rs: any) => rs.clientes.nome
    },
    {
      cabecalho: 'Saldo Restante',
      alinhamento: 'center',
      campo: 'saldo',
      render(arg, row) {

        if (row.saldo === row.peso_total && Number(rsSomatorio.total) > 0) {
          return clsFormatacao.currency(Number(row.saldo) - Number(rsSomatorio.total))
        } else {
          return clsFormatacao.currency(Number(row.saldo))
        }

      }
    },
  ]

  const onRomaneio = (id: number) => {

    const itemPesquisado = rsPesquisa.find(v => v.idProgramacao === id)?.idTinturaria
    const isFinalizado = rsTinturariaGeral.find(v => v.idTinturaria === itemPesquisado)?.finalizado

    if (isFinalizado) {

      clsRelatorios.renderProgramacaoTinturaria(id)
    } else {
      setMensagemState({
        titulo: 'Aviso',
        exibir: true,
        mensagem: 'Nenhuma programação foi gerada.',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }
  const pesquisarID = async (id: string | number): Promise<ProgramacaoInterface> => {
    const rs = await clsCrud
      .pesquisar({
        entidade: "Programacao",
        relations: [
          "romaneio",
          "romaneio.cliente",
          "romaneio.fornecedor",
          "detalheProgramacoes",
          "detalheProgramacoes.produto",
          "detalheProgramacoes.cor",
        ],
        criterio: {
          idProgramacao: id,
        },
      });
    let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataProgramacao)
    return {
      ...rs[0],
      dataProgramacao: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
    };
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      AtualizaSomatorio(rs)
      BuscarItensRomaneio(rs.idTinturaria)
      setProgramacao(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }

  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      AtualizaSomatorio(rs)
      BuscarItensRomaneio(rs.idTinturaria)
      setProgramacao(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    BuscarDados()
    setProgramacao(ResetDados)
    setHeadTableStatus(true)
    setRsSomatorio({ total: "", totalQtd: "" })
    setLocalState({ action: actionTypes.incluindo })
  }

  const btCancelar = async () => {
    setRsRomaneio([RomaneioDados])
    setRsDadosTinturaria(dadosTinturaria)
    setProgramacao(ResetDados)
    setRsSomatorio({ total: "", totalQtd: "" })
    setRsSomatorioTinturaria({ total: "", totalQtd: "" })
    setErros({})
    setOpen(false)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataProgramacao', programacao, erros, retorno)
    retorno = validaCampo.naoVazio('idTinturaria', programacao, erros, retorno, 'Informe o Romaneio')

    setErros(erros)
    return retorno
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

  const BuscarDados = () => {

    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        //campoOrder: ['nome'],
        comparador: 'I',
        criterio: {
          tipoPessoa: ['J', 'C'],
        },
        camposLike: ['tipoPessoa'],
      })
      .then((rsClientes: Array<PessoaInterface>) => {
        setRsClientes(rsClientes)
      })

    clsCrud
      .pesquisar({
        entidade: "Tinturaria",
        criterio: {
          programado: 0
        },
        camposLike: ['programado'],
      })
      .then((rsTinturarias: Array<TinturariaInterface>) => {
        setRsTinturaria(rsTinturarias)
      })

    clsCrud
      .pesquisar({
        entidade: "Tinturaria",
      })
      .then((rsTinturarias: Array<TinturariaInterface>) => {
        setRsTinturariaGeral(rsTinturarias)
      })

    clsCrud
      .pesquisar({
        entidade: "Produto",
        criterio: {
          tipoProduto: [TipoProdutoType.tecidoCru],
        },
        campoOrder: ["nome"],
      })
      .then((rs: Array<ProdutoInterface>) => {
        setRsProdutos(rs)
      })
  }

  const formatDateTimeForMySQL = (dateString: string): string => {
    const [day, month, year] = dateString.split('/')
    return `${year}-${month}-${day} 00:00:00`
  }

  const formatNumber = (numString: string): string => {
    const paddedNum = numString.padStart(9, '0')
    return paddedNum.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  }

  const btPesquisar = async () => {

    const relations = [
      "romaneio",
      "romaneio.cliente",
      "romaneio.fornecedor",
      "detalheProgramacoes",
      "detalheProgramacoes.produto",
      "detalheProgramacoes.cor",
    ];

    const msg = 'Pesquisando programações ...'
    const setMensagem = setMensagemState
    // const idsCli = rsClientes
    //   .filter(clientes => clientes.nome.includes(pesquisa.itemPesquisa))
    //   .map(clientes => clientes.idPessoa)

    let dadosPesquisa = {}
    let criterio = {}
    let camposLike: any = []
    let comparador = "L"
    const temNumero = /\d/.test(pesquisa.itemPesquisa)
    const temNome = /\w/.test(pesquisa.itemPesquisa)

    if (temNumero && pesquisa.itemPesquisa.includes('/')) {
      const formattedDateTime = formatDateTimeForMySQL(pesquisa.itemPesquisa)
      criterio = {
        dataProgramacao: formattedDateTime
      }
      camposLike = ['dataProgramacao']
    } else if (temNumero) {

      const formattedNumber = formatNumber(pesquisa.itemPesquisa);
      criterio = {
        notaFiscal: formattedNumber
      }
      camposLike = ['notaFiscal']
    }

    dadosPesquisa = {
      entidade: "Programacao",
      relations,
      comparador,
      criterio,
      camposLike,
      msg,
      setMensagemState: setMensagem
    }

    await clsCrud
      .pesquisar(dadosPesquisa)
      .then((rs: Array<any>) => {

        rs.forEach((programacao, index) => {
          rs[index].romaneio.cliente = programacao.romaneio.cliente.nome
        })

        if (temNome) {

          const filtrado = rs.filter((item) =>
            item.romaneio.cliente.toLowerCase().includes(pesquisa.itemPesquisa.toLowerCase()))

          setRsPesquisa(filtrado)
        } else {
          setRsPesquisa(rs)
        }
      });

  }


  const AtualizaSomatorio = (rs: ProgramacaoInterface) => {
    let totalQtd: number = 0
    let total: number = 0.0

    if (rs.detalheProgramacoes) {
      rs.detalheProgramacoes.forEach((detalhe) => {
        totalQtd += detalhe.qtdPeca
        total += detalhe.peso
      })

      setRsSomatorio({
        total: Number(total.toFixed(2)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        totalQtd: totalQtd.toString()
      })
    }
  }

  const AtualizaSomatorioTinturaria = (rs: Array<RomaneioInterface>) => {
    let totalQtd: number = 0
    let total: number = 0.0

    if (rs) {
      rs.forEach((detalhe) => {
        totalQtd += Number(detalhe.qtd_peca)
        total += detalhe.peso_total
      })

      setRsSomatorioTinturaria({
        total: Number(total.toFixed(2)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        totalQtd: totalQtd.toString()
      })
    }
  }
  const btConfirmar = async () => {
    if (validarDados()) {
      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        const rs = await clsCrud.incluir({
          entidade: "Programacao",
          criterio: programacao,
          token: usuarioState.token,
        });

        if (rs.ok) {
          if (
            Number(rsSomatorio.total) === Number(rsSomatorioTinturaria.total) &&
            Number(rsSomatorio.totalQtd) === Number(rsSomatorioTinturaria.totalQtd)
          ) {
            // bloqueando e finalizando o romaneio
            const dadostinturaria: Partial<TinturariaInterface> = {
              idTinturaria: programacao.idTinturaria,
              programado: true,
              finalizado: true,
            };

            await clsCrud.incluir({
              entidade: "Tinturaria",
              criterio: dadostinturaria,
              token: usuarioState.token,
            });

            setHeadTableStatus(false);
            setMensagemState({
              titulo: "Atenção",
              exibir: true,
              mensagem: "Programação concluída!",
              tipo: MensagemTipo.Ok,
              exibirBotao: true,
              cb: null,
            });
          } else {
            // bloqueando o romaneio
            const dadostinturaria: Partial<TinturariaInterface> = {
              idTinturaria: programacao.idTinturaria,
              programado: true,
              finalizado: false,
            };

            await clsCrud.incluir({
              entidade: "Tinturaria",
              criterio: dadostinturaria,
              token: usuarioState.token,
            });

            setHeadTableStatus(true);
          }

          setLocalState({ action: actionTypes.pesquisando });

          // <<< garante atualização após incluir
          await btPesquisar();
        } else {
          setMensagemState({
            titulo: "Erro...",
            exibir: true,
            mensagem: "Erro no cadastro - Consulte Suporte",
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null,
          });
        }
      } else if (localState.action === actionTypes.excluindo) {
        const rs = await clsCrud.excluir({
          entidade: "Programacao",
          criterio: { idProgramacao: programacao.idProgramacao },
          token: usuarioState.token,
        });

        if (rs.ok) {
          // Desbloqueando o romaneio
          const dadostinturaria: Partial<TinturariaInterface> = {
            idTinturaria: programacao.idTinturaria,
            programado: false,
            finalizado: false,
          };

          await clsCrud.incluir({
            entidade: "Tinturaria",
            criterio: dadostinturaria,
            token: usuarioState.token,
          });

          setLocalState({ action: actionTypes.pesquisando });

          // <<< garante atualização após excluir
          await btPesquisar();
        } else {
          setMensagemState({
            titulo: "Erro...",
            exibir: true,
            mensagem: "Erro no cadastro - Consulte Suporte",
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null,
          });
        }
      }

      // só reseta depois de pesquisar
      btCancelar();
    }
  };


  const BuscarItensRomaneio = async (romaneio: number) => {
    const tmpRomaneio: Array<any> = await clsCrud.consultar({
      entidade: 'ProducaoMalharia',
      criterio: {
        idTinturaria: romaneio,
        fechado: true,
      },
      groupBy: 'idProduto',
      select: [
        'idTinturaria',
        'idProduto',
        'SUM(peso) AS peso_total',
        '(SUM(peso) * 0) AS peso_programado',
        '(SUM(peso) - 0) AS saldo',
        '(COUNT(idProduto)) AS qtd_peca',
        'fechado'
      ],
    })


    if (tmpRomaneio.length > 0) {
      setRsRomaneio(tmpRomaneio)
      AtualizaSomatorioTinturaria(tmpRomaneio)
      const tmpTinturaria: Array<any> = await clsCrud.pesquisar({
        entidade: 'Tinturaria',
        relations: [
          "cliente",
          "fornecedor",
          "detalheTinturarias",
          "detalheTinturarias.malharia"
        ],
        criterio: {
          idTinturaria: romaneio,
        }
      })

      if (tmpTinturaria.length > 0) {
        setOpen(true)
        setRsDadosTinturaria({
          tinturaria: tmpTinturaria[0].cliente.nome,
          cliente: tmpTinturaria[0].fornecedor.nome
        })
      }
    }
  }
  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Programação de Tinturaria',
      pathTitulo: '/',
      pathTituloAnterior: '/ProgramacaoTinturaria'
    })
    irPara('/')
  }

  useEffect(() => {
    const carregarDados = async () => {
      await BuscarDados()
    }
    carregarDados()
  }, [])

  useEffect(() => {
    if (rsClientes.length > 0) {
      btPesquisar()
    }
  }, [rsClientes])

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: -1.5, mr: -5, mb: -5 }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={10} md={11}>
              <InputText
                label="Buscar por data, nota fiscal ou cliente"
                tipo="uppercase"
                dados={pesquisa}
                field="itemPesquisa"
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
                    //icone: "find_in_page_two_tone",
                    icone: "edit",
                    onAcionador: (rs: ProgramacaoInterface) =>
                      onEditar(rs.idProgramacao as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: ProgramacaoInterface) =>
                      onExcluir(rs.idProgramacao as number),
                    toolTip: "Excluir",
                  },
                  {
                    icone: "picture_as_pdf_rounded_icon",
                    onAcionador: (rs: ProgramacaoInterface) =>
                      onRomaneio(rs.idProgramacao as number),
                    toolTip: "Relação Peças",
                  },
                ] : [
                  {
                    //icone: "find_in_page_two_tone",
                    icone: "edit",
                    onAcionador: (rs: ProgramacaoInterface) =>
                      onEditar(rs.idProgramacao as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "picture_as_pdf_rounded_icon",
                    onAcionador: (rs: ProgramacaoInterface) =>
                      onRomaneio(rs.idProgramacao as number),
                    toolTip: "Relação Peças",
                  },
                ]}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Data"
                  dados={programacao}
                  field="dataProgramacao"
                  setState={setProgramacao}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  autoFocus
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <InputText
                  type='text'
                  mask='nf'
                  tipo='mac'
                  label="Nota Fiscal"
                  dados={programacao}
                  field="notaFiscal"
                  setState={setProgramacao}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 4)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                <ComboBox
                  opcoes={localState.action === 'incluindo' ? rsTinturaria : rsTinturariaGeral}
                  campoDescricao="idTinturaria"
                  campoID="idTinturaria"
                  dados={programacao}
                  mensagemPadraoCampoEmBranco="Romaneio"
                  field="idTinturaria"
                  label="Romaneio"
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  setState={setProgramacao}
                  onFocus={(e) => e.target.select()}
                  onBlur={() => BuscarItensRomaneio(programacao.idTinturaria as number)}
                  onKeyDown={(event) => btPulaCampo(event, 3)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                <InputText
                  type='text'
                  tipo='uppercase'
                  label="Mensagem"
                  dados={programacao}
                  field="msg"
                  setState={setProgramacao}
                  disabled={['excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                />
              </Box>
            </Grid>
            <Condicional condicao={open}>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        border: "2px solid",
                        borderColor: "secondary.main",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Cliente: {rsDadosTinturaria.cliente}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        border: "2px solid",
                        borderColor: "secondary.main",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Fornecedor: {rsDadosTinturaria.tinturaria}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Condicional>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" >
                Itens do Romaneio
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ ml: -5, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Itens Programados
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} sx={{ mt: 2 }}>
              <DataTable
                backgroundColorHead={!headTableStatus ? "red" : "green"}
                cabecalho={cabecalhoRomaneio}
                dados={rsRomaneio}
                acoes={[]}
                exibirPaginacao={false}
              />
            </Grid>
            <Grid item xs={12} md={7} sx={{ mt: 1 }}>
              <DetalheProgramacao
                rsMaster={programacao}
                setRsMaster={setProgramacao}
                masterLocalState={localState}
                setRsSomatorio={setRsSomatorio}
                rsRomaneio={rsRomaneio}
                setRsRomaneio={setRsRomaneio}
                setHeadTableStatus={setHeadTableStatus}
                headTableStatus={headTableStatus}
                rsSomatorioTinturaria={rsSomatorioTinturaria}
              />
            </Grid>
            <Grid item xs={6} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Qtd"
                labelAlign='center'
                dados={rsSomatorioTinturaria}
                field="totalQtd"
                setState={setRsSomatorioTinturaria}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
              />
            </Grid>
            <Grid item xs={6} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Total"
                labelAlign='center'
                dados={rsSomatorioTinturaria}
                field="total"
                setState={setRsSomatorioTinturaria}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
              />
            </Grid>
            <Grid item xs={6} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Qtd"
                labelAlign='center'
                dados={rsSomatorio}
                field="totalQtd"
                setState={setRsSomatorio}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
              />
            </Grid>
            <Grid item xs={6} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Total"
                labelAlign='center'
                dados={rsSomatorio}
                field="total"
                setState={setRsSomatorio}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
              />
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
    </Container >
  )
}