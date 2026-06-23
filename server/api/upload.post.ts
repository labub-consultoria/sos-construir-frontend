// STUB V1: recebe a foto (multipart/form-data) e devolve uma URL.
// Real (ADR-0001/0003): proxy multipart → Spring, que sobe ao Supabase Storage
// (service key) e devolve a URL pública. O front nunca toca o Supabase direto.
export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const file = form?.find((part) => part.name === 'foto' && part.filename)

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhum arquivo enviado.' })
  }

  if (!file.type?.startsWith('image/')) {
    throw createError({ statusCode: 415, statusMessage: 'Arquivo deve ser uma imagem.' })
  }

  // O Spring devolverá a URL real do Storage. Aqui simulamos com um placeholder
  // estável baseado no nome do arquivo.
  const safeName = (file.filename ?? 'foto').replace(/[^\w.-]/g, '_')
  return { url: `https://storage.sosconstruir.com.br/prestadores/${Date.now()}-${safeName}` }
})
