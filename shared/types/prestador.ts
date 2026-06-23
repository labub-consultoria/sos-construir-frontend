// Tipos do cadastro de prestador (Sistema A).
// Espelham o `PrestadorRequestDTO` real do backend Spring (JSON snake_case).
// Quando o OpenAPI do Spring existir, estes tipos devem ser substituídos pelo
// codegen (ADR-0002). Por ora são a fonte de verdade do front (V1).

/** Profissão lida da entidade `Profissao` (somente leitura via API). */
export interface Profissao {
  id_profissao: number
  nome_profissao: string
  slug: string
  icone_nome: string
  ativo: boolean
}

/**
 * Vínculo profissional → categoria, como esperado pelo backend.
 * Híbrido (Apêndice C da spec): `id_profissao` quando vem da lista de `Profissao`;
 * `texto` quando é profissão de texto livre, que o admin classifica na análise.
 * Exatamente um dos dois é enviado por item.
 */
export interface CategoriaVinculo {
  id_profissao?: number
  texto?: string
  destaque: boolean
  ordem_exibicao: number
}

/** Endereço (EnderecoDTO) — snake_case no JSON. */
export interface EnderecoDTO {
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

/**
 * Aceite dos Termos de Uso / Política de Privacidade (LGPD).
 * Registra que houve consentimento, quando e a qual versão dos termos.
 * Como o `email`, o front já coleta/envia; o backend precisa acomodar no DTO.
 */
export interface ConsentimentoDTO {
  aceite: boolean
  data: string
  versao: string
}

/**
 * Curso / certificação informado pelo profissional (etapa "Sobre o trabalho").
 * `conclusao` vazia = curso em andamento. Anos como string (granularidade de ano).
 */
export interface CursoDTO {
  nome: string
  instituicao?: string
  inicio?: string
  conclusao?: string
}

/** Payload final enviado ao backend (snake_case, dígitos crus). */
export interface PrestadorRequestDTO {
  nome: string
  cpf: string
  data_de_nascimento: string
  telefone: string
  email: string
  foto_url: string
  endereco: EnderecoDTO
  categorias: CategoriaVinculo[]
  bio: string
  portfolio: string[]
  cursos: CursoDTO[]
  consentimento: ConsentimentoDTO
}

/** Resposta do cadastro (stub V1). */
export interface PrestadorResponse {
  id: string
  status: 'PENDENTE'
}
