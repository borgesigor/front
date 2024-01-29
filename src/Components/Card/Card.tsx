import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex'
import { ButtonComponent } from '../Button/Button';
import { theme } from '../../Themes/theme.stylex';
import styled from 'styled-components';

interface Props{
  icon?: string,
  button?: string,
  responsive?: boolean,
  vertical?: boolean,
  title: string,
  description: string,
  image?: string
}

export function CardComponent(props: Props) {
  const [button, setButton] = useState(String)
  const [icon, setIcon] = useState(String)

  useEffect(()=>{
    if(props.button){
      setButton(props.button)
    }

    if(props.icon){
      setIcon(props.icon)
    }
  }, [props])

  return ( 
    <Card {...stylex.props(card.default, props.responsive && card.responsive, props.vertical && card.vertical)} >
      {

        props.vertical && props.image &&
          <div className='card-image'>
            <img src={props.image} alt="" />
          </div>

      }
      {
        icon &&
          <i style={{ fontSize: '1.5rem', marginLeft: '-0.1rem' }} className="iconsax icon" icon-name={icon} ></i>
      }
      <div {...stylex.props(card.texts, props.vertical && card.verticalTexts)} >
        <div>
          { props.title }
        </div>
        <div {...stylex.props(card.description)}>
        { props.description }
        </div>
      </div>
      { 
        button &&
          <ButtonComponent>{button}</ButtonComponent>
      }
    </Card>
  );
}

const Card = styled.div`

  overflow: hidden;

  .card-image{
    width: 100%;
    height: 250px;
    overflow: hidden;

    img{
      width: 100%;
      height: 100%;
      object-fit: cover;

      transition: 0.2s;
    }
  }

  &:hover{
    img{
      transform: scale(1.01);
    }
  }
`

const card = stylex.create({
  default: {
    padding: '1.5rem 2rem',
    borderRadius: '0.2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '1rem',
    border: `1px solid ${theme.borderColor}`,
    borderBottom: `2px solid ${theme.borderColor}`,
    lineHeight: '120%',
    width: '100%',
    height: 'fit-content',
    boxSizing: 'border-box',
    fontWeight: 600,
    background: theme.background,
    cursor: 'pointer'
  },
  description: {
    fontSize: '0.9rem',
    color: theme.secondaryColor,
    fontFamily: theme.primaryFont,
    maxWidth: '40rem',
    fontWeight: 500,
  },
  texts: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
    gap: '0.5rem',
    color: theme.primaryColor
  },
  responsive: {
    height: '100%'
  },
  vertical: {
    gap: '0',
    padding: '0',
    justifyContent: 'flex-start'
  },
  verticalTexts: {
    justifyContent: 'start',
    padding: '1.5rem 1.5rem',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    overflow: 'hidden'
  }
})