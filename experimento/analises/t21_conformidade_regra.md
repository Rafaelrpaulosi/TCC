# T21: conformidade por regra (adaptação de Cha et al., 2026, sem LLM como juiz)

Gerado por `t21_conformidade_regra.py` sobre as telas exportadas em 07/11/2026. Regra: propriedade visual definida no componente principal do sistema de design, mantida ou não na instância (ver o cabeçalho do script).

| Bloco | Telas | Instâncias do DS avaliadas | Regras | Atendidas | Conformidade (%) |
|---|---|---|---|---|---|
| B1-A-01 | 1 | 17 | 493 | 487 | 98.78 |
| B2-A-01 | 3 | 87 | 561 | 540 | 96.26 |
| B3-A-01 | 2 | 34 | 294 | 290 | 98.64 |
| B4-A-01 | 4 | 70 | 493 | 476 | 96.55 |
| B5-A-01 | 3 | 63 | 805 | 787 | 97.76 |
| B1-B-01 | 2 | 32 | 1064 | 1064 | 100.0 |
| B2-B-01 | 2 | 24 | 300 | 298 | 99.33 |
| B3-B-01 | 2 | 64 | 798 | 786 | 98.5 |
| B4-B-01 | 3 | 28 | 535 | 533 | 99.63 |
| B5-B-01 | 3 | 16 | 688 | 688 | 100.0 |
| B1-C-01 | 2 | 40 | 1162 | 1159 | 99.74 |
| B2-C-01 | 2 | 22 | 296 | 294 | 99.32 |
| B3-C-01 | 2 | 44 | 596 | 586 | 98.32 |
| B4-C-01 | 3 | 65 | 926 | 914 | 98.7 |
| B5-C-01 | 2 | 43 | 930 | 924 | 99.35 |

| Ambiente | Média dos blocos (%) | Mínimo | Máximo |
|---|---|---|---|
| A | 97.6 | 96.26 | 98.78 |
| B | 99.49 | 98.5 | 100.0 |
| C | 99.09 | 98.32 | 99.74 |

## Regras não atendidas, por tipo (todas as execuções)

| Tipo | Ocorrências | Exemplos (componente › camada: principal → instância) |
|---|---|---|
| cor de preenchimento | 113 | Size=Small › Vector: #000000@1.00 → #54A275@1.00; Size=Small › Vector: #000000@1.00 → #54A275@1.00; Size=Small › Vector: #000000@1.00 → #5D6066@1.00; Size=Small › Vector: #000000@1.00 → #5D6066@1.00 |
| raio do canto | 2 | State=Default, Night Mode=No › _Button Settings: 250.0 → 8.0; State=Default, Night Mode=No › _Button Settings: 250.0 → 8.0 |

## Regras não atendidas por tipo de camada e ambiente

| Ambiente | Ícone (vetor) | Texto | Contêiner ou forma |
|---|---|---|---|
| A | 63 | 1 | 2 |
| B | 12 | 4 | 0 |
| C | 33 | 0 | 0 |
