export const useBlogIndex = () => {
  const route = useRoute()
  const router = useRouter()

  const limit = 6

  // ─── Estado inicializado a partir da URL ──────────────────────────────────────
  const searchQuery = ref(route.query.busca?.toString() || '')
  const selectedCategory = ref(route.query.categoria?.toString() || 'todos')
  const currentPage = ref(Number(route.query.page) || 1)

  // ─── Debounce da busca ────────────────────────────────────────────────────────
  const debouncedSearch = ref(searchQuery.value)
  let debounceTimer: ReturnType<typeof setTimeout>

  watch(searchQuery, (val) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedSearch.value = val
      currentPage.value = 1
    }, 300)
  })

  // ─── Reset de página ao mudar categoria ───────────────────────────────────────
  watch(selectedCategory, () => {
    currentPage.value = 1
  })

  // ─── Sincroniza estado → URL ──────────────────────────────────────────────────
  watch(
    [debouncedSearch, selectedCategory, currentPage],
    () => {
      router.replace({
        query: {
          busca: debouncedSearch.value || undefined,
          categoria: selectedCategory.value !== 'todos' ? selectedCategory.value : undefined,
          page: currentPage.value > 1 ? currentPage.value : undefined,
        },
      })
    },
    { deep: true }
  )

  // ─── Fetch ────────────────────────────────────────────────────────────────────
  const { data, status } = useFetch('/api/blog', {
    query: computed(() => ({
      search: debouncedSearch.value || undefined,
      category: selectedCategory.value !== 'todos' ? selectedCategory.value : undefined,
      page: currentPage.value,
      limit,
    })),
  })

  const posts = computed<BlogPostCard[]>(() => (data.value?.data ?? []) as BlogPostCard[])
  const total = computed(() => data.value?.meta?.total ?? 0)
  const totalPages = computed(() => data.value?.meta?.totalPages ?? 1)
  const loading = computed(() => status.value === 'pending')

  const setCategory = (slug: string) => {
    selectedCategory.value = slug
  }

  return {
    searchQuery,
    selectedCategory,
    currentPage,
    posts,
    total,
    totalPages,
    loading,
    limit,
    setCategory,
  }
}
