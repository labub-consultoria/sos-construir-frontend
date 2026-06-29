// Tipos do cadastro de prestador (Sistema A).
// Espelham o contrato real do backend Spring (JSON snake_case) descrito no
// handoff de integração V1. Quando o OpenAPI do Spring existir, estes tipos
// devem ser substituídos pelo codegen (ADR-0002). Por ora são a fonte de
// verdade do front (V1), editados à mão para casar o contrato.

/** Profissão lida da entidade `Profissao` (read — `GET /profissoes`). */
export interface Profissao {
  id_profissao: number
  nome: string
  slug: string
  icone_nome: string
}

/**
 * Vínculo profissional → categoria, como esperado pelo backend (write).
 * Híbrido (Apêndice C da spec): `id_profissao` quando vem da lista de `Profissao`;
 * `texto` quando é profissão de texto livre, que o admin classifica na análise.
 * Exatamente um dos dois é enviado por item. A ordem é a do array (a principal
 * fica no topo); `principal` marca a categoria de destaque (exatamente uma).
 */
export interface CategoriaVinculo {
  id_profissao?: number
  texto?: string
  principal: boolean
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
 */
export interface ConsentimentoDTO {
  aceite: boolean
  data: string
  versao: string
}

/**
 * Curso / certificação informado pelo profissional (etapa "Sobre o trabalho").
 * `conclusao` ausente = curso em andamento. Anos como inteiros (4 dígitos).
 */
export interface CursoDTO {
  nome: string
  instituicao?: string
  inicio?: number
  conclusao?: number
}

/**
 * Payload final enviado ao backend (snake_case, dígitos crus).
 * `email`/`foto_url` são opcionais — omitidos quando vazios (§4.4 da spec).
 * `site` é o honeypot anti-bot: sempre vazio para humanos (§6.1).
 */
export interface PrestadorRequestDTO {
  nome: string
  cpf: string
  data_de_nascimento: string
  telefone: string
  email?: string
  foto_url?: string
  endereco: EnderecoDTO
  categorias: CategoriaVinculo[]
  bio: string
  portfolio: string[]
  cursos: CursoDTO[]
  consentimento: ConsentimentoDTO
  site: string
}

/**
 * Resposta do cadastro (`ProfissionalResponseDTO`, snake_case).
 * O front consome `id_profissional` (protocolo) e `status`; os demais campos
 * vêm no corpo e ficam tipados para referência.
 */
export interface ProfissionalResponse {
  id_profissional: number
  status: 'PENDENTE'
  data_cadastro: string
}
