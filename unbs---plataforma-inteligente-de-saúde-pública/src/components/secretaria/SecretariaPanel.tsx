import React from 'react';
import { MunicipalKpis, HealthUnit, AuditLog, User } from '../../types';
import {
  Building2,
  Users,
  CalendarCheck,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Syringe,
  ShieldCheck,
} from 'lucide-react';

interface SecretariaPanelProps {
  kpis: MunicipalKpis;
  healthUnits: HealthUnit[];
  auditLogs: AuditLog[];
  currentUser: User;
}

export const SecretariaPanel: React.FC<SecretariaPanelProps> = ({
  kpis,
  healthUnits,
  auditLogs,
  currentUser,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header Municipal */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white px-4 py-6 sm:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-mono mb-1">
              <span>Secretaria Municipal de Saúde</span>
              <span>·</span>
              <span>Serra Azul - SP (IBGE 3551502)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Painel de Gestão e Monitoramento Municipal
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestor Responsável: {currentUser.fullName} · Visão consolidada da rede SUS municipal
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* CARDS DE INDICADORES / KPIS CONSOLIDADOS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Unidades Ativas</span>
              <Building2 className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">
              {kpis.totalUnits} UBSs
            </div>
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">100% em funcionamento</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Profissionais Ativos</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">
              {kpis.activeProfessionals}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Médicos, enfermeiros e equipe</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Taxa de Ocupação</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">
              {kpis.occupancyRate}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Capacidade de agendas</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Doses Aplicadas no Mês</span>
              <Syringe className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">
              {kpis.vaccinesAppliedThisMonth}
            </div>
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">Metas do PNI em dia</p>
          </div>
        </div>

        {/* COMPARATIVO DE UNIDADES BÁSICAS DE SAÚDE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Unidades da Rede Municipal</h3>
              <p className="text-xs text-slate-500">Monitoramento da infraestrutura e serviços por unidade.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthUnits.map((unit) => (
              <div key={unit.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{unit.name}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Ativa
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>CNES: <strong className="font-mono text-slate-800">{unit.cnesCode}</strong> · Bairro: {unit.neighborhood}</p>
                  <p>Endereço: {unit.address}</p>
                  <p>Telefone: {unit.phone}</p>
                  <p>Horário: {unit.openingTime} às {unit.closingTime}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-[11px] font-semibold text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                    {unit.hasPharmacy ? '✓ Farmácia' : '✗ Farmácia'}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                    {unit.hasVaccineRoom ? '✓ Sala Vacinas' : '✗ Sala Vacinas'}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                    {unit.hasDental ? '✓ Odonto' : '✗ Odonto'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TRILHA DE AUDITORIA LGPD E SEGURANÇA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Trilha de Auditoria e Conformidade LGPD</h3>
                <p className="text-xs text-slate-500">Registro imutável de todas as operações administrativas e agendamentos.</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">Total de Registros: {auditLogs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-2.5 px-3">Data/Hora</th>
                  <th className="py-2.5 px-3">Usuário</th>
                  <th className="py-2.5 px-3">Perfil</th>
                  <th className="py-2.5 px-3">Ação Realizada</th>
                  <th className="py-2.5 px-3">Entidade</th>
                  <th className="py-2.5 px-3">IP de Origem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
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
                    <td className="py-2.5 px-3 text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
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
