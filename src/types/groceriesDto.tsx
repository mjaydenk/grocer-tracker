export interface GroceryItemDto {
  id: string;
  name: string;
  prices: GroceryPriceDto[];
  tags: string[];
}

export interface GroceryPriceDto {
  marketId: string;
  marketName: string;
  price: number;
}
