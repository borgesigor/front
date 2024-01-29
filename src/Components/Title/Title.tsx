import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex'
import { theme } from '../../Themes/theme.stylex';

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
      <div {...stylex.props(titleContainer.default)} >
        <span {...stylex.props(titleContainer.title)} >{title}</span>
        { seeMore &&
            <span {...stylex.props(titleContainer.seeMore)} >Ver mais</span>
        }
      </div>
    </>
  );
}

const titleContainer = stylex.create({
  default: {
    fontWeight: 700,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    color: theme.primaryColor
  },
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