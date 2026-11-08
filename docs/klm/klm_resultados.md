# Resultados do KLM (T19)

Gerado por `klm_resultados.py` a partir de `sequencias.csv`, conforme `protocolo_klm.md`. Tempos em segundos. K de clique (após P) = 0,20 s; K de tecla = 0,28 s.

| Bloco | Ambiente | Sequência | M | P | K (clique) | K (tecla) | H | Tempo previsto (s) |
|---|---|---|---|---|---|---|---|---|
| 1 | A | `M P K` | 1 | 1 | 1 | 0 | 0 | 2,65 |
| 1 | B | `M P K` | 1 | 1 | 1 | 0 | 0 | 2,65 |
| 1 | C | `M P K` | 1 | 1 | 1 | 0 | 0 | 2,65 |
| 2 | A | caminho não visível na tela | | | | | | não estimado |
| 2 | B | `(nenhum operador)` | 0 | 0 | 0 | 0 | 0 | 0,00 |
| 2 | C | `(nenhum operador)` | 0 | 0 | 0 | 0 | 0 | 0,00 |
| 3 | A | `M P K H 40K H M P K H 40K H M P K H 40K H M P K H 40K H M P K` | 5 | 5 | 5 | 160 | 8 | 61,25 |
| 3 | B | `M P K H 40K H M P K H 40K H M P K M P K H 40K H M P K H 40K H M P K M P K` | 7 | 7 | 7 | 160 | 8 | 66,55 |
| 3 | C | `M P K H 40K H M P K H 40K H M P K H 40K H M P K H 40K H M P K M P K M P K` | 7 | 7 | 7 | 160 | 8 | 66,55 |
| 4 | A | `M P K M P K` | 2 | 2 | 2 | 0 | 0 | 5,30 |
| 4 | B | `M P K` | 1 | 1 | 1 | 0 | 0 | 2,65 |
| 4 | C | `M P K M P K` | 2 | 2 | 2 | 0 | 0 | 5,30 |
| 5 | A | `M P K M P K` | 2 | 2 | 2 | 0 | 0 | 5,30 |
| 5 | B | `M P K M P K` | 2 | 2 | 2 | 0 | 0 | 5,30 |
| 5 | C | `M P K M P K` | 2 | 2 | 2 | 0 | 0 | 5,30 |

| Ambiente | Soma dos blocos estimados (s) | Blocos não estimados |
|---|---|---|
| A | 74,50 | 2 |
| B | 77,15 | nenhum |
| C | 79,80 | nenhum |

A soma não é comparável entre ambientes quando há bloco não estimado.
