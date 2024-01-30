import styled from "styled-components";
import * as stylex from '@stylexjs/stylex' 
import { theme } from "../../Themes/theme.stylex";
import { IMenuElement } from "./IMenu";

interface Props{
  items: Array<IMenuElement>
}

export function MobileMenuComponent({ items }: Props) {

  return (
    <>
      <Menu {...stylex.props(menu.default)}>
        <ItemContainer>
          {

            items.map((e, i)=> 
              <Item key={i}>
                { e.menu }
              </Item>
            )

          }
        </ItemContainer>
      </Menu>
    </>
  );
}

const Menu = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 99;
  text-align: center;
  display: none;
`

const ItemContainer = styled.ul`
  display: flex;
  flex-direction: column;

  .subitem{
    background: red;
  }
`

const Item = styled.li`
  padding: 2rem;
  position: relative;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::after{
    content: '';
    display: block;
    position: absolute;
    left: 0;
    background: red;
    width: 100%;
    height: 1px;
    bottom: 0px;
  }
`

const menu = stylex.create({
  default: {
    background: theme.background,
    color: theme.primaryColor
  }
})