import professionalsData from '~/data/professionals.json'

const professionalMap = Object.fromEntries(
  (professionalsData as Professional[]).map((p) => [p.id, p])
)

export default defineEventHandler((event): Professional => {
  const slug = getRouterParam(event, 'id')
  const professional = professionalMap[slug!]

  if (!professional) {
    throw createError({ statusCode: 404, message: 'Profissional não encontrado' })
  }

  return professional
})
