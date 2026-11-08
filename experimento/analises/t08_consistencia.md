# T08: quadro de consistência dado × bloco × ambiente (S15, C4.15, R9.6)

Montado em 07/11/2026 (Claude Code, Opus 5.5) a partir de `t08_textos.md` (textos visíveis de cada tela, extraídos pela API do Figma de `experimento/exportacoes/`). Cada célula cita o que está escrito na tela; o número entre colchetes é a ordem da tela na página do bloco (ver `experimento/exportacoes/indice.csv`). Nada foi inferido de imagem.

**Régua (a mesma para A, B e C):** um dado é **consistente** quando todas as telas dos cinco blocos em que ele aparece mostram o mesmo valor; é **divergente** quando aparecem dois ou mais valores para o que deveria ser o mesmo dado do mesmo atendimento. "Não exibido" não conta como divergência. Texto clínico com redação diferente e mesmo conteúdo conta como consistente; com conteúdo diferente (sintoma, valor, medicamento), como divergente.

## Ambiente A

| Dado | B1 | B2 | B3 | B4 | B5 | Situação |
|---|---|---|---|---|---|---|
| Profissional no menu | Maria Cristina | Dra. Maria Cristina | Dra. Maria Cristina | Dra. Maria Cristina | Dra. Maria Cristina [1, 2]; Maria Cristina [3] | Consistente |
| Profissional da agenda ou do registro | Dr. Amir C. Castro, Endocrinologista (agenda) | Maria Cristina, CRM 00000 PR (histórico) | Maria Cristina (histórico) | Maria Cristina (histórico e relatório A4) | Maria Cristina [1, 2]; Dr. Amir C. Castro (agenda) [3] | Divergente |
| Local | Consultório Campo Largo | Consultório Campo Largo | Consultório Campo Largo | Consultório Campo Largo [1 a 3]; "Consultório XXX" (relatório A4) [4] | Consultório Campo Largo | Divergente |
| Paciente atendido | 09:00 Gabriel Costa Rocha, Presente | Francisca Carolina Almeida | Francisca Carolina Almeida | Francisca Carolina Almeida | Francisca Carolina Almeida; na agenda, 09:00 Francisca Carolina Almeida, Atendido [3] | Divergente (o paciente das 09:00 muda entre B1 e B5) |
| Idade e nascimento | não exibido | 38 anos, 10 meses e 24 dias; 15/08/1984 | igual | igual (A4: 15/08/1984) | igual | Consistente |
| Sexo | não exibido | Feminino | Feminino | Feminino | Feminino | Consistente (os textos clínicos dizem "O paciente") |
| Número sem rótulo no cabeçalho | não exibido | (505000) | (505000) | (505000) | (505000) | Consistente |
| Convênio | Unimed | Unimed | Unimed | Unimed [1 a 3]; "Unimed Americana" (A4) [4] | Unimed | Divergente |
| Data e hora do atendimento | "8:22, quarta-feira, 10 de Nov." | histórico "Em 09 de Mar. de 2022 às 11:23 - 12:00" | igual | registro do atendimento atual "Em 09 de Mar. de 2022 às 11:23 - 12:00"; A4 "Gerado por eMed às 8h de 09 de out. de 2026" | "10:00, quarta-feira, 10 de Nov." [3] | Divergente (três datas) |
| Queixa | não exibido | não exibido (só histórico) | dor abdominal aguda, náuseas, febre leve [2] | o mesmo texto | o mesmo texto | Consistente |
| Temperatura | não exibido | não exibido | não exibido | não exibido | não exibido | Não exibido |
| Prescrição | não exibido | não exibido | dieta leve e hidratação, sem medicamento [2] | o mesmo texto | o mesmo texto | Consistente |
| Alergia | não exibido | rótulo "e alergias", sem substância | igual | igual | igual | Consistente (sem substância) |

## Ambiente B

| Dado | B1 | B2 | B3 | B4 | B5 | Situação |
|---|---|---|---|---|---|---|
| Profissional no menu | Dra. Helena Duarte | Maria Cristina | Maria Cristina | Maria Cristina | Maria Cristina | Divergente |
| Profissional do relatório | não exibido | não exibido | não exibido | Dra. Maria Cristina, CRM-PR 00000 [3] | Dra. Maria Cristina, CRM-PR 000000 [1] | Divergente (número do CRM) |
| Local | Clínica Vida Plena, Consultório 2 | Nome da empresa, Consultório Campo Largo | igual a B2 | igual a B2; relatório: Consultório Campo Largo | igual a B2 | Divergente |
| Paciente atendido | próxima: Marina Alves Teixeira [1]; selecionada: Jussara Pires Monteiro [2] | Helena Prado Vasconcelos | Helena Prado Duarte | Helena Duarte | Helena Duarte Sampaio | Divergente (quatro nomes de B2 a B5) |
| Idade | 34 (Marina) [1]; 52 (Jussara) [2] | 58 anos; nascimento 14/03/1968 | 42 anos | 42 anos | 42 anos | Divergente (58 e 42) |
| Sexo | não exibido | Feminino | Feminino | não exibido | não exibido | Consistente |
| Prontuário | não exibido | 000123 | 000482 | 000482 | não exibido | Divergente |
| Convênio | Plano Vital (Marina); Convênio Aurora (Jussara) | Saúde Exemplo | não exibido | não exibido | Convênio Vida Plena (agenda) [3] | Divergente |
| Horário da consulta | 08:00 (Marina); 09:00 (Jussara) | retorno às 09:30, iniciado às 09:34 | "Agendado 14:30" | "Consulta das 09:30"; relatório 09:30 às 10:00, gerado às 10:02 | iniciado às 09:30; 09:30 às 09:52; gerado às 09:52 | Divergente (14:30 e 09:30; fim às 10:00 e às 09:52) |
| Data | sexta-feira, 9 de outubro de 2026 | não exibido | não exibido | 09/10/2026 | 09/10/2026 | Consistente |
| Queixa | não exibido | dor de cabeça há 3 dias, tontura, PA 160 x 100 em casa | dor de garganta e febre há 3 dias, até 38,5 °C | dor de garganta e febre baixa há 3 dias | o mesmo de B4 ("três dias") | Divergente (B2 diferente de B3 a B5) |
| Temperatura | não exibido | 36,5 °C (triagem) | 38,1 °C | 37,8 °C | 37,6 °C | Divergente |
| Prescrição | não exibido | não exibido | Amoxicilina 500 mg e Paracetamol 750 mg [2] | Dipirona 500 mg | "Analgésico e antitérmico", sem nome | Divergente |
| Alergia | não exibido | dipirona (urticária) | dipirona | não exibido | não exibido | Consistente onde aparece; o B4 prescreve dipirona (seção 4.7) |

## Ambiente C

| Dado | B1 | B2 | B3 | B4 | B5 | Situação |
|---|---|---|---|---|---|---|
| Profissional no menu | Dra. Lívia Montebelo | igual | igual | igual | igual | Consistente |
| Profissional do relatório | não exibido | não exibido | não exibido | Dra. Lívia Montebelo, CRM 000000 [3] | não exibido | Consistente |
| Local | Clínica Aurora, Consultório 03 | igual | igual | igual | igual | Consistente |
| Paciente atendido | Otávio Nunes Prado | Otávio Nunes Prado | Otávio Nunes Prado | Otávio Nunes Prado | Otávio Nunes Prado | Consistente |
| Idade | não exibido | 58 anos; nascimento 14/03/1968 | 58 anos | 58 anos | 58 anos [1] | Consistente |
| Sexo | não exibido | Masculino | não exibido | Masculino [3] | não exibido | Consistente |
| Prontuário | não exibido | 004512 | não exibido | 004512 [3] | não exibido | Consistente |
| Convênio | Plano Alfa | Plano Alfa | Plano Alfa | Plano Alfa | Plano Alfa | Consistente |
| Horário | agendado 09:00, chegou 08:47 | iniciado às 09:02 | iniciado às 09:02 | salvo às 09:24; consulta das 09:02 às 09:24; relatório às 09:26 | relatório às 09:26 [1]; encerrado às 09:28 [2] | Consistente |
| Data | sexta-feira, 9 de outubro de 2026 | não exibido | não exibido | 09/10/2026 | 9 de outubro de 2026 [2] | Consistente |
| Queixa | não exibido | dor lombar há 5 dias | o mesmo texto | o mesmo texto | o mesmo texto | Consistente |
| Temperatura | não exibido | não exibido | 36,4 °C [2] | 36,4 °C | 36,4 °C | Consistente |
| Prescrição | não exibido | não exibido | Ciclobenzaprina 5 mg [2] | Ciclobenzaprina 5 mg | Ciclobenzaprina 5 mg | Consistente |
| Alergia | não exibido | dipirona (reação cutânea) | dipirona | dipirona | dipirona | Consistente |

## Contagem

| | Dados que aparecem em duas ou mais telas | Consistentes | Divergentes |
|---|---|---|---|
| A | 12 | 7 | 5 (profissional da agenda, local, paciente das 09:00, convênio, data) |
| B | 14 | 3 (sexo, data, alergia onde aparece) | 11 |
| C | 13 | 13 | 0 |

Não entram: a temperatura no A (não aparece em nenhuma tela) e o profissional do relatório no C (aparece em uma tela só).

## Contagem pelas linhas do Quadro 7 do Cap. 4 (a que vai para o texto)

O quadro do texto junta algumas linhas desta análise (profissional do menu e do relatório numa linha só; data e horário numa linha; sem a linha de sexo). Contagem sobre as 11 linhas do quadro, com a mesma régua:

| | Linhas com dado em duas ou mais telas | Divergentes |
|---|---|---|
| A | 10 (temperatura não aparece) | 5 |
| B | 11 | 10 (só a alergia é consistente) |
| C | 11 | 0 |

## Leitura (para o Cap. 4, sem interpretar além do dado)

- **C:** nenhum dado divergente nos cinco blocos.
- **B:** onze dos catorze dados divergem; o paciente tem quatro nomes de B2 a B5, duas idades, dois prontuários, três temperaturas e três prescrições.
- **A:** o cabeçalho do paciente (nome, idade, sexo, nascimento, convênio, número) é idêntico nas telas dos Blocos 2 a 5, porque essas telas partiram de cópias (Quadro de desvios). As cinco divergências do A estão fora do cabeçalho: textos de exemplo do sistema de design que não foram trocados ("Consultório XXX", "Unimed Americana", data de 2022 no registro do atendimento atual), o profissional da agenda (Dr. Amir C. Castro, enquanto o usuário é Maria Cristina) e o paciente das 09:00, que é Gabriel Costa Rocha no B1 e Francisca Carolina Almeida no B5.
- **Consequência para a frase da 4.6:** "No Ambiente A, o autor manteve a mesma estrutura de tela entre os blocos" fica sustentada para o cabeçalho e a estrutura, mas não para os dados como um todo. O A também tem divergências, de outro tipo que as do B.
