import React from 'react';
import { OutlinedInput, FormControl } from '@mui/material';

interface DisplayTextInterface {
  type?: string,
  dados: { [key: string]: string | number | readonly string[] | undefined | any },
  field: string,
  setState: React.Dispatch<React.SetStateAction<any>>,
  id: string,
}
export default function DisplayText({
  type = 'text',
  dados,
  field,
  setState,
  id,
}: DisplayTextInterface) {

  const inputStyles: React.CSSProperties = {
    textAlign: 'right',
  };

  if (type === 'text') {
    return (
      <>
        <FormControl sx={{ width: '100%' }}>
          <OutlinedInput
            value={field}
            sx={{
              my: 0,
              py: 0,
              fontSize: 35,
            }}
            type={type}
            onChange={(e) => setState({ ...dados, [field]: e.target.value })}
            id={id}
            inputProps={{ style: inputStyles }}
          />
        </FormControl>
      </>
    )
  } else {
    return (<></>)
  }
}