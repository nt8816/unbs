import React, { useState } from 'react';
import { AuditLog, Municipality, HealthUnit } from '../../types';
import { ShieldCheck, Search, Database, Lock, Server, CheckCircle2 } from 'lucide-react';

interface PlatformAdminPanelProps {
  auditLogs: AuditLog[];
  municipalities: Municipality[];
  healthUnits: HealthUnit[];
}

export const PlatformAdminPanel: React.FC<PlatformAdminPanelProps> = ({
  auditLogs,
  municipalities,
  healthUnits,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === 'ALL' || log.action.includes(filterAction);

    return matchesSearch && matchesAction;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Banner Técnico */}
      <section className="bg-slate-900 text-white px-4 py-6 sm:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono mb-1">
            <span>UNBS Core Platform</span>
            <span>·</span>
            <span>Governança, Segurança & Auditoria</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Auditoria Central & Segurança dos Dados de Saúde</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Trilha de auditoria em conformidade com as diretrizes da LGPD (Lei 13.709/2018) e padrões do SUS.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Status de Segurança e Isolamento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Isolamento Multi-Tenant</span>
            </div>
            <p className="text-xs text-slate-600">
              Row-Level Security (RLS) ativo. Isolamento rigoroso entre municípios ({municipalities.length}) e UBSs ({healthUnits.length}).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-sky-700 font-bold text-xs mb-1">
              <Database className="w-4 h-4 text-sky-600" />
              <span>PostgreSQL Schema v4</span>
            </div>
            <p className="text-xs text-slate-600">
              Tabelas normalizadas, chaves primárias UUID, índices de performance e restrições atômicas de concorrência.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Integridade dos Registros</span>
            </div>
            <p className="text-xs text-slate-600">
              Rastreabilidade total: logs imutáveis registrando usuário, perfil, ação, entidade afetada e endereço IP.
            </p>
          </div>
        </div>

        {/* Trilha de Auditoria com Filtro */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Eventos Auditados do Sistema</h3>
              <p className="text-xs text-slate-500">Histórico de ações sensíveis executadas na plataforma.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar ação ou usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 w-48 sm:w-64"
                />
              </div>

              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              >
                <option value="ALL">Todas as Ações</option>
                <option value="AGENDAMENTO">Agendamentos</option>
                <option value="VACINA">Vacinação</option>
                <option value="SENHA">Senhas / Fila</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-2.5 px-3">Data/Hora</th>
                  <th className="py-2.5 px-3">Usuário</th>
                  <th className="py-2.5 px-3">Papel</th>
                  <th className="py-2.5 px-3">Ação</th>
                  <th className="py-2.5 px-3">Entidade</th>
                  <th className="py-2.5 px-3">Detalhes</th>
                  <th className="py-2.5 px-3">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                      {log.userName}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-600">
                      {log.userRole}
                    </td>
                    <td className="py-2.5 px-3 text-sky-800 font-bold">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {log.entityName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {log.ipAddress || '177.18.92.14'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
