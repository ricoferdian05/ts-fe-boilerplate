import type { HorizontalNavItems } from '@layouts/types'

export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Create link',
    to: { name: 'create-link' },
    icon: { icon: 'tabler-file' },
  },
] as HorizontalNavItems
