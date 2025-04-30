import React from 'react';
import * as Styled from './styles';

interface ButtonProps {
  bgColor: string;
  hoverColor: string;
  children: any;
}
export const Button: React.FC<ButtonProps> = ({ bgColor, hoverColor, children }) => {
  return (
    <Styled.ButtonCustom bgColor={bgColor} hoverColor={hoverColor}>
      {children}
    </Styled.ButtonCustom>
  )
};