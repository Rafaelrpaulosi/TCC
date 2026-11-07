"""T23: gráfico de tempo por bloco e ambiente (06/11/2026).

Lê experimento/execucoes/registro_execucoes.csv (coluna tempo_minutos, cronômetro) e gera
experimento/figuras/t23_tempo_por_bloco.png, para a figura do Cap. 4. Título e fonte ficam
na legenda da figura no documento (padrão UEPG), não na imagem.
Cores validadas pelo validador da skill dataviz; hachuras para impressão em tons de cinza.
"""
import csv, os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
t = {}
with open(os.path.join(RAIZ, "experimento", "execucoes", "registro_execucoes.csv"), encoding="utf-8") as f:
    for r in csv.DictReader(f):
        t[(int(r["bloco_id"]), r["ambiente"])] = float(r["tempo_minutos"])

BLOCOS = ["1. Lista e\ninício", "2. Dados do\npaciente", "3. Registro da\nconsulta", "4. Relatório", "5. Encerra-\nmento"]
AMB = [("A", "A (manual)", "#2a78d6", ""), ("B", "B (agente, sessões independentes)", "#eb6834", "///"),
       ("C", "C (agente, conversa contínua)", "#1baf7a", "...")]

plt.rcParams.update({"font.family": "Arial", "font.size": 10, "hatch.color": "white", "hatch.linewidth": 1.2})
fig, ax = plt.subplots(figsize=(16 / 2.54, 9 / 2.54), dpi=300)
w = 0.26
for i, (a, nome, cor, hachura) in enumerate(AMB):
    xs = [b + (i - 1) * (w + 0.02) for b in range(5)]
    ys = [t[(b + 1, a)] for b in range(5)]
    ax.bar(xs, ys, width=w, color=cor, hatch=hachura, label=nome, edgecolor="white", linewidth=0.8, zorder=3)
ax.set_xticks(range(5))
ax.set_xticklabels(BLOCOS)
ax.set_ylabel("Tempo de cronômetro (min)")
ax.set_ylim(0, 60)
ax.yaxis.grid(True, color="#e3e2dc", linewidth=0.6, zorder=0)
for s in ("top", "right", "left"):
    ax.spines[s].set_visible(False)
ax.spines["bottom"].set_color("#8a897f")
ax.tick_params(axis="both", length=0, colors="#3a3a36")
ax.legend(frameon=False, loc="lower center", bbox_to_anchor=(0.5, 1.0), ncol=3, fontsize=7.5,
          handlelength=1.8, columnspacing=1.2)
fig.tight_layout()
saida = os.path.join(RAIZ, "experimento", "figuras", "t23_tempo_por_bloco.png")
fig.savefig(saida, facecolor="white")
print(saida, {a: round(sum(t[(b, a)] for b in range(1, 6)), 2) for a in "ABC"})
