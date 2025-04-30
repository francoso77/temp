import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

interface propsCardEtapas {
  titulo: string
  imagem: string
  cidade: string
  uf: string
  data: string
  descritivo: string
}

export default function CardEtapas({
  titulo,
  imagem,
  cidade,
  uf,
  data,
  descritivo
}: propsCardEtapas) {
  return (
    <>
      <Card sx={{ display: "flex", margin: 2, backgroundColor: '#F5FFFA' }}>
        <Grid container sx={{ display: "flex", justifyContent: 'center' }}>
          <Grid item xs={3} >
            <CardMedia
              component="img"
              sx={{ width: 100, height: 100, marginTop: '20px' }}
              image={"/".concat(imagem)}
              alt="Circuito Tambor Dog"
            />
          </Grid>
          <Grid item xs={9} >
            <Grid item container direction='column' >
              <Grid item xs sx={{ display: 'inline', alignContent: 'center', marginLeft: '10px' }}>
                <Typography variant="h6" gutterBottom sx={{ marginLeft: '10px' }}>
                  {titulo}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom sx={{ marginLeft: '10px' }}>
                  {cidade} - {uf} - {data}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom sx={{ marginLeft: '10px' }}>
                  {descritivo}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} sx={{ marginRight: '15px', textAlign: 'right' }}>
            <PeopleAltOutlinedIcon />
            <InfoOutlinedIcon />
            <WorkspacePremiumOutlinedIcon />
            <TrendingUpOutlinedIcon />
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
