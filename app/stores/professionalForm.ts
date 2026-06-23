import { defineStore } from 'pinia'

// Categoria selecionada na UI (híbrido — Apêndice C da spec).
// - Item da lista: tem `id_profissao` (+ `slug` p/ read → página de serviço).
// - Texto livre: tem `texto` (sem id; o admin classifica na análise).
// `nome_profissao` é o rótulo exibido nos chips/revisão (nome da lista ou o texto).
// O payload (useProfessionalSubmit) envia `id_profissao` OU `texto`, nunca os dois.
export interface SelectedCategoria {
  id_profissao?: number
  texto?: string
  nome_profissao: string
  slug?: string
  icone?: string
  destaque: boolean
  ordem_exibicao: number
}

// Chave estável p/ `:key` e dedupe (itens livres não têm id).
export function categoriaKey(c: Pick<SelectedCategoria, 'id_profissao' | 'texto'>): string {
  return c.id_profissao != null ? `id:${c.id_profissao}` : `txt:${c.texto}`
}

export interface DadosPessoais {
  nome: string
  cpf: string
  data_de_nascimento: string
  telefone: string
  email: string
}

export interface EnderecoForm {
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

// Curso / certificação (etapa "Sobre o trabalho"). `conclusao` vazia = em andamento.
export interface CursoForm {
  nome: string
  instituicao: string
  inicio: string
  conclusao: string
}

export const emptyCurso = (): CursoForm => ({ nome: '', instituicao: '', inicio: '', conclusao: '' })

const STORAGE_KEY = 'sos:Professional-draft'
export const TOTAL_STEPS = 5

const emptyDadosPessoais = (): DadosPessoais => ({
  nome: '',
  cpf: '',
  data_de_nascimento: '',
  telefone: '',
  email: ''
})

const emptyEndereco = (): EnderecoForm => ({
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: ''
})

interface PersistedDraft {
  dadosPessoais: DadosPessoais
  endereco: EnderecoForm
  categorias: SelectedCategoria[]
  bio: string
  cursos: CursoForm[]
  currentStep: number
  completedSteps: number[]
}

export const useProfessionalFormStore = defineStore('ProfessionalForm', () => {
  const dadosPessoais = reactive<DadosPessoais>(emptyDadosPessoais())
  const endereco = reactive<EnderecoForm>(emptyEndereco())
  const categorias = ref<SelectedCategoria[]>([])

  // Etapa "Sobre o trabalho". `bio` e `cursos` são serializáveis (persistem no
  // rascunho); o portfólio são `File`s, só em memória (como a foto de perfil).
  const bio = ref('')
  const cursos = ref<CursoForm[]>([])
  const portfolio = ref<File[]>([])
  const portfolioPreviews = ref<string[]>([])

  // A foto fica só em memória (File não é serializável). Após reload, o
  // usuário precisa reselecionar — a UI avisa.
  const foto = ref<File | null>(null)
  const fotoPreviewUrl = ref<string | null>(null)

  const currentStep = ref(1)
  const completedSteps = ref<number[]>([])

  function setStep(step: number) {
    currentStep.value = Math.min(Math.max(step, 1), TOTAL_STEPS)
  }

  function markCompleted(step: number) {
    if (!completedSteps.value.includes(step)) {
      completedSteps.value.push(step)
    }
  }

  function next() {
    markCompleted(currentStep.value)
    setStep(currentStep.value + 1)
  }

  function prev() {
    setStep(currentStep.value - 1)
  }

  function setFoto(file: File | null) {
    if (fotoPreviewUrl.value) {
      URL.revokeObjectURL(fotoPreviewUrl.value)
      fotoPreviewUrl.value = null
    }
    foto.value = file
    if (file) {
      fotoPreviewUrl.value = URL.createObjectURL(file)
    }
  }

  function addPortfolio(files: File[]) {
    files.forEach((file) => {
      portfolio.value.push(file)
      portfolioPreviews.value.push(URL.createObjectURL(file))
    })
  }

  function removePortfolio(index: number) {
    const url = portfolioPreviews.value[index]
    if (url) URL.revokeObjectURL(url)
    portfolio.value.splice(index, 1)
    portfolioPreviews.value.splice(index, 1)
  }

  function clearPortfolio() {
    portfolioPreviews.value.forEach((url) => URL.revokeObjectURL(url))
    portfolio.value = []
    portfolioPreviews.value = []
  }

  function reset() {
    Object.assign(dadosPessoais, emptyDadosPessoais())
    Object.assign(endereco, emptyEndereco())
    categorias.value = []
    bio.value = ''
    cursos.value = []
    setFoto(null)
    clearPortfolio()
    currentStep.value = 1
    completedSteps.value = []
    pendingDraft = null
    // Não reativa a persistência aqui: o watcher dispara deferido e re-gravaria o
    // estado vazio logo após o removeItem, recriando um rascunho fantasma (banner
    // "Continuar" sem dados). A próxima visita ao formulário chama `peekDraft`,
    // que religa `ready`.
    ready.value = false
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // ── Persistência do rascunho (só dados serializáveis) ───────────────────────
  // `ready` impede que o watch grave antes de o usuário decidir o que fazer com
  // um rascunho salvo: enquanto false, digitar não persiste e não sobrescreve o
  // rascunho existente. O rascunho fica em `pendingDraft` (memória) até o usuário
  // escolher "Continuar" (aplica aos campos) — os campos começam vazios.
  const ready = ref(false)
  let pendingDraft: PersistedDraft | null = null

  // Um rascunho só "vale" se tiver algum dado preenchido — evita banner
  // "Continuar" para rascunho vazio (ex.: fantasma de um cadastro já concluído).
  function draftHasContent(d: PersistedDraft): boolean {
    const dp = d.dadosPessoais
    const e = d.endereco
    return Boolean(
      dp?.nome || dp?.cpf || dp?.telefone || dp?.email || dp?.data_de_nascimento
      || e?.cep || e?.rua || e?.bairro || e?.cidade
      || (d.categorias?.length ?? 0) > 0
      || d.bio || (d.cursos?.length ?? 0) > 0
    )
  }

  // Detecta (sem aplicar) se há rascunho salvo com conteúdo. Retorna true se houver.
  // Não havendo rascunho válido, liga a persistência direto (usuário novo) e limpa
  // um eventual rascunho vazio.
  function peekDraft(): boolean {
    if (!import.meta.client) return false
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      ready.value = true
      return false
    }
    try {
      const draft = JSON.parse(raw) as PersistedDraft
      if (!draftHasContent(draft)) {
        localStorage.removeItem(STORAGE_KEY)
        ready.value = true
        return false
      }
      pendingDraft = draft
      return true
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      ready.value = true
      return false
    }
  }

  // "Continuar": aplica o rascunho salvo aos campos, volta à última etapa em
  // que o usuário estava e liga a persistência. Limita ao passo 3 (foto de
  // perfil): nem a foto nem o portfólio são persistidos (File não serializa),
  // então retomar adiante deixaria o usuário sem essas imagens sem perceber —
  // forçamos ele a repassar pelas etapas de foto (perfil = 3, portfólio = 4).
  const RESUME_MAX_STEP = 3

  function resumeDraft() {
    if (pendingDraft) {
      Object.assign(dadosPessoais, pendingDraft.dadosPessoais)
      Object.assign(endereco, pendingDraft.endereco)
      categorias.value = pendingDraft.categorias ?? []
      bio.value = pendingDraft.bio ?? ''
      cursos.value = pendingDraft.cursos ?? []
      completedSteps.value = pendingDraft.completedSteps ?? []
      setStep(Math.min(pendingDraft.currentStep ?? 1, RESUME_MAX_STEP))
      pendingDraft = null
    }
    ready.value = true
  }

  // Dispensar o aviso (X) começando com os campos vazios: liga a persistência;
  // o rascunho antigo é sobrescrito assim que o usuário digitar.
  function startFresh() {
    pendingDraft = null
    ready.value = true
  }

  if (import.meta.client) {
    watch(
      () => ({
        dadosPessoais: { ...dadosPessoais },
        endereco: { ...endereco },
        categorias: categorias.value,
        bio: bio.value,
        cursos: cursos.value,
        currentStep: currentStep.value,
        completedSteps: completedSteps.value
      }),
      (draft) => {
        if (!ready.value) return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
      },
      { deep: true }
    )
  }

  return {
    dadosPessoais,
    endereco,
    categorias,
    bio,
    cursos,
    portfolio,
    portfolioPreviews,
    foto,
    fotoPreviewUrl,
    currentStep,
    completedSteps,
    setStep,
    markCompleted,
    next,
    prev,
    setFoto,
    addPortfolio,
    removePortfolio,
    reset,
    peekDraft,
    resumeDraft,
    startFresh
  }
})
