import { CardComponent } from "../Card/Card"

interface Items{
  image?: string,
  icon?: string,
  title: string,
  description?: string,
  path: string
}

export interface IDropdown{
  items: Array<Items>
  cards?: Array<Items>
}

export interface IMenuElement{
  menu: string,
  path: string,
  dropdown?: IDropdown
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
      cards: [
        {
          title: 'Faça parte de uma pastoral',
          path: '',
          image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=600',
        },
        {
          title: 'Precisamos de doações',
          path: '',
          image: 'https://i.gifer.com/893b.gif',
        }
      ],
      items: [
        {
          path: '',
          title: 'Pastoral da Comunicação',
          description: 'Comunicando a fé com amor!',
          icon: 'church'
        },
        {
          path: '',
          title: 'Pascom',
          description: 'Isso aí',
          icon: 'church'
        },
        {
          path: '',
          title: 'Pascom',
          description: 'Isso aí',
          icon: 'church'
        },
        {
          path: '',
          title: 'Pascom',
          description: 'Isso aí',
          icon: 'church'
        }
      ]
    }
  }
]