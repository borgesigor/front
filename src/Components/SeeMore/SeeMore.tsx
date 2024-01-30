import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import * as stylex from '@stylexjs/stylex'
import { ButtonComponent } from "../Button/Button";

interface Props{
  children: ReactNode,
  active?: boolean,
  size?: number
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
      <SeeMoreContainer {...stylex.props(hide && hideCont.container)} $size={props.size} >
        <SeeMore >
          {props.children}
          {
            active &&
              <SeeMoreOverlay {...stylex.props(hide && hideCont.default)} />
          }
        </SeeMore>
        {
          active &&
            // <button {...stylex.props(buttonSeeMore.default)} onClick={() => toggleSeeMore()} >{!hide ? 'Abrir parágrafo' : 'Fechar parágrafo'}</button>
            <ButtonComponent onClick={() => toggleSeeMore()} >
              { hide ? 'Fechar Parágrafo': 'Abrir Parágrafo' }
            </ButtonComponent>
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

const SeeMoreContainer = styled.div<{ $size?: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 1rem;
  height: ${props => props.$size ? props.$size : '150'}px;
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
  overflow: hidden;
  position: relative;
`