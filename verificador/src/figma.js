// Cliente minimo da API REST do Figma.
// O token vem SEMPRE da variavel de ambiente FIGMA_TOKEN. O verificador nao
// tenta obter, renovar ou persistir token algum.

'use strict';

const fs = require('fs');

const BASE = 'https://api.figma.com/v1';

function obterToken() {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    throw new Error(
      'FIGMA_TOKEN nao definido. Exporte um Personal Access Token do Figma em FIGMA_TOKEN antes de rodar. ' +
        'Veja o README.'
    );
  }
  return token;
}

async function pegar(caminho) {
  const resp = await fetch(`${BASE}${caminho}`, {
    headers: { 'X-Figma-Token': obterToken() },
  });
  if (!resp.ok) {
    const corpo = await resp.text().catch(() => '');
    throw new Error(`Figma API ${resp.status} em ${caminho}: ${corpo.slice(0, 300)}`);
  }
  return resp.json();
}

// Baixa o arquivo inteiro. fileKey do Design System eMed: [chave do arquivo do sistema de design]
async function baixarArquivo(fileKey) {
  return pegar(`/files/${encodeURIComponent(fileKey)}`);
}

// Baixa apenas subarvores especificas (mais barato para prototipos grandes).
async function baixarNos(fileKey, ids) {
  const q = ids.map((i) => encodeURIComponent(i)).join(',');
  return pegar(`/files/${encodeURIComponent(fileKey)}/nodes?ids=${q}`);
}

// Permite validacao offline: carrega um JSON de arquivo Figma salvo em disco.
function carregarArquivoLocal(caminho) {
  return JSON.parse(fs.readFileSync(caminho, 'utf8'));
}

module.exports = { baixarArquivo, baixarNos, carregarArquivoLocal };
