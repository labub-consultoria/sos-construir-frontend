// Migração única: sobe os covers/heros locais (public/images/services/<slug>/) para o
// Supabase Storage, normalizando os nomes para cover.jpg / hero.webp por convenção.
// NÃO sobe subpastas de parceiro (logos ficam locais por causa do noindex SEO).
//
// Uso (mesmos nomes de env do backend):
//   SUPABASE_URL=https://xxx.supabase.co \
//   SUPABASE_SECRET_KEY=<service_role_key> \
//   SUPABASE_BUCKET=midia \
//   node scripts/upload-service-images.mjs
//
// Sobe para o prefixo services/ do bucket (ex.: midia/services/<slug>/cover.jpg).
// Depois setar no .env do front: NUXT_PUBLIC_SUPABASE_URL e NUXT_PUBLIC_SUPABASE_BUCKET.

import { readFileSync, readdirSync, statSync } from 'node:fs'

const { SUPABASE_URL, SUPABASE_SECRET_KEY, SUPABASE_BUCKET } = process.env
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !SUPABASE_BUCKET) {
  console.error('Faltam env: SUPABASE_URL, SUPABASE_SECRET_KEY, SUPABASE_BUCKET')
  process.exit(1)
}

const SRC = new URL('../public/images/services/', import.meta.url).pathname
// pastas locais cujo nome difere do slug canônico
const folderToSlug = { metalurgico: 'metalurgica' }
const pick = (files, re) => files.find((f) => re.test(f))
const mime = (name) => (name.endsWith('.webp') ? 'image/webp' : name.endsWith('.png') ? 'image/png' : 'image/jpeg')

async function upload(localPath, destPath, contentType) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${destPath}`, {
    method: 'POST',
    headers: {
      // Chave nova (sb_secret_) é token opaco: vai no header `apikey`, não como Bearer JWT
      // (senão o storage-api dá "Invalid Compact JWS"). Chave antiga (JWT) aceita Bearer.
      apikey: SUPABASE_SECRET_KEY,
      ...(SUPABASE_SECRET_KEY.startsWith('sb_') ? {} : { Authorization: `Bearer ${SUPABASE_SECRET_KEY}` }),
      'Content-Type': contentType,
      'x-upsert': 'true'
    },
    body: readFileSync(localPath)
  })
  if (!res.ok) throw new Error(`${destPath}: ${res.status} ${await res.text()}`)
}

const folders = readdirSync(SRC).filter((d) => statSync(SRC + d).isDirectory())
let ok = 0, miss = []
for (const folder of folders) {
  const slug = folderToSlug[folder] || folder
  const files = readdirSync(SRC + folder).filter((f) => statSync(SRC + folder + '/' + f).isFile())
  const cover = pick(files, /^cover\.+(jpe?g|webp|png)$/i)
  const hero = pick(files, /^hero\.(jpe?g|webp|png)$/i)
  if (cover) { await upload(`${SRC}${folder}/${cover}`, `services/${slug}/cover.jpg`, mime(cover)); ok++ }
  else miss.push(`${slug}: sem cover`)
  if (hero) { await upload(`${SRC}${folder}/${hero}`, `services/${slug}/hero.webp`, mime(hero)); ok++ }
  else miss.push(`${slug}: sem hero`)
  console.log(`✓ ${slug}`)
}
console.log(`\n${ok} arquivos enviados.`)
if (miss.length) console.log('Faltando:\n  ' + miss.join('\n  '))
