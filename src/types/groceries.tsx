export type GroceryItem = {
  id: string
  name: string
  prices: GroceryPrice[]
  tags: GroceryTag[]
}

export type GroceryPrice = {
  marketId: string
  price: number
}

export type GroceryMarket = {
  id: string
  name: string
}

export type GroceryTag = {
  id: string
  name: string
}
