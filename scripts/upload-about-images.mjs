// Migração única: sobe as fotos institucionais (public/images/about/) para o
// Supabase Storage no prefixo about/, mantendo os nomes — trocar foto = upload, sem deploy.
//
// Uso (mesmos nomes de env do backend):
//   SUPABASE_URL=https://xxx.supabase.co \
//   SUPABASE_SECRET_KEY=<service_role_key> \
//   SUPABASE_BUCKET=midia \
//   node scripts/upload-about-images.mjs
//
// Sobe para o prefixo about/ do bucket (ex.: midia/about/cover-2.jpg).

import { readFileSync, readdirSync, statSync } from 'node:fs'

const { SUPABASE_URL, SUPABASE_SECRET_KEY, SUPABASE_BUCKET } = process.env
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !SUPABASE_BUCKET) {
  console.error('Faltam env: SUPABASE_URL, SUPABASE_SECRET_KEY, SUPABASE_BUCKET')
  process.exit(1)
}

const SRC = new URL('../public/images/about/', import.meta.url).pathname
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

const files = readdirSync(SRC).filter((f) => statSync(SRC + f).isFile())
let ok = 0
for (const file of files) {
  await upload(`${SRC}${file}`, `about/${file}`, mime(file))
  console.log(`✓ about/${file}`)
  ok++
}
console.log(`\n${ok} arquivos enviados.`)
