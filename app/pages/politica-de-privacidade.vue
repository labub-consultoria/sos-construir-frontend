<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Política de Privacidade' }
]

useBreadcrumbSchema(breadcrumbItems)

useSeoMeta({
  title: 'Política de Privacidade',
  description:
    'Como a SOS Construir coleta, usa, compartilha e protege seus dados pessoais, e quais são os seus direitos conforme a LGPD (Lei nº 13.709/2018).',
  ogTitle: 'Política de Privacidade',
  ogDescription:
    'Saiba como tratamos seus dados pessoais e como exercer seus direitos previstos na LGPD.'
})

const ultimaAtualizacao = '22 de junho de 2026'

// Sumário (índice) — os `id` casam com os `<section>` do conteúdo.
const toc = [
  { id: 'introducao', title: '1. Introdução' },
  { id: 'definicoes', title: '2. Definições' },
  { id: 'dados-coletados', title: '3. Dados que coletamos' },
  { id: 'como-coletamos', title: '4. Como coletamos' },
  { id: 'finalidades', title: '5. Para que usamos' },
  { id: 'bases-legais', title: '6. Bases legais' },
  { id: 'compartilhamento', title: '7. Com quem compartilhamos' },
  { id: 'cookies', title: '8. Cookies e armazenamento local' },
  { id: 'seguranca', title: '9. Segurança da informação' },
  { id: 'retencao', title: '10. Retenção dos dados' },
  { id: 'transferencia', title: '11. Transferência internacional' },
  { id: 'direitos', title: '12. Seus direitos' },
  { id: 'menores', title: '13. Menores de idade' },
  { id: 'alteracoes', title: '14. Alterações desta Política' },
  { id: 'contato', title: '15. Contato e Encarregado' }
]

const h2 = 'text-xl font-bold text-blue-500 mb-3'
const p = 'text-slate-600 leading-relaxed'
const ul = 'list-disc pl-5 space-y-1.5 text-slate-600 leading-relaxed'
</script>

<template>
  <div class="min-h-screen bg-white">
    <section class="w-full">
      <div class="container max-w-6xl mx-auto px-4 pt-8">
        <div class="text-sm text-gray-500 mb-6 flex gap-2 items-center">
          <UBreadcrumb :items="breadcrumbItems" />
        </div>

        <header class="mb-10">
          <h1 class="text-blue-500 text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1]">
            Política de Privacidade
          </h1>
          <p class="text-slate-500 mt-3">
            Última atualização: {{ ultimaAtualizacao }}
          </p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10 lg:gap-12 pb-20">
          <!-- Sumário -->
          <aside class="lg:sticky lg:top-8 lg:self-start">
            <nav aria-label="Sumário da Política de Privacidade" class="rounded-2xl border border-gray-100 p-5">
              <h2 class="text-sm font-bold uppercase tracking-[0.12em] text-blue-500 mb-4">
                Nesta página
              </h2>
              <ul class="flex flex-col gap-1">
                <li v-for="item in toc" :key="item.id">
                  <a
                    :href="`#${item.id}`"
                    class="block py-1 text-sm text-slate-600 hover:text-primary transition-colors"
                  >
                    {{ item.title }}
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          <!-- Conteúdo -->
          <article class="max-w-2xl flex flex-col gap-10">
            <p :class="p">
              Esta Política de Privacidade explica como a SOS Construir coleta, usa, compartilha e
              protege os dados pessoais tratados em seu site, em conformidade com a Lei nº 13.709/2018
              (Lei Geral de Proteção de Dados — LGPD). Ela complementa os
              <ULink to="/termos-de-uso" class="text-blue-600 hover:underline">Termos de Uso</ULink>.
            </p>

            <section id="introducao" class="scroll-mt-24">
              <h2 :class="h2">1. Introdução</h2>
              <p :class="p">
                A SOS Construir (razão social {{ RAZAO_SOCIAL }}, CNPJ {{ formatCnpj(CNPJ) }}), com
                sede em {{ ENDERECO }}, atua como <strong>controladora</strong> dos dados pessoais
                coletados neste site. Ao
                utilizar o site ou enviar um cadastro, você declara estar ciente desta Política.
              </p>
            </section>

            <section id="definicoes" class="scroll-mt-24">
              <h2 :class="h2">2. Definições</h2>
              <ul :class="ul">
                <li><strong>Dado pessoal</strong>: informação relacionada a pessoa natural identificada ou identificável.</li>
                <li><strong>Titular</strong>: a pessoa a quem os dados se referem (você).</li>
                <li><strong>Tratamento</strong>: qualquer operação com dados (coleta, uso, armazenamento, compartilhamento, eliminação, etc.).</li>
                <li><strong>Controlador</strong>: quem decide sobre o tratamento — a SOS Construir.</li>
                <li><strong>Operador</strong>: quem trata dados em nome do controlador (ex.: fornecedores de tecnologia).</li>
                <li><strong>Encarregado (DPO)</strong>: responsável por atuar como canal entre você, a SOS Construir e a ANPD.</li>
              </ul>
            </section>

            <section id="dados-coletados" class="scroll-mt-24">
              <h2 :class="h2">3. Dados que coletamos</h2>
              <p :class="p"><strong>Dados de cadastro de profissional:</strong></p>
              <ul :class="ul" class="mt-2">
                <li>identificação: nome, CPF ou CRNM, data de nascimento;</li>
                <li>contato: telefone/WhatsApp e e-mail;</li>
                <li>endereço: CEP, rua, número, complemento, bairro, cidade e estado;</li>
                <li>perfil: foto (opcional) e categorias de atuação informadas.</li>
              </ul>
              <p :class="p" class="mt-3"><strong>Dados de empresas parceiras:</strong> razão social, nome fantasia, CNPJ (quando houver), contato, endereço, logo e categorias.</p>
              <p :class="p" class="mt-3"><strong>Dados de navegação:</strong> informações técnicas geradas automaticamente, como endereço IP, tipo de dispositivo e páginas acessadas, além de dados guardados no seu navegador (ver seção 8).</p>
            </section>

            <section id="como-coletamos" class="scroll-mt-24">
              <h2 :class="h2">4. Como coletamos</h2>
              <ul :class="ul">
                <li><strong>Diretamente de você</strong>, quando preenche e envia os formulários de cadastro;</li>
                <li><strong>Automaticamente</strong>, durante a navegação no site;</li>
                <li><strong>De terceiros</strong>, como o serviço de consulta de CEP, que retorna dados de endereço a partir do CEP informado por você.</li>
              </ul>
            </section>

            <section id="finalidades" class="scroll-mt-24">
              <h2 :class="h2">5. Para que usamos seus dados</h2>
              <ul :class="ul">
                <li>analisar, aprovar e gerir o seu cadastro na rede;</li>
                <li>entrar em contato sobre o resultado da análise e sobre oportunidades;</li>
                <li>exibir o perfil aprovado de profissionais e parceiros no site;</li>
                <li>conectar profissionais a clientes e viabilizar a prestação de serviços;</li>
                <li>prevenir fraudes, garantir segurança e cumprir obrigações legais e regulatórias.</li>
              </ul>
            </section>

            <section id="bases-legais" class="scroll-mt-24">
              <h2 :class="h2">6. Bases legais</h2>
              <p :class="p">
                Tratamos dados pessoais com fundamento nas seguintes bases legais da LGPD (art. 7º e 11):
              </p>
              <ul :class="ul" class="mt-3">
                <li><strong>Consentimento</strong>, manifestado ao aceitar esta Política no cadastro;</li>
                <li><strong>Procedimentos preliminares</strong> relacionados ao seu pedido de ingresso na rede;</li>
                <li><strong>Legítimo interesse</strong> na gestão, segurança e divulgação da rede;</li>
                <li><strong>Cumprimento de obrigação legal ou regulatória</strong>, quando aplicável.</li>
              </ul>
            </section>

            <section id="compartilhamento" class="scroll-mt-24">
              <h2 :class="h2">7. Com quem compartilhamos</h2>
              <p :class="p">
                Podemos compartilhar dados pessoais, na medida necessária às finalidades acima, com:
              </p>
              <ul :class="ul" class="mt-3">
                <li><strong>clientes e parceiros</strong> da rede, para viabilizar a prestação de serviços;</li>
                <li><strong>operadores</strong> que prestam serviços de tecnologia (hospedagem, armazenamento e infraestrutura), tratando dados em nome e sob instruções da SOS Construir;</li>
                <li><strong>autoridades públicas</strong>, quando exigido por lei ou ordem judicial.</li>
              </ul>
              <p :class="p" class="mt-3">
                <strong>Não vendemos seus dados pessoais.</strong>
              </p>
            </section>

            <section id="cookies" class="scroll-mt-24">
              <h2 :class="h2">8. Cookies e armazenamento local</h2>
              <p :class="p">
                Utilizamos o armazenamento local do seu navegador para salvar o rascunho do seu cadastro,
                permitindo que você retome de onde parou. Também podemos usar cookies e tecnologias
                essenciais ao funcionamento do site. Você pode limpar esses dados pelas configurações do
                seu navegador, ciente de que isso pode afetar funcionalidades como a retomada do
                rascunho.
              </p>
            </section>

            <section id="seguranca" class="scroll-mt-24">
              <h2 :class="h2">9. Segurança da informação</h2>
              <p :class="p">
                Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados pessoais
                contra acessos não autorizados e situações de destruição, perda, alteração ou
                divulgação indevidas. Nenhum sistema é totalmente imune a riscos; em caso de incidente
                relevante, adotaremos as providências previstas na LGPD.
              </p>
            </section>

            <section id="retencao" class="scroll-mt-24">
              <h2 :class="h2">10. Retenção dos dados</h2>
              <p :class="p">
                Mantemos os dados pessoais pelo tempo necessário ao cumprimento das finalidades desta
                Política e das obrigações legais aplicáveis. Encerrada essa necessidade, os dados são
                eliminados ou anonimizados, salvo quando a conservação for autorizada por lei.
              </p>
            </section>

            <section id="transferencia" class="scroll-mt-24">
              <h2 :class="h2">11. Transferência internacional</h2>
              <p :class="p">
                Alguns de nossos operadores de tecnologia podem armazenar ou processar dados em
                servidores localizados fora do Brasil. Nesses casos, adotamos as garantias exigidas pela
                LGPD para assegurar um nível adequado de proteção aos seus dados.
              </p>
            </section>

            <section id="direitos" class="scroll-mt-24">
              <h2 :class="h2">12. Seus direitos</h2>
              <p :class="p">
                Nos termos do art. 18 da LGPD, você pode, a qualquer momento, solicitar:
              </p>
              <ul :class="ul" class="mt-3">
                <li>confirmação da existência de tratamento e acesso aos seus dados;</li>
                <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
                <li>portabilidade dos dados a outro fornecedor, mediante requisição;</li>
                <li>informação sobre as entidades com as quais compartilhamos seus dados;</li>
                <li>informação sobre a possibilidade de não consentir e as consequências disso;</li>
                <li>revogação do consentimento e eliminação dos dados tratados com base nele.</li>
              </ul>
              <p :class="p" class="mt-3">
                Para exercer seus direitos, utilize os canais da seção 15.
              </p>
            </section>

            <section id="menores" class="scroll-mt-24">
              <h2 :class="h2">13. Menores de idade</h2>
              <p :class="p">
                O cadastro de profissional é destinado a maiores de 18 anos. O site não tem o propósito
                de coletar dados de menores de idade; caso identifiquemos uma coleta indevida, os dados
                serão eliminados.
              </p>
            </section>

            <section id="alteracoes" class="scroll-mt-24">
              <h2 :class="h2">14. Alterações desta Política</h2>
              <p :class="p">
                Esta Política pode ser atualizada a qualquer momento. A versão vigente é sempre a
                publicada nesta página, com a data de &ldquo;última atualização&rdquo; no topo.
                Recomendamos revisá-la periodicamente.
              </p>
            </section>

            <section id="contato" class="scroll-mt-24">
              <h2 :class="h2">15. Contato e Encarregado</h2>
              <p :class="p">
                Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados, fale com a
                SOS Construir. O Encarregado pela Proteção de Dados (DPO) é
                {{ ENCARREGADO_DPO }}, pelos canais:
              </p>
              <ul :class="ul" class="mt-3">
                <li>
                  E-mail:
                  <ULink :to="`mailto:${EMAIL}`" class="text-blue-600 hover:underline">{{ EMAIL }}</ULink>
                </li>
                <li>
                  WhatsApp:
                  <ULink :to="`tel:+${PHONENUMBER}`" class="text-blue-600 hover:underline">{{ formatPhoneBR(PHONENUMBER) }}</ULink>
                </li>
              </ul>
            </section>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
