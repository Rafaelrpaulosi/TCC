"""T08 / C4.6: a página DS do arquivo do Ambiente B mudou entre as versões do Figma?

Baixa a página DS inteira em cada versão do histórico (API REST do Figma) e compara
um hash do conteúdo. Uma versão do histórico é uma fotografia do arquivo, não um
registro de cada ação: o script mostra se a página ficou idêntica entre fotografias,
não se houve um quadro criado e removido entre duas delas.

Uso: python experimento/analises/t08_historico_ds.py
Saída: experimento/analises/t08_historico_ds.md
"""
import hashlib, json, os, urllib.request, urllib.error
from datetime import datetime, timedelta, timezone

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOK = open(os.path.join(RAIZ, "verificador", ".figma_token"), encoding="utf-8").read().strip()
KEY = "[chave do arquivo do Ambiente B]"  # arquivo do Ambiente B
BRT = timezone(timedelta(hours=-3))


def get(path):
    req = urllib.request.Request("https://api.figma.com/v1" + path, headers={"X-Figma-Token": TOK})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)


def contar(n):
    return 1 + sum(contar(c) for c in n.get("children", []))


atual = get(f"/files/{KEY}?depth=1")
ds_id = next(p["id"] for p in atual["document"]["children"] if p["name"] == "DS")
versoes = get(f"/files/{KEY}/versions")["versions"]

linhas = []
for v in sorted(versoes, key=lambda x: x["created_at"]):
    quando = datetime.fromisoformat(v["created_at"].replace("Z", "+00:00")).astimezone(BRT)
    try:
        d = get(f"/files/{KEY}/nodes?ids={ds_id}&version={v['id']}")
        no = (d.get("nodes") or {}).get(ds_id)
    except urllib.error.HTTPError as e:
        no = None
    if not no or not no.get("document"):
        linhas.append((quando, v["id"], "página DS ausente", "", ""))
        continue
    doc = no["document"]
    h = hashlib.sha256(json.dumps(doc, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()
    filhos = [c["name"] for c in doc.get("children", [])]
    linhas.append((quando, v["id"], h[:16], contar(doc), len(filhos)))
    print(quando.strftime("%d/%m %H:%M"), h[:16], contar(doc), len(filhos))

hashes = {l[2] for l in linhas if l[3] != ""}
out = os.path.join(RAIZ, "experimento", "analises", "t08_historico_ds.md")
with open(out, "w", encoding="utf-8") as f:
    f.write("# T08 / C4.6: página DS do arquivo do Ambiente B no histórico de versões\n\n")
    f.write(f"Gerado por `t08_historico_ds.py` em {datetime.now(BRT):%d/%m/%Y %H:%M} (Brasília). ")
    f.write(f"Página DS: id {ds_id}. Hash: SHA-256 (16 primeiros caracteres) do JSON da página, com chaves ordenadas.\n\n")
    f.write("| Versão (Brasília) | Id da versão | Hash da página DS | Nós | Seções no 1º nível |\n|---|---|---|---|---|\n")
    for q, i, h, n, s in linhas:
        f.write(f"| {q:%d/%m/%Y %H:%M} | {i} | {h} | {n} | {s} |\n")
    f.write(f"\nHashes distintos entre as versões com a página DS: {len(hashes)}.\n")
print("hashes distintos:", len(hashes), "->", out)
