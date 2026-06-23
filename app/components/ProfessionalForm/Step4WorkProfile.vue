<script setup lang="ts">
import { useProfessionalFormStore, emptyCurso } from '~/stores/professionalForm'
import { useProfessionalSchemas } from '~/composables/useProfessionalSchemas'

const emit = defineEmits<{ next: []; prev: [] }>()

const store = useProfessionalFormStore()
const { workProfileSchema } = useProfessionalSchemas()

const MAX_PORTFOLIO = 6
const MAX_FOTO_BYTES = 5 * 1024 * 1024
const BIO_MAX = 600
const portfolioError = ref<string | null>(null)
const bioError = ref<string | null>(null)

const bioCount = computed(() => store.bio.trim().length)

// `state` só satisfaz o `UForm` (padrão do Step3); a validação é manual no
// submit, sobre os valores do store. `cursos` é a mesma referência do store.
const state = reactive({ cursos: store.cursos })

// ── Portfólio ─────────────────────────────────────────────────────────────────
const fileInput = ref<HTMLInputElement | null>(null)

function openFilePicker() {
  fileInput.value?.click()
}

function onFilesPicked(event: Event) {
  portfolioError.value = null
  const target = event.target as HTMLInputElement
  const picked = Array.from(target.files ?? [])
  target.value = '' // permite reselecionar os mesmos arquivos

  const room = MAX_PORTFOLIO - store.portfolio.length
  if (picked.length > room) {
    portfolioError.value = `Você pode enviar no máximo ${MAX_PORTFOLIO} fotos.`
  }

  const valid = picked.slice(0, Math.max(room, 0)).filter((file) => {
    if (!file.type.startsWith('image/')) {
      portfolioError.value = 'Os arquivos precisam ser imagens.'
      return false
    }
    if (file.size > MAX_FOTO_BYTES) {
      portfolioError.value = 'Cada imagem deve ter no máximo 5 MB.'
      return false
    }
    return true
  })

  if (valid.length) store.addPortfolio(valid)
}

// ── Cursos ──────────────────────────────────────────────────────────────────
function addCurso() {
  if (store.cursos.length >= 10) return
  store.cursos.push(emptyCurso())
}

function removeCurso(index: number) {
  store.cursos.splice(index, 1)
}

// ── Submit do passo ───────────────────────────────────────────────────────────
function onSubmit() {
  bioError.value = null
  store.bio = store.bio.trim()
  // Descarta linhas de curso sem nome antes de validar/avançar.
  store.cursos = store.cursos.filter((c) => c.nome.trim())
  const result = workProfileSchema.safeParse({ bio: store.bio, cursos: store.cursos })
  if (!result.success) {
    bioError.value =
      result.error.issues.find((i) => i.path[0] === 'bio')?.message
      ?? result.error.issues[0]?.message
      ?? 'Revise os campos.'
    return
  }
  emit('next')
}
</script>

<template>
  <UForm :state="state" class="flex flex-col gap-8" @submit="onSubmit">
    <!-- Bio -->
    <section>
      <h3 class="text-base font-bold text-blue-500 mb-1">Sobre você</h3>
      <p class="text-sm text-slate-500 mb-4">
        Conte sua experiência, no que é especialista e o que entrega de diferente. É o que o cliente lê primeiro.
      </p>

      <UFormField name="bio" required :error="bioError || undefined">
        <UTextarea
          v-model="store.bio"
          :rows="5"
          :maxlength="BIO_MAX"
          placeholder="Ex.: Eletricista com 12 anos de experiência em instalações residenciais e comerciais. Trabalho dentro das normas, com laudo técnico e total segurança."
          size="lg"
          class="w-full"
        />
      </UFormField>
      <p class="text-xs text-slate-400 mt-1.5 text-right">{{ bioCount }}/{{ BIO_MAX }}</p>
    </section>

    <!-- Portfólio -->
    <section>
      <h3 class="text-base font-bold text-blue-500 mb-1">Fotos do seu trabalho</h3>
      <p class="text-sm text-slate-500 mb-4">
        Opcional, mas faz diferença. JPG ou PNG até 5 MB, no máximo {{ MAX_PORTFOLIO }} fotos.
      </p>

      <UAlert
        color="secondary"
        variant="soft"
        icon="mdi:camera-outline"
        title="Mostre seu trabalho"
        description="Profissionais que enviam fotos passam mais confiança, têm mais chance de serem aceitos e recebem mais obras. Capriche aqui."
        class="mb-4"
      />

      <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
        <div
          v-for="(url, index) in store.portfolioPreviews"
          :key="url"
          class="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
        >
          <img :src="url" :alt="`Foto de trabalho ${index + 1}`" class="w-full h-full object-cover">
          <button
            type="button"
            class="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center border-2 border-white hover:bg-red-600 cursor-pointer"
            :aria-label="`Remover foto ${index + 1}`"
            @click="store.removePortfolio(index)"
          >
            <Icon name="mdi:trash-can-outline" class="text-sm" />
          </button>
        </div>

        <button
          v-if="store.portfolio.length < MAX_PORTFOLIO"
          type="button"
          class="aspect-square flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/60 hover:bg-orange-50 transition-colors text-center cursor-pointer"
          @click="openFilePicker"
        >
          <Icon name="mdi:plus" class="text-2xl text-orange-500" />
          <span class="text-xs font-bold text-orange-600">Adicionar</span>
        </button>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="sr-only"
        aria-hidden="true"
        tabindex="-1"
        @change="onFilesPicked"
      >

      <p v-if="portfolioError" class="text-sm text-red-600 mt-2" role="alert">{{ portfolioError }}</p>
    </section>

    <!-- Cursos -->
    <section>
      <h3 class="text-base font-bold text-blue-500 mb-1">Cursos e certificações</h3>
      <p class="text-sm text-slate-500 mb-4">
        Opcional. Inclua certificações relevantes (NR-10, NR-35, cursos técnicos…). Deixe a conclusão em branco se ainda estiver cursando.
      </p>

      <ul v-if="store.cursos.length" class="flex flex-col gap-4 mb-4">
        <li
          v-for="(curso, index) in store.cursos"
          :key="index"
          class="rounded-xl border border-gray-200 p-4 flex flex-col gap-3"
        >
          <div class="flex items-start gap-3">
            <div class="flex-1 flex flex-col gap-3">
              <UFormField :name="`cursos.${index}.nome`" label="Nome do curso" :ui="{ label: 'text-xs' }">
                <UInput v-model="curso.nome" placeholder="Ex.: NR-10 — Segurança em Instalações Elétricas" size="md" class="w-full" />
              </UFormField>
              <UFormField label="Instituição" :ui="{ label: 'text-xs' }">
                <UInput v-model="curso.instituicao" placeholder="Ex.: SENAI Paraná" size="md" class="w-full" />
              </UFormField>
              <div class="grid grid-cols-2 gap-3">
                <UFormField label="Início" :ui="{ label: 'text-xs' }">
                  <UInput v-model="curso.inicio" placeholder="Ano (ex.: 2020)" inputmode="numeric" size="md" class="w-full" />
                </UFormField>
                <UFormField label="Conclusão" :ui="{ label: 'text-xs' }">
                  <UInput v-model="curso.conclusao" placeholder="Ano ou em branco" inputmode="numeric" size="md" class="w-full" />
                </UFormField>
              </div>
            </div>
            <button
              type="button"
              class="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer shrink-0"
              :aria-label="`Remover curso ${index + 1}`"
              @click="removeCurso(index)"
            >
              <Icon name="mdi:close" class="text-lg" />
            </button>
          </div>
        </li>
      </ul>

      <UButton
        v-if="store.cursos.length < 10"
        type="button"
        color="primary"
        variant="soft"
        size="md"
        icon="mdi:plus"
        class="font-semibold"
        @click="addCurso"
      >
        Adicionar curso
      </UButton>
    </section>

    <ProfessionalFormNav next-label="Avançar" @prev="emit('prev')" />
  </UForm>
</template>
