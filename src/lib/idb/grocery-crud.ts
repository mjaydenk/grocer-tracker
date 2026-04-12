import { openGrocerDB } from '#/lib/idb/open-grocer-db'
import {
  GROCERY_ITEMS_STORE,
  GROCERY_MARKETS_STORE,
  GROCERY_TAGS_STORE,
} from '#/lib/idb/grocer-schema'
import type {
  GroceryItem,
  GroceryMarket,
  GroceryTag,
} from '#/types/groceries'
import type { GroceryItemDto } from '#/types/groceriesDto'

export const groceryTableQueryKey = ['grocery-table'] as const

function mapToGroceryItemDtos(
  items: GroceryItem[],
  markets: GroceryMarket[],
): GroceryItemDto[] {
  const marketNameById = new Map(markets.map((m) => [m.id, m.name]))
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    prices: item.prices.map((p) => ({
      marketId: p.marketId,
      marketName: marketNameById.get(p.marketId) ?? 'Unknown',
      price: p.price,
    })),
    tags: item.tags.map((t) => t.name),
  }))
}

/**
 * Loads grocery items as DTOs (with market names) and all markets in one DB round trip.
 */
export async function getGroceryTableData(): Promise<{
  items: GroceryItemDto[]
  markets: GroceryMarket[]
}> {
  const db = await openGrocerDB()
  const [rawItems, markets] = await Promise.all([
    db.getAll(GROCERY_ITEMS_STORE),
    db.getAll(GROCERY_MARKETS_STORE),
  ])
  return {
    items: mapToGroceryItemDtos(rawItems, markets),
    markets,
  }
}

export const groceryItems = {
  async list(): Promise<GroceryItem[]> {
    const db = await openGrocerDB()
    return db.getAll(GROCERY_ITEMS_STORE)
  },

  async listDto(): Promise<GroceryItemDto[]> {
    const { items } = await getGroceryTableData()
    return items
  },

  async get(id: string): Promise<GroceryItem | undefined> {
    const db = await openGrocerDB()
    return db.get(GROCERY_ITEMS_STORE, id)
  },

  async put(item: GroceryItem): Promise<void> {
    const db = await openGrocerDB()
    await db.put(GROCERY_ITEMS_STORE, item)
  },

  async delete(id: string): Promise<void> {
    const db = await openGrocerDB()
    await db.delete(GROCERY_ITEMS_STORE, id)
  },
}

export const groceryMarkets = {
  async list(): Promise<GroceryMarket[]> {
    const db = await openGrocerDB()
    return db.getAll(GROCERY_MARKETS_STORE)
  },

  async get(id: string): Promise<GroceryMarket | undefined> {
    const db = await openGrocerDB()
    return db.get(GROCERY_MARKETS_STORE, id)
  },

  async put(market: GroceryMarket): Promise<void> {
    const db = await openGrocerDB()
    await db.put(GROCERY_MARKETS_STORE, market)
  },

  async delete(id: string): Promise<void> {
    const db = await openGrocerDB()
    await db.delete(GROCERY_MARKETS_STORE, id)
  },
}

export const groceryTags = {
  async list(): Promise<GroceryTag[]> {
    const db = await openGrocerDB()
    return db.getAll(GROCERY_TAGS_STORE)
  },

  async get(id: string): Promise<GroceryTag | undefined> {
    const db = await openGrocerDB()
    return db.get(GROCERY_TAGS_STORE, id)
  },

  async put(tag: GroceryTag): Promise<void> {
    const db = await openGrocerDB()
    await db.put(GROCERY_TAGS_STORE, tag)
  },

  async delete(id: string): Promise<void> {
    const db = await openGrocerDB()
    await db.delete(GROCERY_TAGS_STORE, id)
  },
}
