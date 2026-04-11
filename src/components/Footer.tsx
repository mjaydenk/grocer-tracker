export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto flex max-h-40 shrink-0 items-center justify-center overflow-hidden border-t border-[var(--line)] px-4 py-1.5 text-center text-[var(--sea-ink-soft)]">
      <p className="page-wrap m-0 max-h-full truncate text-xs leading-tight">
        &copy; {year} Grocery Price Comparer
      </p>
    </footer>
  )
}
