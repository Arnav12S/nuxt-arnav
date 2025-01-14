<script setup lang="ts">
import type { ParsedContentv2 } from '@nuxt/content'
import type { ContentNavigationItem } from '../../types/navigation'

const { data: navigation } = await useAsyncData<ContentNavigationItem[]>('navigation', () => 
  queryCollectionNavigation('content', ['description', 'badge'])
    .where('navigation', '<>', false)
    .order('title', 'ASC')
, { 
  default: () => [] 
})

const { data: files } = useLazyFetch<ParsedContentv2[]>('/api/search.json', { 
  default: () => [], 
  server: false 
})

provide('navigation', navigation)
</script>

<template>
  <div>
    <UMain>
      <slot />
    </UMain>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </div>
</template>
