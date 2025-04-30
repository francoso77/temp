import React, { useState } from 'react';
//import './Ordem.css';
import {
  AppBar,
  Box,
  Tab,
  Tabs,
  Typography,
  Container,
  TextField,
  Button,
} from '@mui/material';

interface Product {
  name: string;
  price: number;
  description: string;
}

const initialProduct: Product = {
  name: '',
  price: 0,
  description: '',
};

export default function Ordem() {

  const [currentTab, setCurrentTab] = useState(0);
  const [product, setProduct] = useState<Product>(initialProduct);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleProductChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Aqui você pode realizar a lógica de salvamento do produto
    console.log('Produto salvo:', product);
    // Reiniciar o formulário
    setProduct(initialProduct);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 5 }}>
      <AppBar position="static" sx={{ borderTopRightRadius: 5, borderTopLeftRadiusRadius: 5 }}>
        <Tabs value={currentTab} onChange={handleTabChange} >
          <Tab label="Nome do Produto"
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(228, 169, 169, 0.712)',
                color: 'white',
                borderColor: 'rgba(250, 5, 5, 0.658)',

              },
              color: 'rgb(228, 169, 169)',
              border: 0.1,
              borderRadius: 1,
              borderColor: 'white',
              boxShadow: 1
            }}
          />
          <Tab label="Preço e Descrição"
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(228, 169, 169, 0.712)',
                color: 'white',
                borderColor: 'rgba(250, 5, 5, 0.658)',
              },
              ml: 0.2,
              color: 'rgb(228, 169, 169)',
              border: 0.1,
              borderRadius: 1,
              borderColor: 'white',
              boxShadow: 1
            }}
          />
          <Tab label="Preço e Descrição"
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(228, 169, 169, 0.712)',
                color: 'white',
                borderColor: 'rgba(250, 5, 5, 0.658)',
              },
              ml: 0.2,
              color: 'rgb(228, 169, 169)',
              border: 0.1,
              borderRadius: 1,
              borderColor: 'white',
              boxShadow: 1
            }}
          />
          <Tab label="Preço e Descrição"
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(228, 169, 169, 0.712)',
                color: 'white',
                borderColor: 'rgba(250, 5, 5, 0.658)',
              },
              ml: 0.2,
              color: 'rgb(228, 169, 169)',
              border: 0.1,
              borderRadius: 1,
              borderColor: 'white',
              boxShadow: 1
            }}
          />
        </Tabs>
      </AppBar>
      <Box mt={3}>
        {currentTab === 0 && (
          <Box>
            <TextField
              fullWidth
              label="Nome do Produto"
              name="name"
              value={product.name}
              onChange={handleProductChange}
              variant="outlined"
              margin="normal"
            />
          </Box>
        )}
        {currentTab === 1 && (
          <Box>
            <TextField
              fullWidth
              label="Preço"
              type="number"
              name="price"
              value={product.price}
              onChange={handleProductChange}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Descrição"
              name="description"
              value={product.description}
              onChange={handleProductChange}
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        )}
      </Box>
      <Box mt={3} display="flex" justifyContent="flex-end">
        {currentTab === 1 ? (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Salvar
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCurrentTab(currentTab + 1)}
          >
            Próxima
          </Button>
        )}
      </Box>
    </Container>
  );
};
