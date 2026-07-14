<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

// Campo de busca com dropdown, compartilhado pela home e pelo hub. O dropdown é o único
// caminho da busca até o serviço, então ele é um combobox de verdade: seta, Enter, Esc e
// ARIA — sem teclado ele excluiria quem não usa mouse e quem usa leitor de tela.
// O componente não decide destino: emite a escolha e a tela navega.

const props = withDefaults(
  defineProps<{
    placeholder?: string
    // No hub o usuário já está em /servicos — o link viraria um link para a própria página.
    showAllServicesLink?: boolean
    quickSearches?: string[]
    // Frases digitadas em ciclo no placeholder; use só exemplos que a busca de fato resolve.
    animatedPlaceholders?: string[]
  }>(),
  {
    placeholder: 'Ex: meu cano estourou, preciso de uma caçamba…',
    showAllServicesLink: true,
    quickSearches: () => [],
    // Lista canônica coberta pelo teste do catálogo — a animação nunca ensina uma
    // busca que volta vazia. Passe [] para desligar a animação.
    animatedPlaceholders: () => TYPING_EXAMPLES,
  },
)

const emit = defineEmits<{
  // slug vazio = "Todos os Serviços" (a tela leva a /servicos)
  select: [slug: string]
}>()

const { searchQuery, suggestions, searched, clearSearch } = useServiceSearch()

interface Row {
  name: string
  description: string
  icon: string
  slug?: string
  href?: string
}

// A lista nunca fica em branco: sem match, sobra a linha de contato — a SOS é hub,
// e "não achei" é justamente a hora de falar com uma pessoa.
const rows = computed<Row[]>(() => {
  if (suggestions.value.length === 0) {
    return searched.value
      ? [{
          name: 'Não encontrou? Fale com a SOS',
          description: 'Chame no WhatsApp e a gente encontra quem faz',
          icon: 'mdi:whatsapp',
          href: DEFAULT_CTA_WHATSAPP_LINK,
        }]
      : []
  }

  return [
    ...suggestions.value,
    ...(props.showAllServicesLink
      ? [{
          name: 'Todos os Serviços',
          description: 'Veja todos os serviços disponíveis',
          icon: 'mdi:briefcase',
          slug: '',
        }]
      : []),
  ]
})

const open = ref(false)
const activeIndex = ref(-1)

watch(rows, (r) => {
  open.value = r.length > 0
  activeIndex.value = -1
})

const listboxId = useId()
const optionId = (i: number) => `${listboxId}-opt-${i}`

watch(activeIndex, (i) => {
  if (i >= 0) document.getElementById(optionId(i))?.scrollIntoView({ block: 'nearest' })
})

const close = () => {
  open.value = false
  activeIndex.value = -1
}

const pick = (row: Row) => {
  if (row.href) {
    window.open(row.href, '_blank')
    close()
    return
  }
  clearSearch()
  close()
  emit('select', row.slug ?? '')
}

const move = (delta: number) => {
  if (rows.value.length === 0) return
  open.value = true
  activeIndex.value = (activeIndex.value + delta + rows.value.length) % rows.value.length
}

// Enter sem item focado não navega: abre a lista e foca o primeiro, para o usuário
// confirmar — chutar o primeiro palpite mandaria o cliente para a página errada.
const confirm = () => {
  const active = open.value ? rows.value[activeIndex.value] : undefined
  if (active) {
    pick(active)
  } else if (rows.value.length > 0) {
    open.value = true
    activeIndex.value = 0
  }
}

const searchInput = useTemplateRef<ComponentPublicInstance & { inputRef?: HTMLInputElement }>('searchInput')

const applyQuickSearch = (term: string) => {
  searchQuery.value = term
  searchInput.value?.inputRef?.focus()
}

// Placeholder vivo: digita exemplos em ciclo, com cursor piscando, ensinando que o campo
// aceita frase em linguagem natural e mostrando a amplitude do catálogo. Começa vazio
// (nada de flash do placeholder estático antes da primeira letra), para em definitivo no
// primeiro foco — nunca disputa com o usuário — e não roda com prefers-reduced-motion.
const TYPE_MS = 55
const ERASE_MS = 25
const HOLD_MS = 2000
const GAP_MS = 300
const BLINK_MS = 500

const reducedMotion = usePreferredReducedMotion()
const typed = ref('')
const cursorOn = ref(true)
const stopped = ref(false)
let phraseIndex = 0
let pos = 0
let typeTimer: ReturnType<typeof setTimeout> | undefined
let blinkTimer: ReturnType<typeof setInterval> | undefined

// Com animação, o placeholder é o texto digitado (vazio no SSR e no primeiro paint);
// o estático da prop só vale sem animação ou depois que ela para (foco, reduced-motion).
const displayPlaceholder = computed(() => {
  if (props.animatedPlaceholders.length === 0 || stopped.value) return props.placeholder
  return typed.value + (cursorOn.value ? '|' : '')
})

const typeStep = () => {
  const phrase = props.animatedPlaceholders[phraseIndex] ?? ''
  if (pos < phrase.length) {
    typed.value = phrase.slice(0, ++pos)
    typeTimer = setTimeout(typeStep, TYPE_MS)
  } else {
    typeTimer = setTimeout(eraseStep, HOLD_MS)
  }
}

const eraseStep = () => {
  const phrase = props.animatedPlaceholders[phraseIndex] ?? ''
  if (pos > 0) {
    typed.value = phrase.slice(0, --pos)
    typeTimer = setTimeout(eraseStep, ERASE_MS)
  } else {
    phraseIndex = (phraseIndex + 1) % props.animatedPlaceholders.length
    typeTimer = setTimeout(typeStep, GAP_MS)
  }
}

const stopLive = () => {
  stopped.value = true
  clearTimeout(typeTimer)
  clearInterval(blinkTimer)
}

onMounted(() => {
  if (props.animatedPlaceholders.length === 0) return
  if (reducedMotion.value === 'reduce') {
    stopped.value = true
    return
  }
  typeStep()
  blinkTimer = setInterval(() => (cursorOn.value = !cursorOn.value), BLINK_MS)
})

onUnmounted(stopLive)
</script>

<template>
  <div class="w-full">
    <!-- Sem portal: teleportado ao body, o dropdown sai do stacking context do #__nuxt
         (isolate) e cobre o header sticky; dentro dele, o z-50 do header vence o z-40. -->
    <UPopover v-model:open="open" :dismissible="true" :portal="false"
      :ui="{ content: 'w-(--reka-popper-anchor-width) z-40' }">
      <template #anchor>
        <div class="w-full bg-white rounded-2xl shadow-md border border-gray-100 flex items-center">
          <UInput ref="searchInput" v-model="searchQuery" icon="i-heroicons-magnifying-glass-20-solid"
            :placeholder="displayPlaceholder" size="xl" color="secondary" variant="none"
            class="grow bg-transparent border-none outline-none py-3 text-sm sm:text-base" role="combobox"
            aria-label="Buscar serviço" aria-autocomplete="list" :aria-expanded="open" :aria-controls="listboxId"
            :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
            @focus="stopLive" @keydown.down.prevent="move(1)" @keydown.up.prevent="move(-1)"
            @keydown.enter.prevent="confirm" @keydown.escape.prevent="close">
            <template #default>
              <UButton color="primary" variant="solid" size="xl"
                class="font-bold mr-1.5 sm:mr-2 px-3 py-2 text-sm sm:text-base sm:px-6 sm:py-3 rounded-xl transition-colors text-white"
                @click="confirm">
                Buscar
              </UButton>
            </template>
          </UInput>
        </div>
      </template>

      <template #content>
        <ul :id="listboxId" role="listbox" aria-label="Serviços encontrados"
          class="bg-white border border-gray-100 rounded-2xl shadow-xl max-h-64
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 overflow-y-auto">
          <li v-for="(row, i) in rows" :id="optionId(i)" :key="row.slug ?? row.name" role="option"
            :aria-selected="i === activeIndex" class="flex items-center gap-3 px-4 py-3 cursor-pointer
            transition-colors border-b border-gray-50 last:border-none" :class="{ 'bg-orange-50': i === activeIndex }"
            @mouseenter="activeIndex = i" @click="pick(row)">
            <UIcon :name="row.icon" class="text-orange-500 bg-orange-500 text-xl shrink-0" />
            <div class="flex flex-col min-w-0">
              <span class="font-semibold text-blue-500 text-sm text-start">{{ row.name }}</span>
              <span class="text-xs text-gray-500 truncate text-start">{{ row.description }}</span>
            </div>
            <UIcon name="mdi:arrow-right" class="ml-auto text-gray-500 shrink-0" />
          </li>
        </ul>
      </template>
    </UPopover>

    <div v-if="quickSearches.length" class="flex flex-wrap items-center justify-start gap-1.5 sm:gap-2 mt-4 sm:mt-5">
      <span class="text-white/60 text-sm mr-2 hidden sm:block">Mais buscados:</span>
      <button v-for="term in quickSearches" :key="term" type="button" class="rounded-full border border-white/20
        bg-white/5 px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm text-white transition-colors hover:bg-white/10"
        @click="applyQuickSearch(term)">
        {{ term }}
      </button>
    </div>
  </div>
</template>
