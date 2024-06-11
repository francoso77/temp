import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styled from 'styled-components';
import { THEME } from '../../Config/Theme';
import { AppBar } from '@mui/material';

const StyledTab = styled(Tab)`
  &.Mui-selected {
    color: white;
    border: 2px solid black;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-color: black;
    margin-left: 1px;
    margin-right: 1PX;
    background-color: ${() => THEME.palette.primary.main};
  };
  color: white;
  border: 2px solid green;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-color: gray;
  margin-left: 1px;
  margin-right: 1PX;
  background-color: ${() => THEME.palette.secondary.light};

`;

interface propsCustomTab {
  labels: string[]
  currentTab: number
  setState: React.Dispatch<React.SetStateAction<any>>

}
export const CustomTab = ({ labels, currentTab, setState }: propsCustomTab) => {

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setState(newValue);
  };
  return (
    <>
      <AppBar position="static" sx={{
        borderTopRightRadius: 5, borderTopLeftRadiusRadius: 5, background: 'white',
        border: 'none',
        padding: 1,
      }}>
        <Tabs value={currentTab} onChange={handleTabChange}
          sx={{
            background: 'white',
            border: 'none',
            marginTop: 1,
            marginBottom: 1,
          }}>
          {labels.map((label, i) => (
            <StyledTab key={i} label={label} />
          ))}
        </Tabs>
      </AppBar>
    </>
  );
};
