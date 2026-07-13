import baseServicesData from '~/data/services.json'
import { servicePages } from '~/data/servicos'

const baseServicesMap = Object.fromEntries(baseServicesData.services.map((s) => [s.slug, s]))

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')

  const baseService = baseServicesMap[slug!] || null
  const pageContent = servicePages[slug!] ?? null

  if (!baseService) {
    throw createError({ statusCode: 404, message: 'Serviço não encontrado' })
  }

  return {
    baseService,
    pageContent: pageContent && withRelatedResolved(pageContent),
  }
})

// `servicePages` é um objeto de módulo: escrever nele deixaria o `items` resolvido grudado nas
// requisições seguintes. Daí a cópia.
function withRelatedResolved(page: ServicePage): ServicePage {
  const related = page.sections.related
  if (!related) return page

  const items = related.services.map((s) => baseServicesMap[s]).filter(Boolean) as Service[]
  return { ...page, sections: { ...page.sections, related: { ...related, items } } }
}
