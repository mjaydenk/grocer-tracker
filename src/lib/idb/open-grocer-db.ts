import { openDB } from 'idb'
import {
  GROCER_DB_NAME,
  GROCER_DB_VERSION,
  GROCERY_ITEMS_STORE,
  GROCERY_MARKETS_STORE,
  GROCERY_TAGS_STORE

} from '#/lib/idb/grocer-schema'
import type { IDBPDatabase } from 'idb'
import type { GrocerDBSchema } from '#/lib/idb/grocer-schema';

let dbPromise: Promise<IDBPDatabase<GrocerDBSchema>> | undefined

/**
 * Opens the grocery IndexedDB. Server-side calls are unsupported (no `indexedDB`).
 */
export function openGrocerDB(): Promise<IDBPDatabase<GrocerDBSchema>> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(
      new Error('openGrocerDB is only available in the browser'),
    )
  }
  if (!dbPromise) {
    dbPromise = openDB<GrocerDBSchema>(GROCER_DB_NAME, GROCER_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(GROCERY_ITEMS_STORE)) {
          db.createObjectStore(GROCERY_ITEMS_STORE, { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains(GROCERY_MARKETS_STORE)) {
          db.createObjectStore(GROCERY_MARKETS_STORE, { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains(GROCERY_TAGS_STORE)) {
          db.createObjectStore(GROCERY_TAGS_STORE, { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}
