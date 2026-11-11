import React, { useState } from 'react';
import {
  User,
  HealthUnit,
  Service,
  Appointment,
  QueueEntry,
  Vaccine,
  VaccineBatch,
  ImmunizationRecord,
  InventoryItem,
  TicketPriority,
} from '../../types';
import {
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  PlusCircle,
  AlertTriangle,
  Radio,
  FileCheck2,
  Syringe,
  Package,
  Megaphone,
} from 'lucide-react';
import { playTicketChime } from '../../utils/audio';

interface UbsPanelProps {
  currentUser: User;
  healthUnits: HealthUnit[];
  services: Service[];
  appointments: Appointment[];
  queue: QueueEntry[];
  vaccines: Vaccine[];
  batches: VaccineBatch[];
  immunizations: ImmunizationRecord[];
  inventory: InventoryItem[];
  allUsers: User[];
  onCallTicket: (ticketId: string, deskNumber: string) => Promise<void>;
  onGenerateTicket: (data: {
    healthUnitId: string;
    serviceId: string;
    priorityType: TicketPriority;
    citizenName: string;
  }) => Promise<void>;
  onUpdateAppointmentStatus: (id: string, status: string, notes?: string) => Promise<void>;
  onRecordVaccination: (data: {
    citizenId: string;
    citizenName: string;
    vaccineId: string;
    batchId: string;
    doseNumber: string;
    healthUnitId: string;
    notes?: string;
  }) => Promise<void>;
  onCreateAnnouncement: (data: {
    healthUnitId: string;
    title: string;
    content: string;
    category: string;
    isUrgent: boolean;
  }) => Promise<void>;
}

export const UbsPanel: React.FC<UbsPanelProps> = ({
  currentUser,
  healthUnits,
  services,
  appointments,
  queue,
  vaccines,
  batches,
  immunizations,
  inventory,
  allUsers,
  onCallTicket,
  onGenerateTicket,
  onUpdateAppointmentStatus,
  onRecordVaccination,
  onCreateAnnouncement,
}) => {
  const [activeSection, setActiveSection] = useState<'queue' | 'agenda' | 'vaccines' | 'inventory' | 'announcements'>('queue');
  const [selectedUnitId, setSelectedUnitId] = useState(healthUnits[0]?.id || '');
  const [deskNumber, setDeskNumber] = useState('Guichê 01');

  // Estado para emissão de senha presencial
  const [ticketCitizenName, setTicketCitizenName] = useState('');
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>('NORMAL');
  const [ticketServiceId, setTicketServiceId] = useState(services[0]?.id || '');

  // Estado para aplicação de vacina
  const [vacCitizenId, setVacCitizenId] = useState(allUsers.find((u) => u.role === 'CITIZEN')?.id || '');
  const [vacVaccineId, setVacVaccineId] = useState(vaccines[0]?.id || '');
  const [vacBatchId, setVacBatchId] = useState(batches[0]?.id || '');
  const [vacDoseNumber, setVacDoseNumber] = useState('Dose Reforço');
  const [vacNotes, setVacNotes] = useState('');
  const [vacSuccess, setVacSuccess] = useState(false);
  const [vacError, setVacError] = useState<string | null>(null);

  // Estado para comunicado
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annUrgent, setAnnUrgent] = useState(false);
  const [annSuccess, setAnnSuccess] = useState(false);

  const currentUnit = healthUnits.find((u) => u.id === selectedUnitId) || healthUnits[0];

  // Filtra agendamentos da unidade
  const unitAppointments = appointments.filter((a) => a.healthUnitId === selectedUnitId);
  const unitQueue = queue.filter((q) => q.healthUnitId === selectedUnitId);

  const handleCall = async (ticketId: string) => {
    playTicketChime();
    await onCallTicket(ticketId, deskNumber);
  };

  const handleGenerateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCitizenName) return;
    await onGenerateTicket({
      healthUnitId: selectedUnitId,
      serviceId: ticketServiceId,
      priorityType: ticketPriority,
      citizenName: ticketCitizenName,
    });
    setTicketCitizenName('');
  };

  const handleVaccinateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVacError(null);
    const citizen = allUsers.find((u) => u.id === vacCitizenId);
    if (!citizen) return;

    try {
      await onRecordVaccination({
        citizenId: citizen.id,
        citizenName: citizen.fullName,
        vaccineId: vacVaccineId,
        batchId: vacBatchId,
        doseNumber: vacDoseNumber,
        healthUnitId: selectedUnitId,
        notes: vacNotes,
      });
      setVacSuccess(true);
      setVacNotes('');
      setTimeout(() => setVacSuccess(false), 4000);
    } catch (err: any) {
      setVacError(err.message || 'Falha ao registrar vacinação.');
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    await onCreateAnnouncement({
      healthUnitId: selectedUnitId,
      title: annTitle,
      content: annContent,
      category: 'GERAL',
      isUrgent: annUrgent,
    });
    setAnnTitle('');
    setAnnContent('');
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Banner da UBS */}
      <section className="bg-slate-900 text-white px-4 py-5 sm:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-teal-400 font-mono mb-1">
              <span>Painel Operacional da Unidade</span>
              <span>·</span>
              <span>CNES: {currentUnit?.cnesCode}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{currentUnit?.name}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Horário de funcionamento: {currentUnit?.openingTime} às {currentUnit?.closingTime} · Operador: {currentUser.fullName} ({currentUser.role})
            </p>
          </div>

          {/* Seletor de Unidade Básica */}
          <div className="flex items-center gap-3">
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 font-semibold focus:ring-1 focus:ring-sky-500"
            >
              {healthUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.popularName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Menu de Sub-Módulos da UBS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 mb-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveSection('queue')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
              activeSection === 'queue' ? 'bg-sky-700 text-white shadow-xs' : 'bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Fila & Triagem ({unitQueue.filter((q) => q.status === 'AGUARDANDO').length})</span>
          </button>

          <button
            onClick={() => setActiveSection('agenda')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
              activeSection === 'agenda' ? 'bg-sky-700 text-white shadow-xs' : 'bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda do Dia ({unitAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('vaccines')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
              activeSection === 'vaccines' ? 'bg-sky-700 text-white shadow-xs' : 'bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Syringe className="w-4 h-4" />
            <span>Sala de Vacinas</span>
          </button>

          <button
            onClick={() => setActiveSection('inventory')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
              activeSection === 'inventory' ? 'bg-sky-700 text-white shadow-xs' : 'bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Estoque & Insumos</span>
          </button>

          <button
            onClick={() => setActiveSection('announcements')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
              activeSection === 'announcements' ? 'bg-sky-700 text-white shadow-xs' : 'bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Avisos Oficiais</span>
          </button>
        </div>

        {/* 1. SEÇÃO: FILA & TRIAGEM DE ATENDIMENTO */}
        {activeSection === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna da Esquerda: Fila ao Vivo e Ação de Chamar */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Senhas em Espera na Unidade</h3>
                    <p className="text-xs text-slate-500">Ordenadas por prioridade legal e horário de chegada.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Meu Ponto:</span>
                    <input
                      type="text"
                      value={deskNumber}
                      onChange={(e) => setDeskNumber(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold w-28"
                    />
                  </div>
                </div>

                {unitQueue.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    Nenhuma senha gerada no momento.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {unitQueue.map((entry) => (
                      <div
                        key={entry.id}
                        className="py-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-base font-black px-2.5 py-1 rounded-lg ${
                              entry.priorityType !== 'NORMAL'
                                ? 'bg-teal-100 text-teal-900'
                                : 'bg-slate-100 text-slate-900'
                            }`}
                          >
                            {entry.ticketNumber}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{entry.citizenNameMasked}</span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                ({formatPriority(entry.priorityType)})
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {entry.serviceName} · Chegada às {entry.createdAt}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {entry.status === 'AGUARDANDO' ? (
                            <button
                              onClick={() => handleCall(entry.id)}
                              className="flex items-center gap-1 bg-sky-700 hover:bg-sky-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                            >
                              <Radio className="w-3.5 h-3.5" />
                              <span>Chamar</span>
                            </button>
                          ) : (
                            <span className="text-slate-400 font-medium text-[11px]">
                              Chamado às {entry.calledAt} ({entry.deskNumber})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Coluna da Direita: Terminal de Emissão de Senha na Recepção */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Emitir Senha Presencial</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Cadastre o cidadão no balcão da triagem e imprima a senha.
                </p>

                <form onSubmit={handleGenerateTicketSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nome do Cidadão:</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome completo..."
                      value={ticketCitizenName}
                      onChange={(e) => setTicketCitizenName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Classificação de Prioridade:</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as TicketPriority)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                    >
                      <option value="NORMAL">Normal (Geral)</option>
                      <option value="PRIORIDADE_IDOSO_60">Prioridade Idoso (60 a 79 anos)</option>
                      <option value="PRIORIDADE_IDOSO_80">Prioridade Especial (80+ anos - Lei 13.466)</option>
                      <option value="PRIORIDADE_GESTANTE_LACTANTE">Gestante / Lactante</option>
                      <option value="PRIORIDADE_PCD">Pessoa com Deficiência (PCD)</option>
                      <option value="EMERGENCIA_ACOLHIMENTO">Acolhimento com Classificação de Risco</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Destino / Setor:</label>
                    <select
                      value={ticketServiceId}
                      onChange={(e) => setTicketServiceId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl transition text-xs mt-2"
                  >
                    Gerar e Imprimir Senha
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 2. SEÇÃO: AGENDA DO DIA NA RECEPÇÃO */}
        {activeSection === 'agenda' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Agendamentos Marcados para Hoje</h3>
                <p className="text-xs text-slate-500">Realize o check-in na chegada do paciente ou registre falta.</p>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold">
                Total do Dia: {unitAppointments.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-2.5 px-3">Horário</th>
                    <th className="py-2.5 px-3">Cidadão</th>
                    <th className="py-2.5 px-3">Serviço</th>
                    <th className="py-2.5 px-3">Profissional</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Ações da Recepção</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {unitAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {apt.appointmentTime}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{apt.citizenName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">CPF: {apt.citizenCpfMasked}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{apt.serviceName}</td>
                      <td className="py-3 px-3 text-slate-600">{apt.professionalName || 'Não especificado'}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            apt.status === 'CONFIRMADO'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'CHECK_IN'
                              ? 'bg-sky-100 text-sky-800'
                              : apt.status === 'CONCLUIDO'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                        {apt.status === 'CONFIRMADO' && (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'CHECK_IN')}
                            className="bg-sky-700 hover:bg-sky-800 text-white font-bold px-2.5 py-1 rounded-md text-[11px] transition"
                          >
                            Realizar Check-in
                          </button>
                        )}
                        {apt.status === 'CHECK_IN' && (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'CONCLUIDO', 'Atendido pela equipe')}
                            className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-2.5 py-1 rounded-md text-[11px] transition"
                          >
                            Finalizar Consulta
                          </button>
                        )}
                        {['CONFIRMADO', 'CHECK_IN'].includes(apt.status) && (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'NAO_COMPARECEU', 'Paciente não se apresentou no horário previsto.')}
                            className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md font-semibold text-[11px]"
                          >
                            Falta
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. SEÇÃO: SALA DE VACINAS */}
        {activeSection === 'vaccines' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário de Aplicação */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Registrar Aplicação de Dose</h3>
              <p className="text-xs text-slate-500">
                Baixa automática no estoque do lote com conferência de lote e validade.
              </p>

              {vacSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vacinação registrada e lote atualizado com sucesso.</span>
                </div>
              )}

              {vacError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{vacError}</span>
                </div>
              )}

              <form onSubmit={handleVaccinateSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cidadão:</label>
                  <select
                    value={vacCitizenId}
                    onChange={(e) => setVacCitizenId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  >
                    {allUsers
                      .filter((u) => u.role === 'CITIZEN')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.fullName} (CPF: {c.cpf})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vacina / Imunobiológico:</label>
                  <select
                    value={vacVaccineId}
                    onChange={(e) => setVacVaccineId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  >
                    {vaccines.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.manufacturer})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lote Ativo:</label>
                  <select
                    value={vacBatchId}
                    onChange={(e) => setVacBatchId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchNumber} · Val: {b.expiryDate} (Restam: {b.remainingDoses} doses)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dose:</label>
                  <select
                    value={vacDoseNumber}
                    onChange={(e) => setVacDoseNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  >
                    <option value="1ª Dose">1ª Dose</option>
                    <option value="2ª Dose">2ª Dose</option>
                    <option value="Dose Reforço">Dose Reforço</option>
                    <option value="Dose Única">Dose Única</option>
                    <option value="Campanha 2026">Campanha Anual 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Observações clínicas (opcional):</label>
                  <input
                    type="text"
                    placeholder="Ex: Deltoide esquerdo, lote conferido..."
                    value={vacNotes}
                    onChange={(e) => setVacNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition text-xs"
                >
                  Confirmar Aplicação no SUS
                </button>
              </form>
            </div>

            {/* Lista de Aplicações Recentes */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Histórico de Imunizações da Unidade</h3>
                <span className="text-[11px] text-slate-500 font-mono">Total: {immunizations.length}</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {immunizations.map((im) => (
                  <div key={im.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{im.citizenName}</span>
                        <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-md text-[10px]">
                          {im.vaccineName} ({im.doseNumber})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Lote: <strong className="font-mono text-slate-700">{im.batchNumber}</strong> · Aplicador: {im.professionalName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-slate-700">
                        {new Date(im.administeredAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{im.protocol}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. SEÇÃO: ESTOQUE E INSUMOS */}
        {activeSection === 'inventory' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Gestão de Medicamentos e Insumos da UBS</h3>
                <p className="text-xs text-slate-500">Monitoramento de estoque mínimo e validade de lotes.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Item / Descrição</th>
                    <th className="py-2.5 px-3">Categoria</th>
                    <th className="py-2.5 px-3">Qtd Atual</th>
                    <th className="py-2.5 px-3">Estoque Mínimo</th>
                    <th className="py-2.5 px-3 text-right">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item) => {
                    const isLow = item.currentQuantity < item.minimumQuantity;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">{item.code}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{item.name}</td>
                        <td className="py-3 px-3 text-slate-600">{item.category}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {item.currentQuantity} {item.unitMeasure}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500">
                          {item.minimumQuantity} {item.unitMeasure}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-md text-[10px]">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Estoque Crítico</span>
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. SEÇÃO: COMUNICADOS DA UNIDADE */}
        {activeSection === 'announcements' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs max-w-2xl mx-auto space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Publicar Novo Comunicado Oficial</h3>
            <p className="text-xs text-slate-500">
              O comunicado será exibido imediatamente na página inicial dos cidadãos vinculados a esta UBS.
            </p>

            {annSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Aviso publicado com sucesso na plataforma.</span>
              </div>
            )}

            <form onSubmit={handleAnnouncementSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título do Comunicado:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Horário especial de atendimento no feriado"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Conteúdo da mensagem:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Instruções claras para a comunidade..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={annUrgent}
                  onChange={(e) => setAnnUrgent(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="urgentCheck" className="text-slate-700 font-semibold cursor-pointer">
                  Marcar como URGENTE / Prioritário
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-2.5 rounded-xl transition text-xs"
              >
                Publicar Comunicado
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

function formatPriority(priority: string): string {
  switch (priority) {
    case 'PRIORIDADE_IDOSO_60':
      return 'Idoso 60+';
    case 'PRIORIDADE_IDOSO_80':
      return 'Prioridade 80+';
    case 'PRIORIDADE_GESTANTE_LACTANTE':
      return 'Gestante/Lactante';
    case 'PRIORIDADE_PCD':
      return 'PCD';
    case 'EMERGENCIA_ACOLHIMENTO':
      return 'Emergência/Acolhimento';
    default:
      return 'Normal';
  }
}
