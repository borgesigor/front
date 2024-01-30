import { ReactNode } from 'react';
import styled from 'styled-components';

interface Props{
  children: ReactNode,
  onClick?: any,
  inverted?: boolean,
  responsive?: boolean
}

export function ButtonComponent(props: Props) {
  return ( 
    <>
      <Button $inverted={props.inverted} $responsive={props.responsive} onClick={props.onClick}>{props.children}</Button>
    </>
  );
}

const Button = styled.button<{ $inverted?: boolean, $responsive?: boolean }>`
  font-weight: 400;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  background: ${props => props.$inverted ? props.theme.primaryColor : props.theme.background};
  color: ${props => props.$inverted ? props.theme.background : props.theme.primaryColor};
  border: 1px solid;
  border-bottom: 2px solid;
  border-color: ${props => props.theme.primaryColor};
  border-radius: 4px;
  cursor: pointer;
  width: fit-content;
  line-height: 170%;
  width: ${props => props.$responsive ? '100%' : 'fit-content'};
`