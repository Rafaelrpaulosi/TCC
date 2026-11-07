// Gera o conjunto de validacao por defeitos injetados:
//   - frames-defeitos.json  (arquivo Figma sintetico, formato /v1/files)
//   - gabarito.json         (defeitos esperados por frame)
//
// 12 frames, cada um isolando um ou mais defeitos propositais. O runner
// rodar-validacao.js roda o verificador sobre este arquivo e compara o que
// foi detectado com o gabarito, produzindo a taxa de acerto.

'use strict';

const fs = require('fs');
const path = require('path');

function hexParaRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}
const fill = (hex) => [{ type: 'SOLID', visible: true, color: hexParaRgb(hex), opacity: 1 }];

function texto(id, nome, hex, fontSize, fontWeight = 400, styles) {
  const n = { id, name: nome, type: 'TEXT', characters: 'Amostra', fills: fill(hex), style: { fontSize, fontWeight } };
  if (styles) n.styles = styles;
  return n;
}
function retangulo(id, nome, hex, styles) {
  const n = { id, name: nome, type: 'RECTANGLE', fills: fill(hex), absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 40 } };
  if (styles) n.styles = styles;
  return n;
}
function botao(id, nome, hex, w, h, opts = {}) {
  const n = {
    id, name: nome, type: 'INSTANCE',
    fills: fill(hex),
    absoluteBoundingBox: { x: 0, y: 0, width: w, height: h },
  };
  if (opts.componentId) n.componentId = opts.componentId;
  if (opts.styles) n.styles = opts.styles;
  return n;
}
function frame(id, nome, bgHex, children) {
  return {
    id, name: nome, type: 'FRAME',
    fills: fill(bgHex),
    absoluteBoundingBox: { x: 0, y: 0, width: 375, height: 812 },
    children,
  };
}

// Cores calibradas (cinza equivalente => razao de contraste conhecida vs branco):
//   #000000  21:1     #595959 ~7:1      #898989 ~3.5:1     #DDDDDD ~1.3:1
//   #0B5FBF ~6.2:1 (branco por cima)    #E0E0E0 ~1.3:1
const OK_TEXTO = '#000000';
const FALHA_TEXTO = '#DDDDDD';
const TEXTO_GRANDE_35 = '#898989'; // falha se normal, passa se grande
const OK_COMP = '#0B5FBF';
const FALHA_COMP = '#E0E0E0';
const COR_FORA_TOKEN = '#7D2AE8';
const BRANCO = '#FFFFFF';

const frames = [
  frame('1:1', 'F01_texto_normal_ok', BRANCO, [texto('1:11', 'titulo', OK_TEXTO, 16, 400, { fill: 'S:tok' })]),
  frame('1:2', 'F02_texto_normal_baixo_contraste', BRANCO, [texto('1:21', 'titulo', FALHA_TEXTO, 16, 400, { fill: 'S:tok' })]),
  frame('1:3', 'F03_texto_grande_no_limiar', BRANCO, [texto('1:31', 'titulo', TEXTO_GRANDE_35, 40, 400, { fill: 'S:tok' })]),
  frame('1:4', 'F04_texto_pequeno_mesmo_cinza_reprova', BRANCO, [texto('1:41', 'nota', TEXTO_GRANDE_35, 14, 400, { fill: 'S:tok' })]),
  frame('1:5', 'F05_botao_alvo_pequeno', BRANCO, [botao('1:51', 'Botao Confirmar', OK_COMP, 18, 18, { componentId: 'C:btn', styles: { fill: 'S:tok' } })]),
  frame('1:6', 'F06_botao_alvo_ok', BRANCO, [botao('1:61', 'Botao Confirmar', OK_COMP, 48, 40, { componentId: 'C:btn', styles: { fill: 'S:tok' } })]),
  frame('1:7', 'F07_componente_baixo_contraste', BRANCO, [botao('1:71', 'Botao Secundario', FALHA_COMP, 120, 44, { componentId: 'C:btn', styles: { fill: 'S:tok' } })]),
  frame('1:8', 'F08_cor_fora_do_token', BRANCO, [retangulo('1:81', 'faixa-decorativa', COR_FORA_TOKEN, { fill: 'S:tok' })]),
  frame('1:9', 'F09_tamanho_fonte_fora_do_token', BRANCO, [texto('1:91', 'legenda', OK_TEXTO, 15, 400, { fill: 'S:tok' })]),
  frame('1:10', 'F10_aderencia_baixa', BRANCO, [
    retangulo('1:101', 'retangulo-solto-a', OK_TEXTO),
    retangulo('1:102', 'retangulo-solto-b', OK_TEXTO),
    retangulo('1:103', 'retangulo-solto-c', OK_TEXTO),
  ]),
  frame('1:11', 'F11_aderencia_alta', BRANCO, [
    botao('1:111', 'Item Lista', OK_COMP, 300, 56, { componentId: 'C:item', styles: { fill: 'S:tok' } }),
    botao('1:112', 'Item Lista', OK_COMP, 300, 56, { componentId: 'C:item', styles: { fill: 'S:tok' } }),
  ]),
  frame('1:12', 'F12_multiplos_defeitos', BRANCO, [
    texto('1:121', 'titulo', FALHA_TEXTO, 16, 400, { fill: 'S:tok' }),
    botao('1:122', 'Botao Salvar', FALHA_COMP, 16, 16, { componentId: 'C:btn', styles: { fill: 'S:tok' } }),
  ]),
];

const arquivo = {
  name: 'Validacao Verificador - Defeitos Injetados',
  document: { id: '0:0', name: 'Document', type: 'DOCUMENT', children: [
    { id: '0:1', name: 'Pagina 1', type: 'CANVAS', children: frames },
  ] },
};

// Gabarito: criterios que DEVEM aparecer como 'reprova' por frame.
// (criterios de aderencia/valor_fora_token entram como 'alerta' e sao tratados a parte)
const gabarito = {
  F01_texto_normal_ok: { reprova: [], alerta: [] },
  F02_texto_normal_baixo_contraste: { reprova: ['contraste_texto_1.4.3'], alerta: [] },
  F03_texto_grande_no_limiar: { reprova: [], alerta: [] },
  F04_texto_pequeno_mesmo_cinza_reprova: { reprova: ['contraste_texto_1.4.3'], alerta: [] },
  F05_botao_alvo_pequeno: { reprova: ['alvo_toque_2.5.8'], alerta: [] },
  F06_botao_alvo_ok: { reprova: [], alerta: [] },
  F07_componente_baixo_contraste: { reprova: ['contraste_componente_1.4.11'], alerta: [] },
  F08_cor_fora_do_token: { reprova: [], alerta: ['valor_fora_token'] },
  F09_tamanho_fonte_fora_do_token: { reprova: [], alerta: ['valor_fora_token'] },
  F10_aderencia_baixa: { reprova: [], alerta: ['aderencia_design_system'] },
  F11_aderencia_alta: { reprova: [], alerta: [] },
  F12_multiplos_defeitos: { reprova: ['contraste_texto_1.4.3', 'contraste_componente_1.4.11', 'alvo_toque_2.5.8'], alerta: [] },
};

// tokens usados na validacao (o que esta "dentro" do sistema de design)
const tokens = {
  cores: ['#000000', '#FFFFFF', '#0B5FBF', '#898989', '#E0E0E0', '#DDDDDD'],
  tamanhosFonte: [14, 16, 40],
};

const dir = __dirname;
fs.writeFileSync(path.join(dir, 'frames-defeitos.json'), JSON.stringify(arquivo, null, 2));
fs.writeFileSync(path.join(dir, 'gabarito.json'), JSON.stringify(gabarito, null, 2));
fs.writeFileSync(path.join(dir, 'tokens-validacao.json'), JSON.stringify(tokens, null, 2));
console.log('Fixture gerada:', dir);
