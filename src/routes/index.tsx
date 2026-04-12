import { createFileRoute, useRouter } from "@tanstack/react-router";
import { GroceryPricesTable } from "#/components/grocery-prices-table";
import { SettingsDialog } from "#/components/settings-dialog";

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: (search) => {
    return {
      options: search.options === true ? true : undefined,
    };
  },
});

function App() {
  const router = useRouter();
  const { options } = Route.useSearch();

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <GroceryPricesTable className="min-h-0 flex-1" />
      <SettingsDialog
        open={options === true}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            void router.navigate({
              to: "/",
              search: { options: undefined },
            });
          }
        }}
      />
    </main>
  );
}
