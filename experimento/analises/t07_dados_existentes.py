"""T07 do PLANO_CORRECAO.md: análises com dados já existentes (05/11/2026).

Fontes: experimento/consolidado.csv, experimento/verificador_relatorios/v2/*/relatorio.json e ocorrencias.csv,
experimento/auditoria_gravacoes/leituras_cronometro.csv. Saída: experimento/analises/t07_resultados.md.
Nenhum dado é digitado à mão: todo número sai destes arquivos.
"""
import csv, glob, json, os, statistics as st, datetime as dt

R = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EXP = os.path.join(R, "experimento")
out = []
p = out.append

cons = list(csv.DictReader(open(os.path.join(EXP, "consolidado.csv"), encoding="utf-8")))
for c in cons:
    for k in ("tempo_min", "aderencia_ds_pct", "contraste_texto_pct", "alvo_toque_pct"):
        c[k] = float(c[k])
    c["telas"] = int(c["telas"]); c["nos_total"] = int(c["nos_total"]); c["bloco"] = int(c["bloco"])
amb = {a: sorted([c for c in cons if c["ambiente"] == a], key=lambda c: c["bloco"]) for a in "ABC"}
tot = {a: sum(c["tempo_min"] for c in amb[a]) for a in "ABC"}

p("# T07: análises com dados existentes\n")
p("Gerado por `experimento/analises/t07_dados_existentes.py`. Não editar à mão.\n")

# 1. Pausas do cronômetro (mesmo método de auditoria_gravacoes/intervalos.py)
def seg(h):
    a, b, c = h.split(":"); return int(a) * 3600 + int(b) * 60 + float(c)
zeros = {}
for l in csv.DictReader(open(os.path.join(EXP, "auditoria_gravacoes", "leituras_cronometro.csv"), encoding="utf-8")):
    if l["execucao"] == "sem bloco" or seg(l["cron_inicio"]) == 0:
        continue
    # trecho reaberto depois de o bloco ser dado como concluído (B4-A, declarado na seção 4.1):
    # o intervalo entre o fechamento e a reabertura não é pausa durante a execução
    if "reaberto" in l["obs"]:
        continue
    t0 = dt.datetime.strptime(l["inicio_clipe"], "%Y-%m-%d %H:%M:%S") - dt.timedelta(seconds=seg(l["cron_inicio"]))
    zeros.setdefault(l["execucao"], []).append(t0)
pausa = {e: sum((b - a).total_seconds() for a, b in zip(v, v[1:]) if (b - a).total_seconds() > 45) / 60 for e, v in zeros.items()}
pA = sum(v for e, v in pausa.items() if "-A-" in e); pB = sum(v for e, v in pausa.items() if "-B-" in e)
red = lambda a, b: 100 * (1 - b / a)
p("## 1. Sensibilidade do tempo às pausas do cronômetro\n")
p("| Execução | Intervalo parado (min) |\n|---|---|")
for e in sorted(pausa):
    if pausa[e] > 0: p(f"| {e} | {pausa[e]:.2f} |")
p("")
p("| Cenário | A (min) | B (min) | Redução A para B |\n|---|---|---|---|")
p(f"| Cronômetro | {tot['A']:.2f} | {tot['B']:.2f} | {red(tot['A'], tot['B']):.1f}% |")
p(f"| Intervalos de A e B contados como trabalho | {tot['A']+pA:.2f} | {tot['B']+pB:.2f} | {red(tot['A']+pA, tot['B']+pB):.1f}% |")
p(f"| Só os intervalos do B contados (pior caso para o B) | {tot['A']:.2f} | {tot['B']+pB:.2f} | {red(tot['A'], tot['B']+pB):.1f}% |")
p("\nNo C não há execução com mais de um clipe além do B1-C, então intervalos não são verificáveis (ver `linha_do_tempo.csv`).\n")

# 2. Sensibilidade à cópia de componentes no A
emp = tot["A"] - tot["B"]
g25 = tot["A"] - tot["B"] / 0.75
p("## 2. Sensibilidade à cópia de componentes no A\n")
p(f"A cópia do DS ocorreu dentro do cronômetro do A (Q1, gravações). Ela não é medível: só um monitor foi gravado. Para o tempo do A igualar o do B, a cópia teria de somar **{emp:.2f} min** ({100*emp/tot['A']:.1f}% do tempo do A). Para a redução cair a 25%, **{g25:.2f} min**. Para cair a zero com os intervalos do B contados, {tot['A']-(tot['B']+pB):.2f} min.\n")

# 3. Tempo normalizado
p("## 3. Tempo normalizado\n")
p("| Ambiente | Tempo (min) | Telas | Nós | min por tela | min por 100 nós |\n|---|---|---|---|---|---|")
for a in "ABC":
    t = tot[a]; n = sum(c["telas"] for c in amb[a]); nos = sum(c["nos_total"] for c in amb[a])
    p(f"| {a} | {t:.2f} | {n} | {nos} | {t/n:.2f} | {100*t/nos:.2f} |")
p("")

# 4. Volume de composição: ganho por bloco x nós do A (Spearman, n = 5, descritivo)
def rank(v):
    o = sorted(range(len(v)), key=lambda i: v[i]); r = [0]*len(v)
    for k, i in enumerate(o): r[i] = k + 1
    return r
def spear(x, y):
    rx, ry = rank(x), rank(y); n = len(x)
    return 1 - 6 * sum((a - b) ** 2 for a, b in zip(rx, ry)) / (n * (n * n - 1))
ganho = [red(a["tempo_min"], b["tempo_min"]) for a, b in zip(amb["A"], amb["B"])]
nosA = [c["nos_total"] for c in amb["A"]]; tA = [c["tempo_min"] for c in amb["A"]]
p("## 4. Volume de composição (hipótese, n = 5)\n")
p("| Bloco | Nós A | Tempo A | Tempo B | Redução |\n|---|---|---|---|---|")
for i in range(5):
    p(f"| {i+1} | {nosA[i]} | {tA[i]:.2f} | {amb['B'][i]['tempo_min']:.2f} | {ganho[i]:.1f}% |")
p(f"\nSpearman entre nós do A e redução: **{spear(nosA, ganho):.2f}**; entre tempo do A e redução: {spear(tA, ganho):.2f}. Com n = 5, só descritivo. O tempo do B fica entre {min(c['tempo_min'] for c in amb['B']):.2f} e {max(c['tempo_min'] for c in amb['B']):.2f} min: a redução varia porque o tempo do A varia.\n")

# 5. Variação do agente para a mesma entrada
b1, c1 = amb["B"][0]["tempo_min"], amb["C"][0]["tempo_min"]
p("## 5. Variação do agente (B1 x C1, mesma entrada, conversa nova)\n")
p(f"B1-B {b1:.2f} min, B1-C {c1:.2f} min: diferença de **{100*(b1-c1)/b1:.1f}%** do B1-B. Diferença A x B no Bloco 1: {100*(amb['B'][0]['tempo_min']-amb['A'][0]['tempo_min'])/amb['A'][0]['tempo_min']:+.1f}% (B mais lento); no Bloco 5: {ganho[4]:.1f}%. Nos dois blocos, a diferença entre fluxos é menor que a variação do agente.\n")

# 6. Densidade, fora de token e contraste por tamanho, por tela
p("## 6. Densidade, valores fora de token e contraste por tamanho de texto\n")
p("Agregação das Tabelas 3 e 4 (C4.12): percentual sobre todos os elementos das telas do bloco somados (`consolidar.py`), não média das telas.\n")
p("| Execução | Telas | Nós por tela (média) | Cores fora de token (máx. por tela) | Tamanhos de fonte fora de token (máx. por tela) | Reprovações de contraste | das quais texto pequeno (mín. 4,5:1) |\n|---|---|---|---|---|---|---|")
for d in sorted(glob.glob(os.path.join(EXP, "verificador_relatorios", "v2", "B*"))):
    ex = os.path.basename(d)[:7]
    j = json.load(open(os.path.join(d, "relatorio.json"), encoding="utf-8"))
    ms = [q["metricas"] for q in j["prototipos"]]
    rep = peq = 0
    for r in csv.DictReader(open(os.path.join(d, "ocorrencias.csv"), encoding="utf-8")):
        if r["criterio"] == "contraste_texto_1.4.3" and r["gravidade"] == "reprova":
            rep += 1; peq += "4.5:1" in r["detalhe"]
    p(f"| {ex} | {len(ms)} | {st.mean(m['densidade_total_nos'] for m in ms):.0f} | {max(m['cores_distintas_fora_token'] for m in ms)} | {max(m['tamanhos_fonte_distintos_fora_token'] for m in ms)} | {rep} | {peq} |")
p("\nObs.: o número de telas aqui é o de quadros analisados pelo verificador, que pode diferir da contagem de telas do registro quando um quadro de apoio foi analisado ou excluído.\n")

# 7. Independência das sessões do B (transcrições)
p("## 7. Independência das sessões do B (C4.17)\n")
T = os.path.join(EXP, "execucoes", "transcricoes")
for f in sorted(glob.glob(os.path.join(T, "B?-B-01.md"))):
    for i, l in enumerate(open(f, encoding="utf-8"), 1):
        if ("não abri" in l.lower() or "não toquei" in l.lower() or "não foram abertas" in l.lower()):
            p(f"- `{os.path.basename(f)}`, linha {i}: \"{l.strip()[:220]}\"")
p("\nNas transcrições (texto visível das conversas), o agente declara ter visto os nomes das páginas dos blocos anteriores e não tê-las aberto. As chamadas de ferramenta não constam das transcrições; a confirmação depende da exportação de dados da conta Claude (T24). Os nomes da paciente nos Blocos 2 a 5 se parecem com o nome dado à médica no Bloco 1 (Helena). Como cada sessão declara não ter aberto as outras páginas, a explicação compatível com as transcrições é a preferência do modelo para entradas semelhantes, e não a leitura de outras páginas; sem as chamadas de ferramenta, isso não fica provado.\n")

open(os.path.join(EXP, "analises", "t07_resultados.md"), "w", encoding="utf-8").write("\n".join(out))
print("\n".join(out))
