import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
// TODO: SUGGESTIONS TAMBÉM ENVIAR UM ITEM "TODOS OS SERVIÇOS"
const PAGE_SIZE = 9

export function useServices() {
  const searchQuery = ref('')
  const debouncedSearch = ref('')
  const selectedCategory = ref('todos')
  const visibleCount = ref(PAGE_SIZE)

  // Scroll infinito acrescenta à lista; categoria/busca a substituem. Só no
  // primeiro caso a UI preserva os cards atuais — no segundo eles não batem
  // mais com o filtro.
  const isAppending = ref(false)

  const _updateSearch = useDebounceFn((val: string) => {
    debouncedSearch.value = val
  }, 300)

  watch(searchQuery, (newVal) => {
    _updateSearch(newVal)
    visibleCount.value = PAGE_SIZE
    isAppending.value = false
  })

  const { data, pending } = useFetch('/api/servicos', {
    query: computed(() => ({
      limit: visibleCount.value,
      category: selectedCategory.value === 'todos' ? undefined : selectedCategory.value,
      search: debouncedSearch.value || undefined,
    })),
  })

  watch(pending, (isPending) => {
    if (!isPending) isAppending.value = false
  })

  const visibleServices = computed(() => data.value?.data || [])
  const totalServices = computed(() => data.value?.meta?.total || 0)

  const setCategory = (slug: string) => {
    selectedCategory.value = slug
    visibleCount.value = PAGE_SIZE
    isAppending.value = false
  }

  const loadMore = () => {
    if (visibleCount.value < totalServices.value) {
      isAppending.value = true
      visibleCount.value += PAGE_SIZE
    }
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = 'todos'
    visibleCount.value = PAGE_SIZE
    isAppending.value = false
  }

  type Suggestion = Pick<Service, 'slug' | 'name' | 'description' | 'icon'>
  const suggestions = ref<Suggestion[]>([])
  const seeAllServices: Suggestion = {
    name: 'Todos os Serviços',
    description: 'Veja todos os serviços disponíveis',
    icon: 'mdi:briefcase',
    slug: '',
  }

  const _updateSuggestions = useDebounceFn(async () => {
    const q = searchQuery.value.trim()
    if (q.length < 2) {
      suggestions.value = []
      return
    }

    try {
      const res = await $fetch('/api/servicos', {
        query: { search: q, limit: 6, sortBy: 'popularity', order: 'desc' },
      })

      suggestions.value = res.data
      suggestions.value.push(seeAllServices)
    } catch (error) {
      suggestions.value = [seeAllServices]
      throw error
    }
  }, 250)

  watch(searchQuery, _updateSuggestions)

  const clearSearch = () => {
    searchQuery.value = ''
    suggestions.value = []
  }

  return {
    // estadods
    searchQuery,
    selectedCategory,
    visibleCount,
    totalServices,
    pending,
    isAppending,
    pageSize: PAGE_SIZE,

    // dados
    filteredServices: visibleServices,
    visibleServices,
    setCategory,
    loadMore,
    clearFilters,

    // hero e autocomplete
    suggestions,
    clearSearch,
  }
}
