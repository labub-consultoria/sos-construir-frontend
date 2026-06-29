import { FetchError } from 'ofetch'
import { onlyDigits, brDateToISO } from '~/utils/masks'
import { useProfessionalFormStore } from '~/stores/professionalForm'
import type { ConsentimentoDTO, PrestadorRequestDTO, ProfissionalResponse } from '~~/shared/types/prestador'

// Corpo de erro padronizado do backend (§6 da spec de integração).
interface ApiErrorBody {
  erro?: string
  erros?: Record<string, string>
  requestId?: string
}

// Monta o payload snake_case a partir do store e submete o cadastro ao Spring.
// Fluxo: upload-first das imagens (`/upload`) → monta DTO → POST `/profissionais`.
// Todas as chamadas de uma tentativa compartilham o mesmo `X-Request-Id`.
export function useProfessionalSubmit() {
  const store = useProfessionalFormStore()
  const { public: { apiBase } } = useRuntimeConfig()

  const submitting = ref(false)
  const error = ref<string | null>(null)
  // Ação que a UI deve oferecer no erro: 'retry' (transitório — 429/502/500),
  // 'fix-personal' (CPF/e-mail duplicado → corrigir no passo 1) ou 'none' (só a
  // mensagem; o usuário edita pela seção). Erros terminais não são "tentáveis".
  const errorAction = ref<'retry' | 'fix-personal' | 'none'>('retry')
  // Trava o reenvio após um 409 (dado duplicado): repetir o mesmo envio nunca
  // resolve. Só libera ao voltar corrigir os dados (o passo 5 remonta).
  const blocked = ref(false)
  // Cooldown de rate-limit (429): mantém o botão desabilitado até o `Retry-After`.
  const cooldown = ref(false)
  let cooldownTimer: ReturnType<typeof setTimeout> | null = null

  onScopeDispose(() => {
    if (cooldownTimer) clearTimeout(cooldownTimer)
  })

  // Cache por File: cada imagem sobe no máximo uma vez, mesmo em re-tentativas na
  // mesma tela — evita uploads órfãos no Storage e estouro do rate-limit do
  // `/upload`. Trocar a foto cria um novo File, que sobe de novo.
  const uploaded = new WeakMap<File, string>()

  async function uploadImage(file: File, tipo: 'foto-perfil' | 'portfolio', rid: string): Promise<string> {
    const cached = uploaded.get(file)
    if (cached) return cached
    const formData = new FormData()
    formData.append('arquivo', file)
    formData.append('tipo', tipo)
    const { url } = await $fetch<{ url: string }>(`${apiBase}/upload`, {
      method: 'POST',
      body: formData,
      headers: { 'X-Request-Id': rid }
    })
    uploaded.set(file, url)
    return url
  }

  // Sobe as fotos do portfólio (sequencial, 1 imagem por request) e devolve as URLs.
  function uploadPortfolio(files: File[], rid: string): Promise<string[]> {
    return files.reduce<Promise<string[]>>(
      async (acc, file) => [...(await acc), await uploadImage(file, 'portfolio', rid)],
      Promise.resolve([])
    )
  }

  function buildPayload(
    fotoUrl: string,
    portfolio: string[],
    consentimento: ConsentimentoDTO
  ): PrestadorRequestDTO {
    const email = store.dadosPessoais.email.trim()
    const payload: PrestadorRequestDTO = {
      nome: store.dadosPessoais.nome.trim(),
      cpf: onlyDigits(store.dadosPessoais.cpf),
      data_de_nascimento: brDateToISO(store.dadosPessoais.data_de_nascimento),
      telefone: onlyDigits(store.dadosPessoais.telefone),
      endereco: {
        cep: onlyDigits(store.endereco.cep),
        rua: store.endereco.rua.trim(),
        numero: store.endereco.numero.trim(),
        complemento: store.endereco.complemento.trim(),
        bairro: store.endereco.bairro.trim(),
        cidade: store.endereco.cidade.trim(),
        estado: store.endereco.estado
      },
      // Ordem do array = ordem de exibição (a principal já está no topo).
      categorias: store.categorias.map((c) => ({
        principal: c.principal,
        ...(c.id_profissao != null ? { id_profissao: c.id_profissao } : { texto: c.texto })
      })),
      bio: store.bio.trim(),
      portfolio,
      // Descarta linhas sem nome; anos viram inteiros e campos vazios são omitidos
      // (conclusão ausente = curso em andamento).
      cursos: store.cursos
        .filter((c) => c.nome.trim())
        .map((c) => ({
          nome: c.nome.trim(),
          ...(c.instituicao.trim() ? { instituicao: c.instituicao.trim() } : {}),
          ...(c.inicio.trim() ? { inicio: Number(c.inicio) } : {}),
          ...(c.conclusao.trim() ? { conclusao: Number(c.conclusao) } : {})
        })),
      consentimento,
      site: store.site
    }
    // `email`/`foto_url` são opcionais: omitir quando vazios (não mandar "").
    if (email) payload.email = email
    if (fotoUrl) payload.foto_url = fotoUrl
    return payload
  }

  async function submit(consentimento: ConsentimentoDTO): Promise<ProfissionalResponse | null> {
    if (submitting.value || cooldown.value || blocked.value) return null
    submitting.value = true
    const rid = crypto.randomUUID()
    // Não limpamos `error` aqui: mantemos o alerta visível durante a nova tentativa
    // (o botão "Tentar de novo" fica em loading). Em caso de sucesso, navegamos.

    try {
      let fotoUrl = ''
      let portfolioUrls: string[] = []
      try {
        if (store.foto) fotoUrl = await uploadImage(store.foto, 'foto-perfil', rid)
        if (store.portfolio.length) portfolioUrls = await uploadPortfolio(store.portfolio, rid)
      } catch (err) {
        handleUploadError(err)
        return null
      }

      const payload = buildPayload(fotoUrl, portfolioUrls, consentimento)
      try {
        return await $fetch<ProfissionalResponse>(`${apiBase}/profissionais`, {
          method: 'POST',
          body: payload,
          headers: { 'X-Request-Id': rid }
        })
      } catch (err) {
        handleCadastroError(err, rid)
        return null
      }
    } finally {
      submitting.value = false
    }
  }

  // ── Mapeamento de erro por status (§6 da spec) ────────────────────────────────
  function parseError(err: unknown): { status?: number; body: ApiErrorBody; retryAfter: string | null } {
    if (err instanceof FetchError) {
      return {
        status: err.statusCode,
        body: (err.data ?? {}) as ApiErrorBody,
        retryAfter: err.response?.headers.get('retry-after') ?? null
      }
    }
    return { body: {}, retryAfter: null }
  }

  // Liga o cooldown respeitando o `Retry-After` (em segundos); sem header, 30s.
  function startCooldown(retryAfter: string | null) {
    const secs = Number(retryAfter)
    const ms = (Number.isFinite(secs) && secs > 0 ? Math.min(secs, 3600) : 30) * 1000
    cooldown.value = true
    if (cooldownTimer) clearTimeout(cooldownTimer)
    cooldownTimer = setTimeout(() => { cooldown.value = false }, ms)
  }

  function rateLimitMessage(retryAfter: string | null): string {
    startCooldown(retryAfter)
    const secs = Number(retryAfter)
    if (Number.isFinite(secs) && secs > 0) {
      const espera = secs >= 60 ? `${Math.ceil(secs / 60)} min` : `${secs}s`
      return `Muitas tentativas. Aguarde ${espera} e tente novamente.`
    }
    return 'Muitas tentativas em sequência. Aguarde alguns instantes e tente novamente.'
  }

  function fail(message: string, action: 'retry' | 'fix-personal' | 'none') {
    error.value = message
    errorAction.value = action
  }

  function handleUploadError(err: unknown) {
    const { status, retryAfter } = parseError(err)
    // Arquivo recusado (tamanho/tipo/bytes) não melhora ao reenviar — o usuário
    // troca a imagem na etapa anterior (sem "Tentar de novo").
    if (status === 413) return fail('Cada imagem deve ter no máximo 5 MB. Troque a imagem na etapa anterior.', 'none')
    if (status === 415 || status === 422) return fail('Envie imagens JPG ou PNG válidas. Ajuste as fotos na etapa anterior.', 'none')
    if (status === 429) return fail(rateLimitMessage(retryAfter), 'retry')
    if (status === 502) return fail('Não foi possível enviar suas fotos agora. Tente novamente em instantes.', 'retry')
    fail('Não foi possível enviar suas fotos. Tente novamente ou remova as imagens para prosseguir.', 'retry')
  }

  function handleCadastroError(err: unknown, rid: string) {
    const { status, body, retryAfter } = parseError(err)
    // 409 = dado duplicado (CPF/e-mail): repetir é inútil — trava e manda corrigir.
    if (status === 409) {
      const msg = body.erro ?? 'cpf ou e-mail já cadastrado'
      blocked.value = true
      return fail(msg.charAt(0).toUpperCase() + msg.slice(1) + '.', 'fix-personal')
    }
    if (status === 422) {
      const msgs = body.erros ? Object.values(body.erros) : []
      return fail(
        msgs.length ? `Revise os dados: ${msgs.join(' ')}` : 'Alguns dados não passaram na validação. Revise e tente novamente.',
        'none'
      )
    }
    if (status === 429) return fail(rateLimitMessage(retryAfter), 'retry')
    if (status === 500) return fail(`Erro interno ao enviar. Tente novamente (código: ${body.requestId ?? rid}).`, 'retry')
    fail('Não foi possível enviar seu cadastro. Tente novamente.', 'retry')
  }

  return { submit, submitting, error, cooldown, errorAction, blocked }
}
