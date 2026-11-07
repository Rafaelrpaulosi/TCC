# Prompts do Ambiente B (Claude + MCP do Figma)

Regras de uso:

1. **Sessão nova a cada execução** (conversa limpa, sem AGENTS.md, sem histórico do TCC). O agente não pode saber a hipótese do trabalho nem ter visto as execuções anteriores. Sem isso, as 3 repetições não são independentes.
2. Colar o PROMPT-BASE abaixo, trocando só o trecho `[BLOCO]` pelo texto do bloco (copiado de `docs/blocos-execucao.md`, campos Estado inicial e Tarefa). Mais nada.
3. Antes de enviar: anotar modelo e versão exatos (o seletor de modelo do app mostra), versão do servidor MCP do Figma e hora de início. Gravar a tela.
4. O agente trabalha em uma etapa por vez, e o Rafael valida cada etapa antes de seguir (validação humana). Cada rodada de pedido ao agente conta como 1 iteração. Alterações manuais feitas no Figma depois da geração contam como ajustes manuais.

**Regra de contagem de iterações, igual nos dois ambientes (definida em 08/10, após o B1-A-01):** iterações = 1 (construção inicial) + número de rodadas de revisão que geraram mudança. No A, cada vez que o Rafael para, avalia e altera conta 1. No B, o prompt inicial conta 1 e cada pedido de correção ao agente conta mais 1.

**Bloco concluído não é reaberto (definida em 09/10, após o B4-A-01):** depois que uma execução é dada como concluída, ela não volta a ser editada, em nenhum dos ambientes. Mudança percebida depois vira observação na planilha. No B, isso já acontece naturalmente, porque cada execução é uma sessão própria.

**Tempo:** cronômetro zerado antes de cada execução, sem pausa; print do cronômetro no fim, salvo em `gravacoes/{id_execucao}_cronometro.png`. A gravação de tela é evidência complementar.
5. Ao terminar: exportar a conversa inteira sem editar para `transcricoes/{id_execucao}.md`.
6. **Arquivo separado do A (definido em 09/10):** o B trabalha no arquivo `TCC experimento assistido a IA e MCP` (fileKey [chave do arquivo do Ambiente B]), com a biblioteca do DS eMed habilitada, e não no `EXPERIMENTO-TCC`. Motivo: o arquivo do A contém as telas do Ambiente A, e o agente, com acesso de leitura ao arquivo, poderia consultá-las. Cada repetição também não pode ver as anteriores: usar páginas novas e, se possível, ocultar ou mover as páginas de execuções anteriores antes de cada repetição.
7. Saída de cada execução: uma página no Figma chamada `{id_execucao}` (ex.: `B1-B-01`).

## PROMPTS PRONTOS (um por bloco)

Trocar `[chave do arquivo do Ambiente B]` pelo fileKey do EXPERIMENTO-TCC-B uma vez. Para cada execução, trocar só o id da página (`B1-B-01`, `B1-B-02`, `B1-B-03`). Mais nada muda entre repetições.

### B1

```
Você é um designer de interfaces apoiando o projeto de um sistema de gestão clínica (Emed4all).

CASO DE USO: "Atendimento clínico do início ao fim". Ator: médico. O médico chega para o expediente, localiza o próximo paciente agendado, realiza a consulta, registra as informações e encerra o atendimento. Pré-condições: o paciente já está agendado e o médico já está autenticado (login e criação de agendamento não fazem parte do trabalho).

FLUXO COMPLETO DO CASO DE USO (para contexto; você fará apenas a tarefa indicada no fim):
1. O médico visualiza a lista de pacientes agendados para o dia (nome, horário, status).
2. O médico seleciona o próximo paciente e inicia o atendimento.
3. O sistema exibe os dados do paciente (histórico e queixa registrada na recepção, se houver).
4. O médico preenche as informações da consulta (queixa, exame físico, conduta, prescrição).
5. O médico solicita a geração de um relatório da consulta.
6. O sistema exibe o relatório gerado.
7. O médico finaliza o atendimento; o sistema retorna à lista de pacientes com o status atualizado.

SISTEMA DE DESIGN: use o Design System eMed, cujos componentes e estilos estão na página "DS" do próprio arquivo de trabalho (copiados do arquivo original do DS, sem alteração), incluindo os componentes-base do DS para novas telas. Use seus componentes, tokens de cor, tipografia e padrões de auto layout. A página "DS" contém apenas componentes e estilos; não altere essa página. Não use telas prontas do sistema como insumo desta tarefa.

REAPROVEITAMENTO: o Design System eMed já contém componentes prontos e convencionados, como o header com menus, cores, tipografia e estilos próprios, além de componentes compostos usados como base para novas telas e documentos. Antes de criar, identifique na biblioteca do DS os componentes que se aplicam à tarefa, use-os como instâncias da biblioteca e crie apenas o que não existir. Ao fim, informe quais componentes do DS reaproveitou e o que criou do zero.

ARQUIVO DE TRABALHO: crie as telas no arquivo Figma "TCC experimento assistido a IA e MCP", de fileKey [chave do arquivo do Ambiente B]. Trabalhe apenas nesse arquivo. Crie nele uma página nova chamada "B1-B-01" e produza ali os frames da tarefa.

ESCOPO: sem prototipagem interativa (links entre telas), sem fluxos de erro e exceção, a menos que surjam naturalmente. Use apenas dados fictícios (sem nomes, CPFs ou exames reais). Você decide quantas telas são necessárias.

MODO DE TRABALHO: trabalhe em etapas e aguarde minha validação antes de seguir para a próxima.

SUA TAREFA (Bloco 1, lista de pacientes e início do atendimento):
Estado inicial: nenhuma tela produzida ainda. O médico está autenticado e chega para o expediente.
Tarefa: projetar a tela de lista de pacientes agendados para o dia, com nome, horário e status de cada paciente, e a ação pela qual o médico seleciona o próximo paciente e inicia o atendimento.
Critério de aceite: lista clara de pacientes, com horário e status visíveis sem exigir rolagem excessiva.
```

### B2

```
Você é um designer de interfaces apoiando o projeto de um sistema de gestão clínica (Emed4all).

CASO DE USO: "Atendimento clínico do início ao fim". Ator: médico. O médico chega para o expediente, localiza o próximo paciente agendado, realiza a consulta, registra as informações e encerra o atendimento. Pré-condições: o paciente já está agendado e o médico já está autenticado (login e criação de agendamento não fazem parte do trabalho).

FLUXO COMPLETO DO CASO DE USO (para contexto; você fará apenas a tarefa indicada no fim):
1. O médico visualiza a lista de pacientes agendados para o dia (nome, horário, status).
2. O médico seleciona o próximo paciente e inicia o atendimento.
3. O sistema exibe os dados do paciente (histórico e queixa registrada na recepção, se houver).
4. O médico preenche as informações da consulta (queixa, exame físico, conduta, prescrição).
5. O médico solicita a geração de um relatório da consulta.
6. O sistema exibe o relatório gerado.
7. O médico finaliza o atendimento; o sistema retorna à lista de pacientes com o status atualizado.

SISTEMA DE DESIGN: use o Design System eMed, cujos componentes e estilos estão na página "DS" do próprio arquivo de trabalho (copiados do arquivo original do DS, sem alteração), incluindo os componentes-base do DS para novas telas. Use seus componentes, tokens de cor, tipografia e padrões de auto layout. A página "DS" contém apenas componentes e estilos; não altere essa página. Não use telas prontas do sistema como insumo desta tarefa.

REAPROVEITAMENTO: o Design System eMed já contém componentes prontos e convencionados, como o header com menus, cores, tipografia e estilos próprios, além de componentes compostos usados como base para novas telas e documentos. Antes de criar, identifique na biblioteca do DS os componentes que se aplicam à tarefa, use-os como instâncias da biblioteca e crie apenas o que não existir. Ao fim, informe quais componentes do DS reaproveitou e o que criou do zero.

ARQUIVO DE TRABALHO: crie as telas no arquivo Figma "TCC experimento assistido a IA e MCP", de fileKey [chave do arquivo do Ambiente B]. Trabalhe apenas nesse arquivo. Crie nele uma página nova chamada "B2-B-01" e produza ali os frames da tarefa.

ESCOPO: sem prototipagem interativa (links entre telas), sem fluxos de erro e exceção, a menos que surjam naturalmente. Use apenas dados fictícios (sem nomes, CPFs ou exames reais). Você decide quantas telas são necessárias.

MODO DE TRABALHO: trabalhe em etapas e aguarde minha validação antes de seguir para a próxima.

SUA TAREFA (Bloco 2, dados do paciente):
Estado inicial: o médico acabou de selecionar um paciente e iniciar o atendimento. O sistema precisa exibir os dados desse paciente antes da consulta em si.
Tarefa: projetar a tela que exibe os dados do paciente no início do atendimento: histórico e queixa registrada na recepção, se houver.
Critério de aceite: dados do paciente organizados por hierarquia de relevância clínica, com queixa e histórico recente em destaque.
```

### B3

```
Você é um designer de interfaces apoiando o projeto de um sistema de gestão clínica (Emed4all).

CASO DE USO: "Atendimento clínico do início ao fim". Ator: médico. O médico chega para o expediente, localiza o próximo paciente agendado, realiza a consulta, registra as informações e encerra o atendimento. Pré-condições: o paciente já está agendado e o médico já está autenticado (login e criação de agendamento não fazem parte do trabalho).

FLUXO COMPLETO DO CASO DE USO (para contexto; você fará apenas a tarefa indicada no fim):
1. O médico visualiza a lista de pacientes agendados para o dia (nome, horário, status).
2. O médico seleciona o próximo paciente e inicia o atendimento.
3. O sistema exibe os dados do paciente (histórico e queixa registrada na recepção, se houver).
4. O médico preenche as informações da consulta (queixa, exame físico, conduta, prescrição).
5. O médico solicita a geração de um relatório da consulta.
6. O sistema exibe o relatório gerado.
7. O médico finaliza o atendimento; o sistema retorna à lista de pacientes com o status atualizado.

SISTEMA DE DESIGN: use o Design System eMed, cujos componentes e estilos estão na página "DS" do próprio arquivo de trabalho (copiados do arquivo original do DS, sem alteração), incluindo os componentes-base do DS para novas telas. Use seus componentes, tokens de cor, tipografia e padrões de auto layout. A página "DS" contém apenas componentes e estilos; não altere essa página. Não use telas prontas do sistema como insumo desta tarefa.

REAPROVEITAMENTO: o Design System eMed já contém componentes prontos e convencionados, como o header com menus, cores, tipografia e estilos próprios, além de componentes compostos usados como base para novas telas e documentos. Antes de criar, identifique na biblioteca do DS os componentes que se aplicam à tarefa, use-os como instâncias da biblioteca e crie apenas o que não existir. Ao fim, informe quais componentes do DS reaproveitou e o que criou do zero.

ARQUIVO DE TRABALHO: crie as telas no arquivo Figma "TCC experimento assistido a IA e MCP", de fileKey [chave do arquivo do Ambiente B]. Trabalhe apenas nesse arquivo. Crie nele uma página nova chamada "B3-B-01" e produza ali os frames da tarefa.

ESCOPO: sem prototipagem interativa (links entre telas), sem fluxos de erro e exceção, a menos que surjam naturalmente. Use apenas dados fictícios (sem nomes, CPFs ou exames reais). Você decide quantas telas são necessárias.

MODO DE TRABALHO: trabalhe em etapas e aguarde minha validação antes de seguir para a próxima.

SUA TAREFA (Bloco 3, registro da consulta):
Estado inicial: o médico já visualizou os dados do paciente e agora precisa registrar a consulta em andamento.
Tarefa: projetar o formulário de registro da consulta, com campos para queixa, exame físico, conduta e prescrição.
Critério de aceite: campos identificáveis sem ambiguidade, com queixa, exame, conduta e prescrição claramente separados.
```

### B4

```
Você é um designer de interfaces apoiando o projeto de um sistema de gestão clínica (Emed4all).

CASO DE USO: "Atendimento clínico do início ao fim". Ator: médico. O médico chega para o expediente, localiza o próximo paciente agendado, realiza a consulta, registra as informações e encerra o atendimento. Pré-condições: o paciente já está agendado e o médico já está autenticado (login e criação de agendamento não fazem parte do trabalho).

FLUXO COMPLETO DO CASO DE USO (para contexto; você fará apenas a tarefa indicada no fim):
1. O médico visualiza a lista de pacientes agendados para o dia (nome, horário, status).
2. O médico seleciona o próximo paciente e inicia o atendimento.
3. O sistema exibe os dados do paciente (histórico e queixa registrada na recepção, se houver).
4. O médico preenche as informações da consulta (queixa, exame físico, conduta, prescrição).
5. O médico solicita a geração de um relatório da consulta.
6. O sistema exibe o relatório gerado.
7. O médico finaliza o atendimento; o sistema retorna à lista de pacientes com o status atualizado.

SISTEMA DE DESIGN: use o Design System eMed, cujos componentes e estilos estão na página "DS" do próprio arquivo de trabalho (copiados do arquivo original do DS, sem alteração), incluindo os componentes-base do DS para novas telas. Use seus componentes, tokens de cor, tipografia e padrões de auto layout. A página "DS" contém apenas componentes e estilos; não altere essa página. Não use telas prontas do sistema como insumo desta tarefa.

REAPROVEITAMENTO: o Design System eMed já contém componentes prontos e convencionados, como o header com menus, cores, tipografia e estilos próprios, além de componentes compostos usados como base para novas telas e documentos. Antes de criar, identifique na biblioteca do DS os componentes que se aplicam à tarefa, use-os como instâncias da biblioteca e crie apenas o que não existir. Ao fim, informe quais componentes do DS reaproveitou e o que criou do zero.

ARQUIVO DE TRABALHO: crie as telas no arquivo Figma "TCC experimento assistido a IA e MCP", de fileKey [chave do arquivo do Ambiente B]. Trabalhe apenas nesse arquivo. Crie nele uma página nova chamada "B4-B-01" e produza ali os frames da tarefa.

ESCOPO: sem prototipagem interativa (links entre telas), sem fluxos de erro e exceção, a menos que surjam naturalmente. Use apenas dados fictícios (sem nomes, CPFs ou exames reais). Você decide quantas telas são necessárias.

MODO DE TRABALHO: trabalhe em etapas e aguarde minha validação antes de seguir para a próxima.

SUA TAREFA (Bloco 4, relatório da consulta):
Estado inicial: o médico concluiu o registro da consulta e solicita a geração de um relatório.
Tarefa: projetar a ação de solicitação do relatório e a tela que exibe o relatório gerado.
Critério de aceite: ação de gerar relatório visível, resultado apresentado de forma legível.
```

### B5

```
Você é um designer de interfaces apoiando o projeto de um sistema de gestão clínica (Emed4all).

CASO DE USO: "Atendimento clínico do início ao fim". Ator: médico. O médico chega para o expediente, localiza o próximo paciente agendado, realiza a consulta, registra as informações e encerra o atendimento. Pré-condições: o paciente já está agendado e o médico já está autenticado (login e criação de agendamento não fazem parte do trabalho).

FLUXO COMPLETO DO CASO DE USO (para contexto; você fará apenas a tarefa indicada no fim):
1. O médico visualiza a lista de pacientes agendados para o dia (nome, horário, status).
2. O médico seleciona o próximo paciente e inicia o atendimento.
3. O sistema exibe os dados do paciente (histórico e queixa registrada na recepção, se houver).
4. O médico preenche as informações da consulta (queixa, exame físico, conduta, prescrição).
5. O médico solicita a geração de um relatório da consulta.
6. O sistema exibe o relatório gerado.
7. O médico finaliza o atendimento; o sistema retorna à lista de pacientes com o status atualizado.

SISTEMA DE DESIGN: use o Design System eMed, cujos componentes e estilos estão na página "DS" do próprio arquivo de trabalho (copiados do arquivo original do DS, sem alteração), incluindo os componentes-base do DS para novas telas. Use seus componentes, tokens de cor, tipografia e padrões de auto layout. A página "DS" contém apenas componentes e estilos; não altere essa página. Não use telas prontas do sistema como insumo desta tarefa.

REAPROVEITAMENTO: o Design System eMed já contém componentes prontos e convencionados, como o header com menus, cores, tipografia e estilos próprios, além de componentes compostos usados como base para novas telas e documentos. Antes de criar, identifique na biblioteca do DS os componentes que se aplicam à tarefa, use-os como instâncias da biblioteca e crie apenas o que não existir. Ao fim, informe quais componentes do DS reaproveitou e o que criou do zero.

ARQUIVO DE TRABALHO: crie as telas no arquivo Figma "TCC experimento assistido a IA e MCP", de fileKey [chave do arquivo do Ambiente B]. Trabalhe apenas nesse arquivo. Crie nele uma página nova chamada "B5-B-01" e produza ali os frames da tarefa.

ESCOPO: sem prototipagem interativa (links entre telas), sem fluxos de erro e exceção, a menos que surjam naturalmente. Use apenas dados fictícios (sem nomes, CPFs ou exames reais). Você decide quantas telas são necessárias.

MODO DE TRABALHO: trabalhe em etapas e aguarde minha validação antes de seguir para a próxima.

SUA TAREFA (Bloco 5, encerramento do atendimento):
Estado inicial: o médico visualizou o relatório da consulta e está pronto para encerrar o atendimento.
Tarefa: projetar a ação de finalização do atendimento e o retorno à lista de pacientes com o status atualizado.
Critério de aceite: confirmação clara de que o atendimento foi finalizado.
```

## Respostas padrão durante a validação

Para manter as execuções comparáveis, use sempre as mesmas frases:

- Etapa aprovada: `Aprovado, siga para a próxima etapa.` (não conta como iteração)
- Pedido de correção: `Corrija: <o que está errado>.` (conta +1 iteração; descrever o problema, não a solução de design)
- Fim: `Tarefa concluída.`

Não dar dica de layout que você não daria a si mesmo no Ambiente A. Se precisar corrigir algo, aponte o que não atende ao roteiro ou ao critério de aceite.

## Regras de condução do B (definidas em 09/10, antes do B1-B-01)

- **Cronômetro não pausa**, nem durante as correções. O tempo de revisão está dentro do tempo total, como no A.
- **Parâmetro de aceitação:** o critério de aceite do bloco e o uso do DS, não a semelhança com as telas antigas do Emed nem com as telas do A. Solução diferente que atende ao critério é aceita. Corrigir apenas o que não atende ao roteiro, ao critério ou ao DS.
- **Limite de parada:** se após 5 pedidos de correção o critério ainda não for atendido, encerrar e registrar o critério como "parcial" ou "não".

## Nota de método

Acesso ao DS no B (09/10): o teste de conexão mostrou que o agente não enxergava o DS a partir do arquivo original. Os componentes e estilos do DS foram copiados, sem alteração e fora do cronômetro, para a página "DS" do arquivo do B. No A, o autor copiou do arquivo do DS sob demanda, durante a execução cronometrada. Diferença declarada: o tempo de copiar entra no cronômetro do A e não no do B.

DS usado nos dois ambientes (confirmado pelo autor em 09/10): arquivo `[chave do arquivo do sistema de design]`, página "⛔ | Componentes - Reorganizando design" (492 componentes, todos não publicados como biblioteca). O nome da página existe desde a criação; o DS não foi alterado entre o A e o B. O outro arquivo citado pelo agente no teste (`[chave de outro arquivo do Figma]`) não foi usado.


O parágrafo REAPROVEITAMENTO foi incluído em 09/10, antes de qualquer execução do B, a pedido do autor: no Ambiente A o autor montou as telas a partir dos componentes do DS (header, menus, componentes-base), prática comum no dia a dia. O parágrafo dá ao agente a mesma instrução de método, sem revelar soluções do A. O agente busca na biblioteca do DS, nunca nas telas antigas (node 44332:2) nem no arquivo do A.


O prompt inclui o fluxo completo do caso de uso (A.4) e o critério de aceite do bloco, porque o Ambiente A tinha acesso ao roteiro completo e aos critérios durante a execução. Assim as duas condições recebem a mesma informação.
