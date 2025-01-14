import type { Collections } from './collections'

export interface ContentNavigationItem {
  title: string
  path: string
  children?: ContentNavigationItem[]
  description?: string
  badge?: string
  icon?: string
  shortcut?: string
  type?: 'blog' | 'projects' | 'page'
}

export type PageCollections = {
  [K in keyof Collections]: Collections[K] & {
    navigation?: boolean | {
      title: string
      description: string
      icon: string
    }
  }
} 