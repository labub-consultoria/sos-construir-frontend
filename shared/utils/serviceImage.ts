// Imagens do site (covers/heros de serviço, fotos institucionais) vivem no Supabase
// Storage e são resolvidas por convenção — trocar/adicionar imagem é upload no bucket,
// sem deploy. A base pública é derivada de URL + BUCKET (mesma convenção do backend).
// Sem config (dev/sem env) cai no caminho local /images de transição.
export type ServiceImageKind = 'cover' | 'hero'

function imageBase(url: string, bucket: string): string {
  return url && bucket ? `${url.replace(/\/$/, '')}/storage/v1/object/public/${bucket}` : '/images'
}

// Resolve qualquer asset do bucket por caminho relativo (ex.: 'about/cover-2.jpg').
export function publicImageUrl(url: string, bucket: string, path: string): string {
  return `${imageBase(url, bucket)}/${path}`
}

export function serviceImageUrl(url: string, bucket: string, slug: string, kind: ServiceImageKind): string {
  return publicImageUrl(url, bucket, `services/${slug}/${kind === 'hero' ? 'hero.webp' : 'cover.jpg'}`)
}

// Foto real da SOS usada quando o cover de um serviço ainda não existe.
export function serviceImageFallback(url: string, bucket: string): string {
  return publicImageUrl(url, bucket, 'about/cover-2.jpg')
}
