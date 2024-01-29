import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import * as stylex from '@stylexjs/stylex'
import { theme } from "../../Themes/theme.stylex";

interface Props{
  children: ReactNode,
  active?: boolean
}

export function SeeMoreComponent(props: Props) {
  const [hide, setHide] = useState(false)
  const [active, setActive] = useState(false);

  const toggleSeeMore = () => {
    setHide(!hide)
  }

  useEffect(()=>{
    if(props.active){
      setActive(true)
      setHide(false)
    }else{
      setHide(true)
      setActive(false)
    }
  }, [props.active])

  return (
    <>
      <SeeMoreContainer>
        <SeeMore {...stylex.props(hide && hideCont.container)} >
          {props.children}
          {
            active &&
              <SeeMoreOverlay {...stylex.props(hide && hideCont.default)} />
          }
        </SeeMore>
        {
          active &&
            <button {...stylex.props(buttonSeeMore.default)} onClick={() => toggleSeeMore()} >{!hide ? 'Abrir parágrafo' : 'Fechar parágrafo'}</button>
        }
      </SeeMoreContainer>
    </>
  );
}

const hideCont = stylex.create({
  default: {
    display: 'none',
  },
  container: {
    height: 'auto'
  }
})

const SeeMoreContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: end;
  gap: 1rem;
`

const SeeMoreOverlay = styled.div`
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
  width: 100%;
  height: 100%;
  content: '';
  display: block;
`

const SeeMore = styled.div`
  height: 100px;
  overflow: hidden;
  position: relative;
`

const buttonSeeMore = stylex.create({
  default: {
    position: 'relative',
    background: 'white',
    cursor: 'pointer',
    border: `1px solid ${theme.primaryColor}`,
    borderRadius: '5rem',
    padding: '0.2rem 0.7rem'
  }
})