import productsData from '~/data/products.json'

const productMap = Object.fromEntries((productsData as Product[]).map((p) => [p.slug, p]))

export default defineEventHandler((event): Product => {
  const slug = getRouterParam(event, 'slug')
  const product = productMap[slug!]

  if (!product) {
    throw createError({ statusCode: 404, message: 'Produto não encontrado' })
  }

  return product
})
