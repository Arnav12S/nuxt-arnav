<script setup lang="ts">
import { defineOgImageComponent } from '~/composables/defineOgImageComponent'
import { findPageHeadline } from '../../utils/page'

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => 
  queryCollection('projects')
    .where('path', '=', route.params.slug)
    .first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => 
  queryCollectionItemSurroundings(
    'projects',
    route.params.slug as string,
    {
      fields: ['title', 'description', 'path']
    }
  )
, { default: () => [] })

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})

defineOgImageComponent('Saas')

const headline = computed(() => findPageHeadline(page.value!))
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :headline="headline"
    />

    <UPageBody prose>
      <ContentRenderer
        v-if="page.body"
        :value="page"
      />

      <hr v-if="surround?.length">

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page.toc !== false"
      #right
    >
      <UContentToc :links="page.body?.toc?.links" />
    </template>
  </UPage>
</template>
