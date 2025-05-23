import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import React, { useState } from 'react';
import CustomButton from '../../Componentes/Button';
import InputText from '../../Componentes/InputText';
import ComboBox from '../../Componentes/ComboBox';
import ColorPicker from '../../Componentes/ColorPicker';

interface categoriaInterface {
  id: number;
  name: string;
  tipo: 'Receitas' | 'Despesas';
  cor: string;
}

interface tiposInterface {
  id: number;
  name: string;
}
export function Categorias({ open }: { open: boolean }) {
  const [categorias, setCategorias] = React.useState<categoriaInterface[]>([]);
  const [erros, setErros] = useState({});
  const [dados, setDados] = useState<categoriaInterface>({
    id: 0,
    name: '',
    tipo: 'Receitas',
    cor: '',
  });

  const [tipos, setTipos] = useState<tiposInterface[]>([
    { id: 2, name: 'Despesas' },
    { id: 3, name: 'Receitas' },
  ])
  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Cadastro de Categorias</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputText
                label="Descrição"
                type="text"
                setState={setCategorias}
                field="name"
                erros={erros}
                dados={categorias}
              />
            </Grid>
            <Grid item xs={12}>
              <ComboBox
                label='Tipo'
                corFundo='#010108'
                opcoes={tipos}
                onChange={(e) => console.log(e)}
                field='name'
                setState={() => { }}
                dados={{}}
                campoID='id'
                campoDescricao='name'
                mensagemPadraoCampoEmBranco='Escolha Uma Categoria'
              />
            </Grid>
            <Grid item xs={12}>
              <ColorPicker
                label="Escolha uma cor"
                dados={dados}
                setState={setDados}
                field="cor"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <CustomButton>Salvar</CustomButton>
        </DialogActions>
      </Dialog>

    </>
  );
}