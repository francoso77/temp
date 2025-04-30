import { createContext } from 'react';
import { LayoutStateInterface } from './LayoutState';
import { MensagemStateInterface } from './MensagemState';
import { LoginStateInterface } from './LoginState';

export interface GlobalContextInterface {
  layoutState: LayoutStateInterface
  setLayoutState: React.Dispatch<React.SetStateAction<LayoutStateInterface>>,
  mensagemState: MensagemStateInterface
  setMensagemState: React.Dispatch<React.SetStateAction<MensagemStateInterface>>,
  loginState: LoginStateInterface
  setLoginState: React.Dispatch<React.SetStateAction<LoginStateInterface>>,
}

export const GlobalContext = createContext<GlobalContextInterface | null>(null)