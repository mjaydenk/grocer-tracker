import type { DBSchema } from 'idb'
import type {
  GroceryItem,
  GroceryMarket,
  GroceryTag,
} from '#/types/groceries'

export const GROCER_DB_NAME = 'grocer-tracker'
export const GROCER_DB_VERSION = 1

export const GROCERY_ITEMS_STORE = 'groceryItems'
export const GROCERY_MARKETS_STORE = 'groceryMarkets'
export const GROCERY_TAGS_STORE = 'groceryTags'

export interface GrocerDBSchema extends DBSchema {
  [GROCERY_ITEMS_STORE]: {
    key: string
    value: GroceryItem
  }
  [GROCERY_MARKETS_STORE]: {
    key: string
    value: GroceryMarket
  }
  [GROCERY_TAGS_STORE]: {
    key: string
    value: GroceryTag
  }
}
