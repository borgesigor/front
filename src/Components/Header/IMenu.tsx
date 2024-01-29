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
        image: 'https://images.pexels.com/photos/19809164/pexels-photo-19809164/free-photo-of-arte-modelo-de-moda-modelo-de-beleza-preto.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
        content: {
          title: 'Pastoral da Caridade',
          description: 'teste',
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
        }
      ]
    }
  }
]