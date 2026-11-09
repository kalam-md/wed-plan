export interface Item {
  id: string
  item: string
  terpenuhi: boolean
  harga: number
}
export interface Category {
  name: string
  items: Item[]
}
