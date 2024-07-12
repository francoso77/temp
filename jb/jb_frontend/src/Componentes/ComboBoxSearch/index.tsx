import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

interface SearchAutocompleteProps {
  fetchOptions: (inputValue: string) => Promise<string[]>;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ fetchOptions }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputValue) {
      setLoading(true);
      fetchOptions(inputValue).then((newOptions) => {
        setOptions(newOptions);
        setLoading(false);
      });
    }
  }, [inputValue, fetchOptions]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default SearchAutocomplete;
