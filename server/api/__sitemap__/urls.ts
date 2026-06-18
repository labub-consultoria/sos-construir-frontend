import type { SitemapUrlInput } from '#sitemap/types'

import servicesData from '~/data/services.json'
import productsData from '~/data/products.json'
import postsData from '~/data/blogPosts.json'
import professionalsData from '~/data/professionals.json'
import portfolioData from '~/data/portfolio.json'

export default defineSitemapEventHandler(async () => {
  // Páginas estáticas e índices
  const staticUrls = [
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/servicos', changefreq: 'monthly', priority: 0.9 },
    { loc: '/catalogo', changefreq: 'weekly', priority: 0.8 },
    { loc: '/profissionais', changefreq: 'weekly', priority: 0.8 },
    { loc: '/portfolio', changefreq: 'monthly', priority: 0.7 },
    { loc: '/blog', changefreq: 'weekly', priority: 0.7 },
    { loc: '/sobre', changefreq: 'yearly', priority: 0.5 },
    { loc: '/faca-parte', changefreq: 'yearly', priority: 0.5 },
  ] satisfies SitemapUrlInput[]

  // Perfis de profissionais
  const professionalsUrls = professionalsData.map(
    (professional) =>
      ({
        loc: `/profissionais/${professional.id}`,
        changefreq: 'monthly',
        priority: 0.6,
      }) satisfies SitemapUrlInput
  )

  // Projetos do portfólio
  const portfolioUrls = portfolioData.map(
    (project) =>
      ({
        loc: `/portfolio/${project.id}`,
        changefreq: 'monthly',
        priority: 0.6,
        images: project.imageUrl
          ? [
              {
                loc: `https://www.sosconstruir.com.br${project.imageUrl}`,
                title: `${project.title} - SOS Construir`,
              },
            ]
          : [],
      }) satisfies SitemapUrlInput
  )

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
                loc: `https://www.sosconstruir.com.br${service.image}`,
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
                loc: `https://www.sosconstruir.com.br${product.image}`,
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
                loc: `https://www.sosconstruir.com.br${p.coverImage}`,
                title: `${p.title} - SOS Construir`,
              },
            ]
          : [],
      }) satisfies SitemapUrlInput
  )

  return [
    ...staticUrls,
    ...servicesUrls,
    ...productsUrls,
    ...postsUrls,
    ...professionalsUrls,
    ...portfolioUrls,
  ]
})
