import logo from '../../assets/logo.svg'
import { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { DropdownComponent } from "./Dropdown";
import styled from "styled-components";
import { MenuArray } from "./IMenu";
import { MobileMenuComponent } from './MobileMenu';

const HeaderBGTransitionTime = '0.2s'

export function HeaderComponent() {
  const [headerBGVisibility, setHeaderBGVisibility] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  const menuOnMouseEnter = () => {
    setDropdownVisible(true)
    setHeaderBGVisibility(true);
  }

  const menuOnMouseLeave = () => {
    setDropdownVisible(false)

    if(!scrolled){
      setHeaderBGVisibility(false);
    }
  }

  useEffect(()=>{
    if(scrolled){
      setHeaderBGVisibility(true);
    }else if(!dropdownVisible){
      setHeaderBGVisibility(false)
    }
  }, [scrolled])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll()
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [mobileMenuState, setMobileMenuState] = useState(false);

  const toggleMobileMenuState = () => {
    setMobileMenuState(!mobileMenuState)
  }

  return ( 
    <>

      <Header $BGVisibility={headerBGVisibility} className='header' >

        <HeaderWrapper>

          <Left>
            {
              MenuArray.map((elem, index) => 
                <MenuElement key={index} onMouseEnter={() => elem.dropdown && menuOnMouseEnter() } onMouseLeave={menuOnMouseLeave} >
                  <Menu >
                    <span>
                      { elem.menu }
                    </span>
                    <span>
                      { 
                        elem.dropdown &&  
                        <i className="iconsax" icon-name="chevron-down"></i>
                      }
                    </span>
                  </Menu>
                  {
                    (elem.dropdown) &&
                      <Dropdown className='dropdown' >
                        <DropdownComponent menu={elem}/>
                      </Dropdown>
                  }
                </MenuElement>
              )

            }
          </Left>

          <Middle $BGVisibility={headerBGVisibility} >
            <ReactSVG src={logo}/>
          </Middle>

          <Right>
            <Button style={{ cursor: 'pointer' }} >
              <i style={{ fontSize: '1.5rem' }} className="iconsax" icon-name="instagram"></i>
            </Button>
            <Button style={{ cursor: 'pointer' }} >
              <i style={{ fontSize: '1.5rem' }} className="iconsax" icon-name="play-square"></i>
            </Button>
          </Right>

          <Button className="mobile" onClick={toggleMobileMenuState} >
            <i style={{ fontSize: '2rem' }} className="iconsax" icon-name="hamburger-menu"></i>
          </Button>
          
        </HeaderWrapper>

      </Header>

      <MobileMenuComponent items={MenuArray} opened={mobileMenuState} toggle={toggleMobileMenuState} />

    </>
  );
}

const HeaderSize = '4rem';

const Dropdown = styled.div`
  position: fixed;
  margin-top: ${HeaderSize};
  background: white;
  width: 100%;
  left: 0;

  padding: 2rem 4rem;
  box-sizing: border-box;

  border-bottom: 1px solid;
  border-color: ${props => props.theme.borderColor};
`

const Menu = styled.a`
  opacity: 0.8;
  height: 100%;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0rem 2rem;

  &:hover{
    opacity: 1;
  }
`

const Header = styled.div<{ $BGVisibility: boolean }>`
  position: fixed;
  z-index: 99;
  background: ${props => props.$BGVisibility ? props.theme.background : 'transparent'};
  width: 100%;
  display: flex;
  height: ${HeaderSize};
  color: ${props => props.$BGVisibility ? props.theme.primaryColor : 'white'};
  transition: ${HeaderBGTransitionTime};
  padding: 0rem 4rem;
  box-sizing: border-box;
  font-family: ${props => props.theme.secondaryFont};
  border-bottom: 1px solid;
  border-color: ${props => props.$BGVisibility ? props.theme.borderColor : 'transparent'};

  @media screen and (max-width: 1100px) {
    padding: 0rem 2rem;
  }

  @media screen and (min-width: 1101px) {
    .mobile{
      display: none;
    }
  }
`

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: ${props => props.theme.headerWidth};
  margin: 0 auto;
`

const Left = styled.div`
  flex: 1;
  display: flex;
  justify-content: left;
  align-items: center;
  height: 100%;

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

const Middle = styled.div<{ $BGVisibility: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  @media screen and (max-width: 1100px) {
    justify-content: left;
  }

  svg{
    width: 3.2rem;
    fill: ${props => props.$BGVisibility ? props.theme.primaryColor : 'white'};
  }
`

const MenuElement = styled.div`
  height: 100%;
  background: transparent;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-content: center;
  position: relative;
  left: -2rem;

  .dropdown{
    opacity: 0;
    transition: ${HeaderBGTransitionTime};
    visibility: hidden;
    top: -20px;
    z-index: -1;
  }

  &:hover{
    .dropdown{
      visibility: visible;
      opacity: 1;
      top: 0;
    }
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
`