"""T05: busca bibliográfica registrada (06/11/2026).

Roda as buscas nas bases abertas (Crossref e arXiv), registra data, termos e número de
resultados, e marca quais das referências usadas no trabalho aparecem entre os 50 primeiros
resultados de cada busca. Gera docs/busca/t05_busca.md e os resultados brutos em docs/busca/brutos/.

A busca é complementar e posterior à seleção das fontes: a maior parte das referências veio
do arquivo de referencial da banca (30/10/2026) e da leitura das referências dessas fontes.
O registro mostra o que as bases devolvem para cada eixo e onde as fontes usadas aparecem.
"""
import datetime, json, os, re, time, unicodedata, urllib.parse, urllib.request
import xml.etree.ElementTree as ET

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SAI = os.path.join(RAIZ, "docs", "busca")
BRUTOS = os.path.join(SAI, "brutos")
os.makedirs(BRUTOS, exist_ok=True)
UA = {"User-Agent": "tcc-busca-bibliografica/1.0"}

# eixo, termos OpenAlex (busca em título, resumo e texto), termos arXiv
BUSCAS = [
    ("Usabilidade e segurança em sistemas de saúde", '"electronic health record" usability patient safety', 'abs:"electronic health record" AND abs:usability'),
    ("Avaliação heurística", '"heuristic evaluation" usability evaluator', 'abs:"heuristic evaluation"'),
    ("IA generativa no design de interfaces", '"large language model" "user interface" design generation', 'abs:"large language model" AND abs:"user interface" AND abs:design'),
    ("Produtividade com IA generativa", '"generative AI" productivity experiment workers', 'abs:"generative AI" AND abs:productivity'),
    ("MCP e agentes com ferramentas", '"Model Context Protocol"', 'abs:"Model Context Protocol"'),
    ("Viés de automação", '"automation bias" decision support', 'abs:"automation bias"'),
    ("Acessibilidade e verificação automática", 'accessibility evaluation tools WCAG automated', 'abs:accessibility AND abs:WCAG AND abs:automated'),
]

# Referências usadas no trabalho (título curto para casar com os resultados)
USADAS = {
    "Cha et al. (2026)": "design system",  # conferido abaixo pelo título completo
    "Duan et al. (2024)": "generating automatic feedback on ui mockups with large language models",
    "Li et al. (2024)": "user interface design",
    "Lu et al. (2022)": "bridging the gap between ux practitioners",
    "Koppel et al. (2005)": "role of computerized physician order entry systems in facilitating medication errors",
    "Zahabi, Kaber e Swangnetr (2015)": "usability and safety in electronic medical records interface design",
    "Howe et al. (2018)": "electronic health record usability issues and potential contribution to patient harm",
    "Nielsen e Molich (1990)": "heuristic evaluation of user interfaces",
    "Nielsen e Landauer (1993)": "a mathematical model of the finding of usability problems",
    "Hertzum e Jacobsen (2001)": "the evaluator effect",
    "Noy e Zhang (2023)": "experimental evidence on the productivity effects of generative artificial intelligence",
    "Brynjolfsson, Li e Raymond (2025)": "generative ai at work",
    "Dell'Acqua et al. (2026)": "navigating the jagged technological frontier",
    "Parasuraman e Manzey (2010)": "complacency and bias in human use of automation",
    "Amershi et al. (2019)": "guidelines for human-ai interaction",
    "Vigo, Brown e Conway (2013)": "benchmarking web accessibility evaluation tools",
    "Lamine e Cheng (2022)": "accessibility",
}
USADAS["Cha et al. (2026)"] = None  # título exato conferido no PDF antes de usar
USADAS["Li et al. (2024)"] = None
USADAS["Lamine e Cheng (2022)"] = None


def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9 ]+", " ", s)


def titulo_pdf(nome):
    """Primeiras linhas do texto extraído, para casar Cha, Li e Lamine pelo título real."""
    p = os.path.join(RAIZ, "docs", "referencias_pdf", nome)
    return open(p, encoding="utf-8", errors="ignore").read()[:600] if os.path.exists(p) else ""


def get(url):
    for t in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001
            if t == 2:
                raise
            time.sleep(5 * (t + 1))


hoje = datetime.date.today().isoformat()
linhas, achados = [], {}
for eixo, q_oa, q_ax in BUSCAS:
    url_oa = "https://api.crossref.org/works?" + urllib.parse.urlencode(
        {"query.bibliographic": q_oa.replace('"', ''), "rows": 50, "select": "title,DOI", "filter": "from-pub-date:1980-01-01"})
    cr = json.loads(get(url_oa))["message"]
    oa = {"meta": {"count": cr["total-results"]}, "results": [{"title": (it.get("title") or [""])[0]} for it in cr["items"]]}
    time.sleep(2)
    url_ax = "https://export.arxiv.org/api/query?" + urllib.parse.urlencode(
        {"search_query": q_ax, "start": 0, "max_results": 50})
    ax_xml = get(url_ax)
    time.sleep(4)
    ns = {"a": "http://www.w3.org/2005/Atom", "o": "http://a9.com/-/spec/opensearch/1.1/"}
    raiz = ET.fromstring(ax_xml)
    n_ax = int(raiz.find("o:totalResults", ns).text)
    tit_ax = [e.find("a:title", ns).text for e in raiz.findall("a:entry", ns)]
    tit_oa = [w.get("title") or "" for w in oa["results"]]
    slug = norm(eixo).replace(" ", "_")[:40]
    json.dump({"data": hoje, "crossref_url": url_oa, "crossref_total": oa["meta"]["count"], "crossref_top50": tit_oa,
               "arxiv_url": url_ax, "arxiv_total": n_ax, "arxiv_top50": tit_ax},
              open(os.path.join(BRUTOS, f"{slug}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    todos = [norm(t) for t in tit_oa + tit_ax]
    hit = [ref for ref, chave in USADAS.items() if chave and any(norm(chave) in t for t in todos)]
    for ref in hit:
        achados.setdefault(ref, []).append(eixo)
    linhas.append((eixo, q_oa, oa["meta"]["count"], q_ax, n_ax, hit))
    print(eixo, oa["meta"]["count"], n_ax, hit)

with open(os.path.join(SAI, "t05_busca.md"), "w", encoding="utf-8") as f:
    f.write(f"# Busca bibliográfica registrada (T05)\n\nExecutada em {hoje} por `experimento/analises/t05_busca.py`. Não editar à mão.\n\n")
    f.write("Bases: Crossref (metadados de publicações com DOI de todas as grandes editoras) e arXiv. "
            "Ordenação por relevância; conferidos os 50 primeiros resultados de cada busca. "
            "Na Crossref a contagem inclui registros que casam com qualquer termo, por isso é grande e serve só de ordem de grandeza; "
            "no arXiv a contagem é a da expressão booleana. OpenAlex e Semantic Scholar recusaram consulta (HTTP 429) na data. "
            "ACM Digital Library, PubMed e o Portal de Periódicos CAPES foram usados para obter os textos completos, "
            "não para a contagem, porque bloqueiam consulta automática.\n\n")
    f.write("| Eixo | Termos (Crossref) | Resultados | Termos (arXiv) | Resultados | Fontes usadas entre os 50 primeiros |\n|---|---|---|---|---|---|\n")
    for eixo, qo, no, qa, na, hit in linhas:
        f.write(f"| {eixo} | `{qo}` | {no} | `{qa}` | {na} | {'; '.join(hit) or 'nenhuma'} |\n")
    f.write("\n## Origem das fontes usadas\n\n"
            "A busca acima é complementar e foi feita depois da seleção. As fontes vieram principalmente do arquivo de "
            "referencial entregue pela banca em 30/10/2026 (`docs/defesa/retorno_banca/`) e das referências citadas por "
            "essas fontes. Fontes usadas que não aparecem entre os 50 primeiros resultados de nenhuma busca:\n\n")
    for ref, chave in USADAS.items():
        if chave and ref not in achados:
            f.write(f"- {ref}\n")
    f.write("\nNão casadas automaticamente (título conferido à mão): Cha et al. (2026), Li et al. (2024), Lamine e Cheng (2022).\n")
print("ok")
