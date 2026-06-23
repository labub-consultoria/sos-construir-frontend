<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Termos de Uso' }
]

useBreadcrumbSchema(breadcrumbItems)

useSeoMeta({
  title: 'Termos de Uso',
  description:
    'Termos de Uso do site da SOS Construir: regras de uso, cadastro de profissionais e empresas parceiras, conteúdo enviado e tratamento de dados pessoais (LGPD).',
  ogTitle: 'Termos de Uso',
  ogDescription:
    'Conheça as regras de uso do site da SOS Construir e como tratamos seus dados ao se cadastrar na nossa rede.'
})

const ultimaAtualizacao = '22 de junho de 2026'

// Sumário (índice) — os `id` casam com os `<section>` do conteúdo.
const toc = [
  { id: 'aceitacao', title: '1. Aceitação dos Termos' },
  { id: 'definicoes', title: '2. Definições' },
  { id: 'identificacao', title: '3. Quem somos' },
  { id: 'uso-do-site', title: '4. Uso do site e elegibilidade' },
  { id: 'cadastro-profissional', title: '5. Cadastro de profissional' },
  { id: 'cadastro-empresa', title: '6. Cadastro de empresa parceira' },
  { id: 'analise', title: '7. Análise, aprovação e ausência de garantia' },
  { id: 'conteudo', title: '8. Conteúdo enviado por você' },
  { id: 'dados', title: '9. Dados pessoais e privacidade (LGPD)' },
  { id: 'propriedade', title: '10. Propriedade intelectual' },
  { id: 'terceiros', title: '11. Links e serviços de terceiros' },
  { id: 'responsabilidade', title: '12. Limitação de responsabilidade' },
  { id: 'suspensao', title: '13. Suspensão e encerramento' },
  { id: 'alteracoes', title: '14. Alterações destes Termos' },
  { id: 'lei', title: '15. Lei aplicável e foro' },
  { id: 'contato', title: '16. Contato' }
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
            Termos de Uso
          </h1>
          <p class="text-slate-500 mt-3">
            Última atualização: {{ ultimaAtualizacao }}
          </p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10 lg:gap-12 pb-20">
          <!-- Sumário -->
          <aside class="lg:sticky lg:top-8 lg:self-start">
            <nav aria-label="Sumário dos Termos de Uso" class="rounded-2xl border border-gray-100 p-5">
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
              Estes Termos de Uso (&ldquo;Termos&rdquo;) regem o acesso e o uso do site da SOS Construir
              e dos formulários de cadastro disponibilizados nele. Ao acessar o site ou enviar um
              cadastro, você declara ter lido, compreendido e concordado com estes Termos.
            </p>

            <section id="aceitacao" class="scroll-mt-24">
              <h2 :class="h2">1. Aceitação dos Termos</h2>
              <p :class="p">
                Ao utilizar o site ou ao marcar a opção de aceite no formulário de cadastro, você
                concorda integralmente com estes Termos e com a forma de tratamento de dados descrita
                na seção 9. Caso não concorde com qualquer condição, você não deve utilizar o site nem
                enviar um cadastro.
              </p>
            </section>

            <section id="definicoes" class="scroll-mt-24">
              <h2 :class="h2">2. Definições</h2>
              <ul :class="ul">
                <li><strong>SOS Construir</strong>: a empresa responsável pelo site e pela rede de profissionais e parceiros.</li>
                <li><strong>Usuário</strong>: qualquer pessoa que acessa o site.</li>
                <li><strong>Profissional</strong>: pessoa física que se cadastra para integrar a rede de prestadores de serviço.</li>
                <li><strong>Empresa parceira</strong>: pessoa jurídica que se cadastra como fornecedora ou parceira.</li>
                <li><strong>Cadastro</strong>: o conjunto de dados enviados por meio dos formulários do site.</li>
                <li><strong>Rede</strong>: o conjunto de profissionais e parceiros aprovados pela SOS Construir.</li>
              </ul>
            </section>

            <section id="identificacao" class="scroll-mt-24">
              <h2 :class="h2">3. Quem somos</h2>
              <p :class="p">
                O site é operado pela SOS Construir (razão social {{ RAZAO_SOCIAL }}, inscrita no
                CNPJ sob o nº {{ formatCnpj(CNPJ) }}), com sede em {{ ENDERECO }}. Em caso de dúvidas,
                utilize os canais da seção 16.
              </p>
            </section>

            <section id="uso-do-site" class="scroll-mt-24">
              <h2 :class="h2">4. Uso do site e elegibilidade</h2>
              <p :class="p">
                Você se compromete a utilizar o site de forma lícita e a fornecer informações
                verdadeiras, completas e atualizadas. Para se cadastrar como profissional, é necessário
                ter no mínimo 18 anos. É vedado:
              </p>
              <ul :class="ul" class="mt-3">
                <li>fornecer dados falsos, de terceiros sem autorização ou que violem direitos;</li>
                <li>tentar acessar áreas restritas, burlar validações ou comprometer a segurança do site;</li>
                <li>utilizar o site para fins ilícitos, fraudulentos ou que prejudiquem a SOS Construir ou terceiros.</li>
              </ul>
            </section>

            <section id="cadastro-profissional" class="scroll-mt-24">
              <h2 :class="h2">5. Cadastro de profissional</h2>
              <p :class="p">
                O cadastro de profissional é público e gratuito. No formulário, você informa dados
                pessoais (nome, CPF ou CRNM, data de nascimento, telefone e e-mail), endereço, uma foto
                de perfil (opcional) e as categorias de atuação. Você é o único responsável pela
                veracidade e pela atualização dessas informações.
              </p>
              <p :class="p" class="mt-3">
                O envio do cadastro <strong>não cria vínculo empregatício, societário ou de prestação
                de serviços</strong> com a SOS Construir, e não garante aprovação, ativação,
                exibição no site nem qualquer volume de trabalho.
              </p>
            </section>

            <section id="cadastro-empresa" class="scroll-mt-24">
              <h2 :class="h2">6. Cadastro de empresa parceira</h2>
              <p :class="p">
                Empresas interessadas em fornecer materiais ou patrocinar páginas de serviço podem se
                cadastrar pelos canais indicados no site. A exibição de marca, logo e conteúdo de
                qualquer parceiro depende de aprovação prévia da SOS Construir e pode ser ajustada,
                suspensa ou removida a qualquer momento, conforme estes Termos e o acordo comercial
                aplicável.
              </p>
            </section>

            <section id="analise" class="scroll-mt-24">
              <h2 :class="h2">7. Análise, aprovação e ausência de garantia</h2>
              <p :class="p">
                Todo cadastro é recebido com status pendente e passa por análise manual da SOS Construir
                antes de qualquer exibição ou ativação. A SOS Construir pode, a seu critério, aprovar,
                solicitar complementação, recusar ou exigir capacitação. Nenhum perfil é exibido no
                site sem aprovação explícita, e a recusa pode ocorrer sem que isso gere direito a
                indenização.
              </p>
            </section>

            <section id="conteudo" class="scroll-mt-24">
              <h2 :class="h2">8. Conteúdo enviado por você</h2>
              <p :class="p">
                Ao enviar fotos, textos ou outros materiais, você declara ser o titular dos direitos ou
                possuir autorização para usá-los, e que o conteúdo não viola direitos de terceiros nem a
                legislação. Você autoriza a SOS Construir a armazenar e, após aprovação, exibir esse
                conteúdo no site e em materiais de divulgação da rede, com a finalidade de apresentar o
                profissional ou parceiro. Essa autorização é gratuita e pode ser revogada mediante
                solicitação, observados os efeitos já produzidos.
              </p>
            </section>

            <section id="dados" class="scroll-mt-24">
              <h2 :class="h2">9. Dados pessoais e privacidade (LGPD)</h2>
              <p :class="p">
                O tratamento de dados pessoais segue a Lei nº 13.709/2018 (LGPD). A SOS Construir atua
                como controladora dos dados coletados nos formulários do site. Os detalhes completos
                estão na
                <ULink to="/politica-de-privacidade" class="text-blue-600 hover:underline">Política de Privacidade</ULink>.
              </p>
              <p :class="p" class="mt-3"><strong>Dados coletados:</strong> nome, CPF ou CRNM, data de nascimento, telefone, e-mail, endereço, foto de perfil e categorias de atuação informadas.</p>
              <p :class="p" class="mt-3"><strong>Finalidades:</strong> analisar e gerir o cadastro; entrar em contato sobre o resultado e sobre oportunidades; exibir o perfil aprovado na rede; e cumprir obrigações legais.</p>
              <p :class="p" class="mt-3"><strong>Bases legais:</strong> consentimento, execução de procedimentos preliminares a seu pedido e legítimo interesse na gestão da rede.</p>
              <p :class="p" class="mt-3"><strong>Compartilhamento:</strong> os dados podem ser compartilhados com clientes e parceiros da rede, na medida necessária à prestação dos serviços, e com fornecedores de tecnologia que tratam dados em nome da SOS Construir. Não vendemos seus dados.</p>
              <p :class="p" class="mt-3"><strong>Retenção:</strong> os dados são mantidos pelo tempo necessário às finalidades acima e ao cumprimento de obrigações legais; depois disso, são eliminados ou anonimizados.</p>
              <p :class="p" class="mt-3"><strong>Seus direitos (art. 18 da LGPD):</strong></p>
              <ul :class="ul" class="mt-2">
                <li>confirmação da existência de tratamento e acesso aos dados;</li>
                <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
                <li>portabilidade e informação sobre o compartilhamento;</li>
                <li>revogação do consentimento e eliminação dos dados tratados com base nele.</li>
              </ul>
              <p :class="p" class="mt-3">
                Para exercer seus direitos, utilize os canais da seção 16.
              </p>
            </section>

            <section id="propriedade" class="scroll-mt-24">
              <h2 :class="h2">10. Propriedade intelectual</h2>
              <p :class="p">
                A marca, o logotipo, o layout, os textos e os demais elementos do site pertencem à SOS
                Construir ou a seus licenciadores e são protegidos por lei. É vedada a reprodução, cópia
                ou uso sem autorização prévia e por escrito, ressalvado o conteúdo que você mesmo
                enviou.
              </p>
            </section>

            <section id="terceiros" class="scroll-mt-24">
              <h2 :class="h2">11. Links e serviços de terceiros</h2>
              <p :class="p">
                O site pode usar serviços de terceiros (por exemplo, consulta de CEP e formulários
                externos) e conter links para outros sites. A SOS Construir não controla esses serviços
                e não se responsabiliza por seu conteúdo, disponibilidade ou políticas de privacidade.
              </p>
            </section>

            <section id="responsabilidade" class="scroll-mt-24">
              <h2 :class="h2">12. Limitação de responsabilidade</h2>
              <p :class="p">
                O site é fornecido &ldquo;no estado em que se encontra&rdquo;. A SOS Construir adota
                esforços razoáveis para manter as informações corretas e o serviço disponível, mas não
                garante operação ininterrupta ou livre de erros. Na máxima medida permitida em lei, a
                SOS Construir não responde por danos indiretos decorrentes do uso do site, de
                indisponibilidades ou de informações fornecidas por usuários.
              </p>
            </section>

            <section id="suspensao" class="scroll-mt-24">
              <h2 :class="h2">13. Suspensão e encerramento</h2>
              <p :class="p">
                A SOS Construir pode suspender ou encerrar o acesso e remover cadastros que violem estes
                Termos, contenham dados falsos ou representem risco a terceiros, à rede ou à própria SOS
                Construir, registrando as alterações de status para fins de auditoria.
              </p>
            </section>

            <section id="alteracoes" class="scroll-mt-24">
              <h2 :class="h2">14. Alterações destes Termos</h2>
              <p :class="p">
                Estes Termos podem ser atualizados a qualquer momento. A versão vigente é sempre a
                publicada nesta página, com a data de &ldquo;última atualização&rdquo; no topo. O uso
                continuado do site após mudanças significa concordância com a versão revisada.
              </p>
            </section>

            <section id="lei" class="scroll-mt-24">
              <h2 :class="h2">15. Lei aplicável e foro</h2>
              <p :class="p">
                Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o
                foro da Comarca de Foz do Iguaçu/PR para dirimir eventuais controvérsias, com renúncia a
                qualquer outro, por mais privilegiado que seja.
              </p>
            </section>

            <section id="contato" class="scroll-mt-24">
              <h2 :class="h2">16. Contato</h2>
              <p :class="p">
                Dúvidas sobre estes Termos ou solicitações relativas a dados pessoais podem ser
                encaminhadas para:
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
