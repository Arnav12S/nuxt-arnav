import { z } from '@nuxt/content'
import type { ParsedContentv2 } from '@nuxt/content'

// Base interfaces for collection items
export interface BaseCollectionItem extends ParsedContentv2 {
  title: string
  description?: string
  path: string
  date?: string
}

export interface BlogCollectionItem extends BaseCollectionItem {
  type: 'blog'
}

export interface ProjectCollectionItem extends BaseCollectionItem {
  type: 'projects'
  links?: string[]
  toc?: {
    items: {
      id: string
      title: string
      level: number
      depth: number
      links: string[]
    }[]
  } | false
}

export interface PageCollectionItem extends BaseCollectionItem {
  type: 'page'
}

// Schema definitions
const contentSchema = z.object({
  title: z.string(),
  description: z.string()
})

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.array(z.object({
    name: z.string(),
    picture: z.string()
  })),
  date: z.string(),
  tags: z.array(z.string()),
  rawbody: z.string(),
  toc: z.object({
    items: z.array(z.object({
      id: z.string(),
      title: z.string(),
      level: z.number(),
      depth: z.number()
    }))
  }).optional()
})

const projectsSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  rawbody: z.string(),
  links: z.array(z.string()).optional()
})

// Collection type definitions
export type Collections = {
  blog: BlogCollectionItem[]
  projects: ProjectCollectionItem[]
  content: PageCollectionItem[]
}

// Schema collections type
export type SchemaCollections = {
  content: Zod.infer<typeof contentSchema>
  blog: Zod.infer<typeof blogSchema>
  projects: Zod.infer<typeof projectsSchema>
}