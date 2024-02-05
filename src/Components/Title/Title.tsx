import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex'
import { styled } from 'styled-components';

interface Props{
  title: string,
  seeMore?: boolean
}

export function TitleComponent(props: Props) {
  const [title, setTitle] = useState(String)
  const [seeMore, setSeeMore] = useState(false)

  useEffect(()=>{

    setTitle(props.title)

    if(props.seeMore){
      setSeeMore(true)
    }

  }, [props])

  return ( 
    <>
      <TitleContainer>
        <h2 {...stylex.props(titleContainer.title)} >{title}</h2>
        { seeMore &&
            <span {...stylex.props(titleContainer.seeMore)} >Ver mais</span>
        }
      </TitleContainer>
    </>
  );
}

const TitleContainer = styled.div`
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: ${props => props.theme.primaryColor };
`

const titleContainer = stylex.create({
  title: {
    fontSize: '1.5rem'
  },
  seeMore: {
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: {
      default: 'none',
      ':hover': 'underline'
    }
  }
})