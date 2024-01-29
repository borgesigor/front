import * as stylex from '@stylexjs/stylex'
import { ReactNode } from 'react';

interface Props{
  children: ReactNode
}

export function MainComponent({ children }: Props) {
  return ( 
    <>
      <div {...stylex.props(main.default)} >
        {children}
      </div>
    </>
  );
}

const main = stylex.create({
  default: {
    display: 'flex',
    flexDirection: 'column',
    gap: {
      default: '6rem',
      '@media (max-width: 1100px)': '4rem'
    }
  }
})