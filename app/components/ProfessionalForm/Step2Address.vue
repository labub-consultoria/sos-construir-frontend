<script setup lang="ts">
import { useProfessionalFormStore } from '~/stores/professionalForm'
import { useProfessionalSchemas, UF_OPTIONS } from '~/composables/useProfessionalSchemas'
import { useCep } from '~/composables/useCep'
import { maskCep, onlyDigits } from '~/utils/masks'

const emit = defineEmits<{ next: []; prev: [] }>()

const store = useProfessionalFormStore()
const { addressSchema } = useProfessionalSchemas()
const { lookup, loading: cepLoading, error: cepError } = useCep()
const state = store.endereco

const ufItems = UF_OPTIONS.map((uf) => ({ label: uf.label, value: uf.value as string }))

function onCepInput(value: string) {
  state.cep = maskCep(String(value))
  if (onlyDigits(state.cep).length === 8) {
    void fillFromCep()
  }
}

async function fillFromCep() {
  const result = await lookup(state.cep)
  if (result) {
    state.rua = result.rua || state.rua
    state.bairro = result.bairro || state.bairro
    state.cidade = result.cidade || state.cidade
    state.estado = result.estado || state.estado
  }
}
</script>

<template>
  <UForm :schema="addressSchema" :state="state" class="flex flex-col gap-5" @submit="emit('next')">
    <UFormField label="CEP" name="cep" required>
      <div class="flex items-center gap-3">
        <UInput
          :model-value="state.cep"
          placeholder="00000-000"
          inputmode="numeric"
          autocomplete="postal-code"
          size="lg"
          class="flex-1 sm:max-w-xs"
          :loading="cepLoading"
          @update:model-value="onCepInput"
        />
        <UButton
          to="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank"
          rel="noopener"
          variant="link"
          color="secondary"
          size="sm"
          trailing-icon="mdi:open-in-new"
          class="shrink-0 px-0"
          aria-label="Não sei meu CEP — buscar no site dos Correios (abre em nova aba)"
        >
          Não sei meu CEP
        </UButton>
      </div>
    </UFormField>

    <p v-if="cepError" class="text-sm text-amber-600 -mt-2" role="status">
      {{ cepError }}
    </p>

    <UFormField label="Rua" name="rua" required>
      <UInput v-model="state.rua" :disabled="cepLoading" placeholder="Nome da rua" autocomplete="address-line1" size="lg" class="w-full" />
    </UFormField>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <UFormField label="Número" name="numero" hint="Opcional">
        <UInput v-model="state.numero" :disabled="cepLoading" placeholder="S/N" inputmode="numeric" size="lg" class="w-full" />
      </UFormField>
      <UFormField label="Complemento" name="complemento" hint="Opcional" class="sm:col-span-2">
        <UInput v-model="state.complemento" :disabled="cepLoading" placeholder="Apto, bloco, ponto de referência" size="lg" class="w-full" />
      </UFormField>
    </div>

    <UFormField label="Bairro" name="bairro" required>
      <UInput v-model="state.bairro" :disabled="cepLoading" placeholder="Bairro" autocomplete="address-level3" size="lg" class="w-full" />
    </UFormField>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <UFormField label="Cidade" name="cidade" required class="sm:col-span-2">
        <UInput v-model="state.cidade" :disabled="cepLoading" placeholder="Cidade" autocomplete="address-level2" size="lg" class="w-full" />
      </UFormField>
      <UFormField label="Estado" name="estado" required>
        <USelect
          v-model="state.estado"
          :disabled="cepLoading"
          :items="ufItems"
          value-key="value"
          label-key="label"
          placeholder="Selecione o estado"
          size="lg"
          class="w-full"
        />
      </UFormField>
    </div>

    <ProfessionalFormNav next-label="Avançar" @prev="emit('prev')" />
  </UForm>
</template>
