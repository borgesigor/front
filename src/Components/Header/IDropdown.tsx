interface Items{
  title : string,
  description: string,
  path: string
}

export interface IDropdownItems{
  card: {
    image: string,
    content: Items
  },
  items: Array<Items>
}

export interface IDropdown{
  content: IDropdownItems
}