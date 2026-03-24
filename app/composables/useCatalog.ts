export const useCatalog = () => {
  const route = useRoute()
  const router = useRouter()

  const parseQueryArray = (val: unknown): string[] => {
    if (!val) return []
    return Array.isArray(val) ? val.map(String) : [String(val)]
  }

  const selectedCategories = ref<string[]>(parseQueryArray(route.query.category))
  const selectedBrands = ref<string[]>(parseQueryArray(route.query.brand))
  const searchQuery = ref(route.query.search?.toString() || '')
  const sortBy = ref(route.query.sortBy?.toString() || 'relevance')
  const currentPage = ref(Number(route.query.page) || 1)
  const limit = 9

  const debouncedSearch = ref(searchQuery.value)
  let debounceTimer: ReturnType<typeof setTimeout>

  // 2. Debounce apenas para a string de busca
  watch(searchQuery, (val) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedSearch.value = val
    }, 300)
  })

  // 3. Centraliza o Reset de Página (Críticas B e 5)
  watch(
    [selectedCategories, selectedBrands, sortBy, debouncedSearch],
    () => {
      if (currentPage.value !== 1) currentPage.value = 1
    },
    { deep: true }
  )

  // 4. Sincroniza o estado atual com a URL do navegador (Crítica A)
  watch(
    [selectedCategories, selectedBrands, debouncedSearch, sortBy, currentPage],
    () => {
      router.replace({
        query: {
          ...route.query,
          category: selectedCategories.value.length ? selectedCategories.value : undefined,
          brand: selectedBrands.value.length ? selectedBrands.value : undefined,
          search: debouncedSearch.value || undefined,
          sortBy: sortBy.value !== 'relevance' ? sortBy.value : undefined,
          page: currentPage.value > 1 ? currentPage.value : undefined,
        },
      })
    },
    { deep: true }
  )
  // 5. Tipagem rigorosa no useFetch com LAZY FETCH
  const { data, status } = useFetch('/api/catalogo', {
    lazy: true,
    query: computed(() => ({
      category: selectedCategories.value.length ? selectedCategories.value : undefined,
      brand: selectedBrands.value.length ? selectedBrands.value : undefined,
      search: debouncedSearch.value || undefined,
      sortBy: sortBy.value,
      page: currentPage.value,
      limit,
    })),
  })

  // Como o useFetch está tipado, não precisamos mais do `as ProductCard[]`
  const products = computed(() => data.value?.data ?? [])
  const total = computed(() => data.value?.meta?.total ?? 0)
  const totalPages = computed(() => data.value?.meta?.totalPages ?? 1)
  const loading = computed(() => status.value === 'pending')

  const brands = computed(() => data.value?.meta.facets.brands ?? [])
  const categories = computed(() => data.value?.meta.facets.categories ?? [])

  const hasActiveFilters = computed(
    () =>
      selectedCategories.value.length > 0 ||
      selectedBrands.value.length > 0 ||
      searchQuery.value !== ''
  )

  const clearFilters = () => {
    selectedCategories.value = []
    selectedBrands.value = []
    searchQuery.value = ''
    debouncedSearch.value = ''
    sortBy.value = 'relevance'
    currentPage.value = 1
  }

  const clearSearch = () => {
    searchQuery.value = ''
    debouncedSearch.value = ''
    clearTimeout(debounceTimer)
  }

  return {
    selectedCategories,
    selectedBrands,
    searchQuery,
    sortBy,
    currentPage,
    limit,
    products,
    total,
    totalPages,
    brands,
    categories,
    loading,
    hasActiveFilters,
    clearFilters,
    clearSearch,
  }
}
