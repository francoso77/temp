import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parse,
} from 'date-fns';
import CustomButton from '../Button';

interface DateRangeSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
}

const formatInputDate = (date: Date): string =>
  //date.toISOString().split('T')[0];
  format(date, 'yyyy-MM-dd');

const formatOutputDate = (date: Date): string =>
  format(date, 'dd/MM/yyyy');

const DateRangeSelectorModal: React.FC<DateRangeSelectorModalProps> = ({ open, onClose, onConfirm }) => {
  const [startDate, setStartDate] = useState<string>(formatInputDate(new Date()));
  const [endDate, setEndDate] = useState<string>(formatInputDate(new Date()));
  const [selectedOption, setSelectedOption] = useState<string>('hoje');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    handleOptionChange('hoje');
  }, []);

  useEffect(() => {
    if (selectedOption === 'mesAno') {
      const start = startOfMonth(new Date(selectedYear, selectedMonth));
      const end = endOfMonth(new Date(selectedYear, selectedMonth));
      setStartDate(formatInputDate(start));
      setEndDate(formatInputDate(end));
    }
  }, [selectedMonth, selectedYear, selectedOption]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    const today = new Date();

    let start: Date;
    let end: Date;

    switch (option) {
      case 'hoje':
        start = end = today;
        break;
      case 'ontem':
        start = end = subDays(today, 1);
        break;
      case 'ultimos7':
        start = subDays(today, 7);
        end = today;
        break;
      case 'ultimos15':
        start = subDays(today, 15);
        end = today;
        break;
      case 'mesAtual':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case 'anoAtual':
        start = startOfYear(today);
        end = endOfYear(today);
        break;
      case 'mesAno':
        return; // lida no useEffect
      case 'personalizado':
        return;
      default:
        start = end = today;
    }

    setStartDate(formatInputDate(start));
    setEndDate(formatInputDate(end));
  };

  const handleConfirm = () => {
    const dataInicio = parse(startDate, 'yyyy-MM-dd', new Date());
    const dataFim = parse(endDate, 'yyyy-MM-dd', new Date());
    onConfirm(formatOutputDate(dataInicio), formatOutputDate(dataFim));
    onClose();
  };

  const handleClear = () => {
    onConfirm('', '');
    onClose();
  };

  const selectStyle = {
    mb: 2,
    '& .MuiSelect-icon': { color: '#fff' },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3a3a3a',
      borderWidth: '2px',
      borderRadius: '4px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3a3a3a',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3a3a3a',
    },
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: '#010108', color: '#fff', textAlign: 'center', border: '1px solid #3a3a3a' }}>
        Selecionar Intervalo de Datas
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#010108', color: '#fff', textAlign: 'center', borderRight: '1px solid #3a3a3a', borderLeft: '1px solid #3a3a3a' }}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#fff' }}>Intervalo Rápido</InputLabel>
              <Select
                value={selectedOption}
                onChange={(e) => handleOptionChange(e.target.value)}
                label="Intervalo Rápido"
                sx={selectStyle}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#010108',
                      borderRadius: '4px',
                      border: '1px solid #3a3a3a',
                      mt: 1,
                      '& .MuiMenuItem-root': {
                        color: '#fff',
                        '&:hover': { backgroundColor: '#bbdefb' },
                        '&.Mui-selected': {
                          backgroundColor: '#90caf9',
                          color: '#0d47a1',
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: '#64b5f6',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="hoje">Hoje</MenuItem>
                <MenuItem value="ontem">Ontem</MenuItem>
                <MenuItem value="ultimos7">Últimos 7 dias</MenuItem>
                <MenuItem value="ultimos15">Últimos 15 dias</MenuItem>
                <MenuItem value="mesAtual">Mês atual</MenuItem>
                <MenuItem value="anoAtual">Ano atual</MenuItem>
                <MenuItem value="mesAno">Selecionar Mês e Ano</MenuItem>
                <MenuItem value="personalizado">Personalizado</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {selectedOption === 'mesAno' && (
            <>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#fff' }}>Mês</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    sx={selectStyle}
                  >
                    {[
                      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                    ].map((month, index) => (
                      <MenuItem key={index} value={index}>{month}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#fff' }}>Ano</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    sx={selectStyle}
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <MenuItem key={year} value={year}>{year}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={6}>
            <InputLabel sx={{ color: '#fff' }}>Data Inicial</InputLabel>
            <TextField
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSelectedOption('personalizado');
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                mb: 2,
                '& input::-webkit-calendar-picker-indicator': {
                  filter: 'brightness(0) invert(1)',
                },
                '& label': { color: '#fff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#3a3a3a', borderRadius: '4px' },
                  '&:hover fieldset': { borderColor: '#3a3a3a' },
                  '&.Mui-focused fieldset': { borderColor: '#3a3a3a' },
                },
                input: { color: '#fff' },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <InputLabel sx={{ color: '#fff' }}>Data Final</InputLabel>
            <TextField
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSelectedOption('personalizado');
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                mb: 2,
                '& input::-webkit-calendar-picker-indicator': {
                  filter: 'brightness(0) invert(1)',
                },
                '& label': { color: '#fff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#3a3a3a', borderRadius: '4px' },
                  '&:hover fieldset': { borderColor: '#3a3a3a' },
                  '&.Mui-focused fieldset': { borderColor: '#3a3a3a' },
                },
                input: { color: '#fff' },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ bgcolor: '#010108', color: '#fff', textAlign: 'center', border: '1px solid #3a3a3a' }}>
        <CustomButton onClick={onClose} bgColor='#0c3055' textColor='black' sx={{ mr: '10px' }}>
          Cancelar
        </CustomButton>
        <CustomButton onClick={handleConfirm} bgColor='#1976d2' textColor='black' sx={{ mr: '10px' }}>
          Aplicar
        </CustomButton>
        <CustomButton onClick={handleClear} bgColor='#1976d2' textColor='black' sx={{ mr: '10px' }}>
          Limpar
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default DateRangeSelectorModal;
