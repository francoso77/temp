import { Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { InscricaoInterface } from '../../../../tambordog-backend/src/interfaces/inscricaoInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import ComboBox from '../../Componentes/ComboBox';
import { CaoInterface } from '../../../../tambordog-backend/src/interfaces/caoInterface';
import { ProvaInterface } from '../../../../tambordog-backend/src/interfaces/provaInterface';
import { InscricaoTypes } from '../../types/InscricaoTypes';


export default function Inscricao(idProva: string) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: InscricaoInterface = {
    idAtleta: '',
    idCao: '',
    idCategoria: '',
    // idProva: rsProva.idProva as string,
    idProva: '',
    // valor: rsProva.valorProva as number,
    valor: 0,
    statusInscricao: InscricaoTypes.PendentePagamento
  }


  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [erros, setErros] = useState({})
  const [inscricao, setInscricao] = useState<InscricaoInterface>(ResetDados)
  const [rsCao, setRsCao] = useState<Array<CaoInterface>>([])
  const [rsProva, setRsProva] = useState<Array<ProvaInterface>>([])


  const pesquisarID = (id: string | number): Promise<InscricaoInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Inscricao",
        criterio: {
          idInscricao: id,
        },
      })
      .then((rs: Array<InscricaoInterface>) => {
        return rs[0]
      })
  }

  const btIncluir = () => {
    setInscricao(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setInscricao(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}
    retorno = validaCampo.naoVazio('nomeProva', inscricao, erros, retorno, 'Nome do inscrição não pode ser vázio')
    retorno = validaCampo.naoVazio('cep', inscricao, erros, retorno, 'Informe um CEP válido')
    retorno = validaCampo.eData('datainscricao', inscricao, erros, retorno, false)
    retorno = validaCampo.eTelefone('telefone', inscricao, erros, retorno, false)
    retorno = validaCampo.eTelefone('whatsapp', inscricao, erros, retorno, false)
    retorno = validaCampo.eEmail('email', inscricao, erros, retorno, false)
    retorno = validaCampo.naoVazio('endereco', inscricao, erros, retorno, 'Informe um endereço')
    retorno = validaCampo.naoVazio('numero', inscricao, erros, retorno, 'Número inválido')
    retorno = validaCampo.naoVazio('bairro', inscricao, erros, retorno, 'Informe um bairro')
    retorno = validaCampo.naoVazio('cidade', inscricao, erros, retorno, 'Informe a cidade')
    retorno = validaCampo.eUF('uf', inscricao, erros, retorno, false)
    retorno = validaCampo.naoVazio('idCampeonato', inscricao, erros, retorno, 'Informe um campeonato')
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "Inscricao",
          criterio: inscricao,
          localState: localState.action,
          cb: null,
          setMensagemState: setMensagemState
        })
          .then((rs) => {
            if (rs.ok) {
              setLocalState({ action: actionTypes.pesquisando })
            } else {
              setMensagemState({
                titulo: 'Erro...',
                exibir: true,
                mensagem: 'Erro no cadastro - Consulte Suporte - err',
                tipo: MensagemTipo.Error,
                exibirBotao: true,
                cb: null
              })
            }
          })
      } else if (localState.action === actionTypes.excluindo) {
        clsCrud.excluir({
          entidade: "inscricao",
          criterio: {
            idInscricao: inscricao.idInscricao
          },
          cb: null,
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

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Provas',
      pathTitulo: '/',
      pathTituloAnterior: '/Prova'
    })
    irPara('/')
  }

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Cao",
        criterio: {
          nome: "%".concat("%"),
        },
        camposLike: ["nome"],
      })
      .then((rs: Array<CaoInterface>) => {
        setRsCao(rs)
      })

    clsCrud
      .pesquisar({
        entidade: "Prova",
        criterio: {
          idProva: idProva,
        },
        camposLike: ["idProva"],
        select: ['idProva', 'nomeProva', 'dataHoraProva', 'cidade', 'uf', 'status']
      })
      .then((rs: Array<ProvaInterface>) => {
        setRsProva(rs)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])
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
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Prova"
                tipo="text"
                dados={rsProva}
                field="nomeProva"
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

          </Condicional>

          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Prova"
                tipo="text"
                dados={inscricao}
                field="nomeProva"
                setState={setInscricao}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={60}
                autoFocus
              />
            </Grid>

            <Grid item xs={12} md={9} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Endereço"
                tipo="text"
                dados={inscricao}
                field="endereco"
                setState={setInscricao}
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
                dados={inscricao}
                field="numero"
                setState={setInscricao}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={9} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Bairro"
                tipo="text"
                dados={inscricao}
                field="bairro"
                setState={setInscricao}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={60}
              />
            </Grid>
            <Grid item xs={12} md={5} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Cidade"
                tipo="text"
                dados={inscricao}
                field="cidade"
                setState={setInscricao}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={60}
              />
            </Grid>

            <Grid item xs={6} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Data da Prova"
                setState={setInscricao}
                dados={inscricao}
                field="dataProva"
                erros={erros}
                type="tel"
                tipo='date'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={6} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Hora da Prova"
                setState={setInscricao}
                dados={inscricao}
                field="horaProva"
                erros={erros}
                type="tel"
                tipo='mac'
                mask='hora'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Valor da Prova"
                tipo="currency"
                type='currency'
                dados={inscricao}
                field="valorProva"
                setState={setInscricao}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Valor da Prova até 12(anos)"
                tipo="currency"
                type='currency'
                dados={inscricao}
                field="valorProvaAte12"
                setState={setInscricao}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Telefone"
                setState={setInscricao}
                dados={inscricao}
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
                setState={setInscricao}
                dados={inscricao}
                field="whatsapp"
                erros={erros}
                type="tel"
                mask='tel'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="E-mail"
                setState={setInscricao}
                dados={inscricao}
                field="email"
                erros={erros}
                type="email"
                tipo="text"
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsCao}
                campoDescricao="nome"
                campoID="idCao"
                dados={inscricao}
                mensagemPadraoCampoEmBranco="Escolha um cão"
                field="idCao"
                label="Cão"
                erros={erros}
                setState={setInscricao}
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
      {/* {JSON.stringify(prova)} */}
    </Container >
  )
}