# Verificador mínimo de conformidade de protótipos Figma

Utilitário de linha de comando, em Node.js, para o TCC de Rafael Paulosi. Lê um
arquivo do Figma pela API REST e produz, por protótipo, um relatório em JSON e
CSV com métricas objetivas de acessibilidade e de aderência ao sistema de design.

É a "versão mínima" definida na seção "O verificador mínimo" de
`../PLANO_ATE_A_BANCA.md`. Não é um servidor MCP; é um instrumento de medida.

## O que ele mede, por protótipo

| Métrica | Base normativa | Campo no CSV |
|---|---|---|
| Contraste de texto | WCAG 2.2, critérios 1.4.3 (texto) | `textos_pct_conformidade_1_4_3` |
| Contraste de componentes de interface | WCAG 2.2, critério 1.4.11 | `componentes_pct_conformidade_1_4_11` |
| Tamanho de alvo de toque (mínimo 24 x 24 px) | WCAG 2.2, critério 2.5.8 | `alvos_toque_pct_conformidade_2_5_8` |
| Aderência ao sistema de design (% de nós usando componentes/estilos/variáveis da biblioteca) | objetivo geral do TCC | `aderencia_design_system_pct` |
| Valores fora dos tokens (cores e tamanhos de fonte soltos) | complementa a métrica anterior | `cores_distintas_fora_token`, `tamanhos_fonte_distintos_fora_token` |
| Densidade (contagem de nós por tela) | contextualiza a comparação entre ambientes | `densidade_total_nos` |

## Pré-requisitos

- Node.js 18 ou superior (usa `fetch` nativo, sem dependências externas).
- Um Personal Access Token do Figma, com escopo de leitura de arquivos, na
  variável de ambiente `FIGMA_TOKEN`.

O verificador **não** obtém, renova nem grava token algum. Rafael precisa gerar o
token em Figma > Settings > Security > Personal access tokens e exportá-lo:

```powershell
# PowerShell
$env:FIGMA_TOKEN = "figd_xxxxxxxxxxxxxxxxxxxxxxxx"
```

```bash
# bash
export FIGMA_TOKEN="figd_xxxxxxxxxxxxxxxxxxxxxxxx"
```

`fileKey` do Design System eMed: `[chave do arquivo do sistema de design]`.

## Uso

Analisar frames específicos (recomendado: um protótipo = um frame de nível
superior por bloco e ambiente):

```bash
node src/cli.js --file-key [chave do arquivo do sistema de design] \
  --node "44332:2" --node "44332:9" \
  --tokens tokens.json \
  --rotulo ambienteA_bloco1 \
  --out relatorios
```

Analisar o arquivo inteiro (cada frame de nível superior de cada página vira um
protótipo):

```bash
node src/cli.js --file-key [chave do arquivo do sistema de design] --rotulo varredura_completa
```

Rodar sem token, sobre um JSON de arquivo Figma salvo em disco (útil para testes
e para a validação):

```bash
node src/cli.js --local caminho/arquivo_figma.json --tokens tokens.json --rotulo teste
```

### Parâmetros

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `--file-key` | sim (salvo com `--local`) | chave do arquivo Figma |
| `--node` | não | id de frame a tratar como protótipo; pode repetir |
| `--local` | não | caminho de um JSON de arquivo Figma (dispensa `--file-key` e token) |
| `--tokens` | não | JSON com os tokens do sistema de design (ver abaixo) |
| `--rotulo` | não | prefixo da pasta de saída (ex.: `ambienteB_bloco3_rep2`) |
| `--out` | não | diretório raiz dos relatórios (padrão: `./relatorios`) |

### Arquivo de tokens

Sem `--tokens`, o verificador apenas conta os valores distintos de cor e de
tamanho de fonte. Com `--tokens`, ele marca como "fora do token" todo valor que
não estiver na lista.

```json
{
  "cores": ["#0B5FBF", "#1A1A1A", "#FFFFFF", "#F2F4F7"],
  "tamanhosFonte": [12, 14, 16, 20, 24, 32]
}
```

## Saída

Cada execução cria `<out>/<rotulo>_<carimbo-de-tempo>/` com:

- `relatorio.json` — tudo: métricas por protótipo, valores fora de token e a
  lista completa de ocorrências.
- `metricas_por_prototipo.csv` — uma linha por protótipo, para colar na planilha
  de consolidação.
- `ocorrencias.csv` — uma linha por ocorrência (critério, nó, gravidade,
  detalhe).

Gravidade `reprova` indica violação de critério WCAG. Gravidade `alerta` indica
ponto de atenção que depende de julgamento (aderência, valor fora de token,
cor de texto não resolvida).

## Validação do verificador (defeitos injetados)

Antes de usar os números do verificador na monografia, é preciso responder
"quem garante que a medição está certa?". A pasta `validacao/` faz isso.

```bash
node validacao/gerar-fixture.js     # gera os 12 frames com defeitos e o gabarito
node validacao/rodar-validacao.js   # roda o verificador e compara com o gabarito
# ou: npm run validar
```

`rodar-validacao.js` imprime a taxa de acerto por critério (verdadeiros
positivos, falsos positivos, falsos negativos, precisão, revocação e F1) e grava
`validacao/resultado-validacao.json`. O protocolo completo, incluindo a tabela
dos 12 frames e a instrução para repetir a validação com frames desenhados
diretamente no Figma, está em `validacao/PROTOCOLO.md`.

## Limitações conhecidas (declarar na monografia)

- O fundo efetivo de um texto é aproximado pelo preenchimento sólido do
  ancestral mais próximo. Sobreposições complexas, gradientes e imagens de fundo
  não são resolvidos; esses casos aparecem como alerta, não como reprovação.
- "Componente de interface" é identificado por heurística de tipo (`INSTANCE`,
  `COMPONENT`) e de nome. A API REST nem sempre expõe estados interativos, então
  elementos clicáveis feitos como `FRAME` sem nome indicativo podem escapar da
  verificação de alvo de toque.
- O critério 2.5.8 usa o mínimo de 24 x 24 px (nível AA). Não considera exceções
  de espaçamento nem alvos inline.
- A aderência ao design system depende de os estilos e variáveis estarem de fato
  vinculados no arquivo. Estilo aplicado e depois "destacado" conta como valor
  solto, o que é o comportamento desejado.

## Versão 2 (09/10/2026) e decisão de uso das métricas

Primeira execução contra as telas reais (A e B, 09/10) mostrou dois defeitos, corrigidos em `src/analise.js` (cópia da versão anterior em `src/analise.v1_20260909.js.bak`):

1. Nós ocultos (`visible: false`), comuns dentro de instâncias com camadas escondidas, eram analisados. Agora são ignorados com toda a subárvore.
2. Peças internas de um componente (ícone de 16 px dentro de um botão) eram contadas como alvos de toque e componentes separados. Agora conta-se apenas o componente mais externo de cada ramo.

Validação: `validacao/rodar-validacao.js` continua com 12/12 e P=R=1; `validacao/teste-v2-ocultos-aninhados.js` cobre os dois comportamentos novos (PASSOU). Relatórios da v1 mantidos em `experimento/verificador_relatorios/` e os da v2 em `experimento/verificador_relatorios/v2/`.

Decisão de uso na monografia, tomada ao inspecionar as ocorrências reais:

- **Aderência ao DS:** métrica principal.
- **Contraste de texto (1.4.3):** reportar. As reprovações recorrentes vêm de cores do próprio DS (verde da marca e cinza secundário sobre branco, cerca de 3,1:1), que afetam A e B igualmente. O achado é sobre a paleta do DS, não sobre o ambiente.
- **Alvo de toque (2.5.8):** reportar como indicativo, com a limitação da identificação heurística de componente.
- **Contraste de componente (1.4.11):** NÃO reportar como conformidade. Na v2, o componente mais externo costuma ser um contêiner (card, linha de agenda) cujo fundo claro sobre fundo claro reprova, mas o 1.4.11 exige contraste das partes necessárias para identificar o componente, não do fundo do contêiner. A implementação não mede o construto do critério.
- **Valores fora de token:** sem arquivo de tokens, o número é só a contagem de cores e tamanhos distintos; reportar como contagem, não como "fora de token".
