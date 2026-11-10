// T08 / C4.13: aderência ao sistema de design com e sem os componentes locais (verificador v3).
//
// Roda o verificador (verificador/src/analise.js) sobre as telas exportadas em
// experimento/exportacoes/. Valores da v3 (não conta conteúdo cortado pelo quadro),
// com e sem as instâncias de componentes locais (t08_componentes_locais.json).
// Conferência: a regra v2 (respeitarRecorte: false) aplicada às mesmas telas tem de
// reproduzir os relatórios de 09/10 (experimento/verificador_relatorios/v2).
// Agregado por bloco: soma dos nós aderentes sobre a soma dos elegíveis. Média do
// ambiente: média simples dos cinco blocos.
//
// Uso: node experimento/analises/t08_aderencia_sem_locais.js
const fs = require('fs');
const path = require('path');
const { analisarPrototipo } = require('../../verificador/src/analise');

const RAIZ = path.join(__dirname, '..', '..');
const EXP = path.join(RAIZ, 'experimento', 'exportacoes');
const V2 = path.join(RAIZ, 'experimento', 'verificador_relatorios', 'v2');
const locais = JSON.parse(fs.readFileSync(path.join(__dirname, 't08_componentes_locais.json'), 'utf8'));

// o nome da tela pode ter vírgula (vem entre aspas); ambiente, página e png não têm
const telas = fs.readFileSync(path.join(EXP, 'indice.csv'), 'utf8').trim().split(/\r?\n/).slice(1).map((l) => {
  const v = l.split(',');
  return { ambiente: v[0], pagina: v[1], png: v[v.length - 1] };
});

function v2Bloco(pagina) {
  const dir = fs.readdirSync(V2).find((d) => d.startsWith(pagina + '_'));
  const r = JSON.parse(fs.readFileSync(path.join(V2, dir, 'relatorio.json'), 'utf8'));
  let a = 0, e = 0;
  for (const p of r.prototipos) { a += p.metricas.aderencia_nos_aderentes; e += p.metricas.aderencia_nos_elegiveis; }
  return { a, e, telas: r.prototipos.length };
}

const pct = (a, e) => (e ? Math.round((a / e) * 10000) / 100 : null);
const blocos = {};
for (const t of telas) {
  const frame = JSON.parse(fs.readFileSync(path.join(RAIZ, t.png.replace(/\.png$/, '.json')), 'utf8'));
  const excl = new Set(locais[t.ambiente].map((c) => c.id));
  const mv2 = analisarPrototipo(frame, { respeitarRecorte: false }).metricas;
  const m0 = analisarPrototipo(frame).metricas;
  const m1 = analisarPrototipo(frame, { componentesExcluidos: excl }).metricas;
  let instLocais = 0;
  (function contar(n) {
    if (n.visible === false) return;
    if (n.type === 'INSTANCE' && excl.has(n.componentId)) instLocais += 1;
    (n.children || []).forEach(contar);
  })(frame);
  const b = (blocos[t.pagina] = blocos[t.pagina] || { amb: t.ambiente, a2: 0, e2: 0, a0: 0, a1: 0, e: 0, inst: 0, telas: 0 });
  b.a2 += mv2.aderencia_nos_aderentes; b.e2 += mv2.aderencia_nos_elegiveis;
  b.a0 += m0.aderencia_nos_aderentes; b.a1 += m1.aderencia_nos_aderentes; b.e += m0.aderencia_nos_elegiveis;
  b.inst += instLocais; b.telas += 1;
}

let md = '# T08 / C4.13: aderência ao sistema de design com e sem componentes locais\n\n';
md += 'Gerado por `t08_aderencia_sem_locais.js` sobre as telas exportadas em 07/11/2026, com o verificador v3 (09/11/2026), que não conta conteúdo cortado pelo quadro. ';
md += '"Sem locais": a instância de componente criado numa página de bloco não conta como aderente, salvo se tiver estilo ou variável vinculada. ';
md += 'Agregado por bloco: nós aderentes sobre nós elegíveis, somados nas telas do bloco.\n\n';
md += '| Bloco | Telas | Elegíveis (v3) | Instâncias de locais | Aderência v2 (09/10) | v3 com locais | v3 sem locais | Diferença (p.p.) |\n|---|---|---|---|---|---|---|---|\n';
const amb = {};
let confere = true;
for (const [pag, b] of Object.entries(blocos)) {
  const v = v2Bloco(pag);
  const p2 = pct(v.a, v.e), p0 = pct(b.a0, b.e), p1 = pct(b.a1, b.e);
  if (p2 !== pct(b.a2, b.e2) || v.e !== b.e2 || v.telas !== b.telas) confere = false;
  md += `| ${pag} | ${b.telas} | ${b.e} | ${b.inst} | ${p2} | ${p0} | ${p1} | ${(Math.round((p1 - p0) * 100) / 100).toFixed(2)} |\n`;
  (amb[b.amb] = amb[b.amb] || []).push([p2, p0, p1]);
}
md += '\n| Ambiente | Média v2 | Média v3 com locais | Média v3 sem locais |\n|---|---|---|---|\n';
for (const [a, l] of Object.entries(amb)) {
  const m = (i) => Math.round((l.reduce((s, x) => s + x[i], 0) / l.length) * 100) / 100;
  md += `| ${a} | ${m(0)} | ${m(1)} | ${m(2)} |\n`;
}
md += `\nConferência: a regra v2 aplicada às telas exportadas reproduz os relatórios de 09/10 (mesmas telas, mesmos elegíveis, mesmo percentual): ${confere ? 'confere em todos os blocos' : 'NÃO CONFERE, ver tabela'}.\n`;
fs.writeFileSync(path.join(__dirname, 't08_aderencia_sem_locais.md'), md);
console.log(md);
