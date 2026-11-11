# DIRETRIZES DE SEGURANÇA E CONFORMIDADE LGPD — UNBS

A Plataforma UNBS trata dados de saúde, classificados como **dados pessoais sensíveis** pela Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018 - LGPD).

---

## 1. Bases Legais Aplicáveis no SUS
No âmbito do Sistema Único de Saúde, o tratamento de dados de saúde baseia-se prioritariamente em:
- **Art. 11, II, "a"**: Cumprimento de obrigação legal ou regulatória pelo controlador;
- **Art. 11, II, "b"**: Execução de políticas públicas previstas em leis e regulamentos;
- **Art. 11, II, "f"**: Tutela da saúde, exclusivamente, em procedimento realizado por profissionais de saúde, serviços de saúde ou autoridade sanitária.

O consentimento é exigido estritamente para finalidades complementares que não constituam execução direta do serviço público de saúde.

---

## 2. Princípio da Minimização de Dados
- **Painel Público / TV da Recepção**: NUNCA exibe o nome completo do paciente nem motivos clínicos de atendimento. Apenas o código da senha (ex: `P-006`) e o consultório de destino são anunciados.
- **Visualização da Fila na Triagem**: Nomes são exibidos de forma mascarada para terceiros (ex: `Maria S. ***`).
- **Comprovantes**: Exibem apenas os dados estritamente necessários para validação do agendamento ou vacina.

---

## 3. Matriz de Perfis (RBAC / ABAC)
1. **Cidadão**: Acesso exclusivo aos seus próprios agendamentos, vacinas e solicitações.
2. **Recepcionista**: Acesso a agendamentos, check-in e filas da sua UBS vinculada. Sem acesso a prontuários médicos.
3. **Médico / Enfermeiro**: Acesso à agenda e atendimento dos cidadãos com consulta marcada.
4. **Vacinador**: Registro de vacinas com conferência de lote e validade.
5. **Gestor de UBS**: Acesso a indicadores e estoque da sua unidade.
6. **Secretaria Municipal**: Acesso agregado aos dados do município sem exposição individual de prontuários.
7. **Superadministrador**: Gestão técnica e auditoria sem privilégio automático de leitura clínica.

---

## 4. Trilha de Auditoria Imutável (`audit_logs`)
Todas as operações críticas são registradas:
- Identificador do operador (`user_id`)
- Papel no momento da operação (`user_role`)
- Data e hora com fuso oficial (`created_at`)
- Endereço IP e agente de conexão (`ip_address`)
- Entidade e registro afetado (`entity_name`, `entity_id`)
- Detalhes da alteração (`details`)

Os registros de auditoria são protegidos contra edição ou exclusão retroativa.
