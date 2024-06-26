import { Chip, Grid, Stack } from '@mui/material';
import CardEtapas from './CardEtapas';

export default function EtapasRealizadas() {

  const handleClick = (oque: string) => {
    console.info('Ordenar os Eventos por ', oque);
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid
          item
          xs={12}
          sm={8}
          md={10}
          lg={8}
          xl={6}
        >
          <Stack direction="row" spacing={2} sx={{ marginLeft: 10, marginTop: 5 }}>
            <Chip
              label="Favoritos"
              onClick={() => handleClick('Favoritos')}
            />
            <Chip
              label="Circuitos"
              onClick={() => handleClick('Circuitos')}
            />
            <Chip
              label="Open"
              onClick={() => handleClick('Open')}
            />
          </Stack>
          <CardEtapas
            titulo={"Circuito Etapa RJ"}
            imagem={"logo512.png"}
            cidade={"Volta Redonda"}
            uf={'RJ'}
            data={'02/10/2023'}
            descritivo={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt incidunt harum eum maiores consectetur tempore ratione ipsum non itaque!'}
          />
          <CardEtapas
            titulo={"Open Cia do Cão"}
            imagem={"logo512.png"}
            cidade={"Divinópolis"}
            uf={'MG'}
            data={'13/10/2023'}
            descritivo={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt incidunt harum eum maiores consectetur tempore ratione ipsum non itaque!'}
          />
          <CardEtapas
            titulo={"Circuito Etapa MG"}
            imagem={"logo512.png"}
            cidade={"Divinópolis"}
            uf={'MG'}
            data={'05/11/2023'}
            descritivo={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt incidunt harum eum maiores consectetur tempore ratione ipsum non itaque!'}
          />
        </Grid>
      </Grid >
    </>
  );
}
