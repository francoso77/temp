import { useState } from 'react';

export interface LoginStateInterface {
  usuario: string
  token: string
  logado: boolean
}

export default function useLoginState() {
  const [loginState, setLoginState] = useState<LoginStateInterface>({
    usuario: '',
    token: '2131sdgdfgdfgf313132',
    logado: false,
  })
  return { loginState, setLoginState }
}