<script setup lang="ts">
import type { NuxtError } from '#app'
import type { ParsedContentv2 } from '@nuxt/content'
import type { ContentNavigationItem } from '../content/types/navigation'

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

const { data: navigation } = await useAsyncData<ContentNavigationItem[]>('navigation', () => 
  queryCollectionNavigation('content', ['description'])
    .where('navigation', '<>', false)
    .order('title', 'ASC')
, { 
  default: () => [], 
  immediate: true 
})

const { data: files } = useLazyFetch<ParsedContentv2[]>('/api/search.json', { 
  default: () => [], 
  server: false 
})

provide('navigation', navigation)
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer>
        <UPage>
          <UPageError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>

    <UNotifications />
  </div>
</template>
