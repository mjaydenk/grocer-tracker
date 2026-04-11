export type GroceryItem = {
  id: string
  name: string
  prices: GroceryPrice[]
  tags: GroceyTags[]
}

export type GroceryPrice = {
  marketId: string
  price: number
}

export type GroceryMarket = {
  id: string
  name: string
}

export type GroceyTags = {
  id: string
  name: string
}
