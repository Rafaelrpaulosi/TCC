// Utilitarios de cor e contraste conforme WCAG 2.2.
// Referencia: https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio

'use strict';

// Converte canal sRGB [0..1] para valor linearizado.
function canalLinear(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Luminancia relativa de uma cor {r,g,b} com canais em [0..1].
function luminanciaRelativa({ r, g, b }) {
  return 0.2126 * canalLinear(r) + 0.7152 * canalLinear(g) + 0.0722 * canalLinear(b);
}

// Razao de contraste entre duas cores {r,g,b} em [0..1].
function razaoContraste(cor1, cor2) {
  const l1 = luminanciaRelativa(cor1);
  const l2 = luminanciaRelativa(cor2);
  const claro = Math.max(l1, l2);
  const escuro = Math.min(l1, l2);
  return (claro + 0.05) / (escuro + 0.05);
}

// Compoe uma cor com alfa sobre um fundo opaco (alpha blending simples).
function compor(corFrente, corFundo) {
  const a = corFrente.a == null ? 1 : corFrente.a;
  return {
    r: corFrente.r * a + corFundo.r * (1 - a),
    g: corFrente.g * a + corFundo.g * (1 - a),
    b: corFrente.b * a + corFundo.b * (1 - a),
    a: 1,
  };
}

function paraHex({ r, g, b }) {
  const h = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

module.exports = { luminanciaRelativa, razaoContraste, compor, paraHex };
