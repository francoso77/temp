import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Link
} from '@mui/material';

const TermoDeUsoModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Link href="#" onClick={handleOpen}>
        Leia os termos de uso
      </Link>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Termos de Uso do Sistema</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            Bem-vindo ao nosso sistema! Ao utilizar este sistema, você concorda com os seguintes termos de uso...
          </Typography>
          <Typography variant="body2" paragraph>
            1. O usuário deve manter a confidencialidade de suas credenciais de acesso.<br />
            2. O uso indevido do sistema pode resultar em penalidades.<br />
            3. As funcionalidades estão sujeitas a alterações sem aviso prévio.<br />
            4. Dados fornecidos devem ser verídicos e atualizados.
          </Typography>
          <Typography variant="body2" paragraph>
            Ao continuar, você concorda integralmente com estes termos.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TermoDeUsoModal;
