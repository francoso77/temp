import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import Condicional from '../Condicional/Condicional';
import { Typography } from '@mui/material';
import { PessoaTypes } from '../../types/pessoaTypes';

// export const pessoas = [
//   { nome: 'Cliente PF', codigo: 'C' },
//   { nome: 'Cliente PJ', codigo: 'J' },
//   { nome: 'Fornecedor', codigo: 'F' },
//   { nome: 'Revisador', codigo: 'R' },
//   { nome: 'Tecelão', codigo: 'T' },
//   { nome: 'Vendedor', codigo: 'V' }

// ];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  rsDados?: {
    [key: string]: string | number | readonly string[] | undefined | any
  };
  tipo: 'pessoas' | 'dados'
}

export default function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open, rsDados, tipo } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <>
      <Condicional condicao={tipo === 'pessoas'}>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>Escolha o tipo de Pessoa</DialogTitle>
          <List sx={{ pt: 0 }}>
            {PessoaTypes.map((pessoa) => (
              <ListItem disableGutters key={pessoa.descricao}>
                <ListItemButton onClick={() => handleListItemClick(pessoa.idPessoaType)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={pessoa.descricao} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Dialog>
      </Condicional>
      <Condicional condicao={tipo === 'dados'}>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>Estrutura de produtos</DialogTitle>
          <Typography>
            {selectedValue}
          </Typography>
        </Dialog>

      </Condicional>
    </>
  );
}