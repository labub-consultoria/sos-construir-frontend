import { ref, computed, watch } from 'vue'

const PAGE_SIZE = 9

// Listagem da grade de serviços (trilho + categoria + scroll infinito). A busca do
// dropdown vive no useServiceSearch: quem busca sai da página, quem navega usa a grade.
export function useServices(type?: ServiceType) {
  const selectedCategory = ref('todos')
  const visibleCount = ref(PAGE_SIZE)

  // Scroll infinito acrescenta à lista; categoria a substitui. Só no primeiro caso a UI
  // preserva os cards atuais — no segundo eles não batem mais com o filtro.
  const isAppending = ref(false)

  const { data, pending } = useFetch('/api/servicos', {
    query: computed(() => ({
      limit: visibleCount.value,
      type,
      category: selectedCategory.value === 'todos' ? undefined : selectedCategory.value,
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

  return {
    // estados
    selectedCategory,
    visibleCount,
    totalServices,
    pending,
    isAppending,
    pageSize: PAGE_SIZE,

    // dados
    visibleServices,
    setCategory,
    loadMore,
  }
}
