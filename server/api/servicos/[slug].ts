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
    pageContent,
  }
})
