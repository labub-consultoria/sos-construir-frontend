import Fuse from 'fuse.js'
import professionalsData from '~/data/professionals.json'
import type { ProfessionalCard } from '~~/shared/types/profissional'

const professionals = professionalsData as Professional[]

// ─── Sort ─────────────────────────────────────────────────────────────────────

const sortableFields = ['relevance', 'rating', 'jobs', 'experience'] as const
type SortOption = (typeof sortableFields)[number]
const sortableFieldsSet = new Set<string>(sortableFields)

// ─── Fuse (busca fuzzy) ───────────────────────────────────────────────────────

const fuse = new Fuse(professionals, {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'title', weight: 0.3 },
    { name: 'specialties', weight: 0.2 },
    { name: 'bio', weight: 0.1 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toCard = (p: Professional): ProfessionalCard => {
  const { bio, phoneNumber, courses, ...card } = p
  return card
}

/** Retorna todas as especialidades únicas com contagem */
function getSpecialtyFacets(list: Professional[]) {
  const map = new Map<string, number>()
  for (const p of list) {
    for (const s of p.specialties) {
      map.set(s, (map.get(s) ?? 0) + 1)
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

function getRatingBuckets(list: Professional[]) {
  return [5, 4, 3].map((stars) => ({
    stars,
    count: list.filter((p) => p.rating >= stars).length,
  }))
}

const parseArrayQuery = (param: string | string[] | undefined): string[] => {
  if (!param) return []
  return Array.isArray(param) ? param : [param]
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default defineEventHandler((event) => {
  const query = getQuery(event)

  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(parseInt(query.limit as string) || 9, 50)

  const search = (query.search as string | undefined)?.trim() || undefined
  const onlyTopRated = query.topRated === 'true'
  const minRating = parseFloat(query.minRating as string) || 0

  // Filtro por especialidades — aceita múltiplos valores
  const specialties = parseArrayQuery(query.specialty as string | string[] | undefined)
  const specialtySet = new Set(specialties)

  const sortBy = (
    sortableFieldsSet.has(query.sortBy as string) ? query.sortBy : 'relevance'
  ) as SortOption

  // ── Busca textual ────────────────────────────────────────────────────────────
  const afterSearch: Professional[] = search
    ? fuse.search(search).map((r) => r.item)
    : [...professionals]

  // ── Facets — calculados antes dos filtros de especialidade ───────────────────
  const forFacets = afterSearch

  // ── Filtros ──────────────────────────────────────────────────────────────────
  let filtered = [...afterSearch]

  if (specialtySet.size > 0) {
    filtered = filtered.filter((p) => p.specialties.some((s: string) => specialtySet.has(s)))
  }

  if (minRating > 0) {
    filtered = filtered.filter((p) => p.rating >= minRating)
  }

  if (onlyTopRated) {
    filtered = filtered.filter((p) => p.isTopRated)
  }

  // ── Ordenação ────────────────────────────────────────────────────────────────
  if (!(search && sortBy === 'relevance')) {
    filtered = filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'jobs') return b.jobsCompleted - a.jobsCompleted
      if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience
      // relevance default: isTopRated primeiro
      return (b.isTopRated ? 1 : 0) - (a.isTopRated ? 1 : 0)
    })
  }

  // ── Paginação ────────────────────────────────────────────────────────────────
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
        specialties: getSpecialtyFacets(forFacets),
        ratingBuckets: getRatingBuckets(forFacets),
      },
    },
  }
})
