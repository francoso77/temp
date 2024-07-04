import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

export const pessoas = [
    { nome: 'Cliente', codigo: 'C' },
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

// export default function SimpleDialogDemo() {
//   const [open, setOpen] = React.useState(true);
//   const [selectedValue, setSelectedValue] = React.useState(pessoas[1].codigo);

// //   const handleClickOpen = () => {
// //     setOpen(true);
// //   };

//   const handleClose = (value: string) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
//       {/* <Typography variant="subtitle1" component="div">
//         Selected: {selectedValue}
//       </Typography>
//       <br />
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button> */}
//       <SimpleDialog
//         selectedValue={selectedValue}
//         open={open}
//         onClose={handleClose}
//       />
//     </div>
//   );
// }
