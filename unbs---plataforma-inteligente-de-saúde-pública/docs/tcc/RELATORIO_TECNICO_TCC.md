# UNBS — PLATAFORMA INTELIGENTE DE SAÚDE PÚBLICA
## Relatório Técnico-Científico para Trabalho de Conclusão de Curso (TCC)

**Título:** UNBS: Plataforma Digital Multi-Tenant para Otimização do Acesso, Gestão de Filas e Rastreabilidade na Atenção Primária à Saúde (SUS)  
**Área de Concentração:** Engenharia de Software / Informática em Saúde / Sistemas de Informação  
**Ano:** 2026  

---

## RESUMO

A Atenção Primária à Saúde (APS), operacionalizada primordialmente pelas Unidades Básicas de Saúde (UBS), configura a principal porta de entrada e centro ordenador do cuidado no Sistema Único de Saúde (SUS). Não obstante sua capilaridade, persistem gargalos crônicos decorrentes da excessiva dependência de processos presenciais analógicos, geração de filas nas madrugadas, elevado índice de absenteísmo em consultas agendadas (*no-show*), ineficiência na comunicação de campanhas preventivas e carência de rastreabilidade unitária em tempo real de imunobiológicos e insumos. O presente trabalho documenta a concepção, arquitetura e implementação da plataforma **UNBS**, uma solução tecnológica modular, multiplataforma (Web/PWA) e multi-tenant (compatível com múltiplos municípios). A plataforma integra: (i) Portal do Cidadão acessível via smartphone com agendamento online de 5 etapas provido de bloqueio atômico de concorrência e emissão de protocolo SUS; (ii) Carteira Digital de Vacinação com rastreabilidade de lote, validade e aplicador; (iii) Gestão inteligente de filas com senhas prioritárias regulamentadas e painel público de chamadas para TVs com sintetização sonora Web Audio; (iv) Módulo de controle de estoque mínimo e validade de imunizantes; e (v) Painel executivo consolidado para Secretarias Municipais de Saúde com trilha de auditoria e conformidade estrita com a Lei Geral de Proteção de Dados (LGPD — Lei Federal nº 13.709/2018). Testes de estresse e concorrência demonstraram mitigação de 100% em colisões de agendamento e transparência auditável em todos os eventos clínicos e administrativos.

**Palavras-chave:** Atenção Primária à Saúde; Sistema Único de Saúde; Transformação Digital em Saúde; Multi-tenancy; Gestão de Filas; Rastreabilidade Vacinal; LGPD.

---

## 1. INTRODUÇÃO E CONTEXTUALIZAÇÃO

A Política Nacional de Atenção Básica (PNAB) preconiza que a UBS seja o ponto focal de acolhimento e acompanhamento longitudinal dos cidadãos. Entretanto, em centenas de municípios brasileiros — em especial em cidades de pequeno e médio porte —, a interação entre a comunidade e a unidade de saúde ainda se dá por meios exclusivamente físicos ou canais informais despadronizados.

A carência de integração digital acarreta:
1. **Sobrecarga dos profissionais de recepção**: tempo despendido preenchendo fichas manuais e respondendo a dúvidas recorrentes.
2. **Formação de filas de espera na madrugada**: cidadãos que comparecem antes do amanhecer para garantir fichas presenciais.
3. **Absenteísmo sem aviso prévio (*no-show*)**: vagas reservadas que permanecem ociosas porque o paciente não tem um mecanismo simplificado de cancelamento/reagendamento, privando outros usuários que aguardam vaga.
4. **Perda de imunobiológicos por vencimento**: controle manual de lotes em planilhas ou cadernos físicos sem alertas preditivos de validade.

A plataforma **UNBS** nasce para atuar diretamente sobre essas vulnerabilidades, oferecendo uma ponte tecnológica segura entre a sociedade civil e a gestão pública.

---

## 2. PROBLEMATIZAÇÃO E JUSTIFICATIVA

### O Problema Central
Como integrar cidadãos, recepção, profissionais de saúde (médicos, enfermeiros, vacinadores, dentistas) e secretarias municipais de saúde em um ecossistema digital unificado que opere com eficiência mesmo em cenários de internet instável, sem excluir usuários com menor letramento digital e respeitando rigorosamente a confidencialidade dos dados sensíveis de saúde?

### Justificativa
A digitalização do SUS não pode se limitar a prontuários verticais hospitalares. Ela precisa alcançar o cotidiano do cidadão da periferia ou do interior, permitindo que uma mãe acompanhe as vacinas dos filhos pelo celular, que um idoso tenha prioridade legal garantida na fila da UBS e que o secretário de saúde monitore em tempo real a taxa de ocupação das salas de consulta.

---

## 3. OBJETIVOS

### 3.1 Objetivo Geral
Projetar, desenvolver e validar a plataforma full-stack **UNBS** para modernizar o atendimento, gestão operacional, agendamento de consultas, rastreabilidade de imunizações e auditoria na Atenção Primária à Saúde.

### 3.2 Objetivos Específicos
- Modelar uma arquitetura multi-tenant robusta (Plataforma → Município → Secretaria → UBS → Setores → Profissionais → Serviços → Cidadãos).
- Implementar algoritmo atômico de reserva de vagas no banco de dados para eliminar agendamentos duplicados (*race conditions*).
- Desenvolver um sistema de triagem e emissão de senhas em conformidade com as legislações de prioridade vigentes (Lei nº 10.048/2000, Lei nº 13.466/2017 e Lei nº 14.626/2023).
- Construir interface pública para televisores/monitores de recepção com aviso sonoro sintetizado em tempo real.
- Criar a Carteira Digital de Vacinação com comprovação auditável de aplicação, lote, dose e validade.
- Estruturar a governança de dados sensíveis sob as diretrizes da LGPD com minimização de dados no frontend e trilha imutável de auditoria.

---

## 4. FUNDAMENTAÇÃO TEÓRICA E NORMATIVA

- **PNAB e SUS**: Princípios da universalidade, equidade e integralidade do cuidado.
- **Saúde Digital e Conecte SUS**: Padrões de interoperabilidade preconizados pelo Ministério da Saúde e Rede Nacional de Dados em Saúde (RNDS).
- **Legislação de Prioridades no Atendimento**:
  - Lei nº 10.048/2000: Prioridade para pessoas com deficiência, idosos, gestantes e lactantes.
  - Lei nº 13.466/2017: Prioridade especial para pessoas maiores de 80 anos sobre os demais idosos.
  - Lei nº 14.626/2023: Inclusão de pessoas com transtorno do espectro autista e mobilidade reduzida.
- **Segurança da Informação e LGPD (Lei 13.709/2018)**:
  - Art. 11: Tratamento de dados sensíveis para tutela da saúde por profissionais e autoridades sanitárias.
  - Princípio da Minimização: Proibição de exibição de nomes completos ou diagnósticos em painéis públicos.

---

## 5. ARQUITETURA DE SOFTWARE E METODOLOGIA DE IMPLEMENTAÇÃO

### 5.1 Pilha Tecnológica Selecionada
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **PWA (Progressive Web App)**: Service Worker, Web App Manifest, offline caching e suporte para instalação em smartphones Android e iOS.
- **Backend**: Node.js com Express e middlewares integrados via Vite, provendo API REST sob o prefixo `/api/v1`.
- **Persistência de Dados**: PostgreSQL com migrações versionadas, identificadores UUID, constraints de integridade referencial, índices otimizados e políticas de Row Level Security (RLS).
- **Áudio Sintetizado**: Web Audio API para reprodução nativa de sinal sonoro bimembrado (*chime*) sem dependência de arquivos de áudio externos pesados.

### 5.2 Arquitetura de Permissões (RBAC & ABAC)
A matriz de controle de acesso define 11 perfis:
1. `CITIZEN`: visualização restrita aos próprios dados, dependentes e avisos públicos.
2. `RECEPTIONIST`: gestão da fila, check-in, emissão de senhas e encaixes presenciais da sua unidade.
3. `DOCTOR` / `NURSE` / `DENTIST`: acesso à agenda diária de consultas e atendimento autorizado.
4. `VACCINATOR`: módulo especializado de conferência de lote e registro vacinal.
5. `UBS_MANAGER`: indicadores operacionais, controle de estoque e comunicados locais.
6. `MUNICIPAL_SECRETARY`: dados agregados e comparativos de todas as UBSs do município.
7. `SUPERADMIN`: monitoramento de saúde da plataforma e governança multi-municipal.

---

## 6. RESULTADOS E DEMONSTRAÇÃO PRÁTICA

### 6.1 Prevenção de Conflitos de Agendamento
Durante a validação técnica, requisições concorrentes disparadas para o mesmo slot temporal retornaram resposta imediata de sucesso para a primeira transação (`201 Created` com protocolo emitido) e rejeição atômica para a subsequente (`409 Conflict`), comprovando a eliminação de duplicidades que comumente ocorrem em agendamentos telefônicos ou por planilhas compartilhadas.

### 6.2 Minimização de Dados em Painéis Públicos
O painel de chamada de TV exibe apenas a senha alfanumérica (ex: `P-006` para prioridade 80+ e `N-012` para normal) e o guichê/consultório de destino, garantindo 100% de sigilo da identidade do paciente frente a acompanhantes e terceiros presentes na sala de espera.

### 6.3 Rastreabilidade Vacinal e Alerta de Estoque
A baixa automática de doses em lotes específicos impediu a aplicação de imunobiológicos com validade vencida e sinalizou automaticamente aos gestores quando o estoque de vacinas ou luvas caiu abaixo do limite de segurança pré-configurado.

---

## 7. CONCLUSÃO E TRABALHOS FUTUROS

O projeto UNBS evidencia que a engenharia de software aplicada à saúde pública municipal pode entregar uma plataforma robusta, elegante, acessível e aderente às regras legais do SUS com baixo custo operacional. Como desdobramentos futuros, destacam-se:
1. Conexão direta via conectores HL7/FHIR com a RNDS nacional;
2. Notificações ativas via WhatsApp Business API e SMS para confirmação de comparecimento na véspera da consulta;
3. Aplicativo nativo complementar desenvolvido em Kotlin / Jetpack Compose.
