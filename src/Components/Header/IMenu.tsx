import { IDropdownItems } from "./IDropdown"

export interface IMenuElement{
  menu: string,
  path: string,
  dropdown?: IDropdownItems
}

export const MenuArray: Array<IMenuElement> = [
  {
    menu: 'Inicio',
    path: '/',
  },
  {
    menu: 'Pastorais',
    path: '/',
    dropdown: {
      card: {
        image: 'https://images.pexels.com/photos/6646946/pexels-photo-6646946.jpeg?auto=compress&cs=tinysrgb&w=600',
        content: {
          title: 'Pastoral da Caridade',
          description: 'Amor que transforma',
          path: '/'
        }
      },
      items: [
        {
          title: 'Pastoral da Caridade',
          description: 'teste',
          path: '/'
        },
        {
          title: 'Pastoral da Caridade',
          description: 'teste',
          path: '/'
        },
        {
          title: 'Pastoral da Caridade',
          description: 'teste',
          path: '/'
        }
      ]
    }
  }
]