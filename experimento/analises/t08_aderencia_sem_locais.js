// T08 / C4.13: aderência ao sistema de design com e sem os componentes locais.
//
// Roda o verificador (verificador/src/analise.js) sobre as telas exportadas em
// experimento/exportacoes/ duas vezes: como em 09/10 (toda instância conta como
// aderente) e excluindo as instâncias de componentes locais, listados em
// t08_componentes_locais.json. Agregado por bloco: soma dos nós aderentes sobre a
// soma dos elegíveis, como em experimento/consolidar.py. Média do ambiente: média
// simples dos cinco blocos. Confere a versão original contra os relatórios v2.
//
// Uso: node experimento/analises/t08_aderencia_sem_locais.js
const fs = require('fs');
const path = require('path');
const { analisarPrototipo } = require('../../verificador/src/analise');

const RAIZ = path.join(__dirname, '..', '..');
const EXP = path.join(RAIZ, 'experimento', 'exportacoes');
const V2 = path.join(RAIZ, 'experimento', 'verificador_relatorios', 'v2');
const locais = JSON.parse(fs.readFileSync(path.join(__dirname, 't08_componentes_locais.json'), 'utf8'));

const linhas = fs.readFileSync(path.join(EXP, 'indice.csv'), 'utf8').trim().split(/\r?\n/);
const cab = linhas.shift().split(',');
const telas = linhas.map((l) => {
  // o nome da tela pode ter vírgula (vem entre aspas); ambiente, página e png não têm
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
  const m0 = analisarPrototipo(frame).metricas;
  const m1 = analisarPrototipo(frame, { componentesExcluidos: excl }).metricas;
  let instLocais = 0;
  (function contar(n) {
    if (n.visible === false) return;
    if (n.type === 'INSTANCE' && excl.has(n.componentId)) instLocais += 1;
    (n.children || []).forEach(contar);
  })(frame);
  const b = (blocos[t.pagina] = blocos[t.pagina] || { amb: t.ambiente, a0: 0, a1: 0, e: 0, inst: 0, telas: 0 });
  b.a0 += m0.aderencia_nos_aderentes; b.a1 += m1.aderencia_nos_aderentes; b.e += m0.aderencia_nos_elegiveis;
  b.inst += instLocais; b.telas += 1;
}

let md = '# T08 / C4.13: aderência ao sistema de design com e sem componentes locais\n\n';
md += 'Gerado por `t08_aderencia_sem_locais.js` sobre as telas exportadas em 07/11/2026. ';
md += '"Original" repete a regra de 09/10 (toda instância de componente conta como aderente); ';
md += '"sem locais" não conta como aderente a instância de componente criado numa página de bloco, salvo se tiver estilo ou variável vinculada. ';
md += 'Agregado por bloco: nós aderentes sobre nós elegíveis, somados nas telas do bloco.\n\n';
md += '| Bloco | Telas | Elegíveis | Instâncias de locais | Aderência v2 (09/10) | Original (07/11) | Sem locais | Diferença (p.p.) |\n|---|---|---|---|---|---|---|---|\n';
const amb = {};
let confere = true;
for (const [pag, b] of Object.entries(blocos)) {
  const v = v2Bloco(pag);
  const p2 = pct(v.a, v.e), p0 = pct(b.a0, b.e), p1 = pct(b.a1, b.e);
  if (p2 !== p0 || v.e !== b.e || v.telas !== b.telas) confere = false;
  md += `| ${pag} | ${b.telas} | ${b.e} | ${b.inst} | ${p2} | ${p0} | ${p1} | ${(Math.round((p1 - p0) * 100) / 100).toFixed(2)} |\n`;
  (amb[b.amb] = amb[b.amb] || []).push([p0, p1]);
}
md += '\n| Ambiente | Média original | Média sem locais |\n|---|---|---|\n';
for (const [a, l] of Object.entries(amb)) {
  const m = (i) => Math.round((l.reduce((s, x) => s + x[i], 0) / l.length) * 100) / 100;
  md += `| ${a} | ${m(0)} | ${m(1)} |\n`;
}
md += `\nConferência com os relatórios v2 de 09/10 (mesmas telas, mesmos elegíveis, mesmo percentual): ${confere ? 'confere em todos os blocos' : 'NÃO CONFERE, ver tabela'}.\n`;
fs.writeFileSync(path.join(__dirname, 't08_aderencia_sem_locais.md'), md);
console.log(md);
