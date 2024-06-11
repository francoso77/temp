import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import Condicional from '../Condicional/Condicional'

interface SelectInterface {
  label: string,
  disabled?: boolean,
  placeholder?: string,
  dados: { [key: string]: string | number | readonly string[] | undefined | any },
  erros?: { [key: string]: string },
  field: string,
  dadosMap?: string[],
  setState: React.Dispatch<React.SetStateAction<any>>
}
export default function Selection({
  label,
  disabled = false,
  placeholder = label,
  dados,
  erros = {},
  field,
  dadosMap = [],
  setState
}: SelectInterface) {

  const handleChangeSelect = (event: SelectChangeEvent, field: string) => {
    let IndiceField: number = parseInt(event.target.value)
    setState({ ...dados, [field]: IndiceField })
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          sx={{ my: 0, py: 0, height: 40 }}
          disabled={disabled}
          placeholder={placeholder}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={(dados[field]) ? dados[field].toString() : ''}
          label={label}
          onChange={(e) => handleChangeSelect(e, field)}
          required
        >
          {dadosMap.map((item, i) => (
            <MenuItem key={i} value={i}>{item}</MenuItem>
          ))}
        </Select>
        <Condicional condicao={typeof erros[field] !== 'undefined'}>
          <Typography variant='caption' textAlign='left' color='warning.main' >{erros[field]}</Typography>
        </Condicional>
      </FormControl>
    </>
  )
};
