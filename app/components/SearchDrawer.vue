<template>
  <Transition name="fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-30 flex justify-center items-start pt-[10vh] backdrop-blur-sm bg-black/20 dark:bg-black/40"
      @click.self="closeDrawer"
      @keydown="handleKeydown"
    >
      <div
        class="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-lg w-11/12 max-w-lg p-6 relative focus:outline-none shadow-lg border border-gray-200 dark:border-gray-700"
        tabindex="-1"
        ref="drawer"
      >
        <!-- Search Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-search" class="w-5 h-5 text-gray-400" />
            <span class="text-sm text-gray-500">Search content and navigation</span>
          </div>
          
          <!-- Keyboard Shortcuts -->
          <div class="hidden sm:flex items-center gap-2">
            <kbd class="px-2 py-1 text-xs font-semibold bg-gray-100 border rounded-md dark:bg-gray-800 dark:border-gray-700">
              esc
            </kbd>
            <span class="text-xs text-gray-500">to close</span>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery" 
            ref="searchInput"
            class="w-full px-4 py-2 pl-10 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            :placeholder="isSearching ? 'Search content...' : 'Type to search or use shortcuts...'"
            @input="performSearch"
            @keyup="handleKeyup"
          />
          <UIcon 
            :name="isSearching ? 'i-lucide-search' : 'i-lucide-command'" 
            class="absolute left-3 top-3 w-4 h-4 text-gray-400"
          />
        </div>

        <!-- Quick Navigation or Search Results -->
        <ul class="space-y-1 max-h-[60vh] overflow-y-auto">
          <li 
            v-for="(item, index) in filteredItems" 
            :key="index"
            :class="[
              'p-2 rounded-md cursor-pointer flex items-center justify-between',
              currentIndex === index ? 'bg-primary-50 dark:bg-primary-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            ]"
            @click="selectItem(item)"
            @mouseover="currentIndex = index"
          >
            <div class="flex items-center gap-2">
              <UIcon :name="item.icon" class="w-4 h-4 text-gray-500" />
              <span>{{ item.text }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="item.type" 
                :class="[
                  'text-xs px-2 py-1 rounded',
                  item.type === 'blog' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 
                  item.type === 'project' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                ]"
              >
                {{ item.type }}
              </span>
              <kbd v-if="!isSearching && item.shortcut" 
                class="hidden sm:inline-block px-2 py-1 text-xs font-semibold bg-gray-100 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                ⌘{{ item.shortcut }}
              </kbd>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import { useAsyncData } from '#app'
import type { ContentNavigationItem } from '../../types/navigation'
import type { BlogCollectionItem, ProjectCollectionItem, PageCollectionItem } from '../../types/collections'

// Update the search results interface
interface SearchResult {
  title: string
  description: string
  path: string
  type: 'blog' | 'projects' | 'page'
  navigation?: boolean
  badge?: string
  date?: string
}

// Define props
const props = defineProps<{
  isOpen: boolean
}>()

// Define emitted events
const emit = defineEmits<{
  (e: 'close'): void
}>()

const searchQuery = ref('')
const currentIndex = ref(-1)
const isSearching = ref(false)

// Inject navigation items provided by the parent layout
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))

// Define quick navigation items
const quickNavItems = computed(() => navigation.value)

// Fetch all content at once
const { data: allContent } = await useAsyncData('search-content', () => 
  Promise.all([
    queryCollection('blog').all(),
    queryCollection('projects').all(),
    queryCollection('content').all()
  ])
)

// Computed search results
const searchResults = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []

  const query = searchQuery.value.toLowerCase()
  const results: SearchResult[] = []

  if (allContent.value) {
    const [blogPosts, projects, pages] = allContent.value as [
      BlogCollectionItem[],
      ProjectCollectionItem[],
      PageCollectionItem[]
    ]
    
    // Search blog posts
    blogPosts.forEach((post: BlogCollectionItem) => {
      if (post.title?.toLowerCase().includes(query) || 
          post.description?.toLowerCase().includes(query)) {
        results.push({
          title: post.title,
          description: post.description || '',
          path: post.path,
          type: 'blog',
          date: post.date
        })
      }
    })

    // Search projects
    projects.forEach((project: ProjectCollectionItem) => {
      if (project.title?.toLowerCase().includes(query) || 
          project.description?.toLowerCase().includes(query)) {
        results.push({
          title: project.title,
          description: project.description || '',
          path: project.path,
          type: 'projects'
        })
      }
    })

    // Search pages
    pages.forEach((page: PageCollectionItem) => {
      if (page.title?.toLowerCase().includes(query) || 
          page.description?.toLowerCase().includes(query)) {
        results.push({
          title: page.title,
          description: page.description || '',
          path: page.path,
          type: 'page'
        })
      }
    })
  }

  return results.slice(0, 8) // Limit to 8 results
})

// Computed filtered items based on search query
const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return quickNavItems.value.map(item => ({
      text: item.title,
      to: item.path,
      description: item.description || '',
      icon: item.icon || 'i-lucide-file-text',
      type: item.type,
      shortcut: item.shortcut
    }))
  }

  return searchResults.value
    ?.map(item => ({
      text: item.title,
      to: item.path,
      description: item.description,
      icon: getIconForContentType(item.type),
      type: item.type,
      date: item.date
    })) ?? []
})

// Function to get icon based on content type
const getIconForContentType = (type: string): string => {
  switch (type) {
    case 'blog':
      return 'i-lucide-pen-tool'
    case 'projects':
      return 'i-lucide-folder'
    default:
      return 'i-lucide-file-text'
  }
}

// Function to handle item selection
const selectItem = (item: ContentNavigationItem | { to: string; text: string }) => {
  const path = 'to' in item ? item.to : item.path
  navigateTo(path)
  emit('close')
}

// Function to handle search input
const performSearch = () => {
  isSearching.value = searchQuery.value.length >= 2
}

// Function to handle keydown events
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDrawer()
  }
}

// Function to close the drawer
const closeDrawer = () => {
  emit('close')
}

// Function to handle keyup events (e.g., Enter key)
const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (currentIndex.value >= 0 && currentIndex.value < filteredItems.value.length) {
      selectItem(filteredItems.value[currentIndex.value])
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 