import type { Profissao } from '~~/shared/types/prestador'

// STUB V1: lista de profissões ativas. Substituir pelo read endpoint do Spring
// (`GET` de `Profissao` com `ativo = true`) quando o OpenAPI existir (ADR-0002).
// O `slug` casa com a página de serviço (`/pintor`); o write usa só `id_profissao`.
const profissoes: Profissao[] = [
  { id_profissao: 1, nome_profissao: 'Pintor', slug: 'pintor', icone_nome: 'mdi:format-paint', ativo: true },
  { id_profissao: 2, nome_profissao: 'Eletricista', slug: 'eletricista', icone_nome: 'mdi:flash', ativo: true },
  { id_profissao: 3, nome_profissao: 'Encanador', slug: 'encanador', icone_nome: 'mdi:pipe-wrench', ativo: true },
  { id_profissao: 4, nome_profissao: 'Pedreiro', slug: 'pedreiro', icone_nome: 'mdi:wall', ativo: true },
  { id_profissao: 5, nome_profissao: 'Marceneiro', slug: 'marceneiro', icone_nome: 'mdi:saw-blade', ativo: true },
  { id_profissao: 6, nome_profissao: 'Serralheiro', slug: 'serralheiro', icone_nome: 'mdi:gate', ativo: true },
  { id_profissao: 7, nome_profissao: 'Gesseiro', slug: 'gesseiro', icone_nome: 'mdi:square-outline', ativo: true },
  { id_profissao: 8, nome_profissao: 'Azulejista', slug: 'azulejista', icone_nome: 'mdi:grid', ativo: true },
  { id_profissao: 9, nome_profissao: 'Vidraceiro', slug: 'vidraceiro', icone_nome: 'mdi:window-closed-variant', ativo: true },
  { id_profissao: 10, nome_profissao: 'Jardineiro', slug: 'jardineiro', icone_nome: 'mdi:flower', ativo: true },
  { id_profissao: 11, nome_profissao: 'Telhadista', slug: 'telhadista', icone_nome: 'mdi:home-roof', ativo: true },
  { id_profissao: 12, nome_profissao: 'Marmorista', slug: 'marmorista', icone_nome: 'mdi:countertop', ativo: true },
  { id_profissao: 13, nome_profissao: 'Soldador', slug: 'soldador', icone_nome: 'mdi:welding', ativo: true },
  { id_profissao: 14, nome_profissao: 'Calceteiro (Paver)', slug: 'calceteiro', icone_nome: 'mdi:road', ativo: true }
]

export default defineEventHandler((): Profissao[] => {
  return profissoes
})
