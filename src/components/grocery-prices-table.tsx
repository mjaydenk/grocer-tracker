import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "#/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import {
  getGroceryTableData,
  groceryItems,
  groceryTableQueryKey,
} from "#/lib/idb/grocery-crud";
import { cn } from "#/lib/utils";
import type { GroceryMarket, GroceryPrice } from "#/types/groceries";
import type { GroceryItemDto } from "#/types/groceriesDto";
import type { ColumnDef } from "@tanstack/react-table";

function parsePriceInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = Number.parseFloat(trimmed.replace(",", "."));
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

function AddGroceryItemForm({
  markets,
  disabled,
}: {
  markets: GroceryMarket[];
  disabled: boolean;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    const trimmed = name.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      const prices: GroceryPrice[] = [];
      for (const m of markets) {
        const parsed = parsePriceInput(priceInputs[m.id] ?? "");
        if (parsed !== null) {
          prices.push({ marketId: m.id, price: parsed });
        }
      }

      await groceryItems.put({
        id: crypto.randomUUID(),
        name: trimmed,
        prices,
        tags: [],
      });
      await queryClient.invalidateQueries({ queryKey: groceryTableQueryKey });
      setName("");
      setPriceInputs({});
    } finally {
      setSubmitting(false);
    }
  }

  if (disabled) {
    return (
      <div className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
        Add supermarkets in settings to enter prices per store.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
      className="flex flex-col gap-3 rounded-lg border border-border/80 bg-muted/15 p-3 sm:p-4"
    >
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        Add item
      </p>
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <FieldGroup className="min-w-48 flex-1 gap-2">
          <Field>
            <FieldLabel htmlFor="new-grocery-name">Product</FieldLabel>
            <Input
              id="new-grocery-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              autoComplete="off"
              disabled={submitting}
            />
          </Field>
        </FieldGroup>
        {markets.map((m) => (
          <FieldGroup
            key={m.id}
            className="w-full min-w-26 max-w-40 gap-2 sm:w-auto"
          >
            <Field>
              <FieldLabel htmlFor={`price-${m.id}`} className="truncate">
                {m.name}
              </FieldLabel>
              <Input
                id={`price-${m.id}`}
                name={`price-${m.id}`}
                value={priceInputs[m.id] ?? ""}
                onChange={(e) =>
                  setPriceInputs((prev) => ({
                    ...prev,
                    [m.id]: e.target.value,
                  }))
                }
                placeholder="0.00"
                inputMode="decimal"
                autoComplete="off"
                disabled={submitting}
              />
            </Field>
          </FieldGroup>
        ))}
        <Button
          type="submit"
          className="w-full shrink-0 sm:w-auto"
          disabled={!name.trim() || submitting}
        >
          {submitting ? "Saving…" : "Add"}
        </Button>
      </div>
    </form>
  );
}

export type GroceryPriceRow = {
  id: string;
  name: string;
  /** Price per supermarket column, keyed by `GroceryMarket.id` */
  marketPrices: Record<string, number | undefined>;
};

function buildRows(
  items: GroceryItemDto[],
  markets: GroceryMarket[],
): GroceryPriceRow[] {
  return items.map((dto) => {
    const priceByMarketId = new Map(
      dto.prices.map((p) => [p.marketId, p.price] as const),
    );
    const marketPrices: Record<string, number | undefined> = {};
    for (const m of markets) {
      const price = priceByMarketId.get(m.id);
      if (price !== undefined) {
        marketPrices[m.id] = price;
      }
    }
    return {
      id: dto.id,
      name: dto.name,
      marketPrices,
    };
  });
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function GroceryPricesTable({ className }: { className?: string }) {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery({
    queryKey: groceryTableQueryKey,
    queryFn: getGroceryTableData,
    enabled: typeof window !== "undefined",
  });

  const markets = data?.markets ?? [];
  const rows = useMemo(
    () => (data ? buildRows(data.items, data.markets) : []),
    [data],
  );

  const columns = useMemo<ColumnDef<GroceryPriceRow>[]>(() => {
    const productColumn: ColumnDef<GroceryPriceRow> = {
      id: "name",
      accessorKey: "name",
      header: "Product",
    };

    const editColumn: ColumnDef<GroceryPriceRow> = {
      id: "edit",
      header: () => <span className="sr-only">Edit</span>,
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label={`Edit ${row.original.name}`}
          onClick={() => {
            /* edit flow coming soon */
          }}
        >
          <Pencil className="size-4" />
        </Button>
      ),
    };

    const marketColumns: ColumnDef<GroceryPriceRow>[] = markets.map((m) => ({
      id: m.id,
      accessorFn: (row) => row.marketPrices[m.id],
      header: m.name,
      cell: ({ getValue }) => {
        const value = getValue<number | undefined>();
        return value != null ? formatPrice(value) : "—";
      },
    }));

    const deleteColumn: ColumnDef<GroceryPriceRow> = {
      id: "delete",
      header: () => <span className="sr-only">Delete</span>,
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive"
          aria-label={`Delete ${row.original.name}`}
          onClick={() => {
            void (async () => {
              await groceryItems.delete(row.original.id);
              await queryClient.invalidateQueries({
                queryKey: groceryTableQueryKey,
              });
            })();
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      ),
    };

    return [productColumn, editColumn, ...marketColumns, deleteColumn];
  }, [markets, queryClient]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const colSpan = columns.length || 1;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-hidden",
        className,
      )}
    >
      <AddGroceryItemForm markets={markets} disabled={isPending || isError} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div className="min-h-0 flex-1 overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell
                    colSpan={colSpan}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={colSpan}
                    className="h-24 text-center text-destructive"
                  >
                    {error instanceof Error ? error.message : "Failed to load"}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={colSpan}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No data yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
