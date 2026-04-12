import { Settings } from "lucide-react";
import { Button } from "#/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { useRouter } from "@tanstack/react-router";

export default function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-lg">
      <nav className="relative flex min-h-14 items-center justify-between px-4 py-2 sm:min-h-16 sm:px-6">
        <div className="flex shrink-0 justify-start">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Settings"
            className="text-[var(--sea-ink)]"
            onClick={() =>
              router.navigate({ to: "/", search: { options: true } })
            }
          >
            <Settings className="size-5" />
          </Button>
        </div>

        <h1 className="pointer-events-none absolute left-1/2 top-1/2 m-0 max-w-[min(100%-8rem,28rem)] -translate-x-1/2 -translate-y-1/2 truncate text-center text-base font-semibold tracking-tight text-[var(--sea-ink)] sm:text-lg">
          Grocery Price Comparer
        </h1>

        <div className="flex shrink-0 justify-end">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
