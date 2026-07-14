import baseServicesData from '~/data/services.json'
import { createServiceSearch } from '../../utils/serviceSearch'

const services = baseServicesData.services as Service[]

const searchServices = createServiceSearch(services)

const sortableFields: (keyof Service)[] = ['name', 'category', 'popularity']

export default defineEventHandler((event) => {
  const query = getQuery(event)

  const page = Math.max(1, parseInt(query.page as string) || 1)
  // Teto no tamanho do catálogo, não num número fixo: a listagem faz scroll
  // infinito crescendo o `limit`, então um teto menor que o total esconderia
  // os serviços do fim para sempre.
  const limit = Math.min(parseInt(query.limit as string) || 10, services.length)

  const requestedSort = query.sortBy as keyof Service
  const sortBy = sortableFields.includes(requestedSort) ? requestedSort : 'popularity'

  const order = query.order === 'asc' ? 'asc' : 'desc'
  const type = query.type as string | undefined
  const category = query.category as string | undefined
  const search = query.search as string | undefined

  let filtered: Service[]
  // filtro
  if (search) {
    filtered = searchServices(search)
  } else {
    filtered = services
  }

  // type (trilho) e category (grupo) aplicam em conjunto; ambos opcionais
  if (type) {
    filtered = filtered.filter((s) => s.type === type)
  }

  if (category) {
    filtered = filtered.filter((s) => s.category === category)
  }

  if (!search) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }

  // paginacao
  const start = (page - 1) * limit
  const paginated = filtered.slice(start, start + limit)

  return {
    data: paginated,
    meta: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      sortedBy: search ? 'relevance' : sortBy,
    },
  }
})
