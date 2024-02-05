import { IDropdown, IMenuElement } from './IMenu';
import styled from 'styled-components';

interface Props{
  menu: IMenuElement
}

export function DropdownComponent(props: Props) {

  const dropdown = props.menu.dropdown as IDropdown

  const dividirEmGrupos = (lista: Array<Object>, tamanhoGrupo: number) => {
    const grupos = [];
    for (let i = 0; i < lista.length; i += tamanhoGrupo) {
      grupos.push(lista.slice(i, i + tamanhoGrupo));
    }
    return grupos;
  };

  const gruposDeItens = dividirEmGrupos(dropdown.items, 3);

  return ( 
    <>
      <Dropdown>

        {
          dropdown.cards &&
            <CardsContainer>

              {
                dropdown.cards.map((elem, index)=>
                  <Card key={index} $backgroundImage={elem.image} href={elem.path} >
                    <Item className='card-item' >
                      { elem.icon && <ItemIcon className="material-symbols-rounded item-icon">{elem.icon}</ItemIcon> }
                      <ItemInfos>
                        <ItemTitle className='item-title' >{elem.title}</ItemTitle>
                        { elem.description &&  <ItemDescription>{elem.description}</ItemDescription> }
                      </ItemInfos>
                    </Item>

                  </Card>
                )
              }

            </CardsContainer>
        }

        <ItemsContainer $itemsQuantity={dropdown.items.length} >

          {
            dropdown.items.map((elem, index)=>
              <Item key={index} href={elem.path} $inverted >
                { elem.icon && <ItemIcon className="material-symbols-rounded item-icon">{elem.icon}</ItemIcon> }
                <ItemInfos>
                  <ItemTitle className='item-title' >{elem.title}</ItemTitle>
                  { elem.description &&  <ItemDescription>{elem.description}</ItemDescription> }
                </ItemInfos>
              </Item>
            )
          }

        </ItemsContainer>

      </Dropdown>
    </>
  );
}

const Dropdown = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100vh;
  background: ${props => props.theme.background};

  max-width: ${props => props.theme.headerWidth};
  margin: 0 auto;

  /* box-shadow: 0px 1px 1px rgba(3, 7, 18, 0.08),
  0px 5px 4px rgba(3, 7, 18, 0.06),
  0px 12px 9px rgba(3, 7, 18, 0.05),
  0px 20px 15px rgba(3, 7, 18, 0.03),
  0px 32px 24px rgba(3, 7, 18, 0.02); */


  display: flex;
  gap: 2rem;

  left: 0px;
  z-index: 100;

  @media screen and (max-width: 1100px) {
    display: none;
  }
`

const CardsContainer = styled.div`
  flex: 1;
  display: flex;
  gap: 2rem;
`

const Card = styled.a<{ $backgroundImage?: string }>`
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 300px;

  background-image: url(${props => props.$backgroundImage});
  background-size: 100%;
  background-position: center;
  display: flex;
  align-items: end;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  cursor: pointer;

  transition: background-size 0.2s ease-in-out;

  &::after{
    background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    width: 100%;
    height: 100%;
    content: '';
    top: 0;
    left: 0;
    position: absolute;
    z-index: 0;
    opacity: 0.7;
    transition: 0.5s;
    transition-property: opacity;
  }

  border: 1px solid white;

  &:hover{
    background-size: 102%;
    
    border: 1px solid black;
    
    .item-title{
      text-decoration: underline;
    }

    &::after{
      opacity: 1;
    }
  }
`

const ItemsContainer = styled.div<{ $itemsQuantity: number }>`

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: ${props => 
    (props.$itemsQuantity <= 4 && 'repeat(1, 1fr)') ||
    (props.$itemsQuantity > 4 && 'repeat(2, 1fr)') ||
    (props.$itemsQuantity > 8 && 'repeat(3, 1fr)')
  };
  grid-auto-flow: column;
  gap: 2rem;
`

const Item = styled.a<{ $inverted?: boolean }>`
  display: flex;
  gap: 1rem;
  cursor: pointer;
  position: relative;
  z-index: 1;

  color: ${props => props.$inverted ? props.theme.primaryColor : props.theme.background };

  .item-icon{
    background: ${props => props.$inverted ? props.theme.primaryColor : props.theme.background };
    color: ${props => props.$inverted ? props.theme.background : props.theme.primaryColor };
  }

  &:hover{
    .item-title{
      text-decoration: underline;
    }
  }
`

const ItemIcon = styled.div`
  height: 3rem;
  width: 3rem;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  position: relative;
  top: 50%;
  transform: translateY(-50%);
`

const ItemInfos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.4rem;
`

const ItemTitle = styled.div`
  font-size: 1rem;
`

const ItemDescription = styled.div`
  font-weight: 300;
  font-size: 0.9rem;
  opacity: 0.8;
`