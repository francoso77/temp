import React, { useState } from 'react';
import { TransacoesFicha } from './transacoesFicha';
import { useNavigate } from 'react-router-dom';

export default function PaginaTransacoes() {
  const [openDialog, setOpenDialog] = useState(true);
  const irPara = useNavigate();

  const handleClose = () => {
    setOpenDialog(false);
    irPara('/transacoes');
  };


  return (
    <>
      <TransacoesFicha
        open={openDialog}
        setOpen={handleClose}
      // você pode passar outros props como transacao, localState, etc.
      />
    </>
  );
}
