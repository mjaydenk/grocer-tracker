import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-8 sm:py-10">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-4 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Compare grocery prices across supermarkets
        </h1>
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-[var(--sea-ink-soft)]">
          <p className="m-0">
            <strong className="font-semibold text-[var(--sea-ink)]">
              Grocery Price Comparer
            </strong>{' '}
            helps you see how the same groceries are priced at different
            supermarkets, so you can spot better deals and plan your shop with
            clearer numbers.
          </p>
          <p className="m-0">
            Add items you buy often, compare prices from multiple stores in one
            place, and use the app as a lightweight reference when deciding where
            to buy—or what to swap when another chain is cheaper.
          </p>
        </div>
      </section>
    </main>
  )
}
