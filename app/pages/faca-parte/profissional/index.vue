<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { useProfessionalFormStore, TOTAL_STEPS } from '~/stores/professionalForm'
import { useProfessionalSchemas } from '~/composables/useProfessionalSchemas'

// Telas utilitárias: fora do índice, mas seguindo links (§12 da spec).
useSeoMeta({
  title: 'Cadastro de profissional',
  description:
    'Cadastre-se como profissional autônomo na rede da SOS Construir e receba obras para executar em Foz do Iguaçu.',
  robots: 'noindex, follow'
})

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Faça parte', to: '/faca-parte' },
  { label: 'Cadastro de profissional' }
]

const store = useProfessionalFormStore()
const draftDismissed = ref(false)

const stepTitles: Record<number, string> = {
  1: 'Dados pessoais',
  2: 'Endereço',
  3: 'Foto e categorias',
  4: 'Revisão final'
}

const currentTitle = computed(() => stepTitles[store.currentStep] ?? '')

// Só mostramos o banner se havia rascunho persistido NO CARREGAMENTO (visita
// anterior). `peekDraft` apenas detecta o rascunho — não preenche os campos;
// eles só são preenchidos quando o usuário clica em "Continuar".
const hadDraftOnLoad = ref(false)
const showResumeBanner = computed(() => hadDraftOnLoad.value && !draftDismissed.value)

// O rascunho só pode ser lido no cliente (localStorage). Enquanto `loaded` é
// false (SSR + 1º tick do cliente), mostramos um skeleton no lugar do form —
// assim o usuário não digita antes de `peekDraft` rodar, o que faria o
// "Continuar" sobrescrever o que ele escreveu.
const loaded = ref(false)

const headingRef = ref<HTMLElement | null>(null)

onMounted(() => {
  hadDraftOnLoad.value = store.peekDraft()
  loaded.value = true
})

// Move o foco ao título só em navegação iniciada pelo usuário (a11y), nunca na
// carga/hidratação inicial — evita forçar reflow antes do CSS carregar (FOUC).
function focusHeading() {
  nextTick(() => headingRef.value?.focus())
}

function goNext() {
  store.next()
  focusHeading()
}

function goPrev() {
  store.prev()
  focusHeading()
}

function goEdit(step: number) {
  store.setStep(step)
  focusHeading()
}

// ── Navegação pelo stepper (mesmas regras do Zod/“Avançar”) ────────────────────
const { personalSchema, addressSchema, profileCategoriesSchema } = useProfessionalSchemas()

function isStepValid(step: number): boolean {
  if (step === 1) return personalSchema.safeParse(store.dadosPessoais).success
  if (step === 2) return addressSchema.safeParse(store.endereco).success
  if (step === 3) return profileCategoriesSchema.safeParse({ categorias: store.categorias }).success
  return true // revisão não tem schema próprio
}

// Todos os passos obrigatórios (1–3) válidos. Gate do botão "Finalizar" no
// Passo 4 (§6 da spec): não dá pra reusar `reachableStep` porque ele é forçado
// ao `currentStep`, que no passo 4 é sempre 4 mesmo se um passo ficou inválido.
const allRequiredStepsValid = computed(() => isStepValid(1) && isStepValid(2) && isStepValid(3))

// Até onde dá pra navegar: para trás é livre; para frente só até o primeiro passo
// inválido (não dá pra pular um passo não preenchido). Nunca abaixo do atual.
const reachableStep = computed(() => {
  let s = 1
  while (s < TOTAL_STEPS && isStepValid(s)) s++
  return Math.max(s, store.currentStep)
})

function goToStep(step: number) {
  if (step === store.currentStep || step > reachableStep.value) return
  for (let s = 1; s < step; s++) store.markCompleted(s)
  store.setStep(step)
  focusHeading()
}

// "Continuar": carrega o rascunho salvo nos campos e segue o cadastro.
function continueDraft() {
  store.resumeDraft()
  draftDismissed.value = true
}

// X: dispensa o aviso mantendo os campos vazios (começa do zero).
function dismissDraft() {
  store.startFresh()
  draftDismissed.value = true
}

async function onSubmitted() {
  await navigateTo('/faca-parte/profissional/sucesso')
  store.reset()
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <section class="w-full">
      <div class="container max-w-3xl mx-auto px-4 pt-8">
        <div class="text-sm text-gray-500 mb-6 flex gap-2 items-center">
          <UBreadcrumb :items="breadcrumbItems" />
        </div>

        <header class="mb-8">
          <h1 class="text-blue-500 text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1]">
            Cadastro de Profissional
          </h1>
          <p class="text-slate-600 mt-3 leading-relaxed">
            Preencha as etapas abaixo para entrar na nossa rede de profissionais.
            Seu cadastro passa por uma análise antes de ser ativado.
          </p>
        </header>

        <!-- Skeleton enquanto o rascunho não foi detectado  -->
        <div v-if="!loaded" class="pb-16" aria-hidden="true">
          <USkeleton class="h-10 w-full mb-8 bg-slate-200" />
          <USkeleton class="h-7 w-48 mb-6 bg-slate-200" />
          <div class="space-y-4">
            <USkeleton class="h-12 w-full bg-slate-200" />
            <USkeleton class="h-12 w-full bg-slate-200" />
            <USkeleton class="h-12 w-full bg-slate-200" />
            <USkeleton class="h-12 w-full bg-slate-200" />
          </div>
          <USkeleton class="h-11 w-40 mt-8 bg-slate-200" />
        </div>

        <template v-else>
          <!-- Banner de retomada: os campos começam vazios na etapa 1.
               "Continuar" preenche com o rascunho salvo e volta à última etapa;
               o X mantém vazio na etapa 1. -->
          <UAlert
            v-if="showResumeBanner"
            color="secondary"
            variant="soft"
            icon="mdi:history"
            title="Você tem um cadastro em andamento"
            description="Seus dados foram salvos. Quer continuar de onde parou?"
            class="mb-8"
            close
            :actions="[
              { label: 'Continuar', color: 'secondary', variant: 'solid', onClick: continueDraft }
            ]"
            @update:open="dismissDraft"
          />

          <ProfessionalFormStepper
            :current="store.currentStep"
            :completed="store.completedSteps"
            :reachable="reachableStep"
            class="mb-8"
            @navigate="goToStep"
          />

          <p class="sr-only" aria-live="polite">
            Passo {{ store.currentStep }} de {{ TOTAL_STEPS }}: {{ currentTitle }}
          </p>

          <div class="pb-16">
            <h2 ref="headingRef" tabindex="-1" class="text-xl font-bold text-blue-500 mb-6 outline-none">
              {{ currentTitle }}
            </h2>

            <ProfessionalFormStep1Personal v-if="store.currentStep === 1" @next="goNext" />
            <ProfessionalFormStep2Address v-else-if="store.currentStep === 2" @next="goNext" @prev="goPrev" />
            <ProfessionalFormStep3ProfileCategories v-else-if="store.currentStep === 3" @next="goNext" @prev="goPrev" />
            <ProfessionalFormStep4Review v-else-if="store.currentStep === 4" :can-submit="allRequiredStepsValid" @edit="goEdit" @submitted="onSubmitted" />
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
