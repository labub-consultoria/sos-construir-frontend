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
  // Overrides por env: NUXT_PUBLIC_API_BASE, NUXT_PUBLIC_SUPABASE_URL/BUCKET.
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080',
      // Vazio = imagens de serviço em /images local; preenchido = Supabase.
      supabaseUrl: '',
      supabaseBucket: ''
    }
  },
  routeRules: {
    // noindex nas logos de parceiro; 200 (não Disallow) p/ o Google ler o header.
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
    // Telas utilitárias do cadastro: fora do sitemap (o módulo auto-descobre rotas).
    exclude: ['/faca-parte/profissional', '/faca-parte/profissional/**', '/faca-parte/empresa'],
  },
})
