import { describe, expect, it } from 'vitest'
import servicesData from '../app/data/services.json'
import { createServiceSearch } from '../server/utils/serviceSearch'
import { TYPING_EXAMPLES, QUICK_SEARCHES } from '../shared/utils/searchExamples'
import type { Service } from '../shared/types/service'

const search = createServiceSearch(servicesData.services as Service[])
const firstOf = (query: string) => search(query)[0]?.name

// O hub e a home convidam o cliente a escrever com as próprias palavras — o placeholder
// sugere "meu cano estourou". Cada frase abaixo é uma promessa da tela: se o serviço certo
// sair do primeiro lugar, o campo falha no exemplo que ele mesmo ensina a digitar.
describe('busca por linguagem natural', () => {
  it.each([
    ['meu cano estourou', 'Encanador'],
    ['preciso tirar entulho', 'Locação de Caçamba'],
    ['quero pintar a casa', 'Pintor'],
    ['preciso de uma caçamba', 'Locação de Caçamba'],
    ['vazamento no telhado', 'Reforma de Telhado'],
    ['alugar máquina para obra', 'Locação de Equipamentos Pesados'],
  ])('"%s" traz %s em primeiro', (query, expected) => {
    expect(firstOf(query)).toBe(expected)
  })

  // Keywords exatas funcionavam antes da tokenização; não podem regredir.
  it.each([
    ['cano estourado', 'Encanador'],
    ['pia entupida', 'Encanador'],
  ])('keyword exata "%s" segue trazendo %s em primeiro', (query, expected) => {
    expect(firstOf(query)).toBe(expected)
  })

  // O cliente digita sem acento no celular; o catálogo é acentuado.
  it('ignora acento nos dois lados', () => {
    expect(firstOf('cacamba')).toBe('Locação de Caçamba')
  })

  // Palavras de até 2 letras não viram token, mas "ar" é um serviço real —
  // sem o fallback da query crua, ele ficaria inalcançável pela busca.
  it('query curta demais para tokenizar ainda encontra serviço', () => {
    expect(search('ar').map((s) => s.name)).toContain('Ar-Condicionado')
  })

  it('query vazia ou só de stopwords não retorna nada', () => {
    expect(search('')).toEqual([])
    expect(search('   ')).toEqual([])
  })

  // O placeholder vivo e os chips de busca rápida são promessas na tela: cada texto que a
  // UI ensina o usuário a digitar tem que aparecer no dropdown (corte de 6 resultados).
  // Se uma frase nova entrar em `searchExamples.ts` sem keyword no catálogo, quebra aqui.
  it.each([...TYPING_EXAMPLES, ...QUICK_SEARCHES])(
    'texto ensinado na UI "%s" retorna resultado dentro do corte do dropdown',
    (taught) => {
      expect(search(taught).slice(0, 6).length).toBeGreaterThan(0)
    },
  )
})
