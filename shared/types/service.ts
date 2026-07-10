// Eixo que separa intenção: execução (mão de obra) tem página dedicada;
// locação/material/projeto entram só no catálogo e roteiam diferente.
export type ServiceType = 'execucao' | 'locacao' | 'material' | 'projeto'

export interface Category {
  name: string
  slug: string
  examples?: string // subtítulo leigo no chip (ex.: "Vazamento, cano, caixa d'água")
  icon?: string
}
export interface Service {
  id: number | string
  name: string
  slug: string
  type: ServiceType
  category: string
  size?: 'medium' | 'large' | string
  icon: string
  description: string
  keywords: string[]
  aliases?: string[] // sinônimos canônicos p/ a busca (ex.: "bombeiro hidráulico")
  popularity: number
}
