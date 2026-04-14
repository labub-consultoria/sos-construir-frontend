import Fuse from 'fuse.js'
import productsData from '~/data/products.json'

const products = productsData as Product[]

const validCategories = new Set<string>([
  'revestimentos',
  'paver',
  'pedras',
  'areia',
  'pre-moldados',
  'pedras-decorativas',
  'serralheria',
  'terra',
  'telhas',
  'forros',
  'paisagismo',
  'lajes',
  'argamassas',
  'playground'
])

const categoryNames: Record<ProductCategory, string> = {
  revestimentos: 'Revestimentos',
  paver: 'Paver',
  pedras: 'Pedras',
  areia: 'Areia',
  'pre-moldados': 'Pré Moldados',
  'pedras-decorativas': 'Pedras Decorativas',
  serralheria: 'Serralheria',
  terra: 'Terra',
  portas: 'Portas',
  telhas: 'Telhas',
  forros: 'Forros',
  paisagismo: 'Paisagismo',
  lajes: 'Lajes',
  argamassas: 'Argamassas',
  playground: 'Playground',
}

const sortableFields = ['relevance', 'price-asc', 'price-desc', 'rating'] as const
type SortOption = (typeof sortableFields)[number]
const sortableFieldsSet = new Set<string>(sortableFields)

const fuse = new Fuse(products, {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'description', weight: 0.2 },
    { name: 'brand', weight: 0.2 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

const toCard = (p: Product): ProductCard => {
  const { brandSlug, featured, ...card } = p
  return card
}

function getBrands(filtered: Product[]): ProductBrand[] {
  const map = new Map<string, { name: string; slug: string; count: number }>()

  for (const p of filtered) {
    if (!p.brandSlug || !p.brand) continue

    const entry = map.get(p.brandSlug)
    if (entry) {
      entry.count++
    } else {
      map.set(p.brandSlug, { name: p.brand, slug: p.brandSlug, count: 1 })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}

function getCategories(filtered: Product[]) {
  const map = new Map<string, { name: string; slug: string; count: number }>()
  for (const p of filtered) {
    const entry = map.get(p.category)
    if (entry) {
      entry.count++
    } else {
      map.set(p.category, {
        name: categoryNames[p.category],
        slug: p.category,
        count: 1,
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}

const parseArrayQuery = (queryParam: string | string[] | undefined): string[] => {
  if (!queryParam) return []
  return Array.isArray(queryParam) ? queryParam : [queryParam]
}

export default defineEventHandler((event) => {
  const query = getQuery(event)

  // sanitize query
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(parseInt(query.limit as string) || 9, 50)
  const search = (query.search as string | undefined)?.trim() || undefined

  const categories = parseArrayQuery(query.category as string | string[] | undefined).filter((c) =>
    validCategories.has(c)
  ) as ProductCategory[]
  const brands = parseArrayQuery(query.brand as string | string[] | undefined)

  const categorySet = new Set(categories)
  const brandSet = new Set(brands)

  const sortBy = (
    sortableFieldsSet.has(query.sortBy as string) ? query.sortBy : 'relevance'
  ) as SortOption

  // filtra por texto, depois por categoria e marca
  const afterSearch: Product[] = search ? fuse.search(search).map((r) => r.item) : [...products]

  const forBrandFacets =
    categorySet.size > 0 ? afterSearch.filter((p) => categorySet.has(p.category)) : afterSearch

  // Verifica se o produto tem brandSlug antes de procurar no Set
  const forCategoryFacets =
    brandSet.size > 0
      ? afterSearch.filter((p) => p.brandSlug != null && brandSet.has(p.brandSlug))
      : afterSearch

  let filtered = [...afterSearch]

  if (categorySet.size > 0) {
    filtered = filtered.filter((p) => p.category != null && categorySet.has(p.category))
  }

  if (brandSet.size > 0) {
    filtered = filtered.filter((p) => p.brandSlug != null && brandSet.has(p.brandSlug))
  }

  const exclude = query.exclude as string | undefined
  if (exclude) {
    filtered = filtered.filter((p) => p.slug !== exclude)
  }

  if (!(search && sortBy === 'relevance')) {
    filtered = filtered.sort((a, b) => {
      if (sortBy === 'price-asc') {
        if (a.price == null) return 1
        if (b.price == null) return -1
        return a.price - b.price
      }

      if (sortBy === 'price-desc') {
        if (a.price == null) return 1
        if (b.price == null) return -1
        return b.price - a.price
      }

      if (sortBy === 'rating') {
        return (b.rating ?? 0) - (a.rating ?? 0)
      }

      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    })
  }

  const total = filtered.length
  const paginated = filtered.slice((page - 1) * limit, page * limit)

  return {
    data: paginated.map(toCard),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      sortedBy: search && sortBy === 'relevance' ? 'relevance' : sortBy,
      facets: {
        brands: getBrands(forBrandFacets),
        categories: getCategories(forCategoryFacets),
      },
    },
  }
})
