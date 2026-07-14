import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

type Suggestion = Pick<Service, 'slug' | 'name' | 'description' | 'icon'>

// Estado do campo de busca com dropdown (home e hub). A listagem da grade
// (paginação, categoria) vive no useServices — quem só busca não paga por ela.
export function useServiceSearch() {
  const searchQuery = ref('')
  const suggestions = ref<Suggestion[]>([])

  // Distingue "ainda digitando" de "buscou e não achou": só o segundo pode
  // mostrar o estado sem resultado no dropdown.
  const searched = ref(false)

  const _updateSuggestions = useDebounceFn(async () => {
    const q = searchQuery.value.trim()
    if (q.length < 2) {
      suggestions.value = []
      searched.value = false
      return
    }

    try {
      const res = await $fetch('/api/servicos', { query: { search: q, limit: 6 } })
      suggestions.value = res.data
    } catch {
      // Falha de rede não pode derrubar o dropdown: cai no estado sem resultado,
      // que aponta o contato — nunca uma lista em branco.
      suggestions.value = []
    }
    searched.value = true
  }, 250)

  watch(searchQuery, _updateSuggestions)

  const clearSearch = () => {
    searchQuery.value = ''
    suggestions.value = []
    searched.value = false
  }

  return {
    searchQuery,
    suggestions,
    searched,
    clearSearch,
  }
}
