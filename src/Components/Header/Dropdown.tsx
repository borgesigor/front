import * as stylex from '@stylexjs/stylex' 
import { theme } from '../../Themes/theme.stylex';
import { IDropdown } from './IDropdown';
import styled from 'styled-components';

export function DropdownComponent(dropdownItems: IDropdown) {

  const dividirEmGrupos = (lista: Array<Object>, tamanhoGrupo: number) => {
    const grupos = [];
    for (let i = 0; i < lista.length; i += tamanhoGrupo) {
      grupos.push(lista.slice(i, i + tamanhoGrupo));
    }
    return grupos;
  };

  const gruposDeItens = dividirEmGrupos(dropdownItems.content.items, 3);

  return ( 
    <>
      <Dropdown>

        {
          dropdownItems.content.card &&

          <>
            <Card>
              <Item>
                <div className='image'>
                  <img src={dropdownItems.content.card.image} alt="" />
                </div>
                <span style={{ marginTop: '0.5rem' }} className='title'>{dropdownItems.content.card.content.title}</span>
                <span className='description'>{dropdownItems.content.card.content.description}</span>
              </Item>
            </Card>

            <Separator/>
          </>

        }

        <ItemContainer>
          {  
            gruposDeItens.map((e, i) => (
              <ItemContainer style={{ flexDirection: 'column', margin: '0' }} key={i} >
                {
                  e.map((e: any, i) => (
                    <a href={e.path} key={i}>
                      <Item>
                        <span className='title'>{e.title}</span>
                        <span className='description'>{e.description}</span>
                      </Item>
                    </a>
                  ))
                }
              </ItemContainer>
            ))
          }
        </ItemContainer>

      </Dropdown>
    </>
  );
}

const Dropdown = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem 4rem 2rem 1rem;
  gap: 2.5rem;
  font-size: 1rem;
  font-weight: 400;
  background: ${props => props.theme.background};
  color: ${props => props.theme.primaryColor};
  font-family: ${props => props.theme.primaryFont};

  width: fit-content;
  position: relative;

  border: 1px solid ${props => props.theme.borderColor};
  border-bottom: 2px solid ${props => props.theme.borderColor};

  @media screen and (max-width: 1100px) {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
  }
`

const Card = styled.div`
  flex: 1;
`

const Separator = styled.div`
  position: relative;
  content: '';
  align-items: stretch;
  width: 1px;
  background: ${props => props.theme.primaryColor};
  opacity: 10%;
  right: 0;
  top: 0;
  box-sizing: border-box;
`

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 2rem;
  padding: 1rem 0rem;
  box-sizing: border-box;
`

const Item = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  height: 100%;
  font-weight: 400;

  gap: 0.5rem;

  .description{
    font-size: 0.9rem;
    opacity: 0.4;
  }

  &:hover{
    .title{
      text-decoration: underline;
    }
  }

  .image{
    aspect-ratio: 1/1;
    max-width: 14rem;
    overflow: hidden;

    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`


