import React from 'react';
import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl, Typography, useTheme } from '@mui/material';
import Condicional from '../Condicional/Condicional';



export type Operator = '>' | '<' | '>=' | '<=' | '=' | '!=';

interface OperatorSelectProps {
  value: Operator;
  onChange: (event: SelectChangeEvent<Operator>) => void;
  textAlign?: "left" | "right" | "center"
  labelAlign?: "left" | "right" | "center"
  tamanhoFonte?: number
  label?: string
}

const OperatorSelect: React.FC<OperatorSelectProps> = ({ value, onChange, textAlign, labelAlign, tamanhoFonte, label }) => {

  const theme = useTheme()

  return (
    <FormControl sx={{ width: '100%' }}>
      <Condicional condicao={typeof label === 'string' && label.length > 0}>
        <Typography
          variant='body2'
          textAlign={labelAlign}
          sx={{
            mt:
              theme && theme.inputs && theme.inputs.marginTop
                ? theme.inputs.marginTop
                : 0,
            fontSize: tamanhoFonte,
          }}
        >
          {label}
        </Typography>
      </Condicional>
      <Select
        sx={{
          '& .MuiInputBase-input': {
            fontSize: tamanhoFonte, // Aumenta o tamanho da fonte do input
            textAlign: textAlign,
          }
        }}
        size="small"
        value={value}
        onChange={onChange}
      >
        <MenuItem sx={{ fontSize: tamanhoFonte }} value=">">
          <img src={'img/operator/maior-que.png'} alt="Maior que" style={{ width: 24, marginRight: 8, marginTop: 3 }} />
          Maior que
        </MenuItem>
        <MenuItem sx={{ fontSize: tamanhoFonte }} value="<">
          <img src={'img/operator/menor-que.png'} alt="Menor que" style={{ width: 24, marginRight: 8, marginTop: 3 }} />
          Menor que
        </MenuItem>
        <MenuItem sx={{ fontSize: tamanhoFonte }} value=">=">
          <img src={'img/operator/e-maior-que-ou-igual-a.png'} alt="Maior ou igual" style={{ width: 24, marginRight: 8, marginTop: 3 }} />
          Maior ou igual
        </MenuItem>
        <MenuItem sx={{ fontSize: tamanhoFonte }} value="<=">
          <img src={'img/operator/e-menor-ou-igual-a.png'} alt="Menor ou igual" style={{ width: 24, marginRight: 8, marginTop: 3 }} />
          Menor ou igual
        </MenuItem>
        <MenuItem sx={{ fontSize: tamanhoFonte }} value="=">
          <img src={'img/operator/igual.png'} alt="Igual" style={{ width: 24, marginRight: 8, marginTop: 3 }} />
          Igual
        </MenuItem>
        <MenuItem sx={{ fontSize: tamanhoFonte }} value="!=">
          <img src={'img/operator/nao-igual.png'} alt="Diferente" style={{ width: 24, marginRight: 8, marginTop: 3 }} />
          Diferente
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default OperatorSelect;
