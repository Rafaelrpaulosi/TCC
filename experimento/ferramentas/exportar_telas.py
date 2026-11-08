"""Exporta todas as telas de cada bloco dos Ambientes A, B e C pela API REST do Figma.

Tela = quadro (FRAME) de primeiro nível da página do bloco, com largura de 800 px ou mais.
Ficam de fora: componentes, seções e quadros de componentes locais, e sobras pequenas
(no A, o quadro 'List menu Subitem Tissue', 166 x 128, do B4-A). Entra o relatório A4
do B4-A (842 x 595), que é tela do bloco.

Saída (fora do repositório público, porque o DS e as telas não são publicados):
  experimento/exportacoes/<AMB>/<pagina>/<ordem>_<id>.png   (escala 2)
  experimento/exportacoes/<AMB>/<pagina>/<ordem>_<id>.json  (nó completo)
  experimento/exportacoes/indice.csv

Uso: python -I -X utf8 experimento/ferramentas/exportar_telas.py
"""
import csv, json, os, re, time, urllib.request, urllib.error

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOK = open(os.path.join(RAIZ, "verificador", ".figma_token"), encoding="utf-8").read().strip()
ARQ = {"A": "[chave do arquivo do Ambiente A]", "B": "[chave do arquivo do Ambiente B]", "C": "[chave do arquivo do Ambiente C]"}
SAIDA = os.path.join(RAIZ, "experimento", "exportacoes")
LARGURA_MIN = 800
EXCLUIR_NOME = re.compile(r"componentes locais", re.I)


def get(url, binario=False, tentativas=4):
    for t in range(tentativas):
        req = urllib.request.Request(url, headers={} if binario else {"X-Figma-Token": TOK})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                return r.read() if binario else json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429 and t < tentativas - 1:
                time.sleep(20 * (t + 1))
                continue
            raise


def api(path):
    return get("https://api.figma.com/v1" + path)


linhas = []
for amb, key in ARQ.items():
    arq = api(f"/files/{key}?depth=2")
    for pag in arq["document"]["children"]:
        if pag["name"] == "DS":
            continue
        telas = []
        for c in pag.get("children", []):
            bb = c.get("absoluteBoundingBox") or {}
            if c["type"] != "FRAME" or EXCLUIR_NOME.search(c["name"]) or bb.get("width", 0) < LARGURA_MIN and not c["name"].startswith("Relatorio - A4"):
                continue
            telas.append(c)
        # ordem de leitura: da esquerda para a direita, de cima para baixo
        telas.sort(key=lambda c: (round(c["absoluteBoundingBox"]["y"] / 200), c["absoluteBoundingBox"]["x"]))
        pasta = os.path.join(SAIDA, amb, pag["name"])
        os.makedirs(pasta, exist_ok=True)
        ids = ",".join(c["id"] for c in telas)
        nos = api(f"/files/{key}/nodes?ids={ids}")["nodes"]
        imgs = api(f"/images/{key}?ids={ids}&format=png&scale=2")["images"]
        for i, c in enumerate(telas, 1):
            base = f"{i:02d}_{c['id'].replace(':', '-')}"
            with open(os.path.join(pasta, base + ".json"), "w", encoding="utf-8") as f:
                json.dump(nos[c["id"]]["document"], f, ensure_ascii=False)
            png = get(imgs[c["id"]], binario=True)
            with open(os.path.join(pasta, base + ".png"), "wb") as f:
                f.write(png)
            bb = c["absoluteBoundingBox"]
            linhas.append({"ambiente": amb, "pagina": pag["name"], "ordem": i, "id": c["id"], "nome": c["name"],
                           "largura": int(bb["width"]), "altura": int(bb["height"]),
                           "png": os.path.relpath(os.path.join(pasta, base + ".png"), RAIZ).replace("\\", "/")})
            print(amb, pag["name"], i, c["id"], c["name"])

with open(os.path.join(SAIDA, "indice.csv"), "w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(linhas[0]))
    w.writeheader()
    w.writerows(linhas)
cont = {a: sum(1 for l in linhas if l["ambiente"] == a) for a in ARQ}
print("telas por ambiente:", cont)
