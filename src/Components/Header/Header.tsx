import logo from '../../assets/logo.svg'
import { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { DropdownComponent } from "./Dropdown";
import styled from "styled-components";
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

  return ( 
    <>

      <Header $scrolled={scrolled} >

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

        <Button className="mobile">
          <i style={{ fontSize: '2rem' }} className="iconsax" icon-name="hamburger-menu"></i>
        </Button>

      </Header>

      {/* <MobileMenuComponent items={MenuArray}  /> */}

    </>
  );
}

const TransitionTime = '0.2s'

const Header = styled.div<{ $scrolled: boolean }>`
  position: fixed;
  z-index: 99;
  background: ${props => props.$scrolled ? props.theme.background : 'transparent'};
  width: 100%;
  display: flex;
  height: 4rem;
  color: ${props => props.$scrolled ? props.theme.primaryColor : 'white'};
  transition: ${TransitionTime};
  padding: 0rem 4rem;
  box-sizing: border-box;
  font-family: ${props => props.theme.secondaryFont};
  border-bottom: 1px solid;
  border-color: ${props => props.$scrolled ? props.theme.borderColor : 'transparent'};

  @media screen and (max-width: 1100px) {
    padding: 0rem 2rem;
  }


  @media screen and (min-width: 1101px) {

    .mobile{
      display: none;
    }
  }
`

const Left = styled.div`
  flex: 1;
  display: flex;
  justify-content: left;
  align-items: center;
  height: 100%;
  gap: 3rem;

  @media screen and (max-width: 1100px) {
    display: none;
  }
`

const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: right;
  align-items: center;
  height: '100%';
  gap: 1rem;

  @media screen and (max-width: 1100px) {
    display: none;
  }
` 

const Middle = styled.div<{ $scrolled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  @media screen and (max-width: 1100px) {
    justify-content: left;
  }

  svg{
    width: 3.2rem;
    fill: ${props => props.$scrolled ? props.theme.primaryColor : 'white'};
  }
`

const Button = styled.div`

  height: 100%;
  background: transparent;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .text{
    display: flex;
    align-items: center;
    height: 100%;
    cursor: pointer;
  }

  a{
    opacity: 0.6;
  }
  
  &:hover {
    a{
      opacity: 1;
    }

    .dropdown{
      visibility: visible;
      opacity: 1;
      margin-top: 0;
    }
  }
  
`

const Dropdown = styled.div`
  position: absolute;
  left: 0;
  top: 4rem;
  overflow: visible;
  width: fit-content;
  visibility: hidden;
  opacity: 0;
  transition: .1s ease-in-out;
  margin-top: -0.2rem;
`