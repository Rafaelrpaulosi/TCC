// Geracao de relatorio em JSON e CSV.

'use strict';

const fs = require('fs');
const path = require('path');

function garantirPasta(p) {
  fs.mkdirSync(p, { recursive: true });
}

function paraCsv(linhas) {
  if (linhas.length === 0) return '';
  const colunas = Object.keys(linhas[0]);
  const escapar = (v) => {
    if (v == null) return '';
    const s = String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const cabecalho = colunas.join(',');
  const corpo = linhas.map((l) => colunas.map((c) => escapar(l[c])).join(','));
  return [cabecalho, ...corpo].join('\n') + '\n';
}

// resultados: array de analisarPrototipo(...)
function gravarRelatorio(resultados, opcoes) {
  const destino = opcoes.destino;
  const rotulo = opcoes.rotulo || 'execucao';
  const carimbo = new Date().toISOString().replace(/[:.]/g, '-');
  const pasta = path.join(destino, `${rotulo}_${carimbo}`);
  garantirPasta(pasta);

  const jsonCompleto = {
    gerado_em: new Date().toISOString(),
    fonte: opcoes.fonte || null,
    fileKey: opcoes.fileKey || null,
    total_prototipos: resultados.length,
    prototipos: resultados,
  };
  fs.writeFileSync(path.join(pasta, 'relatorio.json'), JSON.stringify(jsonCompleto, null, 2), 'utf8');

  const linhasMetricas = resultados.map((r) => ({ prototipo: r.prototipo, ...r.metricas }));
  fs.writeFileSync(path.join(pasta, 'metricas_por_prototipo.csv'), paraCsv(linhasMetricas), 'utf8');

  const linhasFindings = resultados.flatMap((r) => r.findings);
  fs.writeFileSync(path.join(pasta, 'ocorrencias.csv'), paraCsv(linhasFindings), 'utf8');

  return { pasta, totalOcorrencias: linhasFindings.length };
}

module.exports = { gravarRelatorio, paraCsv };
