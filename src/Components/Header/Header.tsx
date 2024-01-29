import * as stylex from "@stylexjs/stylex";
import logo from '../../assets/logo.svg'
import { useEffect, useState } from 'react';
import { theme } from "../../Themes/theme.stylex";
import { ReactSVG } from 'react-svg';
import { DropdownComponent } from "./Dropdown";
import styled from "styled-components";
import { MobileMenuComponent } from "./MobileMenu";
import { MenuArray } from "./IMenu";

export function HeaderComponent() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Adiciona o listener de evento de rolagem quando o componente é montado
    handleScroll()
    window.addEventListener('scroll', handleScroll);

    // Remove o listener quando o componente é desmontado
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  console.log(MenuArray)

  return ( 
    <>

      <Header $scrolled={scrolled} >

        <HeaderContent $scrolled={scrolled} >

          <Left>
            {
              MenuArray.map((e, i) => 
                  <Button key={i}>
                    <a href={e.path} style={{ display: 'flex', height: '100%', gap: '0.3rem' }} >
                      <div className="text">
                        { e.menu }
                      </div>
                      <div className="text">
                        { 
                          e.dropdown &&  
                          <i className="iconsax" icon-name="chevron-down"></i>
                        }
                      </div>
                    </a>
                    {
                      e.dropdown &&
                      <Dropdown className="dropdown">
                        <DropdownComponent content={e.dropdown} />
                      </Dropdown>
                    }
                  </Button>
              )

            }
          </Left>

          <Middle $scrolled={scrolled} >
            <ReactSVG src={logo}/>
          </Middle>

          <Right >
            <Button style={{ cursor: 'pointer' }} >
              <i style={{ fontSize: '1.5rem' }} className="iconsax" icon-name="instagram"></i>
            </Button>
            <Button style={{ cursor: 'pointer' }} >
              <i style={{ fontSize: '1.5rem' }} className="iconsax" icon-name="play-square"></i>
            </Button>
          </Right>

          <Button>
            <i style={{ fontSize: '2rem' }} className="iconsax" icon-name="hamburger-menu"></i>
          </Button>

        </HeaderContent>


      </Header>

      <MobileMenuComponent items={MenuArray}  />

    </>
  );
}

const TransitionTime = '0.2s'

const Header = styled.div<{ $scrolled: boolean }>`
  position: fixed;
  z-index: 99;
  width: 100%;
  background: ${props => props.$scrolled ? props.theme.background : 'transparent'};
`

const HeaderContent = styled.div<{ $scrolled: boolean }>`
  width: 1300px;
  margin: 0 auto;
  display: flex;
  height: 4rem;
  color: ${props => props.$scrolled ? props.theme.primaryColor : 'white'};
  transition: ${TransitionTime};
  font-family: ${props => props.theme.secondaryFont};
`

const Left = styled.div`
  flex: 1;
  display: flex;
  justify-content: left;
  align-items: center;
  height: 100%;
  gap: 3rem;
`

const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: right;
  align-items: center;
  height: '100%';
  gap: 1rem;
` 

const Middle = styled.div<{ $scrolled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  svg{
    width: 3.2rem;
    fill: ${props => props.$scrolled ? props.theme.primaryColor : 'white'};
  }
`

const Button = styled.div`

  height: 100%;
  background: transparent;
  border: none;
  opacity: 0.6;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;

  .text{
    display: flex;
    align-items: center;
    height: 100%;
    cursor: pointer;
  }
  
  &:hover {
    opacity: 1;
  }
  
`

const Dropdown = styled.div`
  position: absolute;
  width: 100%;
  background: white;
  left: 0;
  top: 4rem;
`