// Analise de conformidade de um prototipo (um frame de nivel superior).
//
// Metricas produzidas, por prototipo:
//  - contraste de texto (WCAG 2.2, criterio 1.4.3)
//  - contraste de componentes de interface (WCAG 2.2, criterio 1.4.11)
//  - tamanho de alvo de toque (WCAG 2.2, criterio 2.5.8, minimo 24x24)
//  - aderencia ao design system (% de nos que usam componentes/estilos da biblioteca)
//  - contagem de valores fora dos tokens (cores e tamanhos de fonte soltos)
//  - densidade: contagem de elementos por tela
//
// Limitacoes conhecidas (declarar na monografia):
//  - o fundo efetivo de um texto e aproximado pelo fundo solido do ancestral
//    mais proximo; sobreposicoes complexas e imagens nao sao resolvidas.
//  - "componente de interface" e identificado por heuristica de nome e tipo,
//    ja que a API REST nem sempre expoe reactions/estados interativos.
//    Conta-se apenas o componente mais externo de cada ramo (versao 2,
//    09/10/2026); nos ocultos (visible=false) sao ignorados com a subarvore.

'use strict';

const { razaoContraste, compor, paraHex } = require('./cor');

const ALVO_MIN_PX = 24; // WCAG 2.2, 2.5.8 (AA)
const LIMIAR_TEXTO_NORMAL = 4.5; // 1.4.3
const LIMIAR_TEXTO_GRANDE = 3.0; // 1.4.3 (texto grande)
const LIMIAR_COMPONENTE = 3.0; // 1.4.11

const PALAVRAS_COMPONENTE = [
  'button', 'botao', 'btn', 'input', 'campo', 'checkbox', 'radio', 'toggle',
  'switch', 'chip', ' tab', 'link', 'icon-button', 'fab', 'select', 'dropdown',
  'stepper', 'slider',
];

// Tipos que sao contêiner estrutural: nao contam para aderencia (o fundo de um
// frame nao e um "valor solto") nem sao tratados como componente de interface,
// exceto quando o proprio no e uma instancia/componente.
const CONTEINERES = ['DOCUMENT', 'CANVAS', 'PAGE', 'SECTION', 'FRAME', 'GROUP'];

function primeiroFillSolido(node) {
  const fills = node.fills || [];
  return fills.find((f) => f.visible !== false && f.type === 'SOLID') || null;
}

function corDoFill(fill) {
  if (!fill || !fill.color) return null;
  const { r, g, b } = fill.color;
  const a = fill.opacity == null ? (fill.color.a == null ? 1 : fill.color.a) : fill.opacity;
  return { r, g, b, a };
}

function ehTextoGrande(style) {
  if (!style) return false;
  const tamanho = style.fontSize || 0;
  const peso = style.fontWeight || 400;
  // 18.66px bold ou 24px normal, conforme WCAG.
  return tamanho >= 24 || (tamanho >= 18.66 && peso >= 700);
}

function pareceComponente(node, ehRaiz) {
  if (['INSTANCE', 'COMPONENT', 'COMPONENT_SET'].includes(node.type)) return true;
  if (ehRaiz) return false; // o frame raiz do prototipo nunca e "um componente"
  const nome = (node.name || '').toLowerCase();
  return PALAVRAS_COMPONENTE.some((p) => nome.includes(p));
}

function usaBibliotecaDoDesignSystem(node) {
  // Nos com estilos vinculados (fill/text/effect/stroke) ou instancias de
  // componentes sao considerados aderentes ao design system.
  if (node.type === 'INSTANCE' && node.componentId) return true;
  if (node.styles && Object.keys(node.styles).length > 0) return true;
  if (node.boundVariables && Object.keys(node.boundVariables).length > 0) return true;
  return false;
}

function temPreenchimentoOuTraco(node) {
  const fills = (node.fills || []).filter((f) => f.visible !== false);
  const strokes = (node.strokes || []).filter((s) => s.visible !== false);
  return fills.length > 0 || strokes.length > 0;
}

// tokens: { cores: Set<hex>, tamanhosFonte: Set<number> } (opcional)
function analisarPrototipo(frame, opcoes = {}) {
  const tokens = opcoes.tokens || null;
  const findings = [];
  let totalNos = 0;
  let nosAderentes = 0;
  let nosElegiveisAderencia = 0; // nos com preenchimento/traco proprio
  let textos = 0;
  let textosAprovados = 0;
  let componentes = 0;
  let componentesContrasteAprovados = 0;
  let alvos = 0;
  let alvosAprovados = 0;
  const coresForaToken = new Set();
  const tamanhosForaToken = new Set();

  function registrar(tipo, gravidade, node, detalhe) {
    findings.push({
      prototipo: frame.name,
      criterio: tipo,
      gravidade, // 'reprova' | 'alerta'
      no: node.name || node.id,
      noId: node.id,
      detalhe,
    });
  }

  // dentroDeComponente: ja existe um ancestral contado como componente de
  // interface; pecas internas (icone dentro de botao, label dentro de chip)
  // nao sao alvos de toque nem componentes separados para 1.4.11 e 2.5.8.
  function andar(node, fundoHerdado, profundidade, dentroDeComponente) {
    // nos ocultos (e toda a sua subarvore) nao aparecem na tela renderizada
    if (node.visible === false) return;
    totalNos += 1;
    const ehRaiz = profundidade === 0;
    const ehConteiner = CONTEINERES.includes(node.type);

    // fundo efetivo desta subarvore
    let fundo = fundoHerdado;
    const fillContainer = primeiroFillSolido(node);
    if (fillContainer && node.type !== 'TEXT') {
      const c = corDoFill(fillContainer);
      if (c) fundo = compor(c, fundo || { r: 1, g: 1, b: 1, a: 1 });
    }

    // aderencia ao design system (conteineres estruturais nao contam)
    const elegivelAderencia =
      node.type === 'INSTANCE' ||
      (!ehConteiner && (temPreenchimentoOuTraco(node) || node.type === 'TEXT'));
    if (elegivelAderencia) {
      nosElegiveisAderencia += 1;
      if (usaBibliotecaDoDesignSystem(node)) {
        nosAderentes += 1;
      } else {
        registrar('aderencia_design_system', 'alerta', node,
          'no com preenchimento/traco proprio, sem estilo ou variavel da biblioteca vinculada');
      }
    }

    // valores fora dos tokens
    const fillSolido = ehConteiner ? null : primeiroFillSolido(node);
    if (fillSolido) {
      const hex = paraHex(fillSolido.color);
      if (tokens && !tokens.cores.has(hex)) {
        coresForaToken.add(hex);
        registrar('valor_fora_token', 'alerta', node, `cor solta ${hex}`);
      } else if (!tokens) {
        coresForaToken.add(hex);
      }
    }
    if (node.type === 'TEXT' && node.style && node.style.fontSize) {
      const fs = Math.round(node.style.fontSize * 100) / 100;
      if (tokens && !tokens.tamanhosFonte.has(fs)) {
        tamanhosForaToken.add(fs);
        registrar('valor_fora_token', 'alerta', node, `tamanho de fonte solto ${fs}px`);
      } else if (!tokens) {
        tamanhosForaToken.add(fs);
      }
    }

    // contraste de texto (1.4.3)
    if (node.type === 'TEXT') {
      textos += 1;
      const fill = primeiroFillSolido(node);
      const corTexto = corDoFill(fill);
      const fundoRef = fundo || { r: 1, g: 1, b: 1, a: 1 };
      if (corTexto) {
        const corTextoComposta = compor(corTexto, fundoRef);
        const razao = razaoContraste(corTextoComposta, fundoRef);
        const limiar = ehTextoGrande(node.style) ? LIMIAR_TEXTO_GRANDE : LIMIAR_TEXTO_NORMAL;
        if (razao + 1e-9 >= limiar) {
          textosAprovados += 1;
        } else {
          registrar('contraste_texto_1.4.3', 'reprova', node,
            `razao ${razao.toFixed(2)}:1 (minimo ${limiar}:1) sobre fundo ${paraHex(fundoRef)}`);
        }
      } else {
        registrar('contraste_texto_1.4.3', 'alerta', node, 'cor de texto nao resolvida (fill nao solido)');
      }
    }

    // componente de interface: contraste 1.4.11 + alvo de toque 2.5.8
    const ehComponente = !dentroDeComponente && pareceComponente(node, ehRaiz);
    if (ehComponente) {
      componentes += 1;
      const fill = primeiroFillSolido(node);
      const corComp = corDoFill(fill);
      if (corComp && fundoHerdado) {
        const composta = compor(corComp, fundoHerdado);
        const razao = razaoContraste(composta, fundoHerdado);
        if (razao + 1e-9 >= LIMIAR_COMPONENTE) {
          componentesContrasteAprovados += 1;
        } else {
          registrar('contraste_componente_1.4.11', 'reprova', node,
            `razao ${razao.toFixed(2)}:1 (minimo ${LIMIAR_COMPONENTE}:1)`);
        }
      } else {
        componentesContrasteAprovados += 1; // sem preenchimento proprio: nao avaliavel aqui
      }

      const bb = node.absoluteBoundingBox;
      if (bb && typeof bb.width === 'number' && typeof bb.height === 'number') {
        alvos += 1;
        if (bb.width + 1e-6 >= ALVO_MIN_PX && bb.height + 1e-6 >= ALVO_MIN_PX) {
          alvosAprovados += 1;
        } else {
          registrar('alvo_toque_2.5.8', 'reprova', node,
            `${bb.width.toFixed(0)}x${bb.height.toFixed(0)} px (minimo ${ALVO_MIN_PX}x${ALVO_MIN_PX})`);
        }
      }
    }

    for (const filho of node.children || []) {
      andar(filho, fundo, profundidade + 1, dentroDeComponente || ehComponente);
    }
  }

  const fundoInicial = (() => {
    const f = primeiroFillSolido(frame);
    const c = corDoFill(f);
    return c ? compor(c, { r: 1, g: 1, b: 1, a: 1 }) : { r: 1, g: 1, b: 1, a: 1 };
  })();

  andar(frame, fundoInicial, 0, false);

  const pct = (n, d) => (d === 0 ? null : Math.round((n / d) * 10000) / 100);

  return {
    prototipo: frame.name,
    prototipoId: frame.id,
    metricas: {
      densidade_total_nos: totalNos,
      textos_total: textos,
      textos_aprovados_contraste: textosAprovados,
      textos_pct_conformidade_1_4_3: pct(textosAprovados, textos),
      componentes_total: componentes,
      componentes_aprovados_contraste: componentesContrasteAprovados,
      componentes_pct_conformidade_1_4_11: pct(componentesContrasteAprovados, componentes),
      alvos_toque_total: alvos,
      alvos_toque_aprovados: alvosAprovados,
      alvos_toque_pct_conformidade_2_5_8: pct(alvosAprovados, alvos),
      aderencia_design_system_pct: pct(nosAderentes, nosElegiveisAderencia),
      aderencia_nos_aderentes: nosAderentes,
      aderencia_nos_elegiveis: nosElegiveisAderencia,
      cores_distintas_fora_token: coresForaToken.size,
      tamanhos_fonte_distintos_fora_token: tamanhosForaToken.size,
    },
    valoresForaToken: {
      cores: [...coresForaToken].sort(),
      tamanhosFonte: [...tamanhosForaToken].sort((a, b) => a - b),
    },
    findings,
  };
}

module.exports = { analisarPrototipo, ALVO_MIN_PX };
