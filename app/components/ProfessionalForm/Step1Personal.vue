<script setup lang="ts">
import { useProfessionalFormStore } from '~/stores/professionalForm'
import { useProfessionalSchemas } from '~/composables/useProfessionalSchemas'
import { maskCpf, maskPhone, maskDate } from '~/utils/masks'

const emit = defineEmits<{ next: []; prev: [] }>()

const store = useProfessionalFormStore()
const { personalSchema } = useProfessionalSchemas()
const state = store.dadosPessoais
</script>

<template>
  <UForm :schema="personalSchema" :state="state" class="flex flex-col gap-5" @submit="emit('next')">
    <UFormField label="Nome completo" name="nome" required>
      <UInput
        v-model="state.nome"
        placeholder="Ex.: João da Silva"
        autocomplete="name"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <UFormField label="CPF" name="cpf" required>
        <UInput
          :model-value="state.cpf"
          placeholder="000.000.000-00"
          inputmode="numeric"
          autocomplete="off"
          size="lg"
          class="w-full"
          @update:model-value="state.cpf = maskCpf(String($event))"
        />
      </UFormField>

      <UFormField label="Data de nascimento" name="data_de_nascimento" required>
        <UInput
          :model-value="state.data_de_nascimento"
          placeholder="dd/mm/aaaa"
          inputmode="numeric"
          autocomplete="bday"
          size="lg"
          class="w-full"
          @update:model-value="state.data_de_nascimento = maskDate(String($event))"
        />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <UFormField label="WhatsApp" name="telefone" required>
        <UInput
          :model-value="state.telefone"
          placeholder="(00) 00000-0000"
          inputmode="numeric"
          autocomplete="tel"
          size="lg"
          class="w-full"
          @update:model-value="state.telefone = maskPhone(String($event))"
        />
      </UFormField>

      <UFormField
        label="E-mail"
        name="email"
        hint="Opcional"
        help="Usamos para avisar sobre a aprovação do seu cadastro."
      >
        <UInput
          v-model="state.email"
          type="email"
          placeholder="voce@email.com"
          autocomplete="email"
          size="lg"
          class="w-full"
        />
      </UFormField>
    </div>

    <ProfessionalFormNav :show-back="false" next-label="Avançar" />
  </UForm>
</template>
