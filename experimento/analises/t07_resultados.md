# T07: análises com dados existentes

Gerado por `experimento/analises/t07_dados_existentes.py`. Não editar à mão.

## 1. Sensibilidade do tempo às pausas do cronômetro

| Execução | Intervalo parado (min) |
|---|---|
| B1-B-01 | 6.29 |
| B2-A-01 | 35.58 |
| B2-B-01 | 1.32 |
| B4-A-01 | 4.88 |

| Cenário | A (min) | B (min) | Redução A para B |
|---|---|---|---|
| Cronômetro | 167.08 | 85.79 | 48.7% |
| Intervalos de A e B contados como trabalho | 207.53 | 93.40 | 55.0% |
| Só os intervalos do B contados (pior caso para o B) | 167.08 | 93.40 | 44.1% |

No C não há execução com mais de um clipe além do B1-C, então intervalos não são verificáveis (ver `linha_do_tempo.csv`).

## 2. Sensibilidade à cópia de componentes no A

A cópia do DS ocorreu dentro do cronômetro do A (Q1, gravações). Ela não é medível: só um monitor foi gravado. Para o tempo do A igualar o do B, a cópia teria de somar **81.29 min** (48.7% do tempo do A). Para a redução cair a 25%, **52.69 min**. Para cair a zero com os intervalos do B contados, 73.68 min.

## 3. Tempo normalizado

| Ambiente | Tempo (min) | Telas | Nós | min por tela | min por 100 nós |
|---|---|---|---|---|---|
| A | 167.08 | 13 | 3075 | 12.85 | 5.43 |
| B | 85.79 | 12 | 2854 | 7.15 | 3.01 |
| C | 59.40 | 11 | 3199 | 5.40 | 1.86 |

## 4. Volume de composição (hipótese, n = 5)

| Bloco | Nós A | Tempo A | Tempo B | Redução |
|---|---|---|---|---|
| 1 | 332 | 18.46 | 20.19 | -9.4% |
| 2 | 795 | 55.36 | 17.16 | 69.0% |
| 3 | 366 | 22.24 | 14.56 | 34.5% |
| 4 | 782 | 51.15 | 15.25 | 70.2% |
| 5 | 800 | 19.87 | 18.63 | 6.2% |

Spearman entre nós do A e redução: **0.30**; entre tempo do A e redução: 0.90. Com n = 5, só descritivo. O tempo do B fica entre 14.56 e 20.19 min: a redução varia porque o tempo do A varia.

## 5. Variação do agente (B1 x C1, mesma entrada, conversa nova)

B1-B 20.19 min, B1-C 16.23 min: diferença de **19.6%** do B1-B. Diferença A x B no Bloco 1: +9.4% (B mais lento); no Bloco 5: 6.2%. Nos dois blocos, a diferença entre fluxos é menor que a variação do agente.

## 6. Densidade, valores fora de token e contraste por tamanho de texto

Agregação das Tabelas 3 e 4 (C4.12): percentual sobre todos os elementos das telas do bloco somados (`consolidar.py`), não média das telas.

| Execução | Telas | Nós por tela (média) | Cores fora de token (máx. por tela) | Tamanhos de fonte fora de token (máx. por tela) | Reprovações de contraste | das quais texto pequeno (mín. 4,5:1) |
|---|---|---|---|---|---|---|
| B1-A-01 | 1 | 332 | 19 | 6 | 42 | 42 |
| B1-B-01 | 2 | 395 | 19 | 6 | 82 | 82 |
| B1-C-01 | 2 | 412 | 23 | 7 | 95 | 95 |
| B2-A-01 | 3 | 265 | 18 | 7 | 106 | 106 |
| B2-B-01 | 2 | 262 | 19 | 7 | 16 | 16 |
| B2-C-01 | 2 | 221 | 17 | 7 | 12 | 12 |
| B3-A-01 | 2 | 183 | 17 | 8 | 21 | 21 |
| B3-B-01 | 2 | 274 | 17 | 6 | 31 | 31 |
| B3-C-01 | 2 | 226 | 15 | 7 | 24 | 24 |
| B4-A-01 | 4 | 196 | 17 | 8 | 76 | 76 |
| B4-B-01 | 3 | 149 | 14 | 6 | 20 | 20 |
| B4-C-01 | 3 | 262 | 14 | 7 | 24 | 24 |
| B5-A-01 | 3 | 267 | 17 | 7 | 95 | 95 |
| B5-B-01 | 3 | 182 | 18 | 7 | 54 | 54 |
| B5-C-01 | 2 | 348 | 22 | 7 | 60 | 60 |

Obs.: o número de telas aqui é o de quadros analisados pelo verificador, que pode diferir da contagem de telas do registro quando um quadro de apoio foi analisado ou excluído.

## 7. Independência das sessões do B (C4.17)

- `B3-B-01.md`, linha 45: "O arquivo já tem as páginas “B1-B-01” e “B2-B-01”. Não abri nenhuma das duas, para manter o bloco isolado. Se quiser consistência visual com elas, me avise."
- `B3-B-01.md`, linha 167: "A página “DS” não foi alterada e as páginas “B1-B-01” e “B2-B-01” não foram abertas. Ficou sem decisão sua apenas a entrelinha de 100% no texto preenchido das Textareas, que mantive no padrão do DS."
- `B5-B-01.md`, linha 168: "A página DS não foi alterada. Notei que o arquivo agora tem também as páginas B1-B-01 a B4-B-01, que não toquei."

Nas transcrições (texto visível das conversas), o agente declara ter visto os nomes das páginas dos blocos anteriores e não tê-las aberto. As chamadas de ferramenta não constam das transcrições; a confirmação depende da exportação de dados da conta Claude (T24). Os nomes da paciente nos Blocos 2 a 5 se parecem com o nome dado à médica no Bloco 1 (Helena). Como cada sessão declara não ter aberto as outras páginas, a explicação compatível com as transcrições é a preferência do modelo para entradas semelhantes, e não a leitura de outras páginas; sem as chamadas de ferramenta, isso não fica provado.
