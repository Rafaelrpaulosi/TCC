# Protocolo do KLM (T19)

Fixado em 06/11/2026, antes de modelar qualquer tela (Claude Code, Opus 5.5). Não alterar depois de começar a modelagem; mudança vira desvio declarado. O Rafael confere as sequências de operadores.

## Fonte e valores

Card, Moran e Newell (1980), conferido no PDF de `docs/referencias_pdf/`:
- operadores e tempos: Figura 1, p. 399;
- regras para posicionar o operador M: Figura 2, p. 400.

| Operador | Significado | Tempo usado (s) | Observação |
|---|---|---|---|
| K | Tecla ou clique | 0,28 para teclas; 0,20 para o clique do mouse | 0,28 é o digitador médio não profissional (40 palavras por minuto, Figura 1). O artigo diz que P não inclui o clique que costuma seguir, de cerca de 0,2 s |
| P | Apontar com o mouse para um alvo na tela | 1,10 | Valor médio da Figura 1 |
| H | Levar a mão do mouse ao teclado, ou o contrário | 0,40 | |
| M | Preparação mental | 1,35 | Posicionado pela Regra 0 e retirado pelas Regras 1 a 4 da Figura 2 |
| R | Espera pela resposta do sistema | 0 | Os protótipos são estáticos; o tempo de resposta não é modelado |

## Tarefas (iguais para A, B e C)

Uma tarefa por bloco, modelada sobre as telas finais de cada ambiente, as mesmas da avaliação heurística e do Apêndice D, e sobre as demais telas do bloco quando a tarefa passa por elas.

1. **Bloco 1:** na lista de pacientes do dia, iniciar o atendimento do próximo paciente.
2. **Bloco 2:** a partir da tela de dados do paciente, chegar à queixa registrada na recepção e ao histórico recente, até ambos estarem visíveis. A leitura não é modelada; contam-se só os passos para torná-los visíveis.
3. **Bloco 3:** preencher queixa, exame físico, conduta e prescrição e salvar. O texto digitado é o mesmo nos três ambientes: 40 caracteres por campo, digitados de uma vez. Campos além desses quatro não são preenchidos, salvo se a tela os indicar como obrigatórios.
4. **Bloco 4:** com o registro concluído, solicitar o relatório e abri-lo.
5. **Bloco 5:** finalizar o atendimento, confirmar se houver confirmação, e voltar à lista com o status atualizado.

## Regras de modelagem

1. A mão começa no mouse em todas as tarefas.
2. Só contam ações cujo alvo está visível na tela ou foi tornado visível por ação anterior modelada. Ação de que não aparece o gatilho é registrada como "caminho não visível na tela". Nesse caso não se estima tempo para a tarefa.
3. Rolagem: o quadro visível tem 1440 por 900 pixels a partir do topo do quadro. Alvo abaixo disso custa uma rolagem, modelada como P (até a área) mais K para cada 900 pixels de deslocamento.
4. Campo de texto: P até o campo, K (clique), H para o teclado, digitação (40 K), H de volta ao mouse. O M segue a Regra 0, com as Regras 1 a 4.
5. Abas, menus e modais: cada abertura é P mais K. A escolha de item dentro de menu é outro P mais K.
6. Havendo dois caminhos visíveis para a mesma tarefa, modela-se o mais curto.
7. Cada sequência é registrada como texto (por exemplo, `M P K H 40K H`), com o tempo previsto e o elemento de cada P.

## Saída

`docs/klm/klm_resultados.md`, com uma tabela por tarefa: ambiente, sequência, número de operadores por tipo e tempo previsto em segundos. Esse arquivo é gerado por script a partir de `docs/klm/sequencias.csv`, que guarda as sequências.

## Limitações a declarar

- O KLM prevê o tempo de um usuário experiente, sem erros; não mede aprendizado nem satisfação.
- Os protótipos são estáticos, e a interação é inferida dos elementos visíveis.
- A modelagem é feita pelo agente e conferida pelo autor, que conhece as telas do Ambiente A.
- O texto padronizado de 40 caracteres por campo torna o tempo de digitação igual nos três ambientes. A diferença entre eles vem do número de alvos, campos, abas e rolagens.

## Andamento

- 06/11/2026: Blocos 1 e 2 modelados com as telas de `experimento/figuras/frames/` (`sequencias.csv`). Bloco 1: `M P K` (2,65 s) nos três ambientes. Bloco 2: B e C sem operadores; A pendente. Os Blocos 2 a 5 precisam de todas as telas de cada bloco, não só da final. Exportar as telas pela API quando houver token (T08) e retomar.
- 07/11/2026 (Claude Code, Opus 5.5): Blocos 2 a 5 modelados com as telas exportadas pela API (`experimento/exportacoes/`); posições em `docs/klm/posicoes.md` (gerado por `posicoes.py`); resultado em `klm_resultados.md`. Bloco 2 do A: caminho não visível na tela (a queixa da recepção não aparece em nenhuma tela do bloco), sem tempo, pela regra 2.

## Interpretações aplicadas na modelagem de 07/11 (as regras acima não mudaram)

Pontos que o protocolo não decidia. O Rafael confere cada um; se discordar, a mudança entra como desvio declarado.

1. **Alvo na borda da área visível (regra 3):** o alvo é visível quando o centro dele está acima de 900 pixels.
2. **Rolagem:** modelada como `M P K`; o M segue a Regra 0, como em qualquer ação que começa uma operação nova.
3. **M antes do P do campo de texto:** apontar para o próximo campo começa uma operação nova; o M é posto antes do P e retirado antes do K pela Regra 1.
4. **Prescrição estruturada (B e C):** os 40 caracteres vão para o campo Medicamento, seguidos de "Adicionar medicamento"; Dose, Via, Posologia e Duração não são obrigatórios na tela e não são preenchidos.
5. **Exame físico:** no B e no C, o campo "Achados do exame"; sinais vitais não são preenchidos (não obrigatórios).
6. **Salvar no Bloco 3:** no A, o único botão é "Finalizar atendimento"; no B, "Salvar rascunho"; no C, "Salvar registro".
7. **Queixa pré-preenchida no C:** digitada igual aos outros ambientes (40 caracteres), conforme o protocolo. O pré-preenchimento fica como observação.
8. **Início do Bloco 4 no A:** a tela [2] do B4-A (registro salvo no histórico), e não a [1], que é a reabertura do bloco.
9. **Início do Bloco 5 no C:** o relatório do B4-C (tela [3]), porque o gatilho "Finalizar atendimento" não está nas telas do B5-C; o C é uma conversa contínua.
