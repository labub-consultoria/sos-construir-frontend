import { describe, expect, it } from 'vitest'
import servicesData from '../app/data/services.json'
import { servicePages } from '../app/data/servicos'

const services = servicesData.services
const slugs = new Set(services.map((s) => s.slug))

// O TypeScript não pega nenhuma das regras abaixo: o JSON compila, a página sobe, e o defeito só
// aparece no site no ar.
describe('catálogo de serviços', () => {
  // No Nuxt a rota estática vence a dinâmica. Um serviço com um desses slugs faz /servicos/<slug>
  // abrir o trilho, e a página do serviço nunca chega a ser servida.
  it('nenhum serviço usa um slug reservado para as rotas de trilho', () => {
    const reserved = ['locacao', 'materiais', 'projetos']
    const colliding = services.filter((s) => reserved.includes(s.slug))

    expect(colliding.map((s) => s.slug)).toEqual([])
  })

  // O services.json já põe o serviço na grade e no sitemap. Sem o JSON de conteúdo registrado,
  // quem clica no card cai no PageUnderConstruction.
  it('todo serviço publicado tem conteúdo de página registrado', () => {
    const semConteudo = services.filter((s) => !servicePages[s.slug])

    expect(semConteudo.map((s) => s.slug)).toEqual([])
  })

  // Conteúdo registrado para um slug fora do catálogo não entra na grade nem no sitemap: ninguém
  // chega até ele.
  it('todo conteúdo de página corresponde a um serviço do catálogo', () => {
    const orfas = Object.keys(servicePages).filter((slug) => !slugs.has(slug))

    expect(orfas).toEqual([])
  })

  // Um slug com typo no `related` não quebra o build: o card some da página e ninguém percebe.
  it('todo slug citado em `related` existe e não aponta para a própria página', () => {
    const quebrados = Object.entries(servicePages).flatMap(([slug, page]) =>
      (page.sections.related?.services ?? [])
        .filter((alvo) => !slugs.has(alvo) || alvo === slug)
        .map((alvo) => `${slug} → ${alvo}`)
    )

    expect(quebrados).toEqual([])
  })
})
