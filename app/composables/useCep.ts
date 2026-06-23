import { onlyDigits } from '~/utils/masks'

interface ViaCepResponse {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export interface CepAddress {
  rua: string
  bairro: string
  cidade: string
  estado: string
}

// Aborta a consulta se o ViaCEP demorar demais — o usuário cai no preenchimento
// manual em vez de ficar preso num input desabilitado.
const CEP_TIMEOUT_MS = 5000

// Consulta o ViaCEP. Retorna os campos de endereço, ou `null` quando o CEP não
// existe / a API falha — nesse caso o usuário preenche manualmente (Passo 2).
export function useCep() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function lookup(cep: string): Promise<CepAddress | null> {
    const digits = onlyDigits(cep)
    error.value = null
    if (digits.length !== 8) return null

    loading.value = true
    try {
      const data = await $fetch<ViaCepResponse>(`https://viacep.com.br/ws/${digits}/json/`, {
        timeout: CEP_TIMEOUT_MS
      })
      if (data.erro) {
        error.value = 'CEP não encontrado. Preencha o endereço manualmente.'
        return null
      }
      return {
        rua: data.logradouro ?? '',
        bairro: data.bairro ?? '',
        cidade: data.localidade ?? '',
        estado: data.uf ?? ''
      }
    } catch {
      error.value = 'Não foi possível consultar o CEP. Preencha manualmente.'
      return null
    } finally {
      loading.value = false
    }
  }

  return { lookup, loading, error }
}
