<script setup lang="ts">
// Links de navegação principais e úteis
const navigationLinks = [
  { label: 'Sobre Nós', to: '/sobre' },
  { label: 'Serviços', to: '/servicos' },
  { label: 'Profissionais', to: '/profissionais' },
  { label: 'Portfólio', to: '/portfolio' },
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Blog', to: '/blog' },
]
const URL = '/api/servicos?sortBy=popularity&order=desc?page=1&limit=6'
const { data, error } = await useFetch(URL)
if (error.value) {
  throw createError({ statusCode: 500, cause: error.value })
}
const services = data.value?.data

defineProps<{
  whatsappLink: string
  phoneNumber: string
  email: string
}>()

// Estilo compartilhado dos títulos de coluna (uppercase + tracking)
const headingClass =
  'text-sm font-bold uppercase tracking-[0.12em] text-white mb-5'
</script>

<template>
  <UFooter class="bg-[#0b2258] text-white" :ui="{
    container: 'border-t border-white/10',
  }">
    <template #top>
      <UContainer class="">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 ">

          <!-- Logo + sobre + redes -->
          <div class="flex flex-col lg:pr-10">
            <div class="flex items-center gap-2 max-h-20 max-w-44 mb-5">
              <AppLogo color2='white' />
            </div>
            <p class="text-sm text-[#CBD5E1] leading-relaxed mb-8">
              Mais de 10 anos transformando obras em realidade.
            </p>
            <div class="flex gap-2">
              <UButton icon="i-simple-icons-instagram" variant="soft" to="https://instagram.com/sos_construir"
                class="text-white rounded-full bg-white/10 p-3" target="_blank" aria-label="Instagram" />
              <UButton icon="i-simple-icons-facebook" size="lg" variant="ghost" to="https://facebook.com/sosconstruir"
                class="text-white rounded-full bg-white/10 p-3" target="_blank" aria-label="Facebook" />
            </div>

            <div class="flex flex-col gap-3 pt-6 mt-8 border-t border-white/10">
              <span :class="headingClass" class="!mb-0">Trabalhe conosco</span>
              <ULink to="/faca-parte"
                class="inline-flex items-center gap-1.5 w-fit text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Faça parte da nossa rede
                <UIcon name="mdi:arrow-right" class="w-4 h-4" />
              </ULink>
            </div>
          </div>

          <!-- Navegação -->
          <div class="flex flex-col lg:px-10  lg:border-white/10">
            <h3 :class="headingClass">Navegação</h3>
            <ul class="flex flex-col">
              <li v-for="link in navigationLinks" :key="link.label">
                <ULink :to="link.to" class="block py-1 text-sm text-[#CBD5E1] hover:text-primary transition-colors">
                  {{ link.label }}
                </ULink>
              </li>
            </ul>
          </div>

          <!-- Serviços em destaque -->
          <div class="flex flex-col lg:px-10">
            <h3 :class="headingClass">Serviços em destaque</h3>
            <ul class="flex flex-col">
              <li v-for="service in services" :key="service.slug">
                <ULink :to="'/servicos/' + service.slug"
                  class="block py-1 text-sm text-[#CBD5E1] hover:text-primary transition-colors">
                  {{ service.name }}
                </ULink>
              </li>
            </ul>
          </div>

          <!-- Contato -->
          <div class="flex flex-col lg:pl-10  lg:border-white/10">
            <h3 :class="headingClass">Contato</h3>
            <ul class="flex flex-col gap-4 text-sm">
              <li class="flex items-start gap-3">
                <UIcon name="mdi:map-marker" class="w-4 h-4 shrink-0 mt-0.5 text-white" />
                <ULink
                  to="https://www.google.com/maps/search/?api=1&query=R.+dos+Eucaliptos,+597+-+Jardim+Bourbon,+Foz+do+Iguaçu+-+PR,+85854-610"
                  target="_blank" rel="noopener"
                  class="leading-relaxed text-[#CBD5E1] hover:text-primary transition-colors">
                  R. dos Eucalíptos, 597 - JD. BOURBON,
                  Foz do Iguaçu - PR, 85854-610
                </ULink>
              </li>
              <li class="flex items-start gap-3">
                <UIcon name="mdi:phone" class="w-4 h-4 shrink-0 mt-0.5 text-white" />
                <ULink :to="'tel:+' + phoneNumber" class="text-[#CBD5E1] hover:text-primary transition-colors">
                  {{ formatPhoneBR(phoneNumber) }}
                </ULink>
              </li>
              <li class="flex items-start gap-3">
                <UIcon name="mdi:email" class="w-4 h-4 shrink-0 mt-0.5 text-white" />
                <ULink :to="'mailto:' + email" class="text-[#CBD5E1] hover:text-primary transition-colors">
                  {{ email }}
                </ULink>
              </li>
            </ul>
          </div>
        </div>
      </UContainer>
    </template>

    <template #left>
      <p class="text-sm">
        © {{ new Date().getFullYear() }} SOS Construir. Todos os direitos reservados.
      </p>
    </template>
  </UFooter>
</template>
