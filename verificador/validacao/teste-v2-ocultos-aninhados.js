// Teste da versao 2 (09/10/2026): nos ocultos ignorados; pecas internas de um
// componente nao contam como alvo de toque separado.
'use strict';
const { analisarPrototipo } = require('../src/analise');
const branco = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }];
const cinzaClaro = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.85, a: 1 } }];
const escuro = [{ type: 'SOLID', color: { r: 0.05, g: 0.3, b: 0.15, a: 1 } }];
const bb = (w, h) => ({ x: 0, y: 0, width: w, height: h });
const frame = {
  type: 'FRAME', name: 'teste', id: 't', fills: branco, absoluteBoundingBox: bb(400, 400),
  children: [
    // 1) texto oculto de baixo contraste: nao pode reprovar
    { type: 'TEXT', name: 'oculto', id: 'a', visible: false, fills: cinzaClaro, style: { fontSize: 14 } },
    // 2) botao 120x40 com icone 16x16 dentro: so o botao conta como alvo, e passa
    { type: 'INSTANCE', name: 'Button', id: 'b', componentId: 'c1', fills: escuro, absoluteBoundingBox: bb(120, 40),
      children: [{ type: 'INSTANCE', name: 'Icon/play', id: 'b1', componentId: 'c2', absoluteBoundingBox: bb(16, 16) }] },
    // 3) controle visivel de 16x16 fora de componente: continua reprovando
    { type: 'INSTANCE', name: 'Icon Button', id: 'd', componentId: 'c3', absoluteBoundingBox: bb(16, 16) },
  ],
};
const r = analisarPrototipo(frame);
const alvos = r.findings.filter((f) => f.criterio === 'alvo_toque_2.5.8').map((f) => f.noId);
const textos = r.findings.filter((f) => f.criterio.startsWith('contraste_texto')).map((f) => f.noId);
const ok = alvos.length === 1 && alvos[0] === 'd' && textos.length === 0 && r.metricas.alvos_toque_total === 2;
console.log(JSON.stringify({ alvos_reprovados: alvos, textos_reprovados: textos, alvos_total: r.metricas.alvos_toque_total }));
console.log(ok ? 'PASSOU' : 'FALHOU');
process.exit(ok ? 0 : 1);
