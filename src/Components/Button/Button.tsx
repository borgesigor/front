import { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex'
import { theme } from '../../Themes/theme.stylex'

interface Props{
  children: ReactNode
}

export function ButtonComponent({ children }: Props) {
  return ( 
    <>
      <button {...stylex.props(button.default)} >{children}</button>
    </>
  );
}

const button = stylex.create({
  default: {
    fontWeight: 400,
    fontSize: '0.9rem',
    padding: '0.5rem 1rem',
    background: theme.background,
    color: theme.primaryColor,
    border: `1px solid ${theme.borderHardColor}`,
    borderBottom: `2px solid ${theme.borderHardColor}`,
    borderRadius: '4px',
    cursor: 'pointer',
    width: 'fit-content',
    lineHeight: '170%'
  },
  responsive: {
    width: '100%' 
  }
})