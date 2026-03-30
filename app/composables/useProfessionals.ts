export const useProfessionals = (options?: { limit?: number; syncUrl?: boolean }) => {
  const route = useRoute()
  const router = useRouter()

  const limit = options?.limit ?? 9
  const syncUrl = options?.syncUrl ?? true

  const parseQueryArray = (val: unknown): string[] => {
    if (!val) return []
    return Array.isArray(val) ? val.map(String) : [String(val)]
  }

  // ─── Estado sincronizado com a URL ────────────────────────────────────────────
  const searchQuery = ref(syncUrl ? route.query.search?.toString() || '' : '')
  const selectedSpecialty = ref<string[]>(syncUrl ? parseQueryArray(route.query.specialty) : [])
  const minRating = ref(syncUrl ? route.query.minRating?.toString() || '0' : '0')
  const sortBy = ref(syncUrl ? route.query.sortBy?.toString() || 'relevance' : 'relevance')
  const currentPage = ref(syncUrl ? Number(route.query.page) || 1 : 1)

  // ─── Debounce da busca ────────────────────────────────────────────────────────
  const debouncedSearch = ref(searchQuery.value)
  let debounceTimer: ReturnType<typeof setTimeout>

  watch(searchQuery, (val) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedSearch.value = val
    }, 300)
  })

  // ─── Reset de página ao mudar filtros ─────────────────────────────────────────
  watch(
    [selectedSpecialty, minRating, sortBy, debouncedSearch],
    () => {
      if (currentPage.value !== 1) currentPage.value = 1
    },
    { deep: true }
  )

  // ─── Sincroniza estado com a URL ──────────────────────────────────────────────
  if (syncUrl) {
    watch(
      [selectedSpecialty, minRating, debouncedSearch, sortBy, currentPage],
      () => {
        router.replace({
          query: {
            ...route.query,
            specialty: selectedSpecialty.value.length ? selectedSpecialty.value : undefined,
            minRating: minRating.value !== '0' ? minRating.value : undefined,
            search: debouncedSearch.value || undefined,
            sortBy: sortBy.value !== 'relevance' ? sortBy.value : undefined,
            page: currentPage.value > 1 ? currentPage.value : undefined,
          },
        })
      },
      { deep: true }
    )
  }

  // ─── Fetch ────────────────────────────────────────────────────────────────────
  const { data, status } = useFetch('/api/profissionais', {
    lazy: true,
    query: computed(() => ({
      specialty: selectedSpecialty.value.length ? selectedSpecialty.value : undefined,
      minRating: minRating.value !== '0' ? minRating.value : undefined,
      search: debouncedSearch.value || undefined,
      sortBy: sortBy.value,
      page: currentPage.value,
      limit,
    })),
  })

  // ─── Dados derivados ──────────────────────────────────────────────────────────
  const professionals = computed<ProfessionalCard[]>(() => data.value?.data ?? [])
  const total = computed(() => data.value?.meta?.total ?? 0)
  const totalPages = computed(() => data.value?.meta?.totalPages ?? 1)
  const loading = computed(() => status.value === 'pending')

  // Facets vindos da API — usados para popular a sidebar dinamicamente
  const specialtyFacets = computed(() => data.value?.meta?.facets?.specialties ?? [])
  const ratingBuckets = computed(() => data.value?.meta?.facets?.ratingBuckets ?? [])

  // ─── Filtros ativos ───────────────────────────────────────────────────────────
  const hasActiveFilters = computed(
    () => selectedSpecialty.value.length > 0 || minRating.value !== '0' || searchQuery.value !== ''
  )

  // ─── Ações ────────────────────────────────────────────────────────────────────
  const clearFilters = () => {
    selectedSpecialty.value = []
    minRating.value = '0'
    searchQuery.value = ''
    debouncedSearch.value = ''
    sortBy.value = 'relevance'
    currentPage.value = 1
    clearTimeout(debounceTimer)
  }

  const clearSearch = () => {
    searchQuery.value = ''
    debouncedSearch.value = ''
    clearTimeout(debounceTimer)
  }

  return {
    // Estado
    searchQuery,
    selectedSpecialty,
    minRating,
    sortBy,
    currentPage,
    limit,
    // Dados
    professionals,
    total,
    totalPages,
    loading,
    // Facets
    specialtyFacets,
    ratingBuckets,
    // Helpers
    hasActiveFilters,
    clearFilters,
    clearSearch,
  }
}
