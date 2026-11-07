# Avaliação do uso de IA integrada ao Figma via MCP no design de interfaces de um sistema de saúde

Material de apoio do Trabalho de Conclusão de Curso de **Rafael Paulosi**, Bacharelado em Engenharia de Computação, Universidade Estadual de Ponta Grossa (UEPG), Departamento de Informática, 2026. Orientadora: Prof.ª Sabine Cassol. Coorientadora: Prof.ª Dra. Diolete Marcante Lati Cerutti.

Título do trabalho: *Avaliação do uso de Inteligência Artificial integrada ao Figma via Model Context Protocol (MCP) no apoio ao design de interfaces de um sistema de saúde*.

O estudo comparou a produção das telas de um caso de uso clínico (o atendimento do médico, do início ao fim, em cinco blocos) em três condições: no Figma, sem IA (Ambiente A); com o modelo Claude Opus 5.5 conectado ao servidor MCP oficial do Figma, em conversas independentes por bloco (Ambiente B); e com o mesmo agente numa única conversa (Ambiente C). Foram 15 execuções, em 8 e 9 de outubro de 2026.

## Conteúdo

| Pasta ou arquivo | O que é |
|---|---|
| `verificador/` | Verificador de conformidade em Node.js, sem dependências externas. Lê os arquivos pela API REST do Figma e mede aderência ao sistema de design, contraste de texto (WCAG 2.2, critério 1.4.3), contraste de componentes (1.4.11), alvo de toque (2.5.8), valores fora de token e densidade. `validacao/` traz o teste com quadros sintéticos e defeitos injetados |
| `experimento/consolidado.csv` e `.md` | Métricas consolidadas das 15 execuções |
| `experimento/execucoes/registro_execucoes.csv` | Planilha de registro: tempo, telas, iterações, critério de aceite e observações de cada execução |
| `experimento/execucoes/PROMPTS_AMBIENTE_B.md` e `PROMPTS_AMBIENTE_C.md` | Enunciados preparados para os Ambientes B e C, com as regras de condução |
| `experimento/execucoes/transcricoes/` | Transcrições das 10 conversas dos Ambientes B e C |
| `experimento/execucoes/conferencia_memoria.csv` | Conferência, conversa por conversa, da leitura do registro de memória da conta pelo agente |
| `experimento/auditoria_gravacoes/` | Linha do tempo das execuções e leituras do cronômetro, reconstituídas das gravações de tela |
| `experimento/verificador_relatorios/v2/` | Relatórios do verificador por execução (JSON e CSV) |
| `experimento/analises/` | Scripts e resultados das análises (tempo normalizado, sensibilidade às pausas, gráfico de tempo por bloco, busca bibliográfica) |
| `docs/busca/t05_busca.md` | Registro da busca bibliográfica (bases, termos, data, resultados) |

## O que não está aqui, e por quê

- **Chaves dos arquivos do Figma:** trocadas por rótulos, como `[chave do arquivo do Ambiente B]`, em todos os arquivos.
- **Sistema de design e telas:** pertencem a terceiros e não são publicados; as telas finais estão no apêndice do trabalho, como imagem. Por isso, o verificador não pode ser rodado de novo sobre os arquivos originais; ele pode ser rodado sobre qualquer outro arquivo do Figma, e o teste de `verificador/validacao/` roda sem acesso a eles.
- **Gravações de tela e capturas do cronômetro:** não publicadas; as capturas estão no apêndice do trabalho.
- **Token de acesso:** o verificador lê o token da variável de ambiente `FIGMA_TOKEN`; nenhum token está no repositório.

Todos os dados das telas (pacientes, médicos, prontuários, medicamentos) são sintéticos, criados para o experimento.

## Observações sobre as transcrições

- Nas transcrições do Ambiente B, o enunciado inicial foi reconstruído a partir de `PROMPTS_AMBIENTE_B.md`, que contém o texto colado no aplicativo; o restante foi copiado da conversa sem edição.
- No Ambiente C, as mensagens dos Blocos 2 a 5 começavam com uma linha de transição escrita pelo autor, ausente da primeira versão das transcrições; as transcrições foram corrigidas, com nota datada.
- As imagens e os links anexados pelo agente nas conversas não estão nas transcrições.

## Como rodar o verificador

Requer Node.js 18 ou superior. Detalhes em `verificador/README.md`.

```
export FIGMA_TOKEN="seu token de leitura"
node verificador/src/cli.js --file-key <CHAVE> --node <ID_DO_QUADRO> --out saida/
```

Teste com quadros sintéticos, sem token:

```
node verificador/validacao/rodar-validacao.js
```

## Licença

Ainda não definida. Até lá, para reutilizar o código ou os dados, entre em contato com o autor.

## Situação

Versão corrigida do trabalho em elaboração após a defesa de 30/10/2026.

## Como citar

PAULOSI, Rafael. **Avaliação do uso de Inteligência Artificial integrada ao Figma via Model Context Protocol (MCP) no apoio ao design de interfaces de um sistema de saúde**. 2026. Trabalho de Conclusão de Curso (Bacharelado em Engenharia de Computação) – Universidade Estadual de Ponta Grossa, Ponta Grossa, 2026.
