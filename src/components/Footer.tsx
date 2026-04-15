import { Link } from "@tanstack/react-router";

export default function Footer() {
  const year = new Date().getFullYear();
  // force deploy
  return (
    <footer className="mt-auto flex max-h-40 shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 overflow-hidden border-t border-[var(--line)] px-4 py-1.5 text-center text-[var(--sea-ink-soft)]">
      <a
        href="https://github.com/mjaydenk/grocer-tracker"
        className="text-xs italic"
      >
        Developed by Jayden Kruger
      </a>
      <p className="page-wrap m-0 max-h-full truncate text-xs leading-tight">
        &copy; {year} Grocery Price Comparer
      </p>
      <div>
        <Link
          to="/about"
          className="text-xs underline-offset-2 hover:text-[var(--sea-ink)] hover:underline"
        >
          About
        </Link>
      </div>
    </footer>
  );
}
