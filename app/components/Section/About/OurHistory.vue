<script setup lang="ts">
const stats = [
  {
    icon: 'mdi:office-building',
    value: '500+',
    label: 'De casas residenciais a projetos comerciais, cada uma entregue com prazo cumprido e garantia integral.'
  },
  {
    icon: 'mdi:users',
    value: '100+',
    label: 'Profissionais e parceiros especializados, prontos para cada etapa da sua obra.'
  },
  {
    icon: 'mdi:star',
    value: '10+ anos',
    label: 'Uma década construindo relacionamentos baseados em transparência, qualidade e integridade.'
  }
]
</script>

<template>
  <section class="py-16 bg-gray-50/50">
    <UContainer>
      <div class="grid lg:grid-cols-3 gap-2 lg:gap-12 items-stretch">

        <div class="flex flex-col gap-4">
          <img src="/images/about/cover-2.png" alt="Equipe em reunião de planejamento"
            class="hidden lg:block w-full h-[350px] lg:h-[450px] object-cover rounded-2xl shadow-sm" loading="lazy">
          <img src="/images/about/cover-1.png" alt="Obra em andamento"
            class="hidden lg:block w-full h-[200px] lg:h-[250px] object-cover rounded-2xl shadow-sm" loading="lazy">
        </div>

        <div class="bg-transparent rounded-[2rem] p-8 md:p-10 shadow-smflex flex-col justify-center lg:col-span-2">

          <p class="text-orange-500 font-bold text-xs uppercase tracking-wider mb-4">
            Mais de uma década construindo sonhos
          </p>

          <h2 class="title-section ">
            Cuidando da sua obra como se fosse a nossa.
          </h2>
          <img src="/images/about/cover-2.png" alt="Obra em andamento"
            class="w-full lg:hidden h-[250px] my-3 object-cover rounded-2xl shadow-sm" loading="lazy">

          <div class="space-y-4 text-gray-600 leading-relaxed mb-10 text-[16px]">
            <p>
              Há mais de dez anos em Foz do Iguaçu, a SOS Construir construiu sua reputação obra a obra — com um
              compromisso que nunca mudou: entregar o melhor trabalho possível e garantir que cada cliente saia
              satisfeito.
            </p>
            <p>
              Contamos com uma estrutura integrada de profissionais especializados e parceiros estratégicos em diversas
              áreas. Isso nos permite assumir a gestão completa do projeto — do diagnóstico inicial ao suporte pós-obra
              — com um único ponto de contato responsável por tudo.
            </p>
            <p>
              Excelência não é um diferencial aqui, é o ponto de partida. Sabemos que por trás de cada projeto há um
              sonho, e é com essa consciência que trabalhamos: com rigor, prazo cumprido e total transparência do começo
              ao fim.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-for="(pillar, index) in stats" :key="index"
              class="flex flex-col bg-gray-50/70 items-start gap-4 p-4 rounded-xl border border-gray-100/50 hover:border-orange-200 hover:bg-orange-50/30 transition-all group">
              <div
                class="w-12 h-12 bg-orange-100/50 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                <UIcon :name="pillar.icon" class="w-6 h-6 text-orange-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-2xl font-bold text-blue-500 mb-1">{{ pillar.value }}</p>
                <p class="text-sm text-gray-500 leading-relaxed">{{ pillar.label }}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </UContainer>
  </section>
</template>