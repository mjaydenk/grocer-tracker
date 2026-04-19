import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
  ssr: false,
})

function About() {
  return (
    <main className="page-wrap flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-8 sm:py-10">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-4 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Grocery Price Comparer
        </h1>
        <div className="max-w-3xl space-y-6 text-base leading-relaxed text-[var(--sea-ink-soft)]">
          <p className="m-0">
            <strong className="font-semibold text-[var(--sea-ink)]">
              Grocery Price Comparer
            </strong>{' '}
            is a simple tool to record and compare prices for the same groceries
            across different stores. You build your own list of items, attach
            prices per store, and scan the table to see where things cost less.
          </p>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-[var(--sea-ink)]">
              What you can do
            </h2>
            <ul className="m-0 list-disc space-y-2 pl-5">
              <li>Add and edit grocery items (tags are coming soon).</li>
              <li>
                Define the markets (supermarkets or shops) you care about in
                settings.
              </li>
              <li>
                Enter each item&apos;s price at each market and compare them in
                one place.
              </li>
              <li>
                Open settings from the header to manage markets and related
                options while tag support is still coming soon.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-[var(--sea-ink)]">
              Your data stays on this device
            </h2>
            <p className="m-0">
              Nothing is uploaded to a server. Items and markets are stored in
              your browser cache ({' '}
              <strong className="font-semibold text-[var(--sea-ink)]">
                IndexedDB
              </strong>{' '}
              ). There is no sign-in and no sync, and clearing site data for
              this app will remove your list. Exporting is coming soon, so for
              now make sure to back up anything you need to keep.
            </p>
          </div>

          <p className="m-0">
            <Link
              to="/"
              search={{ options: false }}
              className="font-medium text-[var(--lagoon-deep)] underline decoration-[var(--lagoon)] underline-offset-2 transition-colors hover:text-[var(--sea-ink)]"
            >
              Back to the price table
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
