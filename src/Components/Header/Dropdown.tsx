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
      <Dropdown {...stylex.props(dropdown.default)} >

        {
          dropdownItems.content.card &&

            <div {...stylex.props(card.default)} >

              <img {...stylex.props(card.image)} src={dropdownItems.content.card.image} alt="" />

              <a href={dropdownItems.content.card.content.path}>
                <div {...stylex.props(item.default)} >
                  <span className='title'>{dropdownItems.content.card.content.title}</span>
                  <span {...stylex.props(item.description)} >{dropdownItems.content.card.content.description}</span>
                </div>
              </a>

            </div>

        }

        <div {...stylex.props(container.row)} >

          {  

            gruposDeItens.map((e, i) => (
              <div key={i} {...stylex.props(container.column)} >
                {
                  e.map((e: any, i) => (
                    <a href={e.path} key={i}>
                      <div {...stylex.props(item.default)} >
                        <span className='title'>{e.title}</span>
                        <span {...stylex.props(item.description)} >{e.description}</span>
                      </div>
                    </a>
                  ))
                }
              </div>
            ))
          
          }

        </div>

      </Dropdown>
    </>
  );
}

const Dropdown = styled.div`
  display: flex;
  padding: 1rem 2rem 2rem 1rem;
  gap: 2.5rem;
  width: fit-content;
  text-align: left;
  font-size: 1rem;
  font-weight: 400;

  @media screen and (max-width: 1100px) {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
  }
`


