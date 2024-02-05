import styled from "styled-components";
import { IMenuElement } from "./IMenu";
import { ReactSVG } from 'react-svg';
import Logo from '../../Assets/logo.svg'

interface Props{
  items: Array<IMenuElement>,
  opened: boolean,
  toggle(): void
}

export function MobileMenuComponent(props: Props) {
  return (
    <Container $opened={props.opened} >
      <MenuContainer $opened={props.opened} >
        <Head>
          <ReactSVG src={Logo}/>
          <button onClick={props.toggle} >
            <span style={{ fontSize: '2.3rem' }} className="material-symbols-rounded"> close </span>
          </button>
        </Head>
        <Body>
          {
            props.items.map((e: IMenuElement, i)=>
              <li key={i}>
                {e.menu}
              </li>
            )
          }
        </Body>
      </MenuContainer>
    </Container>
  );
}

const Container = styled.div<{ $opened: boolean }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  top: 0;
  left: 0;
  visibility: ${props => props.$opened ? 'visible' : 'hidden'};
`

const MenuContainer = styled.div<{ $opened: boolean }>`
  width: 100%;
  height: 100vh;
  position: relative;
  top: 0px;
  text-align: center;
  transition: 0.2s;
  position: relative;
  background: ${props => props.theme.background};
  color: ${props => props.theme.primaryColor};
  left: ${props => props.$opened ? '0px' : '100%'};
`

const Head = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0rem 2rem;
  position: relative;
  left: 0;
  width: 100%;
  box-sizing: border-box;

  button{
    background: none;
    border: none;
    padding: none;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  svg{
    fill: ${props => props.theme.primaryColor};
    width: 3.2rem;
  }
`

const Body = styled.div`
  
`