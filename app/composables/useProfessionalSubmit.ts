import { onlyDigits, brDateToISO } from '~/utils/masks'
import { useProfessionalFormStore } from '~/stores/professionalForm'
import type { ConsentimentoDTO, PrestadorRequestDTO, PrestadorResponse } from '~~/shared/types/prestador'

// Monta o payload snake_case a partir do store e submete o cadastro.
// Fluxo (§8 da spec): upload-first da foto → monta DTO → POST /api/profissionais.
export function useProfessionalSubmit() {
  const store = useProfessionalFormStore()
  const submitting = ref(false)
  const error = ref<string | null>(null)

  async function uploadFoto(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('foto', file)
    const { url } = await $fetch<{ url: string }>('/api/upload', {
      method: 'POST',
      body: formData
    })
    return url
  }

  function buildPayload(fotoUrl: string, consentimento: ConsentimentoDTO): PrestadorRequestDTO {
    const sorted = [...store.categorias].sort((a, b) => a.ordem_exibicao - b.ordem_exibicao)
    return {
      nome: store.dadosPessoais.nome.trim(),
      cpf: onlyDigits(store.dadosPessoais.cpf),
      data_de_nascimento: brDateToISO(store.dadosPessoais.data_de_nascimento),
      telefone: onlyDigits(store.dadosPessoais.telefone),
      email: store.dadosPessoais.email.trim(),
      foto_url: fotoUrl,
      endereco: {
        cep: onlyDigits(store.endereco.cep),
        rua: store.endereco.rua.trim(),
        numero: store.endereco.numero.trim(),
        complemento: store.endereco.complemento.trim(),
        bairro: store.endereco.bairro.trim(),
        cidade: store.endereco.cidade.trim(),
        estado: store.endereco.estado
      },
      categorias: sorted.map((c, index) => {
        const base = { destaque: c.destaque, ordem_exibicao: index + 1 }
        return c.id_profissao != null
          ? { ...base, id_profissao: c.id_profissao }
          : { ...base, texto: c.texto }
      }),
      consentimento
    }
  }

  async function submit(consentimento: ConsentimentoDTO): Promise<PrestadorResponse | null> {
    if (submitting.value) return null
    submitting.value = true
    // Não limpamos `error` aqui: mantemos o alerta visível durante a nova tentativa
    // (o botão "Tentar de novo" fica em loading). Em caso de sucesso, navegamos.

    try {
      let fotoUrl = ''
      if (store.foto) {
        try {
          fotoUrl = await uploadFoto(store.foto)
        } catch {
          error.value =
            'Não foi possível enviar sua foto. Tente novamente ou prossiga sem foto.'
          return null
        }
      }

      const payload = buildPayload(fotoUrl, consentimento)
      return await $fetch<PrestadorResponse>('/api/profissionais', {
        method: 'POST',
        body: payload
      })
    } catch {
      error.value = 'Não foi possível enviar seu cadastro. Tente novamente.'
      return null
    } finally {
      submitting.value = false
    }
  }

  return { submit, submitting, error }
}
