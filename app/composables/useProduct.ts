export const useProduct = (slug: string) => {
  const { data: productData, error } = useFetch<Product>(`/api/catalogo/${slug}`)

  const { data: relatedData } = useFetch('/api/catalogo', {
    query: computed(() => ({
      category: productData.value?.category,
      limit: 4,
      exclude: slug,
    })),
  })

  const product = computed(() => productData.value ?? null)

  const relatedProducts = relatedData

  return { product, relatedProducts, error }
}
