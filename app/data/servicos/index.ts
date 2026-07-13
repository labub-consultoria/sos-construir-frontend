import type { ServicePage } from '~~/shared/types/servicePage'
import p_pintor from './pintor.json'
import p_metalurgica from './metalurgica.json'
import p_paver from './paver.json'
import p_instalacao_de_portas from './instalacao-de-portas.json'
import p_energia_solar from './energia-solar.json'
import p_terraplanagem from './terraplanagem.json'
import p_locacao_de_equipamentos_pesados from './locacao-de-equipamentos-pesados.json'
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
import p_marcenaria from './marcenaria.json'
import p_impermeabilizacao from './impermeabilizacao.json'
import p_portao_eletronico from './portao-eletronico.json'
import p_desentupidora from './desentupidora.json'
import p_toldos_e_coberturas from './toldos-e-coberturas.json'
import p_limpeza_de_caixa_dagua from './limpeza-de-caixa-dagua.json'
import p_papel_de_parede from './papel-de-parede.json'
import p_montador_de_moveis from './montador-de-moveis.json'
import p_automacao_residencial from './automacao-residencial.json'
import p_demolicao from './demolicao.json'
import p_rufos_e_calhas from './rufos-e-calhas.json'
import p_manutencao_de_piscina from './manutencao-de-piscina.json'
import p_piso_laminado_e_vinilico from './piso-laminado-e-vinilico.json'
import p_cameras_de_seguranca from './cameras-de-seguranca.json'
import p_marmoraria from './marmoraria.json'
import p_cerca_eletrica from './cerca-eletrica.json'
import p_forro_de_pvc from './forro-de-pvc.json'
import p_steel_frame from './steel-frame.json'
import p_corrimao_e_guarda_corpo from './corrimao-e-guarda-corpo.json'
import p_grama_sintetica from './grama-sintetica.json'
import p_deck_de_madeira from './deck-de-madeira.json'
import p_irrigacao_automatizada from './irrigacao-automatizada.json'
import p_persianas_e_cortinas from './persianas-e-cortinas.json'
import p_interfone_e_video_porteiro from './interfone-e-video-porteiro.json'
import p_aterramento_e_spda from './aterramento-e-spda.json'
import p_rede_de_protecao from './rede-de-protecao.json'
import p_isolamento_termico_e_acustico from './isolamento-termico-e-acustico.json'
import p_aquecimento_solar_de_agua from './aquecimento-solar-de-agua.json'
import p_reforma_de_estofados from './reforma-de-estofados.json'
import p_muro_e_arrimo from './muro-e-arrimo.json'
import p_fossa_septica from './fossa-septica.json'
import p_chaveiro from './chaveiro.json'
import p_marido_de_aluguel from './marido-de-aluguel.json'
import p_dedetizacao from './dedetizacao.json'
import p_limpeza_pos_obra from './limpeza-pos-obra.json'
import p_alarme_residencial from './alarme-residencial.json'
import p_comunicacao_visual from './comunicacao-visual.json'
import p_telhado_metalico from './telhado-metalico.json'
import p_laje_pre_moldada from './laje-pre-moldada.json'
import p_ripados from './ripados.json'
import p_pavimentacao_asfaltica from './pavimentacao-asfaltica.json'

// Mapa slug -> conteúdo da página. Um arquivo por serviço (autoria isolada);
// adicionar serviço = criar o .json e incluí-lo aqui.
export const servicePages: Record<string, ServicePage> = {
  'pintor': p_pintor,
  'metalurgica': p_metalurgica,
  'paver': p_paver,
  'instalacao-de-portas': p_instalacao_de_portas,
  'energia-solar': p_energia_solar,
  'terraplanagem': p_terraplanagem,
  'locacao-de-equipamentos-pesados': p_locacao_de_equipamentos_pesados,
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
  'marcenaria': p_marcenaria,
  'impermeabilizacao': p_impermeabilizacao,
  'portao-eletronico': p_portao_eletronico,
  'desentupidora': p_desentupidora,
  'toldos-e-coberturas': p_toldos_e_coberturas,
  'limpeza-de-caixa-dagua': p_limpeza_de_caixa_dagua,
  'papel-de-parede': p_papel_de_parede,
  'montador-de-moveis': p_montador_de_moveis,
  'automacao-residencial': p_automacao_residencial,
  'demolicao': p_demolicao,
  'rufos-e-calhas': p_rufos_e_calhas,
  'manutencao-de-piscina': p_manutencao_de_piscina,
  'piso-laminado-e-vinilico': p_piso_laminado_e_vinilico,
  'cameras-de-seguranca': p_cameras_de_seguranca,
  'marmoraria': p_marmoraria,
  'cerca-eletrica': p_cerca_eletrica,
  'forro-de-pvc': p_forro_de_pvc,
  'steel-frame': p_steel_frame,
  'corrimao-e-guarda-corpo': p_corrimao_e_guarda_corpo,
  'grama-sintetica': p_grama_sintetica,
  'deck-de-madeira': p_deck_de_madeira,
  'irrigacao-automatizada': p_irrigacao_automatizada,
  'persianas-e-cortinas': p_persianas_e_cortinas,
  'interfone-e-video-porteiro': p_interfone_e_video_porteiro,
  'aterramento-e-spda': p_aterramento_e_spda,
  'rede-de-protecao': p_rede_de_protecao,
  'isolamento-termico-e-acustico': p_isolamento_termico_e_acustico,
  'aquecimento-solar-de-agua': p_aquecimento_solar_de_agua,
  'reforma-de-estofados': p_reforma_de_estofados,
  'muro-e-arrimo': p_muro_e_arrimo,
  'fossa-septica': p_fossa_septica,
  'chaveiro': p_chaveiro,
  'marido-de-aluguel': p_marido_de_aluguel,
  'dedetizacao': p_dedetizacao,
  'limpeza-pos-obra': p_limpeza_pos_obra,
  'alarme-residencial': p_alarme_residencial,
  'comunicacao-visual': p_comunicacao_visual,
  'telhado-metalico': p_telhado_metalico,
  'laje-pre-moldada': p_laje_pre_moldada,
  'ripados': p_ripados,
  'pavimentacao-asfaltica': p_pavimentacao_asfaltica,
}
