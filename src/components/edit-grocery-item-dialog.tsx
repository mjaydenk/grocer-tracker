import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { groceryItems, groceryTableQueryKey } from '#/lib/idb/grocery-crud'
import {
  blockNegativePriceKeyDown,
  parseGroceryPriceField,
} from '#/lib/parse-grocery-price'
import { cn } from '#/lib/utils'
import type { GroceryItem, GroceryMarket, GroceryPrice } from '#/types/groceries'

type EditGroceryItemDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemId: string | null
  markets: GroceryMarket[]
}

export function EditGroceryItemDialog({
  open,
  onOpenChange,
  itemId,
  markets,
}: EditGroceryItemDialogProps) {
  const queryClient = useQueryClient()
  const [loadedItem, setLoadedItem] = useState<GroceryItem | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({})
  const [priceError, setPriceError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open || !itemId) {
      setLoadedItem(null)
      setLoadError(null)
      setName('')
      setPriceInputs({})
      setPriceError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setLoadError(null)
    setLoadedItem(null)

    void groceryItems.get(itemId).then((item) => {
      if (cancelled) return
      setLoading(false)
      if (!item) {
        setLoadError('This item could not be found.')
        return
      }
      setLoadedItem(item)
      setName(item.name)
      const inputs: Record<string, string> = {}
      const byMarket = new Map(
        item.prices.map((p) => [p.marketId, p.price] as const),
      )
      for (const m of markets) {
        const p = byMarket.get(m.id)
        inputs[m.id] = p !== undefined ? String(p) : ''
      }
      setPriceInputs(inputs)
    })

    return () => {
      cancelled = true
    }
  }, [open, itemId, markets])

  async function handleSubmit() {
    if (!loadedItem || submitting) return
    const trimmed = name.trim()
    if (!trimmed) return

    setPriceError(null)
    const prices: GroceryPrice[] = []
    for (const m of markets) {
      const r = parseGroceryPriceField(priceInputs[m.id] ?? '')
      if (r.kind === 'invalid') {
        setPriceError(r.message)
        return
      }
      if (r.kind === 'valid') {
        prices.push({ marketId: m.id, price: r.value })
      }
    }

    setSubmitting(true)
    try {
      await groceryItems.put({
        id: loadedItem.id,
        name: trimmed,
        prices,
        tags: loadedItem.tags,
      })
      await queryClient.invalidateQueries({ queryKey: groceryTableQueryKey })
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          'flex max-h-[min(90vh,36rem)] flex-col gap-0 overflow-hidden sm:max-w-2xl',
        )}
      >
        <DialogHeader>
          <DialogTitle>Edit item</DialogTitle>
          <DialogDescription>
            Update the product name and prices at each supermarket.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {loading ? (
            <p className="text-muted-foreground text-sm py-2">Loading…</p>
          ) : loadError ? (
            <p className="text-destructive text-sm py-2">{loadError}</p>
          ) : loadedItem ? (
            <form
              id="edit-grocery-item-form"
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                void handleSubmit()
              }}
            >
              {priceError ? (
                <p className="text-destructive text-sm" role="alert">
                  {priceError}
                </p>
              ) : null}
              <FieldGroup className="gap-3">
                <Field>
                  <FieldLabel htmlFor="edit-grocery-name">Product</FieldLabel>
                  <Input
                    id="edit-grocery-name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="off"
                    disabled={submitting}
                  />
                </Field>
              </FieldGroup>

              {markets.length > 0 ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {markets.map((m) => (
                    <FieldGroup
                      key={m.id}
                      className="w-full min-w-26 max-w-40 flex-1 gap-2 sm:w-auto"
                    >
                      <Field>
                        <FieldLabel
                          htmlFor={`edit-price-${m.id}`}
                          className="truncate"
                        >
                          {m.name}
                        </FieldLabel>
                        <Input
                          id={`edit-price-${m.id}`}
                          name={`price-${m.id}`}
                          value={priceInputs[m.id] ?? ''}
                          onChange={(e) => {
                            setPriceError(null)
                            setPriceInputs((prev) => ({
                              ...prev,
                              [m.id]: e.target.value,
                            }))
                          }}
                          onKeyDown={blockNegativePriceKeyDown}
                          placeholder="0.00"
                          inputMode="decimal"
                          autoComplete="off"
                          disabled={submitting}
                        />
                      </Field>
                    </FieldGroup>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No supermarkets configured. Add some in settings to set prices
                  per store.
                </p>
              )}
            </form>
          ) : null}
        </div>

        {!loading && !loadError && loadedItem ? (
          <DialogFooter className="mt-4 shrink-0 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-grocery-item-form"
              disabled={!name.trim() || submitting}
            >
              {submitting ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
