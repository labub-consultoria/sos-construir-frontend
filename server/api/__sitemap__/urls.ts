import type { SitemapUrlInput } from '#sitemap/types'

import servicesData from '~/data/services.json'
import productsData from '~/data/products.json'
import postsData from '~/data/blogPosts.json'

export default defineSitemapEventHandler(async () => {
  // Serviços prestados
  const servicesUrls = servicesData.services.map(
    (service) =>
      ({
        loc: `/servicos/${service.slug}`,
        changefreq: 'monthly',
        priority: 0.8,
        images: service.image
          ? [
              {
                loc: `https://sosconstruir.com.br${service.image}`,
                title: `${service.name} - SOS Construir`,
              },
            ]
          : [],
      }) satisfies SitemapUrlInput
  )

  // Produtos dos catalogos
  const productsUrls = productsData.map(
    (product) =>
      ({
        loc: `/catalogo/${product.slug}`,
        changefreq: 'weekly',
        priority: 0.7,
        images: product.image
          ? [
              {
                loc: `https://sosconstruir.com.br${product.image}`,
                title: `${product.title} - SOS Construir`,
              },
            ]
          : [],
      }) satisfies SitemapUrlInput
  )

  // Postagens do blog
  const postsUrls = postsData.map(
    (p) =>
      ({
        loc: `/blog/${p.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        images: p.coverImage
          ? [
              {
                loc: `https://sosconstruir.com.br${p.coverImage}`,
                title: `${p.title} - SOS Construir`,
              },
            ]
          : [],
      }) satisfies SitemapUrlInput
  )

  return [...servicesUrls, ...productsUrls, ...postsUrls]
})
