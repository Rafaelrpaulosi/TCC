# Busca bibliográfica registrada (T05)

Executada em 2026-11-06 por `experimento/analises/t05_busca.py`. Não editar à mão.

Bases: Crossref (metadados de publicações com DOI de todas as grandes editoras) e arXiv. Ordenação por relevância; conferidos os 50 primeiros resultados de cada busca. Na Crossref a contagem inclui registros que casam com qualquer termo, por isso é grande e serve só de ordem de grandeza; no arXiv a contagem é a da expressão booleana. OpenAlex e Semantic Scholar recusaram consulta (HTTP 429) na data. ACM Digital Library, PubMed e o Portal de Periódicos CAPES foram usados para obter os textos completos, não para a contagem, porque bloqueiam consulta automática.

| Eixo | Termos (Crossref) | Resultados | Termos (arXiv) | Resultados | Fontes usadas entre os 50 primeiros |
|---|---|---|---|---|---|
| Usabilidade e segurança em sistemas de saúde | `"electronic health record" usability patient safety` | 6505128 | `abs:"electronic health record" AND abs:usability` | 29 | Howe et al. (2018) |
| Avaliação heurística | `"heuristic evaluation" usability evaluator` | 2028952 | `abs:"heuristic evaluation"` | 85 | Duan et al. (2024) |
| IA generativa no design de interfaces | `"large language model" "user interface" design generation` | 8296796 | `abs:"large language model" AND abs:"user interface" AND abs:design` | 176 | Duan et al. (2024) |
| Produtividade com IA generativa | `"generative AI" productivity experiment workers` | 1202432 | `abs:"generative AI" AND abs:productivity` | 547 | nenhuma |
| MCP e agentes com ferramentas | `"Model Context Protocol"` | 3755277 | `abs:"Model Context Protocol"` | 639 | nenhuma |
| Viés de automação | `"automation bias" decision support` | 1909769 | `abs:"automation bias"` | 71 | nenhuma |
| Acessibilidade e verificação automática | `accessibility evaluation tools WCAG automated` | 2549747 | `abs:accessibility AND abs:WCAG AND abs:automated` | 11 | Vigo, Brown e Conway (2013) |

## Origem das fontes usadas

A busca acima é complementar e foi feita depois da seleção. As fontes vieram principalmente do arquivo de referencial entregue pela banca em 30/10/2026 (`docs/defesa/retorno_banca/`) e das referências citadas por essas fontes. Fontes usadas que não aparecem entre os 50 primeiros resultados de nenhuma busca:

- Lu et al. (2022)
- Koppel et al. (2005)
- Zahabi, Kaber e Swangnetr (2015)
- Nielsen e Molich (1990)
- Nielsen e Landauer (1993)
- Hertzum e Jacobsen (2001)
- Noy e Zhang (2023)
- Brynjolfsson, Li e Raymond (2025)
- Dell'Acqua et al. (2026)
- Parasuraman e Manzey (2010)
- Amershi et al. (2019)
- Vigo e Brajnik (2011)

Não casadas automaticamente (título conferido à mão): Cha et al. (2026), Li et al. (2024), Lamine e Cheng (2022).


**Nota de 06/11/2026 (noite, Rafael):** Vigo e Brajnik (2011) saiu da lista de fontes usadas. Não é citado nos capítulos nem está nas referências. O script foi ajustado; esta tabela não foi gerada de novo, para não mudar as contagens da data da busca.
