# Protocolo de validação do verificador por defeitos injetados

Objetivo: medir se o verificador detecta o que deve detectar, antes de usar seus
números na monografia. Responde de antemão à pergunta de banca "quem garante que
sua medição está certa?".

## Método

1. Construir um conjunto de frames com defeitos propositais, um ou poucos
   defeitos por frame, cada defeito ligado a um critério que o verificador mede.
2. Registrar, para cada frame, o gabarito: quais critérios devem acusar violação
   e quais não devem.
3. Rodar o verificador sobre o conjunto.
4. Comparar detecção com gabarito e reportar verdadeiros positivos, falsos
   positivos e falsos negativos, além de precisão, revocação e F1 por critério.

## Conjunto sintético (rodando agora)

`gerar-fixture.js` gera 12 frames em `frames-defeitos.json`, no mesmo formato da
API `/v1/files` do Figma, e o gabarito em `gabarito.json`. `rodar-validacao.js`
executa e grava `resultado-validacao.json`.

| Frame | Defeito injetado | Critério que deve acusar |
|---|---|---|
| F01_texto_normal_ok | nenhum: texto preto sobre branco | nenhum |
| F02_texto_normal_baixo_contraste | texto cinza claro (#DDDDDD) sobre branco, 16 px | contraste_texto_1.4.3 |
| F03_texto_grande_no_limiar | texto #898989 sobre branco, 40 px | nenhum (passa como texto grande, limiar 3:1) |
| F04_texto_pequeno_mesmo_cinza_reprova | mesmo #898989, agora 14 px | contraste_texto_1.4.3 |
| F05_botao_alvo_pequeno | instância de botão 18 x 18 px | alvo_toque_2.5.8 |
| F06_botao_alvo_ok | instância de botão 48 x 40 px | nenhum |
| F07_componente_baixo_contraste | botão #E0E0E0 sobre fundo branco | contraste_componente_1.4.11 |
| F08_cor_fora_do_token | retângulo com cor #7D2AE8 fora da lista de tokens | valor_fora_token (alerta) |
| F09_tamanho_fonte_fora_do_token | texto 15 px, fora da lista de tamanhos | valor_fora_token (alerta) |
| F10_aderencia_baixa | 3 retângulos com preenchimento solto, sem estilo | aderencia_design_system (alerta) |
| F11_aderencia_alta | 2 instâncias com componentId e estilo vinculado | nenhum |
| F12_multiplos_defeitos | texto sem contraste + botão 16 x 16 sem contraste | contraste_texto_1.4.3, contraste_componente_1.4.11, alvo_toque_2.5.8 |

Resultado atual: 12 de 12 frames classificados corretamente, precisão 1,0 e
revocação 1,0 em todos os critérios. Esse número confirma que a lógica dos
cálculos (fórmula de contraste WCAG, limiar de texto grande, mínimo de alvo,
identificação de nó vinculado à biblioteca) está correta.

## Etapa complementar antes da entrega final

O conjunto sintético valida a implementação, não o comportamento sobre arquivos
reais do Figma, que trazem estrutura de nós, auto-layout e herança de estilo mais
complexos. Antes de fechar o Capítulo 4:

1. Desenhar de 10 a 15 frames de defeito diretamente no arquivo do Figma do
   experimento, usando os componentes do Design System eMed e injetando os mesmos
   tipos de defeito da tabela acima, mais dois ou três casos difíceis: texto
   sobre imagem, botão com ícone sem rótulo, campo com placeholder de baixo
   contraste.
2. Preencher um gabarito equivalente a `gabarito.json` para esses frames.
3. Rodar `node src/cli.js --file-key <KEY> --node <ids dos frames de defeito>` e
   comparar manualmente o `ocorrencias.csv` com o gabarito.
4. Relatar a taxa de acerto real na seção do verificador do Capítulo 3 ou 4, com
   os falsos positivos e falsos negativos discutidos, não escondidos.

`[[PENDENTE: executar a etapa complementar com frames reais no Figma e registrar a taxa de acerto observada]]`
