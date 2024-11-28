import { styled } from '@mui/system';
import { Button, Container, Grid, Paper } from '@mui/material'
import { THEME } from './Theme';

export const StyleContainer = styled(Container)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  // minHeight: '100vh',
  overflow: 'auto'
}))

export const StyleButton = styled(Button)(() => ({
  width: '100%',
  color: THEME.palette.secondary.main,
  borderColor: THEME.palette.secondary.main,
  marginTop: 2,
  marginBottom: 15,
}))

export const StyleGrid = styled(Grid)(() => ({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',

}))

export const StylePaper = styled(Paper)(() => ({
  padding: 2,
  textAlign: 'center',
  color: THEME.palette.primary.main,
}))