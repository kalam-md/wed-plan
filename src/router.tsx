import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './routes/index'
import { CategoryPage } from './routes/category'
import { SettingsPage } from './routes/settings'

const rootRoute = createRootRoute({ component: Layout })
const routeTree = rootRoute.addChildren([
  createRoute({ getParentRoute: () => rootRoute, path: '/', component: Dashboard }),
  createRoute({ getParentRoute: () => rootRoute, path: '/kategori/$name', component: CategoryPage }),
  createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: SettingsPage }),
])

export const router = createRouter({ routeTree })
declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
