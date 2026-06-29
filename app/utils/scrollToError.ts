import { nextTick } from 'vue'

// Rola e foca o primeiro campo inválido do passo atual (marcado com
// `aria-invalid` pelo UFormField). Em telas longas no mobile, o input inválido
// costuma ficar acima da viewport quando o usuário clica em Avançar/Finalizar lá
// embaixo — sem isso, ele só veria a mensagem de erro se rolasse de volta.
// Mover o foco também anuncia o erro no leitor de tela (WCAG 3.3.1).
export function scrollToFirstInvalid() {
  if (!import.meta.client) return
  nextTick(() => {
    const el = document.querySelector<HTMLElement>('[aria-invalid="true"]')
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.focus({ preventScroll: true })
  })
}
