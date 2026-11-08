"""T08: textos visíveis de cada tela exportada (A, B e C), na ordem de leitura.

Lê os JSON de `experimento/exportacoes/` (gerados por exportar_telas.py) e grava
`experimento/analises/t08_textos.md`, base do quadro de consistência. Só nós
visíveis (o nó e todos os ancestrais com visible != false).

Uso: python -I -X utf8 experimento/analises/t08_textos.py
"""
import csv, json, os

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXP = os.path.join(RAIZ, "experimento", "exportacoes")


def textos(n, out):
    if n.get("visible", True) is False:
        return
    if n["type"] == "TEXT":
        bb = n.get("absoluteBoundingBox") or {}
        t = " ".join((n.get("characters") or "").split())
        if t:
            out.append((bb.get("y", 0), bb.get("x", 0), t))
    for c in n.get("children", []):
        textos(c, out)


saida = os.path.join(RAIZ, "experimento", "analises", "t08_textos.md")
with open(os.path.join(EXP, "indice.csv"), encoding="utf-8") as f, open(saida, "w", encoding="utf-8") as o:
    o.write("# T08: textos visíveis por tela\n\nGerado por `t08_textos.py` a partir de `experimento/exportacoes/`. "
            "Ordem: de cima para baixo, da esquerda para a direita (linhas de 8 px).\n")
    for r in csv.DictReader(f):
        js = os.path.join(RAIZ, r["png"][:-4] + ".json")
        no = json.load(open(js, encoding="utf-8"))
        bb = no["absoluteBoundingBox"]
        out = []
        textos(no, out)
        out.sort(key=lambda t: (round((t[0] - bb["y"]) / 8), t[1]))
        o.write(f"\n## {r['ambiente']} · {r['pagina']} · {r['ordem']:0>2} · {r['id']} · {r['nome']}\n\n")
        o.write(" | ".join(t[2] for t in out) + "\n")
print(saida)
