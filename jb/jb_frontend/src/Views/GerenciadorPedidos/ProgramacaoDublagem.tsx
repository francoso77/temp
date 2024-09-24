import React, { useContext, useEffect, useRef, useState } from 'react';
import ClsValidacao from '../../Utils/ClsValidacao';
import ClsCrud from '../../Utils/ClsCrudApi';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { ProgramacaoDublagemInterface } from '../../../../jb_backend/src/interfaces/programacaoDublagemInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { Box, Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import Condicional from '../../Componentes/Condicional/Condicional';
import InputText from '../../Componentes/InputText';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { useNavigate } from 'react-router-dom';
import GerenciadorPedido from './Gerenciador';



export default function ProgramacaoDublagem() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const resetDados = {
    dataProgramacao: '',
    qtdCola: 0,
    qtdFilme: 0,
    detalheProgramacaoDublagens: [],
  }

  interface PesquisaInterface {
    itemPesquisa: string
  }

  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [programacaoDublagem, setProgramacaoDublagem] = useState<ProgramacaoDublagemInterface>(resetDados)
  const { setMensagemState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [erros, setErros] = useState({})
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'dataProgramacao',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Cola Consumida',
      alinhamento: 'center',
      campo: 'qtdCola',
      format: (qtd) => clsFormatacao.numeroPadrao(qtd)
    },
    {
      cabecalho: 'Filme Consumido',
      alinhamento: 'center',
      campo: 'qtdFilme',
      format: (qtd) => clsFormatacao.numeroPadrao(qtd)
    },
    // {
    //   cabecalho: 'Fornecedor',
    //   alinhamento: 'left',
    //   campo: 'idPessoa_fornecedor',
    //   format: (_v, rs: any) => rs.fornecedor.nome
    // },
  ]

  const pesquisarID = (id: string | number): Promise<ProgramacaoDublagemInterface> => {
    return clsCrud
      .pesquisar({
        entidade: 'ProgramacaoDublagem',
        relations: [
          'detalheProgramacaoDublagens',
          'detalheProgramacaoDublagens.pedido',
          'detalheProgramacaoDublagens.pedido.detalhePedidos',
        ],
        criterio: {
          idProgramacaoDublagem: pesquisa.itemPesquisa,
        },
      })
      .then((rs: Array<ProgramacaoDublagemInterface>) => {
        let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataProgramacao)
        return {
          ...rs[0],
          dataProgramacao: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
        }
      })
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProgramacaoDublagem(rs)
      // AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }

  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProgramacaoDublagem(rs)
      // AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setProgramacaoDublagem(resetDados)
    setLocalState({ action: actionTypes.incluindo })
  }

  const btCancelar = () => {
    setErros({})
    setProgramacaoDublagem(resetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Programação Dublagem',
      pathTitulo: '/',
      pathTituloAnterior: '/ProgramacaoPedido'
    })
    irPara('/')
  }
  const formatDateTimeForMySQL = (dateString: string): string => {
    const [day, month, year] = dateString.split('/')
    return `${year}-${month}-${day} 00:00:00`
  }

  const btPesquisar = () => {
    const relations = [
      'detalheProgramacaoDublagens',
      'detalheProgramacaoDublagens.pedido',
      'detalheProgramacaoDublagens.pedido.detalhePedidos',
    ]

    const msg = 'Pesquisando pedidos ...'
    const setMensagem = setMensagemState
    let dadosPesquisa = {}
    let criterio = {}
    let camposLike = ['dataProgramacao']

    let comparador = "L"
    const temNumero = /\d/.test(pesquisa.itemPesquisa)

    if (temNumero && pesquisa.itemPesquisa.includes('/')) {
      const formattedDateTime = formatDateTimeForMySQL(pesquisa.itemPesquisa)
      criterio = {
        dataProgramacao: formattedDateTime
      }
    }

    dadosPesquisa = {
      entidade: "ProgramacaoDublagem",
      relations,
      comparador,
      criterio,
      camposLike,
      msg,
      setMensagemState: setMensagem
    }

    clsCrud
      .pesquisar(dadosPesquisa)
      .then((rs: Array<any>) => {
        console.log('resultado da pesquisa', rs)
        setRsPesquisa(rs);
      });
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataProgramacao', programacaoDublagem, erros, retorno)

    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

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

  return (

    <Container maxWidth="md" sx={{ mt: 2 }}>
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
                label="Pesquisa"
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
                acoes={[
                  {
                    icone: "find_in_page_two_tone",
                    onAcionador: (rs: ProgramacaoDublagemInterface) =>
                      onEditar(rs.idProgramacaoDublagem as number),
                    toolTip: "Visualizar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: ProgramacaoDublagemInterface) =>
                      onExcluir(rs.idProgramacaoDublagem as number),
                    toolTip: "Excluir",
                  },
                ]}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={4} sx={{ mt: 2, ml: 3 }}>
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Data"
                  labelAlign='center'
                  textAlign='center'
                  dados={programacaoDublagem}
                  field="dataProgramacao"
                  setState={setProgramacaoDublagem}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  autoFocus
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, ml: 5 }}>
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                <InputText
                  type='text'
                  tipo='currency'
                  scale={2}
                  label="Cola"
                  labelAlign='center'
                  textAlign='center'
                  dados={programacaoDublagem}
                  field="qtdCola"
                  setState={setProgramacaoDublagem}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 2)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, ml: 6 }}>
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                <InputText
                  type='text'
                  tipo='currency'
                  scale={2}
                  label="Filme"
                  labelAlign='center'
                  textAlign='center'
                  dados={programacaoDublagem}
                  field="qtdFilme"
                  setState={setProgramacaoDublagem}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={12} >
              <GerenciadorPedido detalhe={programacaoDublagem.detalheProgramacaoDublagens} />
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
              <Condicional condicao={['incluindo'].includes(localState.action)}>
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