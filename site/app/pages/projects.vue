<script setup lang="ts">
import type { ContentNavigationItem } from '~/types/navigation'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))

const links = computed(() => navigation.value.find(item => item.path === '/projects')?.children ?? [])
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UAside>
          <UNavigationTree :links="mapContentNavigation(links)" />
        </UAside>
      </template>

      <NuxtPage />
    </UPage>
  </UContainer>
</template>
