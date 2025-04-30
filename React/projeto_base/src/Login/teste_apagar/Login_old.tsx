import { useState, useContext } from 'react';
import { URL_SERVIDOR } from '../../Config/Setup';
import ComText from '../../Components/Text';
import * as Styled from './styles'
import { GlobalContext, GlobalContextInterface } from '../../Context/GlobalContext';
import { Button } from '@mui/material';
import { MensagemTipo } from '../../Context/MensagemState';
import MenuCls, { MenuOpcoesInterface } from '../../Layout/MenuCls';

interface LoginInterface {
  usuario: string,
  senha: string,
  token: string,
}

export default function jacare() {

  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const setLoginState = (useContext(GlobalContext) as GlobalContextInterface).setLoginState

  const [usuarioState, setUsuarioState] = useState<LoginInterface>({
    usuario: '',
    senha: '',
    token: ''
  })

  const logar = () => {

    let urlMenu = URL_SERVIDOR.concat('/MenuDto')
    let url = URL_SERVIDOR.concat('/usuarios?usuario=')
    url = url.concat(usuarioState.usuario)
    url = url.concat('&senha=')
    url = url.concat(usuarioState.senha)

    setMensagemState({ ...mensagemState, exibir: true })

    setTimeout(() => {

      fetch(url).then(rs => {
        return rs.json()
      }).then((rs: LoginInterface[]) => {

        if (rs.length > 0) {

          setLoginState({
            logado: true,
            usuario: rs[0].usuario,
            token: rs[0].token
          })

          fetch(urlMenu).then(rs => {
            return rs.json()
          }).then((rs: MenuOpcoesInterface[]) => {
            const clsMenu = new MenuCls(rs)
            console.log(rs)
            console.log(clsMenu)
            setLayoutState({ ...layoutState, opcoesMenu: clsMenu.Menu })
          })
        } else {
          console.log('verifique o usuario e a senha')
          setMensagemState({
            ...mensagemState, exibir: true, mensagem: 'Verifique Usuário / Senha', tipo: MensagemTipo.Error
          })
        }
      }).catch(e => {
        console.log('Erro no Fetch....', e)
        setMensagemState({
          ...mensagemState, exibir: true, mensagem: 'Erro de conexão com o Servidor', tipo: MensagemTipo.Error
        })
      }
      )
    }, 500)

  }
  return (
    <>
      <section>
        <Styled.Container>
          <ComText label='Usuário' dados={usuarioState} field='usuario' setState={setUsuarioState} type='text' />
          <ComText label='Senha' dados={usuarioState} field='senha' setState={setUsuarioState} type='password' />
          <Button sx={{ my: 1, py: 0, height: 40, background: '#dddd' }} onClick={() => logar()}>Log in</Button>
        </Styled.Container>
      </section>
    </>
  )
}