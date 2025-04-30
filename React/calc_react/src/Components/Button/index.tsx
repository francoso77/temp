import React, {useContext} from 'react';
import {Button} from '@mui/material';
//import * as Styled from './styles';
import { CalculadoraCls } from '../../Utils/CalculadoraCls';
import { GlobalContext, GlobalContextInterface } from '../../Context/GlobalContext';

interface ButtonProps {
  bgColor: string;
  hoverColor: string;
  value: string;
}

export const Btn: React.FC<ButtonProps> = ({ bgColor, hoverColor, value}) => {

  const {displayState, setDisplayState} = useContext(GlobalContext) as GlobalContextInterface

  const passaValor = (tecla: string ) => {
    var calc = new CalculadoraCls();
    calc.enviaValor(tecla, displayState, setDisplayState)
  }
  

  
  return (
    // <Styled.ButtonCustom bgColor={bgColor} hoverColor={hoverColor}>
    // </Styled.ButtonCustom>
          <Button
          onClick={() => passaValor(value)}
          fullWidth
          variant="outlined"
          sx={{
            background: bgColor,
            color: 'white',
            fontSize: '18px',
            '&:hover':{
              backgroundColor: hoverColor,
            }
          }}
        >
          {value}
        </Button>
  )
};