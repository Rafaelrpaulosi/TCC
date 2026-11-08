"""T19: calcula o tempo previsto pelo KLM a partir de docs/klm/sequencias.csv.

Valores do protocolo (Card, Moran e Newell, 1980, Figura 1, p. 399): K de tecla 0,28 s;
K de clique 0,20 s (todo K que segue um P); P 1,10 s; H 0,40 s; M 1,35 s.
"nK" = n teclas. Saída: docs/klm/klm_resultados.md
Uso: python -I -X utf8 docs/klm/klm_resultados.py
"""
import csv, os, re

AQUI = os.path.dirname(os.path.abspath(__file__))
T = {"Kt": 0.28, "Kc": 0.20, "P": 1.10, "H": 0.40, "M": 1.35}


def contar(seq):
    c = {"M": 0, "P": 0, "Kc": 0, "Kt": 0, "H": 0}
    ant = None
    for tok in seq.split():
        m = re.fullmatch(r"(\d+)K", tok)
        if m:
            c["Kt"] += int(m.group(1))
        elif tok == "K":
            c["Kc" if ant == "P" else "Kt"] += 1
        else:
            c[tok] += 1
        ant = tok
    return c, round(sum(T[k] * v for k, v in c.items()), 2)


linhas = list(csv.DictReader(open(os.path.join(AQUI, "sequencias.csv"), encoding="utf-8")))
tot = {}
md = ["# Resultados do KLM (T19)\n",
      "Gerado por `klm_resultados.py` a partir de `sequencias.csv`, conforme `protocolo_klm.md`. "
      "Tempos em segundos. K de clique (após P) = 0,20 s; K de tecla = 0,28 s.\n",
      "| Bloco | Ambiente | Sequência | M | P | K (clique) | K (tecla) | H | Tempo previsto (s) |",
      "|---|---|---|---|---|---|---|---|---|"]
for r in sorted(linhas, key=lambda r: (r["bloco"], r["ambiente"])):
    if r["situacao"] != "modelado":
        sit = r["situacao"].replace("nao visivel", "não visível")
        md.append(f"| {r['bloco']} | {r['ambiente']} | {sit} | | | | | | não estimado |")
        tot.setdefault(r["ambiente"], [0, []])[1].append(r["bloco"])
        continue
    c, t = contar(r["sequencia"]) if r["sequencia"] else ({"M": 0, "P": 0, "Kc": 0, "Kt": 0, "H": 0}, 0.0)
    seq = r["sequencia"] or "(nenhum operador)"
    md.append(f"| {r['bloco']} | {r['ambiente']} | `{seq}` | {c['M']} | {c['P']} | {c['Kc']} | {c['Kt']} | {c['H']} | {t:.2f} |".replace(".", ","))
    tot.setdefault(r["ambiente"], [0, []])[0] += t
md.append("\n| Ambiente | Soma dos blocos estimados (s) | Blocos não estimados |\n|---|---|---|")
for a in sorted(tot):
    s, n = tot[a]
    md.append(f"| {a} | {s:.2f} | {', '.join(n) or 'nenhum'} |".replace(".", ","))
md.append("\nA soma não é comparável entre ambientes quando há bloco não estimado.")
open(os.path.join(AQUI, "klm_resultados.md"), "w", encoding="utf-8").write("\n".join(md) + "\n")
print("\n".join(md))
