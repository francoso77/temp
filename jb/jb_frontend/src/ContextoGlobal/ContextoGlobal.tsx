import { createContext } from 'react';
import { UsuarioStateInterface } from './UsuarioState';
import { LayoutStateInterface } from './LayoutState';
import { MensagemStateInterface } from './MensagemState';

export interface GlobalContextInterface {
  usuarioState: UsuarioStateInterface
  setUsuarioState: React.Dispatch<React.SetStateAction<UsuarioStateInterface>>
  layoutState: LayoutStateInterface
  setLayoutState: React.Dispatch<React.SetStateAction<LayoutStateInterface>>
  mensagemState: MensagemStateInterface
  setMensagemState: React.Dispatch<React.SetStateAction<MensagemStateInterface>>
}
export const GlobalContext = createContext<GlobalContextInterface | null>(null);