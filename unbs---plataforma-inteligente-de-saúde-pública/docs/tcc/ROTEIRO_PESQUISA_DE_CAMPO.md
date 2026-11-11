# ROTEIRO METODOLÓGICO DE PESQUISA DE CAMPO
## Diagnóstico Situacional e Avaliação da Solução UNBS na Atenção Primária à Saúde

**Aplicação:** Trabalho de Conclusão de Curso (TCC) em Engenharia de Software / Saúde Pública  
**Objeto de Estudo:** Fluxos de atendimento, gestão de filas, agendamentos e controle de vacinação em Unidades Básicas de Saúde (UBS)  
**Técnica:** Estudo de Caso com Triangulação de Dados (Observação Não-Participante + Entrevistas Semiestruturadas + Questionário Quantitativo)

---

## 1. OBJETIVO DA PESQUISA DE CAMPO

A pesquisa de campo tem por finalidade:
1. **Identificar as dores reais e gargalos operacionais** enfrentados diariamente pelos cidadãos e pelas equipes multiprofissionais de saúde na UBS.
2. **Mapear a jornada do paciente** desde a intenção de agendamento até a saída do atendimento.
3. **Validar a adequação técnica da plataforma UNBS**, analisando como as funcionalidades desenvolvidas (agendamento com bloqueio de concorrência, painel de TV, fila virtual e rastreabilidade de lote de vacina) transformam cada etapa do fluxo.

---

## 2. ETAPA 1: PROTOCOLO DE OBSERVAÇÃO *IN LOCO* NA UBS

> **Orientações ao Pesquisador:**
> Realize a observação em dias e horários estratégicos:
> - **Início da manhã (06h45 às 09h00):** Momento de maior fluxo, abertura de portões e distribuição de fichas.
> - **Meio do dia (11h00 às 13h30):** Troca de plantão e fluxo de procedimentos.
> - **Tarde (14h00 às 16h30):** Consultas agendadas e sala de vacinas.

### Checklist de Observação do Pesquisador:

| Setor / Ponto Focal | O que Observar e Registrar | Evidências a Anotar |
| :--- | :--- | :--- |
| **Portão de Entrada / Calçada** | • Há fila antes da abertura da unidade?<br>• Pessoas idosas ou com crianças aguardam em pé?<br>• Qual o motivo relatado para chegar tão cedo? | Quantidade de pessoas, horário de chegada dos primeiros cidadãos, condições climáticas. |
| **Balcão de Recepção** | • Como a recepcionista anota o agendamento? (Papel, planilha Excel ou software legado?)<br>• Tempo médio gasto por paciente no balcão.<br>• Há conferência de documento e cartão SUS? | Tempo em minutos, ruído do ambiente, estresse aparente. |
| **Sala de Espera** | • Como os pacientes são chamados? (No grito pelo médico/enfermeiro, por microfone ou painel digital?)<br>• Há pacientes que perdem a chamada por desatenção ou barulho?<br>• Há assentos prioritários claramente demarcados? | Disposição física, iluminação, nível de ruído, presença de TV ou painel. |
| **Sala de Vacinas** | • Como o vacinador verifica o lote e a validade?<br>• Onde a dose aplicada é registrada na hora? (Na caderneta física, em caderno espiral ou no sistema?)<br>• Há conferência de temperatura da geladeira de imunobiológicos? | Tempo por aplicação, tempo de anotação burocrática vs. tempo de atendimento. |
| **Consultórios Médicos** | • Quantos pacientes faltaram no dia? (*no-show*)<br>• O médico tem acesso prévio à lista dos pacientes do dia?<br>• Há atraso acumulado ao longo da jornada? | Vagas perdidas, tempo de atendimento por consulta. |

---

## 3. ETAPA 2: ROTEIRO DE ENTREVISTAS SEMIESTRUTURADAS

### Roteiro A: Com a Recepção / Agente Administrativo
1. *Como é o processo de marcar uma consulta hoje na UBS? O que acontece quando os horários do mês acabam?*
2. *Com que frequência acontecem discussões ou reclamações sobre a ordem da fila ou prioridade de idosos/gestantes?*
3. *Quando um paciente falta sem avisar, vocês conseguem encaixar outra pessoa a tempo ou a vaga é perdida?*
4. *Qual é a tarefa mais repetitiva e cansativa da sua rotina diária no balcão?*
5. *Se existisse um sistema onde o próprio cidadão agenda e desmarca pelo celular, e na recepção você só clica em "Check-in" ou emite a senha na hora, como isso impactaria seu trabalho?*

---

### Roteiro B: Com o(a) Enfermeiro(a) ou Técnico(a) de Vacinas
1. *Como vocês fazem o controle de validade e baixa de lotes de vacina? Já ocorreu de um lote vencer antes do uso?*
2. *Os pacientes costumam trazer a caderneta de vacinação em bom estado ou é comum esquecerem ou perderem?*
3. *Vocês precisam digitar os dados da vacinação duas vezes (uma na caderneta/caderno e outra no sistema oficial)? Quanto tempo isso consome?*
4. *Como uma carteira digital com comprovante com QR Code e baixa automática no lote do estoque facilitaria a rastreabilidade da imunização?*

---

### Roteiro C: Com o(a) Médico(a) de Família e Comunidade / Clínico
1. *Qual é a média de faltas de pacientes nas consultas de rotina na sua agenda semanal?*
2. *Quando o paciente falta, você é avisado com antecedência ou fica ocioso esperando o próximo horário?*
3. *Como é feita a chamada do paciente do seu consultório hoje? Você precisa ir até a porta chamar pelo nome?*
4. *O que você considera essencial para que a transição digital não aumente a burocracia do seu tempo clínico com o paciente?*

---

### Roteiro D: Com o(a) Gestor(a) da UBS / Coordenação da Secretaria de Saúde
1. *Quais indicadores a Secretaria Municipal acompanha hoje para avaliar a eficiência de cada UBS?*
2. *Com que velocidade a gestão toma conhecimento de falta de insumos essenciais (ex: luvas, losartana, vacina de gripe) em uma unidade específica?*
3. *Quais são as principais exigências e cuidados com a LGPD e privacidade que a gestão municipal precisa zelar ao implantar novos sistemas?*
4. *Qual é a viabilidade de adotar uma plataforma multi-tenant integrada para gerenciar todas as UBSs do município em um único painel?*

---

### Roteiro E: Com o Cidadão / Paciente na Sala de Espera
1. *Que horas você precisou sair de casa para conseguir atendimento hoje?*
2. *Você tem celular smartphone e costuma usar aplicativos como WhatsApp, banco ou compras?*
3. *Se você pudesse ver pelo celular os dias e horários livres na UBS e garantir seu agendamento em 2 minutos de casa, você usaria?*
4. *E se você pudesse ver quantas pessoas estão na sua frente na fila pelo celular, para não precisar ficar horas sentado na recepção?*
5. *Você já perdeu a carteirinha de vacinação de papel sua ou do seu filho? O que aconteceu quando precisou dela?*

---

## 4. ETAPA 3: MATRIZ DE TRIANGULAÇÃO (DO CAMPO À SOLUÇÃO UNBS)

Esta matriz deve ser inserida no capítulo de **Resultados e Discussão do seu TCC**, conectando o achado empírico com a solução arquitetada:

| # | Gargalo Diagnosticado em Campo | Causa Raiz Identificada | Como o Sistema UNBS Atua (Intervenção) | Impacto Mensurável / KPI |
| :---: | :--- | :--- | :--- | :--- |
| **01** | Filas de madrugada na calçada para retirar fichas de consulta. | Processo de agendamento 100% presencial e centralizado no balcão físico. | **Wizard de Agendamento Online em 5 Etapas** via Web/PWA com bloqueio atômico de vagas (`409 Conflict`). | • Eliminação das filas externas antes do horário de abertura.<br>• Tempo médio de agendamento reduzido de 2h na fila para 2 minutos no celular. |
| **02** | Alto absenteísmo (*no-show* de 20% a 35%) em consultas agendadas. | Falta de canal acessível para o cidadão avisar desistência com antecedência. | **Botão de Cancelamento e Reagendamento** em 1 clique no Portal do Cidadão, liberando a vaga imediatamente no banco. | • Redução de até 60% na ociosidade de agendas médicas.<br>• Reocupação automática de vagas por outros cidadãos da fila. |
| **03** | Tumulto e reclamações sobre a ordem de chamada na recepção. | Chamada manual no grito; falta de transparência sobre prioridades de lei (80+, 60+, gestantes, PCD). | **Módulo de Fila com Chamada TV + Áudio Chime (Web Audio)** e senhas alfanuméricas regulamentadas. | • Fim de conflitos sobre preferência legal.<br>• Preservação da privacidade (sem expor nomes em viva-voz). |
| **04** | Perda de doses de vacinas e dificuldade de rastreamento de lotes. | Controle em cadernos físicos sem alerta de proximidade de validade. | **Sala de Vacinas com Baixa no Lote** + Alerta preditivo automático para lotes com vencimento em < 30 dias. | • Zero aplicação inadvertida de imunizantes vencidos.<br>• Rastreabilidade total por lote, frasco, aplicador e cidadão. |
| **05** | Perda e deterioração de carteirinhas de vacinação de papel. | Suporte físico frágil e ausência de centralização digital local. | **Carteira Digital de Vacinação SUS com Comprovante e QR Code** imprimível a qualquer momento. | • Cidadão sempre com histórico atualizado na palma da mão.<br>• Aceite imediato em matrículas escolares e empregos. |
| **06** | Gestão municipal "às cegas", descobrindo desabastecimento tardiamente. | Falta de relatórios agregados em tempo real entre as diferentes unidades. | **Painel Consolidado da Secretaria** com indicadores de taxa de ocupação, absenteísmo e estoque crítico. | • Gestão preditiva de insumos.<br>• Remanejamento ágil de estoques entre UBSs vizinhas antes do desabastecimento. |
| **07** | Risco de vazamento de dados de saúde e autuações por descumprimento da LGPD. | Prontuários e fichas expostos na recepção; exibição indevida de dados em papéis soltos. | **Trilha de Auditoria Imutável (`audit_logs`)** + Isolamento Multi-tenant + Minimização no painel público. | • 100% de conformidade com os artigos 6º e 11 da LGPD.<br>• Registro inalterável de quem acessou e alterou cada registro. |

---

## 5. RECOMENDAÇÕES PARA A ESCRITA DA METODOLOGIA NO TCC

1. **Classificação da Pesquisa:**  
   *Pesquisa aplicada, exploratória e explicativa, com abordagem quali-quantitativa, utilizando a metodologia Design Science Research (DSR) para o desenvolvimento do artefato tecnológico UNBS e estudo de caso em Unidade Básica de Saúde.*
2. **Amostra Sugerida para o TCC:**  
   - Questionário Google Forms: 50 a 100 cidadãos e 10 a 20 profissionais da saúde.  
   - Entrevistas semiestruturadas: 1 recepcionista, 1 enfermeiro(a) vacinador(a), 1 médico(a), 1 gestor(a) e 3 cidadãos.  
   - Observação em campo: mínimo de 2 turnos completos (manhã e tarde) em uma UBS de referência.
