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

export const pessoas = [
  { nome: 'Cliente PF', codigo: 'C' },
  { nome: 'Cliente PJ', codigo: 'J' },
  { nome: 'Fornecedor', codigo: 'F' },
  { nome: 'Revisador', codigo: 'R' },
  { nome: 'Tecelão', codigo: 'T' },
  { nome: 'Vendedor', codigo: 'V' }

];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export default function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Escolha o tipo de Pessoa</DialogTitle>
      <List sx={{ pt: 0 }}>
        {pessoas.map((pessoa) => (
          <ListItem disableGutters key={pessoa.nome}>
            <ListItemButton onClick={() => handleListItemClick(pessoa.codigo)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={pessoa.nome} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}