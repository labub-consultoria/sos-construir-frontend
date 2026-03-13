<script setup lang="ts">
import servicesData from '~/data/services.json'
import type { Service } from '~/types/service'

// Links de navegação principais e úteis
const navigationLinks = [
  { label: 'Sobre Nós', to: '/sobre' },
  { label: 'Serviços', to: '/servicos' },
  { label: 'Profissionais', to: '/profissionais' },
  { label: 'Portfólio', to: '/portfolio' },
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Blog', to: '/blog' },
]
const services = servicesData.services as Service[]

const featuredServices = services
  .toSorted((a, b) => b.popularity - a.popularity)
  .slice(0, 6)
  .map(({ slug, name }) => ({
    to: `/servicos/${slug}`,
    label: name
  }))

defineProps<{
  whatsappLink: string
  phoneNumber: string
  email: string
}>()
</script>

<template>
  <UFooter class="bg-blue-500 text-white" :ui="{
    top: 'p-2 lg:py-2',
    left: 'align-center pb-3'
  }">
    <template #top>
      <UContainer class="text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 lg:py-20">

        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2 max-h-20 max-w-44">
            <AppLogo />
          </div>
          <p class="text-sm text-">
            Mais de 10 anos transformando obras em realidade.
          </p>
          <div class="flex gap-2">
            <UButton icon="i-simple-icons-instagram" variant="soft" to="https://instagram.com/sosconstruir"
              class="text-white rounded-full bg-white/10 p-3" target="_blank" aria-label="Instagram" />
            <UButton icon="i-simple-icons-facebook" size="lg" variant="ghost" to="https://facebook.com/sosconstruir"
              class="text-white rounded-full bg-white/10 p-3" target="_blank" aria-label="Facebook" />
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <h3 class="font-bold uppercase text-">Navegação</h3>
          <ul class="flex flex-col gap-2">
            <li v-for="link in navigationLinks" :key="link.label">
              <ULink :to="link.to" class="text-sm text-[#CBD5E1] hover:text-primary transition-colors">
                {{ link.label }}
              </ULink>
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-4">
          <h3 class="font-bold uppercase text-">Serviços em Destaque</h3>
          <ul class="flex flex-col gap-2">
            <li v-for="service in featuredServices" :key="service.label">
              <ULink :to="service.to" class="text-sm text-[#CBD5E1] hover:text-primary transition-colors">
                {{ service.label }}
              </ULink>
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-4">
          <h3 class="font-bold uppercase text-">Contato</h3>
          <ul class="flex flex-col gap-5 text-sm ">
            <li class="flex items-start gap-2">
              <UIcon name="i-lucide-map-pin" class="w-5 h-5 shrink-0 mt-0.5" />
              <ULink to="https://maps.google.com/?q=Rua+Exemplo,123,Centro,Cidade,Estado" target="_blank"
                class="hover:text-primary transition-colors text-[#CBD5E1]">
                R. dos Eucalíptos, 597 - JARDIM BOURBON,<br>
                Foz do Iguaçu - PR, 85854-610
              </ULink>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-lucide-phone" class="w-5 h-5 shrink-0 " />
              <ULink :to="'tel:+' + phoneNumber" class="text-[#CBD5E1] hover:text-primary transition-colors">
                {{ formatPhoneBR(phoneNumber) }}
              </ULink>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-lucide-mail" class="w-5 h-5 shrink-0 mt-0.5" />
              <ULink :to="'mailto:' + email" class="text-[#CBD5E1] hover:text-primary transition-colors">
                {{ email }}
              </ULink>
            </li>
          </ul>
        </div>
      </UContainer>
      <USeparator decorative type="solid" :ui="{
        border: 'border-t-[2px] border-white/10',
      }" />

    </template>
    <template #left>
      <p class="text-sm">
        © 2025 SOS Construir. Todos os direitos reservados.
      </p>
    </template>

  </UFooter>
</template>
