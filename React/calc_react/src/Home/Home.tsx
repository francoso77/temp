import { Grid, TextField, Container, Paper } from '@mui/material';
import { Btn } from "../Components/Button";
import useDisplayState from "../Context/DisplayState";
import { GlobalContext } from "../Context/GlobalContext";
import DisplayText from '../Components/Display';
import Text from '../Components/Text';

const teclado: string[] = [
  'x²', '√', '←', '/',
  '7', '8', '9', '*',
  '4', '5', '6', '+',
  '1', '2', '3', '-',
  'C', '0', ',', '='
]

export default function Home() {

  const { displayState, setDisplayState } = useDisplayState()
  const display = displayState.visor

  return (
    <>
      <GlobalContext.Provider value={{
        displayState: displayState,
        setDisplayState: setDisplayState,
      }}>
        <Container maxWidth="xs">
          <Paper elevation={6} sx={{ padding: 2, marginTop: 2, }}>

            <Grid container spacing={{ xs: 1.2 }}>
              <Grid item xs={12}>
                <Text
                  label=''
                  type='text'
                  dados={displayState}
                  field={display}
                  setState={setDisplayState}
                  id={'txtVisor'}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <DisplayText
                  type='text'
                  dados={displayState}
                  field={display}
                  setState={setDisplayState}
                  id={'txtVisor'}
                />
              </Grid> */}
              <Grid item xs={12}>
              </Grid>
              {teclado.map((tecla, index) => (
                <Grid item xs={3} key={index}>

                  <Btn
                    bgColor='#49c4ff'
                    hoverColor='#000077'
                    value={tecla}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </GlobalContext.Provider>
    </>
  );
}
