// Roda o verificador sobre frames-defeitos.json e compara com gabarito.json.
// Produz a taxa de acerto por criterio e o total de frames classificados
// corretamente. Gera tambem validacao/resultado-validacao.json.
//
// Uso: node validacao/rodar-validacao.js   (ou: npm run validar)

'use strict';

const fs = require('fs');
const path = require('path');
const { analisarPrototipo } = require('../src/analise');

const dir = __dirname;

if (!fs.existsSync(path.join(dir, 'frames-defeitos.json'))) {
  require('./gerar-fixture');
}

const arquivo = JSON.parse(fs.readFileSync(path.join(dir, 'frames-defeitos.json'), 'utf8'));
const gabarito = JSON.parse(fs.readFileSync(path.join(dir, 'gabarito.json'), 'utf8'));
const tokensRaw = JSON.parse(fs.readFileSync(path.join(dir, 'tokens-validacao.json'), 'utf8'));
const tokens = {
  cores: new Set(tokensRaw.cores.map((c) => c.toUpperCase())),
  tamanhosFonte: new Set(tokensRaw.tamanhosFonte.map(Number)),
};

const frames = arquivo.document.children[0].children;

const CRITERIOS_REPROVA = ['contraste_texto_1.4.3', 'contraste_componente_1.4.11', 'alvo_toque_2.5.8'];
const CRITERIOS_ALERTA = ['valor_fora_token', 'aderencia_design_system'];

let tp = 0, fp = 0, fn = 0;
const porCriterio = {};
[...CRITERIOS_REPROVA, ...CRITERIOS_ALERTA].forEach((c) => (porCriterio[c] = { tp: 0, fp: 0, fn: 0 }));

let framesCorretos = 0;
const detalhe = [];

for (const frame of frames) {
  const r = analisarPrototipo(frame, { tokens });
  const esperado = gabarito[frame.name] || { reprova: [], alerta: [] };

  const detectadosReprova = new Set(
    r.findings.filter((f) => f.gravidade === 'reprova').map((f) => f.criterio)
  );
  const detectadosAlerta = new Set(
    r.findings.filter((f) => f.gravidade === 'alerta').map((f) => f.criterio)
  );

  const espReprova = new Set(esperado.reprova);
  const espAlerta = new Set(esperado.alerta);

  let frameOk = true;

  for (const c of CRITERIOS_REPROVA) {
    const esp = espReprova.has(c);
    const det = detectadosReprova.has(c);
    if (esp && det) { tp += 1; porCriterio[c].tp += 1; }
    else if (esp && !det) { fn += 1; porCriterio[c].fn += 1; frameOk = false; }
    else if (!esp && det) { fp += 1; porCriterio[c].fp += 1; frameOk = false; }
  }
  for (const c of CRITERIOS_ALERTA) {
    const esp = espAlerta.has(c);
    const det = detectadosAlerta.has(c);
    if (esp && det) { tp += 1; porCriterio[c].tp += 1; }
    else if (esp && !det) { fn += 1; porCriterio[c].fn += 1; frameOk = false; }
    else if (!esp && det) { fp += 1; porCriterio[c].fp += 1; frameOk = false; }
  }

  if (frameOk) framesCorretos += 1;
  detalhe.push({
    frame: frame.name,
    esperado,
    detectado_reprova: [...detectadosReprova],
    detectado_alerta: [...detectadosAlerta],
    ok: frameOk,
  });
}

const precisao = tp + fp === 0 ? 1 : tp / (tp + fp);
const revocacao = tp + fn === 0 ? 1 : tp / (tp + fn);
const f1 = precisao + revocacao === 0 ? 0 : (2 * precisao * revocacao) / (precisao + revocacao);

const resumo = {
  gerado_em: new Date().toISOString(),
  total_frames: frames.length,
  frames_classificados_corretamente: framesCorretos,
  taxa_acerto_frames: Math.round((framesCorretos / frames.length) * 10000) / 100,
  agregado: {
    verdadeiros_positivos: tp,
    falsos_positivos: fp,
    falsos_negativos: fn,
    precisao: Math.round(precisao * 1000) / 1000,
    revocacao: Math.round(revocacao * 1000) / 1000,
    f1: Math.round(f1 * 1000) / 1000,
  },
  por_criterio: porCriterio,
  detalhe,
};

fs.writeFileSync(path.join(dir, 'resultado-validacao.json'), JSON.stringify(resumo, null, 2));

console.log(`Frames: ${frames.length} | corretos: ${framesCorretos} | taxa de acerto: ${resumo.taxa_acerto_frames}%`);
console.log(`TP ${tp} | FP ${fp} | FN ${fn} | precisao ${resumo.agregado.precisao} | revocacao ${resumo.agregado.revocacao} | F1 ${resumo.agregado.f1}`);
for (const [c, v] of Object.entries(porCriterio)) {
  console.log(`  ${c}: TP ${v.tp} FP ${v.fp} FN ${v.fn}`);
}
for (const d of detalhe.filter((x) => !x.ok)) {
  console.log(`  [FALHA] ${d.frame}: esperado ${JSON.stringify(d.esperado)} detectado reprova=${JSON.stringify(d.detectado_reprova)} alerta=${JSON.stringify(d.detectado_alerta)}`);
}

process.exit(resumo.taxa_acerto_frames === 100 ? 0 : 1);
