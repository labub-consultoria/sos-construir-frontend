<script setup lang="ts">
useSeoMeta({
  title: 'Cadastro enviado',
  description: 'Seu cadastro de profissional foi enviado e está em análise.',
  robots: 'noindex, follow'
})

const proximosPassos = [
  {
    icon: 'mdi:clipboard-search-outline',
    text: 'Nossa equipe vai analisar seus dados e suas categorias de atuação.'
  },
  {
    icon: 'mdi:whatsapp',
    text: 'Entraremos em contato pelo WhatsApp (e e-mail, se informado) com o resultado.'
  },
  {
    icon: 'mdi:hard-hat',
    text: 'Aprovado o cadastro, você passa a receber obras da rede SOS Construir.'
  }
]

const whatsappLink = formatWhatsappLink(
  PHONENUMBER,
  encodeURIComponent('Olá! Acabei de me cadastrar como profissional e gostaria de tirar uma dúvida.')
)
</script>

<template>
  <div class="min-h-screen bg-white">
    <section class="w-full">
      <div class="container max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div class="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6">
          <Icon name="mdi:check-circle-outline" class="text-orange-500 text-5xl" aria-hidden="true" />
        </div>

        <h1 class="text-blue-500 text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1]">
          Cadastro enviado com sucesso!
        </h1>
        <p class="text-slate-600 text-lg mt-4 max-w-xl leading-relaxed">
          Recebemos seu cadastro. Agora ele entra na fila de análise da nossa
          equipe. Você não precisa fazer mais nada por enquanto.
        </p>

        <ul class="flex flex-col gap-4 mt-10 w-full max-w-lg text-left">
          <li
            v-for="passo in proximosPassos"
            :key="passo.text"
            class="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <div class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <Icon :name="passo.icon" class="text-orange-500 text-xl" aria-hidden="true" />
            </div>
            <span class="text-slate-600 leading-relaxed text-sm pt-1.5">{{ passo.text }}</span>
          </li>
        </ul>

        <div class="flex flex-col sm:flex-row gap-3 mt-10 w-full max-w-lg">
          <UButton
            to="/"
            color="primary"
            variant="solid"
            size="xl"
            icon="mdi:home-outline"
            class="flex-1 justify-center font-semibold rounded-lg"
          >
            Voltar para a Home
          </UButton>
          <UButton
            :to="whatsappLink"
            target="_blank"
            rel="noopener"
            color="neutral"
            variant="outline"
            size="xl"
            icon="mdi:chat-outline"
            class="flex-1 justify-center font-semibold rounded-lg"
          >
            Falar com a SOS
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>
