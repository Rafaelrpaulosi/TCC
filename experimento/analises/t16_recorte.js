// T16 (achado): efeito do conteúdo cortado pelo quadro nas métricas do verificador.
// O verificador v2 conta nós fora da área de recorte do quadro (clipsContent sem rolagem),
// que não aparecem na tela. Este script recalcula, por bloco, com respeitarRecorte e
// compara com a regra de 09/10. Agregado por bloco: somas nas telas do bloco.
// Uso: node experimento/analises/t16_recorte.js -> experimento/analises/t16_recorte.md
const fs = require('fs');
const path = require('path');
const { analisarPrototipo } = require('../../verificador/src/analise');

const RAIZ = path.join(__dirname, '..', '..');
const EXP = path.join(RAIZ, 'experimento', 'exportacoes');
const linhas = fs.readFileSync(path.join(EXP, 'indice.csv'), 'utf8').trim().split(/\r?\n/).slice(1);
const K = ['densidade_total_nos', 'aderencia_nos_aderentes', 'aderencia_nos_elegiveis', 'textos_total',
  'textos_aprovados_contraste', 'alvos_toque_total', 'alvos_toque_aprovados'];
const blocos = {};
for (const l of linhas) {
  const v = l.split(',');
  const frame = JSON.parse(fs.readFileSync(path.join(RAIZ, v[v.length - 1].replace(/\.png$/, '.json')), 'utf8'));
  const b = (blocos[v[1]] = blocos[v[1]] || { amb: v[0], o: {}, r: {} });
  const mo = analisarPrototipo(frame, { respeitarRecorte: false }).metricas;
  const mr = analisarPrototipo(frame, { respeitarRecorte: true }).metricas;
  for (const k of K) { b.o[k] = (b.o[k] || 0) + mo[k]; b.r[k] = (b.r[k] || 0) + mr[k]; }
}
const pct = (a, e) => (e ? Math.round((a / e) * 10000) / 100 : null);
const met = (m) => ({
  nos: m.densidade_total_nos,
  ader: pct(m.aderencia_nos_aderentes, m.aderencia_nos_elegiveis),
  cont: pct(m.textos_aprovados_contraste, m.textos_total),
  alvo: pct(m.alvos_toque_aprovados, m.alvos_toque_total),
  textos: m.textos_total, alvos: m.alvos_toque_total,
});
let md = '# T16: efeito do conteúdo cortado pelo quadro nas métricas do verificador\n\n';
md += 'Regra de 09/10 (v2) e regra com recorte (nós fora da área de recorte de um contêiner com clipsContent e sem rolagem não contam). Gerado por `t16_recorte.js` sobre as telas exportadas em 07/11/2026.\n\n';
md += '| Bloco | Nós v2 | Nós recorte | Textos v2 / recorte | Alvos v2 / recorte | Aderência v2 / recorte | Contraste v2 / recorte | Alvo v2 / recorte |\n|---|---|---|---|---|---|---|---|\n';
const amb = {};
for (const [pag, b] of Object.entries(blocos)) {
  const o = met(b.o), r = met(b.r);
  md += `| ${pag} | ${o.nos} | ${r.nos} | ${o.textos} / ${r.textos} | ${o.alvos} / ${r.alvos} | ${o.ader} / ${r.ader} | ${o.cont} / ${r.cont} | ${o.alvo} / ${r.alvo} |\n`;
  (amb[b.amb] = amb[b.amb] || []).push([o, r]);
}
md += '\n| Ambiente | Aderência v2 / recorte | Contraste v2 / recorte | Alvo v2 / recorte | Nós (soma) v2 / recorte |\n|---|---|---|---|---|\n';
for (const [a, l] of Object.entries(amb)) {
  const m = (k, i) => Math.round((l.reduce((s, x) => s + x[i][k], 0) / l.length) * 100) / 100;
  const s = (i) => l.reduce((t, x) => t + x[i].nos, 0);
  md += `| ${a} | ${m('ader', 0)} / ${m('ader', 1)} | ${m('cont', 0)} / ${m('cont', 1)} | ${m('alvo', 0)} / ${m('alvo', 1)} | ${s(0)} / ${s(1)} |\n`;
}
fs.writeFileSync(path.join(__dirname, 't16_recorte.md'), md);
console.log(md);
