import servicesData from '@/data/services.json'
import type { Service } from '@/types/service'
import { useDebounceFn } from '@vueuse/core'

const PAGE_SIZE = 9

export function useServices() {
  const allServices = servicesData.services as Service[]

  const searchQuery = ref('')
  const selectedCategory = ref('todos')
  const visibleCount = ref(PAGE_SIZE)

  const filterByText = (list: Service[], query: string) => {
    const q = query.toLowerCase().trim()
    if (!q) return list
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.keywords?.some((k) => k.toLowerCase().includes(q))
    )
  }

  const filteredServices = computed(() => {
    let result = allServices

    if (selectedCategory.value !== 'todos') {
      result = result.filter(
        (s) => s.category.toLowerCase() === selectedCategory.value.toLowerCase()
      )
    }

    return filterByText(result, searchQuery.value)
  })

  const visibleServices = computed(() => filteredServices.value.slice(0, visibleCount.value))

  const setCategory = (slug: string) => {
    selectedCategory.value = slug
    visibleCount.value = PAGE_SIZE
  }

  const loadMore = () => {
    visibleCount.value += PAGE_SIZE
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = 'todos'
    visibleCount.value = PAGE_SIZE
  }

  // reset paginaçao ao filtrar
  watch([searchQuery, selectedCategory], () => {
    visibleCount.value = PAGE_SIZE
  })

  const suggestions = ref<Service[]>([])

  const _updateSuggestions = useDebounceFn(() => {
    const q = searchQuery.value.trim()
    if (q.length < 2) {
      suggestions.value = []
      return
    }
    suggestions.value = filterByText(allServices, q)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 6)
  }, 250)

  watch(searchQuery, _updateSuggestions)

  const clearSearch = () => {
    searchQuery.value = ''
    suggestions.value = []
  }

  return {
    // estado
    searchQuery,
    selectedCategory,
    visibleCount,

    // pagina de serviços
    filteredServices,
    visibleServices,
    setCategory,
    loadMore,
    clearFilters,

    // hero / autocomplete
    suggestions,
    clearSearch,
  }
}
