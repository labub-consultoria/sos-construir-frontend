<script setup lang="ts">
import { useProfessionalFormStore, categoriaKey, type CursoForm } from '~/stores/professionalForm'
import { useProfessionalSubmit } from '~/composables/useProfessionalSubmit'

const props = defineProps<{ canSubmit: boolean }>()
const emit = defineEmits<{ edit: [step: number]; submitted: [] }>()

const store = useProfessionalFormStore()
const { submit, submitting, error } = useProfessionalSubmit()

const dp = store.dadosPessoais

const nascimentoFmt = computed(() => dp.data_de_nascimento || '—')

const enderecoLinha = computed(() => {
  const e = store.endereco
  const numero = e.numero || 'S/N'
  const complemento = e.complemento ? `, ${e.complemento}` : ''
  return `${e.rua}, ${numero}${complemento} — ${e.bairro}, ${e.cidade}/${e.estado} — CEP ${e.cep}`
})

const categoriasOrdenadas = computed(() =>
  [...store.categorias].sort((a, b) => a.ordem_exibicao - b.ordem_exibicao)
)

const cursosPreenchidos = computed(() => store.cursos.filter((c) => c.nome.trim()))

function cursoPeriodo(curso: CursoForm): string {
  if (curso.inicio && curso.conclusao) return `${curso.inicio} – ${curso.conclusao}`
  if (curso.conclusao) return curso.conclusao
  if (curso.inicio) return `Desde ${curso.inicio} (em andamento)`
  return ''
}

const acceptedTerms = ref(false)

async function onSubmit() {
  if (!acceptedTerms.value || !props.canSubmit || submitting.value) return
  // Registra o aceite (LGPD): data/hora + versão dos termos vão no payload.
  const response = await submit({ aceite: true, data: new Date().toISOString(), versao: TERMS_VERSION })
  if (response) {
    emit('submitted')
  }
}

// Ao surgir um erro de envio, leva o usuário até o alerta (rola + foca), pra que
// ninguém ache que "não aconteceu nada" ao clicar em Finalizar.
const errorRef = ref<HTMLElement | null>(null)
watch(error, (val) => {
  if (!val) return
  nextTick(() => {
    errorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    errorRef.value?.focus()
  })
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <p class="text-sm text-slate-500">
      Confira seus dados antes de enviar. Você pode editar qualquer seção.
    </p>

    <!-- Dados pessoais -->
    <section class="rounded-xl border border-gray-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-blue-500">Dados pessoais</h3>
        <UButton type="button" color="primary" variant="link" size="sm" class="font-semibold" @click="emit('edit', 1)">
          Editar
        </UButton>
      </div>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div><dt class="text-slate-500">Nome</dt><dd class="font-medium text-slate-900">{{ dp.nome || '—' }}</dd></div>
        <div><dt class="text-slate-500">CPF</dt><dd class="font-medium text-slate-900">{{ dp.cpf || '—' }}</dd></div>
        <div><dt class="text-slate-500">Nascimento</dt><dd class="font-medium text-slate-900">{{ nascimentoFmt }}</dd></div>
        <div><dt class="text-slate-500">WhatsApp</dt><dd class="font-medium text-slate-900">{{ dp.telefone || '—' }}</dd></div>
        <div class="sm:col-span-2"><dt class="text-slate-500">E-mail</dt><dd class="font-medium text-slate-900">{{ dp.email || '—' }}</dd></div>
      </dl>
    </section>

    <!-- Endereço -->
    <section class="rounded-xl border border-gray-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-blue-500">Endereço</h3>
        <UButton type="button" color="primary" variant="link" size="sm" class="font-semibold" @click="emit('edit', 2)">
          Editar
        </UButton>
      </div>
      <p class="text-sm font-medium text-slate-900">{{ enderecoLinha }}</p>
    </section>

    <!-- Foto e categorias -->
    <section class="rounded-xl border border-gray-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-blue-500">Foto e categorias</h3>
        <UButton type="button" color="primary" variant="link" size="sm" class="font-semibold" @click="emit('edit', 3)">
          Editar
        </UButton>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-20 h-20 rounded-full bg-orange-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
          <img v-if="store.fotoPreviewUrl" :src="store.fotoPreviewUrl" alt="Sua foto de perfil" class="w-full h-full object-cover">
          <Icon v-else name="mdi:account" class="text-2xl text-orange-300" aria-hidden="true" />
        </div>
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="cat in categoriasOrdenadas"
            :key="categoriaKey(cat)"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
            :class="cat.destaque ? 'bg-orange-500 text-white' : 'bg-gray-100 text-slate-700'"
          >
            <Icon :name="cat.icone || 'mdi:hammer-wrench'" class="text-base" aria-hidden="true" />
            {{ cat.nome_profissao }}
            <span v-if="cat.destaque" class="text-xs opacity-90">(principal)</span>
          </li>
        </ul>
      </div>
      <p v-if="!store.foto" class="text-xs text-slate-400 mt-3">
        Nenhuma foto selecionada. Se recarregou a página, reselecione a foto na etapa anterior.
      </p>
    </section>

    <!-- Sobre o trabalho -->
    <section class="rounded-xl border border-gray-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-blue-500">Sobre o trabalho</h3>
        <UButton type="button" color="primary" variant="link" size="sm" class="font-semibold" @click="emit('edit', 4)">
          Editar
        </UButton>
      </div>

      <dl>
        <dt class="text-slate-500 text-sm">Bio</dt>
        <dd class="text-sm font-medium text-slate-900 whitespace-pre-line mb-4">{{ store.bio || '—' }}</dd>

        <template v-if="store.portfolioPreviews.length">
          <dt class="text-slate-500 text-sm mb-2">Fotos do trabalho</dt>
          <dd>
            <ul class="flex flex-wrap gap-2 mb-4">
              <li
                v-for="(url, index) in store.portfolioPreviews"
                :key="url"
                class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
              >
                <img :src="url" :alt="`Foto de trabalho ${index + 1}`" class="w-full h-full object-cover">
              </li>
            </ul>
          </dd>
        </template>

        <template v-if="cursosPreenchidos.length">
          <dt class="text-slate-500 text-sm mb-2">Cursos e certificações</dt>
          <dd>
            <ul class="flex flex-col gap-1.5">
              <li v-for="(curso, index) in cursosPreenchidos" :key="index" class="text-sm text-slate-900">
                <span class="font-medium">{{ curso.nome }}</span>
                <span v-if="curso.instituicao" class="text-slate-500"> · {{ curso.instituicao }}</span>
                <span v-if="cursoPeriodo(curso)" class="text-slate-400"> · {{ cursoPeriodo(curso) }}</span>
              </li>
            </ul>
          </dd>
        </template>
      </dl>
    </section>

    <div v-if="error" ref="errorRef" tabindex="-1" role="alert" class="outline-none scroll-mt-24">
      <UAlert
        color="error"
        variant="soft"
        icon="mdi:alert-circle-outline"
        :title="error"
        :actions="[{ label: 'Tentar de novo', color: 'error', variant: 'outline', loading: submitting, disabled: submitting, onClick: onSubmit }]"
      />
    </div>

    <UCheckbox v-model="acceptedTerms" color="primary" :ui="{ root: 'items-start', label: 'text-sm text-slate-600' }">
      <template #label>
        Li e concordo com os
        <ULink to="/termos-de-uso" target="_blank" class="font-semibold text-blue-500 hover:underline" @click.stop>Termos de Uso</ULink>
        e a
        <ULink to="/politica-de-privacidade" target="_blank" class="font-semibold text-blue-500 hover:underline" @click.stop>Política de Privacidade</ULink>
        da SOS Construir.
      </template>
    </UCheckbox>

    <p v-if="!canSubmit" class="text-sm text-amber-600" role="status">
      Há informações pendentes em etapas anteriores. Use "Editar" para completá-las antes de finalizar.
    </p>

    <div class="flex items-center justify-between pt-2">
      <UButton type="button" color="neutral" variant="ghost" size="lg" icon="mdi:arrow-left" class="font-semibold" @click="emit('edit', 4)">
        Voltar
      </UButton>
      <UButton
        type="button"
        color="primary"
        variant="solid"
        size="xl"
        icon="mdi:check-circle-outline"
        :loading="submitting"
        :disabled="submitting || !acceptedTerms || !canSubmit"
        class="font-semibold rounded-lg px-8"
        @click="onSubmit"
      >
        Finalizar Cadastro
      </UButton>
    </div>
  </div>
</template>
