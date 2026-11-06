# TCC: IA integrada ao Figma via MCP no design de interfaces de um sistema de saúde

Trabalho de Conclusão de Curso de **Rafael Paulosi**, Engenharia de Computação, Universidade Estadual de Ponta Grossa (UEPG), Departamento de Informática, 2026.

Orientadora: Prof.ª Sabine Cassol. Coorientadora: Prof.ª Diolete Marcante Lati Cerutti.

## Sobre o estudo

O trabalho avalia o uso de um agente de Inteligência Artificial conectado ao Figma pelo Model Context Protocol (MCP) no design de interfaces de um sistema de gestão clínica (Emed4all).

O mesmo caso de uso, o atendimento clínico do início ao fim do ponto de vista do médico, dividido em cinco blocos, foi resolvido em três condições, com o mesmo roteiro e o mesmo sistema de design:

- **Ambiente A:** designer no Figma, sem IA.
- **Ambiente B:** agente Claude conectado ao Figma via MCP, uma conversa nova por bloco, com validação humana a cada etapa.
- **Ambiente C:** o mesmo agente, com os cinco blocos numa única conversa.

Foram medidos tempo, número de telas, iterações, conformidade automática (contraste de texto e alvo de toque segundo a WCAG 2.2, aderência ao sistema de design) e consistência dos dados entre telas.

## Conteúdo do repositório

Em preparação. Serão publicados aqui:

- o verificador de conformidade (Node.js), que lê os arquivos pela API REST do Figma;
- as planilhas de registro das execuções e os dados consolidados;
- as transcrições das conversas com o agente, sem as chaves dos arquivos do Figma.

Não são publicados: gravações de tela, telas do sistema e o sistema de design, que pertencem a terceiros. Todos os dados de pacientes nas telas são fictícios.

## Situação

Versão corrigida em elaboração após a defesa de 30/10/2026.
