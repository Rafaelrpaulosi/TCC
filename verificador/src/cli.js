#!/usr/bin/env node
// Verificador minimo de conformidade de prototipos Figma para o TCC.
//
// Uso:
//   FIGMA_TOKEN=xxx node src/cli.js --file-key <KEY> --node <ID> [--node <ID> ...] \
//       [--tokens tokens.json] [--rotulo ambienteA_bloco1] [--out relatorios]
//
//   node src/cli.js --local arquivo_figma.json [--tokens tokens.json] --rotulo teste
//
// Sem --node, o verificador trata como prototipo cada frame de nivel superior
// de cada pagina do arquivo.

'use strict';

const fs = require('fs');
const path = require('path');
const { baixarArquivo, baixarNos, carregarArquivoLocal } = require('./figma');
const { analisarPrototipo } = require('./analise');
const { gravarRelatorio } = require('./relatorio');

function parseArgs(argv) {
  const args = { node: [] };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const prox = () => argv[(i += 1)];
    if (a === '--file-key') args.fileKey = prox();
    else if (a === '--node') args.node.push(prox());
    else if (a === '--local') args.local = prox();
    else if (a === '--tokens') args.tokens = prox();
    else if (a === '--rotulo') args.rotulo = prox();
    else if (a === '--out') args.out = prox();
    else if (a === '--help' || a === '-h') args.help = true;
    else throw new Error(`argumento desconhecido: ${a}`);
  }
  return args;
}

function carregarTokens(caminho) {
  if (!caminho) return null;
  const raw = JSON.parse(fs.readFileSync(caminho, 'utf8'));
  return {
    cores: new Set((raw.cores || []).map((c) => String(c).toUpperCase())),
    tamanhosFonte: new Set((raw.tamanhosFonte || []).map(Number)),
  };
}

// Extrai frames de nivel superior (prototipos) do documento completo.
function prototiposDoDocumento(doc) {
  const out = [];
  for (const pagina of doc.children || []) {
    for (const filho of pagina.children || []) {
      if (['FRAME', 'COMPONENT', 'COMPONENT_SET', 'SECTION'].includes(filho.type)) {
        out.push(filho);
      }
    }
  }
  return out;
}

// Achata o retorno de /nodes em uma lista de nos.
function prototiposDosNos(respostaNodes) {
  return Object.values(respostaNodes.nodes || {})
    .map((n) => n && n.document)
    .filter(Boolean);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || (!args.fileKey && !args.local)) {
    console.log(fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8'));
    process.exit(args.help ? 0 : 1);
  }

  const tokens = carregarTokens(args.tokens);
  let prototipos = [];
  let fonte;

  if (args.local) {
    fonte = `local:${args.local}`;
    const arquivo = carregarArquivoLocal(args.local);
    prototipos = arquivo.nodes ? prototiposDosNos(arquivo) : prototiposDoDocumento(arquivo.document || arquivo);
  } else if (args.node.length > 0) {
    fonte = `figma:${args.fileKey}:${args.node.join(',')}`;
    const resp = await baixarNos(args.fileKey, args.node);
    prototipos = prototiposDosNos(resp);
  } else {
    fonte = `figma:${args.fileKey}`;
    const arquivo = await baixarArquivo(args.fileKey);
    prototipos = prototiposDoDocumento(arquivo.document);
  }

  if (prototipos.length === 0) {
    console.error('Nenhum prototipo encontrado. Verifique --node ou a estrutura do arquivo.');
    process.exit(2);
  }

  const resultados = prototipos.map((p) => analisarPrototipo(p, { tokens }));

  const saida = gravarRelatorio(resultados, {
    destino: args.out || path.join(process.cwd(), 'relatorios'),
    rotulo: args.rotulo,
    fonte,
    fileKey: args.fileKey || null,
  });

  console.log(`Prototipos analisados: ${resultados.length}`);
  for (const r of resultados) {
    const m = r.metricas;
    console.log(
      `- ${r.prototipo}: texto ${m.textos_pct_conformidade_1_4_3}% | ` +
        `componente ${m.componentes_pct_conformidade_1_4_11}% | ` +
        `alvo ${m.alvos_toque_pct_conformidade_2_5_8}% | ` +
        `DS ${m.aderencia_design_system_pct}% | ` +
        `fora de token: ${m.cores_distintas_fora_token} cores, ${m.tamanhos_fonte_distintos_fora_token} tamanhos`
    );
  }
  console.log(`Relatorio: ${saida.pasta} (${saida.totalOcorrencias} ocorrencias)`);
}

main().catch((e) => {
  console.error(String(e.message || e));
  process.exit(1);
});
