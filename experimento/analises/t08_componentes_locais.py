"""T08 / C4.13: lista os componentes locais de cada arquivo (A, B e C).

Componente local = nó COMPONENT ou COMPONENT_SET definido numa página de bloco
(qualquer página que não seja "DS"). São os componentes criados durante as execuções;
os do sistema de design ficam na página DS (B e C) ou em outro arquivo (A).

Saída: experimento/analises/t08_componentes_locais.json
Uso: python -I -X utf8 experimento/analises/t08_componentes_locais.py
"""
import json, os, urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOK = open(os.path.join(RAIZ, "verificador", ".figma_token"), encoding="utf-8").read().strip()
ARQ = {"A": "[chave do arquivo do Ambiente A]", "B": "[chave do arquivo do Ambiente B]", "C": "[chave do arquivo do Ambiente C]"}


def get(path):
    req = urllib.request.Request("https://api.figma.com/v1" + path, headers={"X-Figma-Token": TOK})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)


def coletar(n, pagina, out):
    if n["type"] in ("COMPONENT", "COMPONENT_SET"):
        out.append({"id": n["id"], "tipo": n["type"], "nome": n["name"], "pagina": pagina})
    for c in n.get("children", []):
        coletar(c, pagina, out)


res = {}
for amb, key in ARQ.items():
    pags = [p for p in get(f"/files/{key}?depth=1")["document"]["children"] if p["name"] != "DS"]
    nos = get(f"/files/{key}/nodes?ids=" + ",".join(p["id"] for p in pags))["nodes"]
    lista = []
    for p in pags:
        coletar(nos[p["id"]]["document"], p["name"], lista)
    res[amb] = lista
    print(amb, len(lista), [f"{c['pagina']}: {c['nome']}" for c in lista])

json.dump(res, open(os.path.join(RAIZ, "experimento", "analises", "t08_componentes_locais.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
