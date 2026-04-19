import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import { TooltipProvider } from '#/components/ui/tooltip'
import { Toaster } from 'sonner'
import Header from '#/components/Header'
import Footer from '#/components/Footer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const queryClient = new QueryClient()
  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <div className="flex min-h-screen flex-col">
          <Header />
          <Outlet />
          <Footer />
        </div>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </QueryClientProvider>
    </TooltipProvider>
  )
}
