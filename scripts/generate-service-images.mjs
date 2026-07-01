// Gera as 2 imagens (hero 16:9 + cover 4:3) de um serviço via OpenRouter Image API e,
// com --upload, converte as revisadas (hero.webp/cover.jpg) e sobe pro bucket Supabase.
// Chaves/modelo no .env (LLM_MODEL/LLM_KEY p/ gerar; SUPABASE_* p/ publicar).
//
// Uso:
//   node scripts/generate-service-images.mjs                 # gera ar-condicionado (padrão)
//   node scripts/generate-service-images.mjs <slug> [slug]   # gera slugs específicos
//   node scripts/generate-service-images.mjs [slug] --hero   # só um lado (preserva o outro)
//   node scripts/generate-service-images.mjs <slug> --upload # publica as revisadas no bucket
//
// Fluxo: gerar → revisar em scripts/generated/<slug>/ → --upload.
// Prompts por serviço em scripts/service-image-prompts.json ({ subject, attire, scene, light }).

import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import sharp from 'sharp'

// .env tem um bloco multi-linha (comando Supabase) que quebra dotenv genérico — leio só
// as chaves que preciso, casando `KEY=valor` no início da linha e limpando o `\` final.
function loadEnv(keys) {
  const out = {}
  for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m && keys.includes(m[1])) out[m[1]] = m[2].replace(/\\\s*$/, '').trim()
  }
  return out
}

// Fórmula da spec (§5): estilo/técnico constantes + humanização calibrada (§5.1: polished —
// luz natural, enquadramento levemente descentralizado, textura real; sem "selfie de celular").
const STYLE = 'Professional commercial photography, photorealistic, shot on a DSLR, clean and bright color grading, natural soft light, slightly off-center candid framing, real skin and material textures, a real work environment, focused on the task, not looking at the camera'
const TECH = 'High resolution, sharp focus, natural depth of field, correctly proportioned hands'
const AVOID = 'Avoid: text, watermark, logo, brand emblems or patches on clothing, any text on clothing, brand names on tools or equipment, deformed hands, extra fingers, blurry, cartoon, illustration, 3d render, distorted tools, unsafe practices, cluttered background'
// Regra do sujeito (global): homem + uniforme liso sem logo (§8 — evita marca inventada).
const WORKER = 'The professional is a man wearing a plain solid-color uniform with no visible logos, patches, or text.'
// Hero: sujeito na DIREITA (o layout renderiza object-right e o texto ocupa a esquerda).
const FRAME = { hero: 'Wide establishing shot, the full environment visible, the professional and the equipment positioned on the right third of the frame, with open uncluttered empty space on the left half for text', cover: 'Medium shot, tight on the professional and the action' }
const ASPECT = { hero: '16:9', cover: '4:3' }
const FORMAT = { hero: 'webp', cover: 'jpeg' }
const lightPhrase = (l) => (l === 'externo' ? 'Bright natural sunlight, clear blue sky' : 'Soft, professional indoor lighting')

const buildPrompt = (p, kind) =>
  `${FRAME[kind]} of ${p.subject}, wearing ${p.attire}, in ${p.scene}. ${WORKER} ${lightPhrase(p.light)}. ${STYLE}. ${TECH}. ${AVOID}.`

function detectExt(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'png'
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpg'
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp'
  return 'bin'
}

async function generate(model, key, prompt, aspect, format) {
  const res = await fetch('https://openrouter.ai/api/v1/images', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, aspect_ratio: aspect, resolution: '1K', output_format: format })
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  const json = await res.json()
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error('sem imagem na resposta: ' + JSON.stringify(json).slice(0, 300))
  return { buf: Buffer.from(b64, 'base64'), cost: json.usage?.cost }
}

// Alvos de publicação (§4): converte/comprime a imagem revisada nos nomes da convenção.
const TARGET = {
  hero: { file: 'hero.webp', w: 1600, h: 900, type: 'image/webp' },
  cover: { file: 'cover.jpg', w: 1200, h: 900, type: 'image/jpeg' }
}

async function convert(srcPath, kind) {
  const t = TARGET[kind]
  const img = sharp(srcPath).resize(t.w, t.h, { fit: 'cover', withoutEnlargement: true })
  return kind === 'hero' ? img.webp({ quality: 80 }).toBuffer() : img.jpeg({ quality: 82 }).toBuffer()
}

async function uploadToBucket(env, destPath, buf, contentType) {
  const res = await fetch(`${env.SUPABASE_URL}/storage/v1/object/${env.SUPABASE_BUCKET}/${destPath}`, {
    method: 'POST',
    headers: {
      // Chave nova (sb_secret_) é token opaco no header `apikey`; chave antiga (JWT) aceita Bearer.
      apikey: env.SUPABASE_SECRET_KEY,
      ...(env.SUPABASE_SECRET_KEY.startsWith('sb_') ? {} : { Authorization: `Bearer ${env.SUPABASE_SECRET_KEY}` }),
      'Content-Type': contentType,
      'x-upsert': 'true'
    },
    body: buf
  })
  if (!res.ok) throw new Error(`${destPath}: ${res.status} ${await res.text()}`)
}

const args = process.argv.slice(2)
// --hero/--cover limita a um lado (preserva o outro); slugs = args sem `--`
const kinds = args.includes('--hero') ? ['hero'] : args.includes('--cover') ? ['cover'] : ['hero', 'cover']
const slugArgs = args.filter((a) => !a.startsWith('--'))
const slugs = slugArgs.length ? slugArgs : ['ar-condicionado']
const srcOf = (dir, kind) => readdirSync(dir).find((f) => new RegExp(`^${kind}\\.(png|jpe?g|webp)$`).test(f))

// --upload: NÃO regera — pega o que foi revisado em generated/, converte e sobe pro bucket.
if (args.includes('--upload')) {
  const env = loadEnv(['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_BUCKET'])
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY || !env.SUPABASE_BUCKET) {
    console.error('Faltam SUPABASE_URL / SUPABASE_SECRET_KEY / SUPABASE_BUCKET no .env')
    process.exit(1)
  }
  for (const slug of slugs) {
    const dir = new URL(`./generated/${slug}/`, import.meta.url).pathname
    for (const kind of kinds) {
      const src = srcOf(dir, kind)
      if (!src) { console.error(`✗ ${slug}/${kind}: sem imagem revisada em generated/`); continue }
      try {
        const buf = await convert(`${dir}${src}`, kind)
        const dest = `services/${slug}/${TARGET[kind].file}`
        await uploadToBucket(env, dest, buf, TARGET[kind].type)
        console.log(`✓ ${dest} — ${(buf.length / 1024).toFixed(0)} KB`)
      } catch (e) {
        console.error(`✗ ${slug}/${kind}: ${e.message}`)
      }
    }
  }
  console.log('\nPublicado. As imagens já resolvem no site pela convenção do slug.')
  process.exit(0)
}

// Geração (padrão)
const { LLM_KEY, LLM_MODEL } = loadEnv(['LLM_KEY', 'LLM_MODEL'])
if (!LLM_KEY || !LLM_MODEL) {
  console.error('Faltam LLM_KEY / LLM_MODEL no .env')
  process.exit(1)
}
const prompts = JSON.parse(readFileSync(new URL('./service-image-prompts.json', import.meta.url)))

console.log(`Modelo: ${LLM_MODEL}\n`)
for (const slug of slugs) {
  const p = prompts[slug]
  if (!p) { console.error(`✗ sem prompt para "${slug}" em service-image-prompts.json`); continue }
  const dir = new URL(`./generated/${slug}/`, import.meta.url).pathname
  mkdirSync(dir, { recursive: true })
  for (const kind of kinds) {
    const prompt = buildPrompt(p, kind)
    console.log(`▸ ${slug}/${kind} (${ASPECT[kind]})`)
    try {
      const { buf, cost } = await generate(LLM_MODEL, LLM_KEY, prompt, ASPECT[kind], FORMAT[kind])
      const ext = detectExt(buf)
      // remove versões antigas deste kind (a extensão pode mudar entre runs)
      for (const f of readdirSync(dir)) if (f.startsWith(`${kind}.`)) rmSync(`${dir}${f}`)
      const file = `${dir}${kind}.${ext}`
      writeFileSync(file, buf)
      console.log(`  ✓ ${file} — ${(buf.length / 1024).toFixed(0)} KB${cost != null ? ` · $${cost}` : ''}`)
    } catch (e) {
      console.error(`  ✗ ${e.message}`)
    }
  }
}
console.log('\nRevise em scripts/generated/ e publique com --upload.')
