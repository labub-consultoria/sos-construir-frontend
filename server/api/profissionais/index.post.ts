import { z } from 'zod'
import type { PrestadorResponse } from '~~/shared/types/prestador'

// STUB V1: valida o `PrestadorRequestDTO` (snake_case, dígitos crus) e simula a
// criação com status PENDENTE (UC01). Trocar pelo endpoint público do Spring
// quando pronto (ADR-0003); os tipos virão do OpenAPI (ADR-0002).
const enderecoSchema = z.object({
  cep: z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos'),
  rua: z.string().min(1),
  numero: z.string(),
  complemento: z.string(),
  bairro: z.string().min(1),
  cidade: z.string().min(1),
  estado: z.string().length(2)
})

// Híbrido (Apêndice C): item da lista (`id_profissao`) ou texto livre (`texto`),
// que o admin classifica na análise. Exatamente um dos dois.
const categoriaSchema = z
  .object({
    id_profissao: z.number().int().positive().optional(),
    texto: z.string().trim().min(1).optional(),
    destaque: z.boolean(),
    ordem_exibicao: z.number().int().positive()
  })
  .refine((c) => c.id_profissao != null || (c.texto?.length ?? 0) > 0, {
    message: 'Categoria precisa de id_profissao ou texto'
  })

// Aceite dos termos (LGPD): precisa ter sido marcado, com data e versão.
const consentimentoSchema = z.object({
  aceite: z.literal(true),
  data: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Data de aceite inválida'),
  versao: z.string().min(1)
})

const prestadorSchema = z.object({
  nome: z.string().min(3),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
  data_de_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  telefone: z.string().regex(/^\d{10,11}$/, 'Telefone inválido'),
  email: z.string().email().or(z.literal('')),
  foto_url: z.string(),
  endereco: enderecoSchema,
  categorias: z
    .array(categoriaSchema)
    .min(1)
    .max(5)
    .refine((c) => c.filter((x) => x.destaque).length === 1, 'Exatamente 1 categoria principal'),
  consentimento: consentimentoSchema
})

export default defineEventHandler(async (event): Promise<PrestadorResponse> => {
  const body = await readBody(event)
  const result = prestadorSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Dados de cadastro inválidos.',
      data: result.error.flatten()
    })
  }

  // Simula persistência: o backend atribui id/status/id_unidade/cadastrado_por.
  return { id: crypto.randomUUID(), status: 'PENDENTE' }
})
