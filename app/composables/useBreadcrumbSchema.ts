import type { BreadcrumbItem } from '@nuxt/ui'

interface BreadcrumbListItem {
  name: string
  item?: string
}

/**
 * Registra o schema `BreadcrumbList` a partir dos mesmos itens usados no
 * `UBreadcrumb` da UI, garantindo consistência entre o que o usuário vê e o
 * que o Google lê. O último item (página atual) normalmente não tem `to` e,
 * por isso, é emitido sem `item` (sem link), como manda a convenção.
 *
 * URLs relativas em `to` são absolutizadas pelo schema-org com base no
 * `site.url` (host canônico), então não há host fixado aqui.
 */
export function useBreadcrumbSchema(items: MaybeRefOrGetter<BreadcrumbItem[]>) {
  const itemListElement = computed<BreadcrumbListItem[]>(() =>
    toValue(items)
      .filter((item): item is BreadcrumbItem & { label: string } =>
        typeof item.label === 'string'
      )
      .map((item) => {
        const entry: BreadcrumbListItem = { name: item.label }
        if (typeof item.to === 'string') entry.item = item.to
        return entry
      })
  )

  useSchemaOrg([
    defineBreadcrumb({ itemListElement })
  ])
}
