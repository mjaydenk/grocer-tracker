import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import {
  groceryMarkets,
  groceryTableQueryKey,
  groceryTags,
} from '#/lib/idb/grocery-crud'
import { cn } from '#/lib/utils'
import type { GroceryMarket, GroceryTag } from '#/types/groceries'

function sortByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name))
}

function ComingSoonEditButton() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <span className="inline-flex" tabIndex={0}>
          <Button type="button" variant="outline" size="icon-sm" disabled>
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>coming soon</TooltipContent>
    </Tooltip>
  )
}

function SupermarketPanel({
  markets,
  onRefresh,
}: {
  markets: GroceryMarket[]
  onRefresh: () => Promise<void>
}) {
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: { name: '' },
    onSubmit: async ({ value }) => {
      const name = value.name.trim()
      if (!name) return
      await groceryMarkets.put({ id: crypto.randomUUID(), name })
      await queryClient.invalidateQueries({ queryKey: groceryTableQueryKey })
      form.reset()
      await onRefresh()
    },
  })

  // test sync change

  return (
    <div className="flex flex-col gap-6">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <FieldGroup className="gap-4">
          <form.Field
            name="name"
            validators={{
              onSubmit: ({ value }) =>
                value.trim() ? undefined : 'Name is required',
            }}
            children={(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="off"
                />
                <FieldError>
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : null}
                </FieldError>
              </Field>
            )}
          />
        </FieldGroup>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Adding…' : 'Add supermarket'}
            </Button>
          )}
        />
      </form>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Supermarkets
        </p>
        <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
          {markets.length === 0 ? (
            <li className="text-muted-foreground text-sm">None yet.</li>
          ) : (
            markets.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-muted/30 px-3 py-2"
              >
                <span className="min-w-0 truncate font-medium">{m.name}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <ComingSoonEditButton />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={async () => {
                      await groceryMarkets.delete(m.id)
                      await onRefresh()
                    }}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Delete {m.name}</span>
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

function TagsPanel({
  tags,
  onRefresh,
}: {
  tags: GroceryTag[]
  onRefresh: () => Promise<void>
}) {
  const form = useForm({
    defaultValues: { name: '' },
    onSubmit: async ({ value }) => {
      const name = value.name.trim()
      if (!name) return
      await groceryTags.put({ id: crypto.randomUUID(), name })
      form.reset()
      await onRefresh()
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <FieldGroup className="gap-4">
          <form.Field
            name="name"
            validators={{
              onSubmit: ({ value }) =>
                value.trim() ? undefined : 'Name is required',
            }}
            children={(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={`tag-${field.name}`}>Name</FieldLabel>
                <Input
                  id={`tag-${field.name}`}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="off"
                />
                <FieldError>
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : null}
                </FieldError>
              </Field>
            )}
          />
        </FieldGroup>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Adding…' : 'Add tag'}
            </Button>
          )}
        />
      </form>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Tags
        </p>
        <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
          {tags.length === 0 ? (
            <li className="text-muted-foreground text-sm">None yet.</li>
          ) : (
            tags.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-muted/30 px-3 py-2"
              >
                <span className="min-w-0 truncate font-medium">{t.name}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <ComingSoonEditButton />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={async () => {
                      await groceryTags.delete(t.id)
                      await onRefresh()
                    }}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Delete {t.name}</span>
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

export function SettingsDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
}) {
  const [markets, setMarkets] = useState<GroceryMarket[]>([])
  const [tags, setTags] = useState<GroceryTag[]>([])

  const refreshMarkets = useCallback(async () => {
    const list = await groceryMarkets.list()
    setMarkets(sortByName(list))
  }, [])

  const refreshTags = useCallback(async () => {
    const list = await groceryTags.list()
    setTags(sortByName(list))
  }, [])

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshMarkets(), refreshTags()])
  }, [refreshMarkets, refreshTags])

  useEffect(() => {
    if (open) void refreshAll()
  }, [open, refreshAll])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children != null ? <DialogTrigger>{children}</DialogTrigger> : null}
      <DialogContent
        showCloseButton
        className={cn(
          'flex max-h-[min(90vh,40rem)] flex-col gap-0 sm:max-w-2xl',
        )}
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage supermarkets and tags used for your grocery list.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="supermarket"
          orientation="vertical"
          className="mt-2 flex min-h-0 w-full flex-1 flex-row gap-4"
        >
          <TabsList className="h-fit w-40 shrink-0 flex-col">
            <TabsTrigger value="supermarket">Supermarket</TabsTrigger>
            <Tooltip>
              <TooltipTrigger>
                <TabsTrigger value="tags" disabled>
                  Tags - coming soon
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>coming soon</TooltipContent>
            </Tooltip>
          </TabsList>
          <TabsContent
            value="supermarket"
            className="mt-0 min-h-0 flex-1 overflow-y-auto outline-none"
          >
            <SupermarketPanel markets={markets} onRefresh={refreshMarkets} />
          </TabsContent>
          <TabsContent
            value="tags"
            className="mt-0 min-h-0 flex-1 overflow-y-auto outline-none"
          >
            <TagsPanel tags={tags} onRefresh={refreshTags} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
