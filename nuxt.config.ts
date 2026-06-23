// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/seo', '@nuxt/image', '@pinia/nuxt'],
  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],
  site: { url: 'https://www.sosconstruir.com.br', name: 'SOS Construir' },
  ui: {
    colorMode: false,
  },
  routeRules: {
    '/': { prerender: true },
    // Remove logos/fachadas de parceiros do Google Imagens. Cobre toda a pasta
    // de imagens de serviços (logos de parceiros + ilustrações de categoria) —
    // as obras reais (portfólio) e produtos ficam em outros caminhos e seguem
    // indexáveis. Mantém 200 OK p/ o Google ler o noindex — não usar Disallow.
    '/images/services/**': { headers: { 'X-Robots-Tag': 'noindex' } },
  },

  compatibilityDate: '2025-01-15',
  vite: {
    optimizeDeps: {
      include: ['@vueuse/core'],
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    // Telas utilitárias do cadastro (§12 da spec): noindex e fora do sitemap.
    // O `@nuxtjs/sitemap` auto-descobre rotas do app, então excluímos explicitamente
    // em vez de confiar na detecção do `noindex` dinâmico.
    exclude: ['/faca-parte/profissional', '/faca-parte/profissional/**', '/faca-parte/empresa'],
  },
})
