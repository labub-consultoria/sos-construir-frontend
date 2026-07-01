import type { ServicePage } from '~~/shared/types/servicePage'
import p_pintor from './pintor.json'
import p_metalurgica from './metalurgica.json'
import p_paver from './paver.json'
import p_instalacao_de_portas from './instalacao-de-portas.json'
import p_energia_solar from './energia-solar.json'
import p_terraplanagem_e_locacao from './terraplanagem-e-locacao.json'
import p_reforma_de_telhado from './reforma-de-telhado.json'
import p_gesso_e_drywall from './gesso-e-drywall.json'
import p_poco_artesiano from './poco-artesiano.json'
import p_vidracaria from './vidracaria.json'
import p_instalacao_de_gas from './instalacao-de-gas.json'
import p_pedras_decorativas from './pedras-decorativas.json'
import p_lago_artificial from './lago-artificial.json'
import p_jardinagem_e_paisagismo from './jardinagem-e-paisagismo.json'
import p_encanador from './encanador.json'
import p_eletricista from './eletricista.json'
import p_ceramica_e_porcelanato from './ceramica-e-porcelanato.json'
import p_concreto_polido from './concreto-polido.json'
import p_pedreiro from './pedreiro.json'
import p_construcao_de_piscinas from './construcao-de-piscinas.json'
import p_sofa_sob_medida from './sofa-sob-medida.json'
import p_reforma_e_construcao from './reforma-e-construcao.json'
import p_playground from './playground.json'
import p_ar_condicionado from './ar-condicionado.json'

// Mapa slug -> conteúdo da página. Um arquivo por serviço (autoria isolada);
// adicionar serviço = criar o .json e incluí-lo aqui.
export const servicePages: Record<string, ServicePage> = {
  'pintor': p_pintor,
  'metalurgica': p_metalurgica,
  'paver': p_paver,
  'instalacao-de-portas': p_instalacao_de_portas,
  'energia-solar': p_energia_solar,
  'terraplanagem-e-locacao': p_terraplanagem_e_locacao,
  'reforma-de-telhado': p_reforma_de_telhado,
  'gesso-e-drywall': p_gesso_e_drywall,
  'poco-artesiano': p_poco_artesiano,
  'vidracaria': p_vidracaria,
  'instalacao-de-gas': p_instalacao_de_gas,
  'pedras-decorativas': p_pedras_decorativas,
  'lago-artificial': p_lago_artificial,
  'jardinagem-e-paisagismo': p_jardinagem_e_paisagismo,
  'encanador': p_encanador,
  'eletricista': p_eletricista,
  'ceramica-e-porcelanato': p_ceramica_e_porcelanato,
  'concreto-polido': p_concreto_polido,
  'pedreiro': p_pedreiro,
  'construcao-de-piscinas': p_construcao_de_piscinas,
  'sofa-sob-medida': p_sofa_sob_medida,
  'reforma-e-construcao': p_reforma_e_construcao,
  'playground': p_playground,
  'ar-condicionado': p_ar_condicionado,
}
