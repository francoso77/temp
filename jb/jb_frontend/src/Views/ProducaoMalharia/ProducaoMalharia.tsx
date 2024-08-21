import { useEffect, useRef, useState } from 'react';
import { ProducaoMalhariaInterface } from '../../../../jb_backend/src/interfaces/producaoMalhariaInterface';
import { TurnoType, TurnoTypes } from '../../types/turnoTypes';
import ClsCrud from '../../Utils/ClsCrudApi';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import ClsValidacao from '../../Utils/ClsValidacao';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import { MaquinaInterface } from '../../../../jb_backend/src/interfaces/maquinaInterface';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { TinturariaInterface } from '../../../../jb_backend/src/interfaces/tinturariaInterface';
import { Box, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import Condicional from '../../Componentes/Condicional/Condicional';
import ComboBox from '../../Componentes/ComboBox';
import InputText from '../../Componentes/InputText';
import InputCalc from '../../Componentes/InputCalc';
import DataTable from '../../Componentes/DataTable';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { DateTime } from 'luxon';

interface UltimaPecaInterface {
  ultimaPeca: number
}

export function ProducaoMalharia() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const DadosPeca: UltimaPecaInterface = {
    ultimaPeca: 0
  }
  const obterDataAtualSistema = (): string => {
    const dataAtual = DateTime.now()
    return clsFormatacao.dataISOtoDatetime(dataAtual.toFormat('dd/MM/yyyy'))
  }

  const ResetDados: ProducaoMalhariaInterface = {
    idMaquina: 0,
    idProduto: 0,
    dataProducao: obterDataAtualSistema(),
    turno: TurnoType.primeiro,
    peso: 0,
    localizacao: '',
    idPessoa_revisador: 0,
    idPessoa_tecelao: 0,
    fechado: false,
    dataFechado: '',
    idTinturaria: null
  }

  const [open, setOpen] = useState(false)
  const [erros, setErros] = useState({})
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.incluindo })
  const [producaoMalharia, setProducaoMalharia] = useState<ProducaoMalhariaInterface>(ResetDados)
  const [rsRevisador, setRsRevisador] = useState<Array<PessoaInterface>>([])
  const [rsTecelao, setRsTecelao] = useState<Array<PessoaInterface>>([])
  const [rsMaquina, setRsMaquina] = useState<Array<MaquinaInterface>>([])
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  const [ultimaPeca, setUltimaPeca] = useState<UltimaPecaInterface>(DadosPeca)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])


  const BuscarDados = () => {

    clsCrud.pesquisar({
      entidade: 'Pessoa',
      criterio: {
        tipoPessoa: 'R'
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<PessoaInterface>) => {
        setRsRevisador(rs)
      })

    clsCrud.pesquisar({
      entidade: 'Pessoa',
      criterio: {
        tipoPessoa: 'T'
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<PessoaInterface>) => {
        setRsTecelao(rs)
      })

    clsCrud.pesquisar({
      entidade: 'Maquina',
      criterio: {
        ativo: true
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<MaquinaInterface>) => {
        setRsMaquina(rs)
      })

    clsCrud.pesquisar({
      entidade: 'Produto',
      criterio: {
        tipoProduto: 9,
        ativo: true
      },
      campoOrder: ['nome'],
    })
      .then((rs: Array<ProdutoInterface>) => {
        setRsProduto(rs)
      })

  }

  const novaPeca = (maquina: number) => {

    clsCrud.pesquisar({
      entidade: 'ProducaoMalharia',
      criterio: {
        idMaquina: maquina,
      },
      campoOrder: ['idPeca'],
    })
      .then((rs: Array<ProducaoMalhariaInterface>) => {
        const ultima = rs[rs.length - 1].idPeca
        if (ultima) {
          setUltimaPeca({ ultimaPeca: ultima + 1 })
        } else {
          const peca = parseInt(producaoMalharia.idMaquina.toString().concat('1'))
          setUltimaPeca({ ultimaPeca: peca })
        }
      })

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

  const btCancelar = () => {

  }

  const btConfirmaInclusao = () => {

  }

  const btConfirmaAlteracao = () => {

  }

  const btConfirmar = () => {
    setOpen(true)
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Condicional condicao={localState.action !== 'pesquisando'}>
        <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
          <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <ComboBox
                  opcoes={rsMaquina}
                  campoDescricao="nome"
                  campoID="idMaquina"
                  dados={producaoMalharia}
                  mensagemPadraoCampoEmBranco="Tear"
                  field="idMaquina"
                  label="Tear"
                  erros={erros}
                  setState={setProducaoMalharia}
                  disabled={localState.action === 'excluindo' ? true : false}
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => novaPeca(producaoMalharia.idMaquina)}
                  onKeyDown={(event) => btPulaCampo(event, 1)}
                  tamanhoFonte={30}
                  autoFocus
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }} >
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                <ComboBox
                  opcoes={rsProduto}
                  campoDescricao="nome"
                  campoID="idProduto"
                  dados={producaoMalharia}
                  mensagemPadraoCampoEmBranco="Escolha um produto"
                  field="idProduto"
                  label="Produtos"
                  erros={erros}
                  setState={setProducaoMalharia}
                  onFocus={(e) => e.target.select()}
                  disabled={localState.action === 'excluindo' ? true : false}
                  onKeyDown={(event) => btPulaCampo(event, 2)}
                  tamanhoFonte={30}

                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 2 }} >
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                <ComboBox
                  opcoes={TurnoTypes}
                  campoDescricao="descricao"
                  campoID="idTurno"
                  dados={producaoMalharia}
                  mensagemPadraoCampoEmBranco="Qual o turno"
                  field="turno"
                  label="Turno"
                  erros={erros}
                  setState={setProducaoMalharia}
                  onFocus={(e) => e.target.select()}
                  disabled={localState.action === 'excluindo' ? true : false}
                  onKeyDown={(event) => btPulaCampo(event, 3)}
                  tamanhoFonte={30}

                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <ComboBox
                  opcoes={rsRevisador}
                  campoDescricao="nome"
                  campoID="idPessoa"
                  dados={producaoMalharia}
                  mensagemPadraoCampoEmBranco="Escolha um revisador"
                  field="idPessoa_revisador"
                  label="Revisador"
                  erros={erros}
                  setState={setProducaoMalharia}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 4)}
                  tamanhoFonte={30}

                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                <ComboBox
                  opcoes={rsTecelao}
                  campoDescricao="nome"
                  campoID="idPessoa"
                  dados={producaoMalharia}
                  mensagemPadraoCampoEmBranco="Escolha um tecelão"
                  field="idPessoa_tecelao"
                  label="Tecelão"
                  erros={erros}
                  setState={setProducaoMalharia}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 7)}
                  tamanhoFonte={30}

                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                <InputText
                  tipo='uppercase'
                  label="Localização"
                  dados={producaoMalharia}
                  field="localizacao"
                  setState={setProducaoMalharia}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 7)}
                  tamanhoFonte={30}

                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[6] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Data"
                  dados={producaoMalharia}
                  field="dataProducao"
                  setState={setProducaoMalharia}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 7)}
                  tamanhoFonte={70}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[7] = el)}>
                <InputText
                  tipo='currency'
                  scale={4}
                  label="Peso"
                  dados={producaoMalharia}
                  field="peso"
                  setState={setProducaoMalharia}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                  tamanhoFonte={70}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[7] = el)}>
                <InputText
                  tipo='number'
                  label="Peça"
                  dados={ultimaPeca}
                  field="ultimaPeca"
                  setState={setUltimaPeca}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                  tamanhoFonte={70}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
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
      </Condicional>

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
          <Grid item xs={12} >
            <Typography sx={{ color: 'white', fontSize: 50, textAlign: 'right' }}>
              Produção Malharia
            </Typography>
          </Grid>
        </Paper>
      </Dialog >
    </>
  )
}