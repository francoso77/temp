import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper
} from '@mui/material';

interface SubItem {
  id: number;
  name: string;
  value: number;
}

interface Item {
  id: number;
  name: string;
  subItems: SubItem[];
}

const items: Item[] = [
  { id: 1, name: 'Item 1', subItems: [{ id: 1, name: 'Subitem 1', value: 10 }, { id: 2, name: 'Subitem 2', value: 20 }] },
  { id: 2, name: 'Item 2', subItems: [{ id: 3, name: 'Subitem 1', value: 15 }, { id: 4, name: 'Subitem 2', value: 25 }] },
];

const TabelaComCheckbox: React.FC = () => {
  const [selectedSubItems, setSelectedSubItems] = useState<{ [key: number]: number[] }>({});
  const [total, setTotal] = useState<number>(0);

  const handleSubItemChange = (itemId: number, subItem: SubItem) => {
    setSelectedSubItems((prevState) => {
      const updatedSelected = { ...prevState };

      if (!updatedSelected[itemId]) {
        updatedSelected[itemId] = [];
      }

      if (updatedSelected[itemId].includes(subItem.id)) {
        // Remove subitem selecionado
        updatedSelected[itemId] = updatedSelected[itemId].filter((id) => id !== subItem.id);
        setTotal((prevTotal) => prevTotal - subItem.value);
      } else {
        // Adiciona subitem selecionado
        updatedSelected[itemId].push(subItem.id);
        setTotal((prevTotal) => prevTotal + subItem.value);
      }

      return updatedSelected;
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Subitens</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Subitem</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Selecionar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item.subItems.map((subItem) => (
                      <TableRow key={subItem.id}>
                        <TableCell>{subItem.name}</TableCell>
                        <TableCell>{subItem.value}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedSubItems[item.id]?.includes(subItem.id) || false}
                            onChange={() => handleSubItemChange(item.id, subItem)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>Total: {total}</div>
    </TableContainer>
  );
};

export default TabelaComCheckbox;
