# UNBS — Plataforma Inteligente de Saúde Pública
## Especificação Técnica v4.0 — Desenvolvimento Full Stack

A **UNBS** é uma plataforma digital modular, acessível e segura, projetada para conectar cidadãos atendidos pelo SUS, Unidades Básicas de Saúde (UBS), equipes multiprofissionais e secretarias municipais de saúde.

---

## 🏛️ Arquitetura Multi-Tenant
A plataforma suporta múltiplos municípios de forma isolada:
```
PLATAFORMA UNBS
  └── MUNICÍPIO (ex: Serra Azul - SP / IBGE 3551502)
        └── SECRETARIA MUNICIPAL DE SAÚDE
              ├── UBS Central Dr. Arnaldo Ribeiro (CNES 2078912)
              │     ├── Setores (Clínica Médica, Vacinas, Odonto, Enfermagem, Farmácia)
              │     ├── Profissionais com Conselhos (CRM, COREN, CRO)
              │     ├── Serviços & Agendas
              │     └── Fila e Chamada em Tempo Real
              └── UBS Vila Esperança (CNES 2078920)
```

---

## 🌟 Módulos Implementados

### 1. Portal do Cidadão (Mobile-First / PWA)
- **Dashboard Pessoal**: Próximas consultas, orientações de comparecimento e avisos oficiais da UBS de referência.
- **Agendamento Online em 6 Etapas**:
  1. Escolha da Unidade Básica.
  2. Escolha da especialidade e serviço.
  3. Consulta de datas disponíveis.
  4. Seleção de horário livre com controle de concorrência atômica.
  5. Confirmação com geração de protocolo SUS (ex: `UNBS-2026-89412`).
  6. Comprovante digital imprimível e regras de cancelamento.
- **Carteira Digital de Vacinação SUS**:
  - Histórico de imunizações com nome da vacina, dose, data, lote, vacinador e unidade responsável.
  - Alertas preventivos baseados no Programa Nacional de Imunizações (PNI).
- **Fila Virtual em Tempo Real**:
  - Emissão de senha antecipada pelo celular com contagem regressiva de posição e aviso sonoro de chamada no guichê.
- **Solicitações Administrativas & Ouvidoria**:
  - Canal para dúvidas, atualização cadastral e elogios com protocolo de rastreamento.

### 2. Painel Operacional da UBS (Recepção, Enfermagem e Médicos)
- **Fila & Triagem**: Emissão presencial de senhas normais e prioritárias (Leis nº 10.048/2000, 13.466/2017 e 14.626/2023: Idoso 60+, Prioridade Especial 80+, Gestante, Lactante e PCD).
- **Chamada de Senha**: Aciona sinal sonoro harmônico (Web Audio API) e atualiza o painel de TV da sala de espera.
- **Agenda do Dia**: Check-in presencial na chegada do paciente, registro de conclusão e faltas.
- **Sala de Vacinas**: Registro de doses aplicadas com conferência de validade e baixa automática no estoque do lote.
- **Estoque & Insumos**: Monitoramento de itens com alertas de estoque crítico (< 15 unidades) e lotes próximos do vencimento.
- **Comunicados Oficiais**: Publicação imediata de comunicados para a comunidade atendida pela UBS.

### 3. Painel TV / Guichê da Recepção
- Visualização de alta visibilidade e contraste para monitor da recepção.
- Destaque da senha chamada, consultório/guichê, histórico recente e relógio em tempo real.

### 4. Painel da Secretaria Municipal de Saúde
- **Indicadores Consolidados**: Total de UBSs, profissionais ativos, taxa de ocupação de agendas, índice de comparecimento e vacinas aplicadas.
- **Comparativo de Unidades**: Infraestrutura e serviços de cada UBS do município.
- **Trilha de Auditoria LGPD**: Registro de todas as operações sensíveis com usuário, ação, data, entidade e endereço IP.

---

## 🔒 Segurança, LGPD e Banco de Dados
- **PostgreSQL Migrations**: Arquivo `supabase/migrations/20261111_000001_initial_schema.sql` com 13 tabelas normalizadas, constraints, índices, chaves UUID e políticas Row Level Security (RLS).
- **Controle de Concorrência**: Bloqueio de horário no banco para impedir que dois cidadãos reservem o mesmo slot simultaneamente.
- **Proteção de Dados Pessoais**: Nomes e CPFs mascarados em visualizações públicas de triagem e chamadas de TV.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 20+
- npm

### Comandos
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor Full-Stack (Express API + Vite Dev Server)
npm run dev

# 3. Testar compilação e tipagem TypeScript
npm run lint

# 4. Compilar para produção
npm run build
```

A aplicação estará acessível em `http://localhost:3000`.
