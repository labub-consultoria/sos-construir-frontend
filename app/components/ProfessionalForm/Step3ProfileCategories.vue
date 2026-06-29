<script setup lang="ts">
import { useProfessionalFormStore, categoriaKey, type SelectedCategoria } from '~/stores/professionalForm'
import { useProfessionalSchemas } from '~/composables/useProfessionalSchemas'
import { scrollToFirstInvalid } from '~/utils/scrollToError'
import type { Profissao } from '~~/shared/types/prestador'

const emit = defineEmits<{ next: []; prev: [] }>()

const store = useProfessionalFormStore()
const { profileCategoriesSchema } = useProfessionalSchemas()

const MAX_FOTO_BYTES = 5 * 1024 * 1024
const TIPOS_IMAGEM = ['image/jpeg', 'image/png']
const MAX_CATEGORIAS = 5
const fotoError = ref<string | null>(null)
const categoriaError = ref<string | null>(null)

// `lazy` mantém o componente síncrono (sem Suspense): evita que a troca de passo
// desmonte o passo anterior — com seu USelect teleportado — durante a suspensão,
// o que quebrava o patch do DOM (reka-ui Popper).
const { public: { apiBase } } = useRuntimeConfig()

const { data: profissoes } = useFetch<Profissao[]>(`${apiBase}/profissoes`, {
  default: () => [],
  lazy: true
})

const profissaoItems = computed(() =>
  (profissoes.value ?? []).map((p) => ({
    label: p.nome,
    value: p.id_profissao,
    slug: p.slug,
    icon: p.icone_nome
  }))
)

type ProfissaoItem = (typeof profissaoItems.value)[number]

// ── Seleção de categorias (híbrido: lista + texto livre — Apêndice C) ──────────
// O UInputMenu é só o "adicionar"; a lista de chips abaixo é a fonte de verdade.
// Já selecionadas saem das sugestões.
const availableItems = computed(() =>
  profissaoItems.value.filter(
    (it) => !store.categorias.some((c) => c.id_profissao === it.value)
  )
)

// Remonta o input após cada adição (limpa texto digitado e seleção).
const adderKey = ref(0)

function pushCategoria(cat: SelectedCategoria) {
  if (store.categorias.length >= MAX_CATEGORIAS) return
  store.categorias.push(cat)
  ensureSinglePrincipal()
  adderKey.value++
}

// Item escolhido da lista → vira categoria com `id_profissao`.
function onPickItem(item: ProfissaoItem | undefined) {
  if (!item) return
  pushCategoria({ id_profissao: item.value, nome_profissao: item.label, slug: item.slug, icone: item.icon, principal: false })
}

// Texto livre (não casou com a lista) → categoria com `texto`; o admin classifica
// na análise. Evita duplicar nome já na lista ou já escolhido.
function onCreateFreeText(texto: string) {
  const t = texto.trim()
  const dup =
    profissaoItems.value.some((p) => p.label.toLowerCase() === t.toLowerCase()) ||
    store.categorias.some((c) => c.nome_profissao.toLowerCase() === t.toLowerCase())
  if (!t || dup) {
    adderKey.value++
    return
  }
  pushCategoria({ texto: t, nome_profissao: t, principal: false })
}

function ensureSinglePrincipal() {
  const principais = store.categorias.filter((c) => c.principal)
  if (store.categorias.length > 0 && principais.length === 0) {
    store.categorias[0]!.principal = true
  }
}

function setPrincipal(cat: SelectedCategoria) {
  const key = categoriaKey(cat)
  // A principal sobe para o topo (a ordem do array é a enviada ao backend).
  const i = store.categorias.findIndex((c) => categoriaKey(c) === key)
  if (i > 0) store.categorias.unshift(store.categorias.splice(i, 1)[0]!)
  store.categorias.forEach((c) => {
    c.principal = categoriaKey(c) === key
  })
}

function removeCategoria(index: number) {
  store.categorias.splice(index, 1)
  ensureSinglePrincipal()
}

// ── Foto ──────────────────────────────────────────────────────────────────────
function onFotoChange(value: File | File[] | null | undefined) {
  fotoError.value = null
  const file = Array.isArray(value) ? value[0] : value
  if (!file) {
    store.setFoto(null)
    return
  }
  if (!TIPOS_IMAGEM.includes(file.type)) {
    fotoError.value = 'Envie uma imagem JPG ou PNG.'
    return
  }
  if (file.size > MAX_FOTO_BYTES) {
    fotoError.value = 'A imagem deve ter no máximo 5 MB.'
    return
  }
  store.setFoto(file)
}

function removeFoto() {
  store.setFoto(null)
}

// Seletor de arquivo (galeria): input nativo escondido, acionado pelo card
// "Selecionar foto" e pelo lápis sobre o avatar.
const fileInput = ref<HTMLInputElement | null>(null)

function openFilePicker() {
  fileInput.value?.click()
}

function onFileInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  onFotoChange(target.files?.[0] ?? null)
  target.value = '' // permite reselecionar o mesmo arquivo
}

// "Tirar foto": input nativo com `capture` abre a câmera no celular. No desktop
// (sem câmera via capture) o navegador cai no seletor de arquivos.
const cameraInput = ref<HTMLInputElement | null>(null)

function openCamera() {
  cameraInput.value?.click()
}

function onCameraChange(event: Event) {
  const target = event.target as HTMLInputElement
  onFotoChange(target.files?.[0] ?? null)
  target.value = '' // permite recapturar o mesmo arquivo
}

// ── Submit do passo ─────────────────────────────────────────────────────────
const state = reactive({ categorias: store.categorias })

function onSubmit() {
  categoriaError.value = null
  const result = profileCategoriesSchema.safeParse({ categorias: store.categorias })
  if (!result.success) {
    categoriaError.value =
      result.error.issues[0]?.message ?? 'Revise as categorias selecionadas.'
    scrollToFirstInvalid()
    return
  }
  emit('next')
}
</script>

<template>
  <UForm :state="state" class="flex flex-col gap-8" @submit="onSubmit">
    <!-- Foto de perfil -->
    <section>
      <h3 class="text-base font-bold text-blue-500 mb-1">Foto de perfil</h3>
      <p class="text-sm text-slate-500 mb-4">
        Opcional, mas ajuda os clientes a reconhecerem você. JPG ou PNG até 5 MB.
      </p>

      <div class="flex flex-wrap items-center gap-5 max-w-xl justify-center">
        <!-- Avatar -->
        <div class="flex shrink-0 items-center justify-center">
          <div class="relative">
            <div
              class="w-26 h-26 rounded-full bg-orange-50 border border-orange-100 overflow-hidden flex items-center justify-center"
            >
              <img
                v-if="store.fotoPreviewUrl"
                :src="store.fotoPreviewUrl"
                alt="Pré-visualização da sua foto de perfil"
                class="w-full h-full object-cover"
              >
              <Icon v-else name="mdi:account-outline" class="text-4xl text-orange-300" aria-hidden="true" />
            </div>
            <button
              v-if="store.foto"
              type="button"
              class="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center border-2 border-white hover:bg-red-600 cursor-pointer"
              aria-label="Remover foto"
              @click="removeFoto"
            >
              <Icon name="mdi:trash-can-outline" class="text-sm" />
            </button>
          </div>
        </div>

        <div class="flex grow basis-72 gap-2">
          <!-- Selecionar foto -->
          <button
            type="button"
            class="flex flex-col max-w-1/2 flex-1 items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/60 hover:bg-orange-50 transition-colors text-center cursor-pointer"
            @click="openFilePicker"
          >
            <span class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
              <Icon name="mdi:upload" class="text-xl text-white" />
            </span>
            <span class="text-sm font-bold text-orange-600">{{ store.foto ? 'Trocar foto' : 'Selecionar foto' }}</span>
            <span class="text-xs text-slate-400">JPG, PNG até 5 MB</span>
          </button>

          <!-- Tirar foto -->
          <button
            type="button"
            class="hidden pointer-coarse:flex flex-1 flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-center cursor-pointer"
            @click="openCamera"
          >
            <span class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Icon name="mdi:camera-outline" class="text-xl text-slate-400" />
            </span>
            <span class="text-sm font-bold text-slate-600">Tirar foto</span>
            <span class="text-xs text-slate-400">Use a câmera do dispositivo</span>
          </button>
        </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png"
        class="sr-only"
        aria-hidden="true"
        tabindex="-1"
        @change="onFileInputChange"
      >
      <input
        ref="cameraInput"
        type="file"
        accept="image/jpeg,image/png"
        capture="user"
        class="sr-only"
        aria-hidden="true"
        tabindex="-1"
        @change="onCameraChange"
      >

      <p v-if="fotoError" class="text-sm text-red-600 mt-2" role="alert">{{ fotoError }}</p>
      </div>

    </section>
    <!-- Categorias -->
    <section>
      <h3 class="text-base font-bold text-blue-500 mb-1">Suas categorias de atuação</h3>
      <p class="text-sm text-slate-500 mb-4">
        Selecione todas as áreas em que você atua e marque a sua categoria principal.
      </p>

      <UFormField name="categorias" :error="categoriaError || undefined">
        <UInputMenu
          :key="adderKey"
          :items="availableItems"
          :disabled="store.categorias.length >= MAX_CATEGORIAS"
          create-item
          label-key="label"
          icon="mdi:magnify"
          placeholder="Digite e selecione sua profissão"
          size="lg"
          class="w-full"
          @update:model-value="onPickItem"
          @create="onCreateFreeText"
        >
          <template #create-item-label="{ item }">
            Adicionar &ldquo;{{ item }}&rdquo;
          </template>
        </UInputMenu>
      </UFormField>
      <p class="text-xs text-slate-500 mt-1.5">
        <template v-if="store.categorias.length >= MAX_CATEGORIAS">
          Máximo de {{ MAX_CATEGORIAS }} profissões atingido.
        </template>
        <template v-else>
          Não encontrou sua profissão? Digite e adicione — nossa equipe classifica no cadastro.
        </template>
      </p>

      <ul v-if="store.categorias.length" class="flex flex-col gap-2 mt-4">
        <li
          v-for="(cat, index) in store.categorias"
          :key="categoriaKey(cat)"
          class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white"
        >
          <Icon
            :name="cat.icone || 'mdi:hammer-wrench'"
            class="text-xl text-orange-500 shrink-0"
            aria-hidden="true"
          />

          <span class="flex-1 font-medium text-blue-500">
            {{ cat.nome_profissao }}
            <span
              v-if="cat.texto"
              class="ml-1.5 align-middle text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded"
              title="Categoria nova — nossa equipe vai classificar no cadastro"
            >
              novo
            </span>
          </span>

          <button
            type="button"
            :aria-pressed="cat.principal"
            :aria-label="`Definir ${cat.nome_profissao} como categoria principal`"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
            :class="
              cat.principal
                ? 'bg-orange-500 text-white'
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
            "
            @click="setPrincipal(cat)"
          >
            <Icon :name="cat.principal ? 'mdi:star' : 'mdi:star-outline'" class="text-base" />
            Principal
          </button>

          <button
            type="button"
            class="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
            :aria-label="`Remover ${cat.nome_profissao}`"
            @click="removeCategoria(index)"
          >
            <Icon name="mdi:close" class="text-lg" />
          </button>
        </li>
      </ul>
    </section>

    <ProfessionalFormNav next-label="Avançar" @prev="emit('prev')" />
  </UForm>
</template>
