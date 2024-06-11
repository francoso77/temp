import { useContext } from 'react'
import { GlobalContext, GlobalContextInterface } from '../../../Context/GlobalContext'
import './Mensagem.css'
import { MensagemStatePadrao, MensagemTipo } from '../../../Context/MensagemState'

export default function Mensagem() {

  const { mensagemState, setMensagemState } = (useContext(GlobalContext) as GlobalContextInterface)

  const fecharJanela = () => {
    setMensagemState(MensagemStatePadrao)
  }

  if (mensagemState.exibir) {

    return (
      <>
        <div id="mensagem" className="modal">
          <div className="modal-content">
            <p>{mensagemState.mensagem}</p>
            <span>{(mensagemState.tipo === MensagemTipo.Error || mensagemState.tipo === MensagemTipo.Info) &&
              <>
                <input type="button" onClick={fecharJanela} value="Fechar" />
              </>
            }
            </span>
          </div>
        </div>
      </>
    )
  } else {
    return (<></>)
  }
}