import { createFileRoute } from '@tanstack/react-router'
import { GroceryPricesTable } from '#/components/grocery-prices-table'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6">
      <GroceryPricesTable className="min-h-0 flex-1" />
    </main>
  )
}
