"""T19: posição (relativa ao topo do quadro) dos textos de cada tela dos Blocos 3 a 5.

Base para o KLM: diz se o alvo está na área visível (1440 x 900 a partir do topo,
regra 3 do protocolo) ou exige rolagem. Lê `experimento/exportacoes/`.
Saída: docs/klm/posicoes.md
Uso: python -I -X utf8 docs/klm/posicoes.py
"""
import csv, json, os

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXP = os.path.join(RAIZ, "experimento", "exportacoes")


def textos(n, out):
    if n.get("visible", True) is False:
        return
    if n["type"] == "TEXT" and (n.get("characters") or "").strip():
        bb = n["absoluteBoundingBox"]
        out.append((bb["y"], bb["x"], bb["height"], " ".join(n["characters"].split())[:70]))
    for c in n.get("children", []):
        textos(c, out)


with open(os.path.join(RAIZ, "docs", "klm", "posicoes.md"), "w", encoding="utf-8") as o:
    o.write("# Posição dos textos nas telas dos Blocos 3 a 5 (y e x relativos ao topo e à esquerda do quadro)\n\n")
    o.write("Visível sem rolagem: y + altura <= 900.\n")
    for r in csv.DictReader(open(os.path.join(EXP, "indice.csv"), encoding="utf-8")):
        if r["pagina"][:2] not in ("B3", "B4", "B5"):
            continue
        no = json.load(open(os.path.join(RAIZ, r["png"][:-4] + ".json"), encoding="utf-8"))
        bb = no["absoluteBoundingBox"]
        out = []
        textos(no, out)
        out.sort()
        o.write(f"\n## {r['ambiente']} {r['pagina']} [{r['ordem']}] {r['nome']} ({r['largura']} x {r['altura']})\n\n")
        for y, x, h, t in out:
            yr = round(y - bb["y"])
            o.write(f"- y {yr:5d} x {round(x - bb['x']):5d}{' (rolagem)' if yr + h > 900 else ''}: {t}\n")
print("ok")
