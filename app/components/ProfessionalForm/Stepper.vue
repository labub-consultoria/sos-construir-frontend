<script setup lang="ts">
import { TOTAL_STEPS } from '~/stores/professionalForm'

const props = defineProps<{
  current: number
  completed: number[]
  reachable: number
}>()

const emit = defineEmits<{ navigate: [step: number] }>()

interface StepMeta {
  step: number
  title: string
  icon: string
}

const steps: StepMeta[] = [
  { step: 1, title: 'Dados pessoais', icon: 'mdi:account-outline' },
  { step: 2, title: 'Endereço', icon: 'mdi:map-marker-outline' },
  { step: 3, title: 'Foto e categorias', icon: 'mdi:hard-hat' },
  { step: 4, title: 'Revisão', icon: 'mdi:clipboard-check-outline' }
]

const currentTitle = computed(
  () => steps.find((s) => s.step === props.current)?.title ?? ''
)

const progress = computed(() => Math.round((props.current / TOTAL_STEPS) * 100))

const isCompleted = (step: number) => props.completed.includes(step) && step !== props.current
const isClickable = (step: number) => step <= props.reachable && step !== props.current
</script>

<template>
  <div>
    <!-- Desktop: stepper horizontal completo -->
    <ol class="hidden md:flex items-center w-full" aria-label="Etapas do cadastro">
      <li
        v-for="(s, index) in steps"
        :key="s.step"
        class="flex items-center"
        :class="index < steps.length - 1 ? 'flex-1' : ''"
        :aria-current="s.step === current ? 'step' : undefined"
      >
        <button
          type="button"
          class="flex items-center gap-3 text-left rounded-lg transition-opacity"
          :class="isClickable(s.step) ? 'cursor-pointer hover:opacity-75' : 'cursor-default'"
          :disabled="s.step > reachable"
          :aria-label="`Ir para a etapa ${s.step}: ${s.title}`"
          @click="emit('navigate', s.step)"
        >
          <span
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 transition-colors"
            :class="[
              s.step === current
                ? 'border-orange-500 bg-orange-500 text-white'
                : isCompleted(s.step)
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-200 bg-white text-gray-400'
            ]"
          >
            <Icon v-if="isCompleted(s.step)" name="mdi:check" class="text-xl" />
            <Icon v-else :name="s.icon" class="text-xl" />
          </span>
          <span
            class="text-sm font-semibold whitespace-nowrap"
            :class="s.step === current ? 'text-blue-500' : 'text-slate-500'"
          >
            {{ s.title }}
          </span>
        </button>
        <span
          v-if="index < steps.length - 1"
          class="flex-1 h-0.5 mx-4 rounded-full transition-colors"
          :class="isCompleted(s.step) ? 'bg-orange-500' : 'bg-gray-200'"
          aria-hidden="true"
        />
      </li>
    </ol>

    <!-- Mobile: "Passo X de N" + progresso -->
    <div class="md:hidden">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold text-blue-500">
          Passo {{ current }} de {{ TOTAL_STEPS }}
        </span>
        <span class="text-sm font-medium text-slate-500">{{ currentTitle }}</span>
      </div>
      <UProgress :model-value="progress" size="md" color="primary" />
    </div>
  </div>
</template>
