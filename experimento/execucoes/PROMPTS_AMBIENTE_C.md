# Prompts do Ambiente C (B com contexto contínuo)

Condição complementar definida em 09/10/2026, depois da coleta do Ambiente B, para testar o efeito da memória da conversa sobre a consistência entre blocos. Mesmo modelo, mesmo app, mesmas regras de validação do B. Diferenças: (1) os cinco blocos são feitos na MESMA conversa, em sequência; (2) arquivo Figma novo, só com a página DS (sem as telas do B, para não haver consulta). A mensagem de cada bloco não pede consistência com os anteriores: a única mudança em relação ao B é o contexto disponível.

Cronômetro: zerado no envio de cada mensagem de bloco e parado quando o bloco termina. Um registro por bloco (B1-C-01 a B5-C-01).

## Mensagem 1 (Bloco 1)

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

ARQUIVO DE TRABALHO: crie as telas no arquivo Figma "EXPERIMENTO TCC com memoria de contexto e mcp", de fileKey [chave do arquivo do Ambiente C]. Trabalhe apenas nesse arquivo. Crie nele uma página nova chamada "B1-C-01" e produza ali os frames da tarefa.

ESCOPO: sem prototipagem interativa (links entre telas), sem fluxos de erro e exceção, a menos que surjam naturalmente. Use apenas dados fictícios (sem nomes, CPFs ou exames reais). Você decide quantas telas são necessárias.

MODO DE TRABALHO: trabalhe em etapas e aguarde minha validação antes de seguir para a próxima.

SUA TAREFA (Bloco 1, lista de pacientes e início do atendimento):
Estado inicial: nenhuma tela produzida ainda. O médico está autenticado e chega para o expediente.
Tarefa: projetar a tela de lista de pacientes agendados para o dia, com nome, horário e status de cada paciente, e a ação pela qual o médico seleciona o próximo paciente e inicia o atendimento.
Critério de aceite: lista clara de pacientes, com horário e status visíveis sem exigir rolagem excessiva.
```

## Mensagem do B2

```
Próxima tarefa. Crie no mesmo arquivo uma página nova chamada "B2-C-01" e produza ali os frames desta tarefa. As demais orientações continuam valendo.

SUA TAREFA (Bloco 2, dados do paciente):
Estado inicial: o médico acabou de selecionar um paciente e iniciar o atendimento. O sistema precisa exibir os dados desse paciente antes da consulta em si.
Tarefa: projetar a tela que exibe os dados do paciente no início do atendimento: histórico e queixa registrada na recepção, se houver.
Critério de aceite: dados do paciente organizados por hierarquia de relevância clínica, com queixa e histórico recente em destaque.
```

## Mensagem do B3

```
Próxima tarefa. Crie no mesmo arquivo uma página nova chamada "B3-C-01" e produza ali os frames desta tarefa. As demais orientações continuam valendo.

SUA TAREFA (Bloco 3, registro da consulta):
Estado inicial: o médico já visualizou os dados do paciente e agora precisa registrar a consulta em andamento.
Tarefa: projetar o formulário de registro da consulta, com campos para queixa, exame físico, conduta e prescrição.
Critério de aceite: campos identificáveis sem ambiguidade, com queixa, exame, conduta e prescrição claramente separados.
```

## Mensagem do B4

```
Próxima tarefa. Crie no mesmo arquivo uma página nova chamada "B4-C-01" e produza ali os frames desta tarefa. As demais orientações continuam valendo.

SUA TAREFA (Bloco 4, relatório da consulta):
Estado inicial: o médico concluiu o registro da consulta e solicita a geração de um relatório.
Tarefa: projetar a ação de solicitação do relatório e a tela que exibe o relatório gerado.
Critério de aceite: ação de gerar relatório visível, resultado apresentado de forma legível.
```

## Mensagem do B5

```
Próxima tarefa. Crie no mesmo arquivo uma página nova chamada "B5-C-01" e produza ali os frames desta tarefa. As demais orientações continuam valendo.

SUA TAREFA (Bloco 5, encerramento do atendimento):
Estado inicial: o médico visualizou o relatório da consulta e está pronto para encerrar o atendimento.
Tarefa: projetar a ação de finalização do atendimento e o retorno à lista de pacientes com o status atualizado.
Critério de aceite: confirmação clara de que o atendimento foi finalizado.
```
