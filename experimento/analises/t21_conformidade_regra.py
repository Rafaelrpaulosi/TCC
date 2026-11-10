"""T21 / R9.3: conformidade por regra, adaptada de Cha et al. (2026), sem LLM como juiz.

Cha et al. decompõem a especificação de cada componente em regras binárias (cor, borda,
tipografia) e contam a proporção de regras atendidas (Apêndice B, p. 6). Aqui, a
especificação é o componente principal do sistema de design no Figma, e a comparação é
determinística: para cada instância de componente do DS nas telas, cada propriedade
visual definida no principal vira uma regra, e a regra é atendida quando a instância
mantém o valor do principal.

Regras por nó do componente (nó e instância visíveis):
  - cor do primeiro preenchimento sólido (hex e opacidade);
  - cor e espessura do traço, se o principal tem traço sólido visível;
  - raio do canto, se o principal tem raio;
  - em texto: família, tamanho e peso da fonte.
Fora: conteúdo do texto, tamanho e posição (variam por uso), camadas ocultas,
componentes locais criados na execução (não são do DS). Troca de instância aninhada por
outro componente do DS é avaliada contra o novo principal; por componente fora do DS,
não é avaliada.

Principais: no B e no C, a página DS do próprio arquivo; no A, a página
"⛔ | Componentes - Reorganizando design" do arquivo do DS (a mesma copiada para B e C),
ligada às instâncias pela chave do componente.

Uso: python -I -X utf8 experimento/analises/t21_conformidade_regra.py
Saída: experimento/analises/t21_conformidade_regra.md
"""
import collections, csv, json, os, urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOK = open(os.path.join(RAIZ, "verificador", ".figma_token"), encoding="utf-8").read().strip()
ARQ = {"A": "[chave do arquivo do Ambiente A]", "B": "[chave do arquivo do Ambiente B]", "C": "[chave do arquivo do Ambiente C]"}
DS_ARQ = "[chave do arquivo do sistema de design]"
DS_PAGINA = "⛔ | Componentes - Reorganizando design"
EXP = os.path.join(RAIZ, "experimento", "exportacoes")


def get(path):
    req = urllib.request.Request("https://api.figma.com/v1" + path, headers={"X-Figma-Token": TOK})
    with urllib.request.urlopen(req, timeout=600) as r:
        return json.load(r)


def pagina(key, nome=None):
    """Devolve (documento da página, mapa id->chave dos componentes daquela resposta)."""
    pags = get(f"/files/{key}?depth=1")["document"]["children"]
    p = next(x for x in pags if x["name"] == (nome or "DS"))
    r = get(f"/files/{key}/nodes?ids={p['id']}")["nodes"][p["id"]]
    return r["document"], {i: v["key"] for i, v in r["components"].items()}


def indexar(n, out):
    if n["type"] == "COMPONENT":
        out[n["id"]] = n
    for c in n.get("children", []):
        indexar(c, out)


def hexa(paint, no):
    c = paint["color"]
    a = c.get("a", 1) * paint.get("opacity", 1)
    return "#%02X%02X%02X@%.2f" % (round(c["r"] * 255), round(c["g"] * 255), round(c["b"] * 255), a)


def solido(lista):
    for p in lista or []:
        if p.get("visible", True) and p.get("type") == "SOLID":
            return p
    return None


def raio(n):
    if n.get("rectangleCornerRadii"):
        return tuple(n["rectangleCornerRadii"])
    return n.get("cornerRadius")


# principais por chave, e chave de cada componentId usado nas telas
principais = {}   # chave -> nó principal
chave_de = {}     # (ambiente, componentId nas telas) -> chave
for amb, key in ARQ.items():
    if amb == "A":
        doc, mapa = pagina(DS_ARQ, DS_PAGINA)
    else:
        doc, mapa = pagina(key)
    comps = {}
    indexar(doc, comps)
    for i, n in comps.items():
        if i in mapa:
            principais[mapa[i]] = n
    # chave dos componentes de cada nó principal (para trocas aninhadas dentro do principal)
    for i, k in mapa.items():
        chave_de[("DS-" + amb, i)] = k
    telas = [r for r in csv.DictReader(open(os.path.join(EXP, "indice.csv"), encoding="utf-8")) if r["ambiente"] == amb]
    ids = ",".join(r["id"] for r in telas)
    nos = get(f"/files/{key}/nodes?ids={ids}")["nodes"]
    for r in telas:
        for i, v in nos[r["id"]]["components"].items():
            chave_de[(amb, i)] = v["key"]

resultado = collections.OrderedDict()
falhas = collections.Counter()
por_camada = collections.Counter()  # (ambiente, tipo de camada) -> falhas
exemplos = collections.defaultdict(list)


def regras(m, n, nome_comp, tally):
    """Compara nó principal m com nó da instância n; acumula (atendidas, total)."""
    if m.get("visible", True) is False or n.get("visible", True) is False:
        return
    def checa(rotulo, vm, vn):
        tally[1] += 1
        if vm == vn:
            tally[0] += 1
        else:
            falhas[rotulo] += 1
            tipo = "ícone (vetor)" if m["type"] in ("VECTOR", "BOOLEAN_OPERATION", "STAR", "LINE", "ELLIPSE", "REGULAR_POLYGON") else ("texto" if m["type"] == "TEXT" else "contêiner ou forma")
            por_camada[(amb_atual, tipo)] += 1
            if len(exemplos[rotulo]) < 4:
                exemplos[rotulo].append(f"{nome_comp} › {m['name']}: {vm} → {vn}")
    fm = solido(m.get("fills"))
    if fm:
        fn = solido(n.get("fills"))
        checa("cor de preenchimento", hexa(fm, m), hexa(fn, n) if fn else None)
    sm = solido(m.get("strokes"))
    if sm:
        sn = solido(n.get("strokes"))
        checa("cor do traço", hexa(sm, m), hexa(sn, n) if sn else None)
        checa("espessura do traço", m.get("strokeWeight"), n.get("strokeWeight") if sn else None)
    if raio(m):
        checa("raio do canto", raio(m), raio(n))
    if m["type"] == "TEXT":
        st_m, st_n = m.get("style", {}), n.get("style", {})
        for prop, rot in (("fontFamily", "família da fonte"), ("fontSize", "tamanho da fonte"), ("fontWeight", "peso da fonte")):
            checa(rot, st_m.get(prop), st_n.get(prop))
    cm, cn = m.get("children", []), n.get("children", [])
    if len(cm) != len(cn):
        falhas["estrutura diferente (não avaliada)"] += 1
        return
    for a, b in zip(cm, cn):
        if b["type"] == "INSTANCE" and a["type"] == "INSTANCE":
            ka = chave_de.get(("DS-" + amb_atual, a.get("componentId")))
            kb = chave_de.get((amb_atual, b.get("componentId")))
            if kb and ka != kb:
                if kb in principais:   # troca por outro componente do DS
                    regras(principais[kb], b, principais[kb]["name"], tally)
                continue
        regras(a, b, nome_comp, tally)


def andar(n, tally, cont):
    if n.get("visible", True) is False:
        return
    b = n.get("absoluteBoundingBox")
    # mesma regra do verificador v3: nó fora da área visível do quadro (cortado pela borda) não conta
    if b and not (b["x"] < QUADRO["x"] + QUADRO["width"] and b["x"] + b["width"] > QUADRO["x"] and b["y"] < QUADRO["y"] + QUADRO["height"] and b["y"] + b["height"] > QUADRO["y"]):
        return
    if n["type"] == "INSTANCE":
        k = chave_de.get((amb_atual, n.get("componentId")))
        if k in principais:
            cont[0] += 1
            regras(principais[k], n, principais[k]["name"], tally)
            return
    for c in n.get("children", []):
        andar(c, tally, cont)


for r in csv.DictReader(open(os.path.join(EXP, "indice.csv"), encoding="utf-8")):
    amb_atual = r["ambiente"]
    no = json.load(open(os.path.join(RAIZ, r["png"][:-4] + ".json"), encoding="utf-8"))
    QUADRO = no["absoluteBoundingBox"]
    b = resultado.setdefault(r["pagina"], {"amb": r["ambiente"], "t": [0, 0], "inst": [0], "telas": 0})
    andar(no, b["t"], b["inst"])
    b["telas"] += 1

md = ["# T21: conformidade por regra (adaptação de Cha et al., 2026, sem LLM como juiz)\n",
      "Gerado por `t21_conformidade_regra.py` sobre as telas exportadas em 07/11/2026. Regra: propriedade visual "
      "definida no componente principal do sistema de design, mantida ou não na instância (ver o cabeçalho do script).\n",
      "| Bloco | Telas | Instâncias do DS avaliadas | Regras | Atendidas | Conformidade (%) |", "|---|---|---|---|---|---|"]
amb = collections.defaultdict(list)
for pag, b in resultado.items():
    ok, tot = b["t"]
    pct = round(100 * ok / tot, 2) if tot else None
    amb[b["amb"]].append(pct)
    md.append(f"| {pag} | {b['telas']} | {b['inst'][0]} | {tot} | {ok} | {pct} |")
md += ["\n| Ambiente | Média dos blocos (%) | Mínimo | Máximo |", "|---|---|---|---|"]
for a, l in amb.items():
    md.append(f"| {a} | {round(sum(l) / len(l), 2)} | {min(l)} | {max(l)} |")
md += ["\n## Regras não atendidas, por tipo (todas as execuções)\n", "| Tipo | Ocorrências | Exemplos (componente › camada: principal → instância) |", "|---|---|---|"]
for rot, q in falhas.most_common():
    md.append(f"| {rot} | {q} | {'; '.join(exemplos.get(rot, []))} |")
md += ["\n## Regras não atendidas por tipo de camada e ambiente\n", "| Ambiente | Ícone (vetor) | Texto | Contêiner ou forma |", "|---|---|---|---|"]
for a in ARQ:
    md.append(f"| {a} | {por_camada[(a, 'ícone (vetor)')]} | {por_camada[(a, 'texto')]} | {por_camada[(a, 'contêiner ou forma')]} |")
open(os.path.join(RAIZ, "experimento", "analises", "t21_conformidade_regra.md"), "w", encoding="utf-8").write("\n".join(md) + "\n")
print("\n".join(md))
