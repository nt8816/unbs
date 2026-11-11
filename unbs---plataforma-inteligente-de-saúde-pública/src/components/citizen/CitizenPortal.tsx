import React, { useState } from 'react';
import {
  User,
  HealthUnit,
  Service,
  Appointment,
  AppointmentSlot,
  ImmunizationRecord,
  QueueEntry,
  Announcement,
  ServiceRequest,
} from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  User as UserIcon,
  PlusCircle,
  XCircle,
  Send,
  Printer,
  ChevronRight,
  ShieldAlert,
  Ticket,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CitizenPortalProps {
  currentUser: User;
  healthUnits: HealthUnit[];
  services: Service[];
  appointments: Appointment[];
  slots: AppointmentSlot[];
  immunizations: ImmunizationRecord[];
  queue: QueueEntry[];
  announcements: Announcement[];
  requests: ServiceRequest[];
  onBookAppointment: (data: {
    citizenId: string;
    citizenName: string;
    citizenCpf: string;
    healthUnitId: string;
    serviceId: string;
    slotDate: string;
    slotTime: string;
    professionalId?: string;
  }) => Promise<void>;
  onCancelAppointment: (id: string, reason: string) => Promise<void>;
  onCreateRequest: (data: {
    citizenId: string;
    citizenName: string;
    healthUnitId: string;
    category: string;
    title: string;
    description: string;
  }) => Promise<void>;
  onTakeVirtualTicket: (serviceId: string, priorityType: any) => Promise<void>;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  currentUser,
  healthUnits,
  services,
  appointments,
  slots,
  immunizations,
  queue,
  announcements,
  requests,
  onBookAppointment,
  onCancelAppointment,
  onCreateRequest,
  onTakeVirtualTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'appointments' | 'vaccines' | 'queue' | 'requests' | 'profile'>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState<string>(healthUnits[0]?.id || '');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Modal de cancelamento
  const [cancelingAptId, setCancelingAptId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Formulário de nova solicitação
  const [reqCategory, setReqCategory] = useState('DUVIDA');
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqSuccess, setReqSuccess] = useState(false);

  // Meus agendamentos filtrados
  const myAppointments = appointments.filter((a) => a.citizenId === currentUser.id);
  const nextAppointment = myAppointments.find(
    (a) => !['CANCELADO', 'CONCLUIDO', 'NAO_COMPARECEU'].includes(a.status)
  );

  // Minhas vacinas filtradas
  const myVaccines = immunizations.filter((im) => im.citizenId === currentUser.id);

  // Minha senha na fila (se houver)
  const myTicket = queue.find(
    (q) => q.citizenNameMasked.toLowerCase().includes(currentUser.fullName.split(' ')[0].toLowerCase()) &&
      ['AGUARDANDO', 'CHAMADO'].includes(q.status)
  );

  // Slots filtrados para a etapa de seleção de horário
  const availableSlots = slots.filter(
    (s) =>
      s.healthUnitId === selectedUnit &&
      s.serviceId === selectedService &&
      s.slotDate === selectedDate &&
      !s.isBooked
  );

  // Datas disponíveis para o serviço selecionado
  const availableDates = Array.from(
    new Set(
      slots
        .filter((s) => s.healthUnitId === selectedUnit && s.serviceId === selectedService && !s.isBooked)
        .map((s) => s.slotDate)
    )
  ).sort();

  const handleFinishBooking = async () => {
    setBookingLoading(true);
    setBookingError(null);
    try {
      await onBookAppointment({
        citizenId: currentUser.id,
        citizenName: currentUser.fullName,
        citizenCpf: currentUser.cpf,
        healthUnitId: selectedUnit,
        serviceId: selectedService,
        slotDate: selectedDate,
        slotTime: selectedTime,
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setIsBookingOpen(false);
      setBookingStep(1);
      setSelectedService('');
      setSelectedDate('');
      setSelectedTime('');
    } catch (err: any) {
      setBookingError(err.message || 'Falha ao concluir agendamento.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelingAptId) return;
    await onCancelAppointment(cancelingAptId, cancelReason);
    setCancelingAptId(null);
    setCancelReason('');
  };

  const handleCreateRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle || !reqDesc) return;
    await onCreateRequest({
      citizenId: currentUser.id,
      citizenName: currentUser.fullName,
      healthUnitId: selectedUnit || healthUnits[0].id,
      category: reqCategory,
      title: reqTitle,
      description: reqDesc,
    });
    setReqTitle('');
    setReqDesc('');
    setReqSuccess(true);
    setTimeout(() => setReqSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      {/* Cabeçalho do Cidadão Mobile-First */}
      <section className="bg-gradient-to-r from-sky-700 via-sky-800 to-teal-800 text-white px-4 py-6 sm:px-8 sm:py-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-200 mb-1">
              <span>SUS Cidadão</span>
              <span>·</span>
              <span className="font-mono">CNS: {currentUser.cns}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Olá, {currentUser.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-300" />
              <span>Sua unidade de referência: <strong>UBS Dr. Arnaldo Ribeiro (Centro)</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setBookingStep(1);
                setIsBookingOpen(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-sky-800 hover:bg-sky-50 font-bold px-4 py-2.5 rounded-xl shadow-sm text-xs sm:text-sm transition"
            >
              <PlusCircle className="w-4 h-4 text-sky-600" />
              <span>Novo Agendamento</span>
            </button>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal com Abas */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* TABS DESKTOP */}
        <div className="hidden md:flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'home' ? 'bg-sky-100 text-sky-800' : 'hover:bg-slate-100'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'appointments' ? 'bg-sky-100 text-sky-800' : 'hover:bg-slate-100'
            }`}
          >
            Meus Agendamentos ({myAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('vaccines')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'vaccines' ? 'bg-sky-100 text-sky-800' : 'hover:bg-slate-100'
            }`}
          >
            Carteira de Vacinação ({myVaccines.length})
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'queue' ? 'bg-sky-100 text-sky-800' : 'hover:bg-slate-100'
            }`}
          >
            Fila Virtual {myTicket && <span className="bg-teal-500 text-white px-1.5 py-0.2 rounded-full text-[10px] ml-1">1</span>}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'requests' ? 'bg-sky-100 text-sky-800' : 'hover:bg-slate-100'
            }`}
          >
            Solicitações & Ouvidoria
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'profile' ? 'bg-sky-100 text-sky-800' : 'hover:bg-slate-100'
            }`}
          >
            Meu Perfil
          </button>
        </div>

        {/* ABA: INÍCIO */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Próximo Atendimento em Destaque */}
            {nextAppointment ? (
              <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-sky-700 font-semibold mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <span>Próximo Atendimento Confirmado</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    Protocolo: {nextAppointment.protocol}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {nextAppointment.serviceName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {nextAppointment.professionalName || 'Equipe da Unidade'} · {nextAppointment.healthUnitName}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {nextAppointment.appointmentDate}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {nextAppointment.appointmentTime}
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        ✓ {nextAppointment.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setCancelingAptId(nextAppointment.id)}
                      className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Comprovante</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                <p className="text-sm text-slate-600 font-medium">Você não possui consultas agendadas no momento.</p>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl border border-sky-200 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Agendar Atendimento na UBS</span>
                </button>
              </div>
            )}

            {/* Acesso Rápido a Serviços */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setSelectedService('srv-clinica-geral');
                  setBookingStep(2);
                  setIsBookingOpen(true);
                }}
                className="bg-white border border-slate-200 hover:border-sky-300 p-4 rounded-xl text-left transition group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold mb-2 group-hover:bg-sky-600 group-hover:text-white transition">
                  🩺
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Consulta Médica</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Clínica geral e rotina</p>
              </button>

              <button
                onClick={() => {
                  setSelectedService('srv-vacinacao');
                  setBookingStep(2);
                  setIsBookingOpen(true);
                }}
                className="bg-white border border-slate-200 hover:border-teal-300 p-4 rounded-xl text-left transition group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-2 group-hover:bg-teal-600 group-hover:text-white transition">
                  💉
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Vacinação</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Gripe, Covid e rotina</p>
              </button>

              <button
                onClick={() => {
                  setSelectedService('srv-odonto');
                  setBookingStep(2);
                  setIsBookingOpen(true);
                }}
                className="bg-white border border-slate-200 hover:border-sky-300 p-4 rounded-xl text-left transition group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mb-2 group-hover:bg-indigo-600 group-hover:text-white transition">
                  🦷
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Odontologia</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Saúde bucal e limpeza</p>
              </button>

              <button
                onClick={() => setActiveTab('vaccines')}
                className="bg-white border border-slate-200 hover:border-emerald-300 p-4 rounded-xl text-left transition group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-2 group-hover:bg-emerald-600 group-hover:text-white transition">
                  📜
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Carteira Digital</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Histórico e comprovante</p>
              </button>
            </div>

            {/* Comunicados Oficiais da Unidade */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Comunicados Oficiais da Saúde Municipal
                </h3>
                <span className="text-[11px] text-slate-400">Atualizado hoje</span>
              </div>

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-3.5 rounded-xl border text-xs ${
                      ann.isUrgent
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {ann.isUrgent && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{ann.title}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                    <div className="mt-2 text-[10px] text-slate-400 font-medium">
                      Publicado por: {ann.publishedByName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA: MEUS AGENDAMENTOS */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Histórico de Atendimentos</h2>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 px-3.5 py-2 rounded-xl transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Novo Agendamento</span>
              </button>
            </div>

            {myAppointments.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
                Nenhum agendamento registrado até o momento.
              </div>
            ) : (
              <div className="space-y-3">
                {myAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{apt.serviceName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            apt.status === 'CONFIRMADO'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'CONCLUIDO'
                              ? 'bg-sky-100 text-sky-800'
                              : apt.status === 'CANCELADO'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {apt.healthUnitName} · {apt.professionalName || 'Profissional da UBS'}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-mono">
                        <span>Data: {apt.appointmentDate} às {apt.appointmentTime}</span>
                        <span>·</span>
                        <span>Protocolo: {apt.protocol}</span>
                      </div>
                      {apt.attendanceNotes && (
                        <p className="mt-2 text-xs bg-slate-50 p-2 rounded-md text-slate-700 border border-slate-100">
                          <strong>Observações da equipe:</strong> {apt.attendanceNotes}
                        </p>
                      )}
                    </div>

                    {apt.status === 'CONFIRMADO' && (
                      <button
                        onClick={() => setCancelingAptId(apt.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 self-start sm:self-auto"
                      >
                        Cancelar Horário
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA: CARTEIRA DE VACINAÇÃO DIGITAL */}
        {activeTab === 'vaccines' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-emerald-800 text-white p-4 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-200">
                  Cartão Nacional de Imunização SUS
                </span>
                <h2 className="text-base sm:text-lg font-bold">Registro de Vacinas Rastreáveis</h2>
                <p className="text-xs text-emerald-100">Rastreabilidade completa de lote, unidade e aplicador.</p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-white text-emerald-900 font-bold px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Imprimir Certificado</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs">
              {myVaccines.map((v) => (
                <div key={v.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-sm text-slate-900">{v.vaccineName}</span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {v.doseNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                      <p>Lote: <strong className="font-mono text-slate-800">{v.batchNumber}</strong> · Unidade: {v.healthUnitName}</p>
                      <p>Vacinador: {v.professionalName}</p>
                      {v.notes && <p className="text-slate-500 italic">{v.notes}</p>}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-xs font-bold text-slate-700">
                      {new Date(v.administeredAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {v.protocol}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Alerta PNI de Próximas Doses Recomendadas */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900">
              <h4 className="font-bold text-sky-950 flex items-center gap-1.5 mb-1">
                <span>🛡️</span>
                <span>Orientações do Programa Nacional de Imunizações (PNI)</span>
              </h4>
              <p className="text-slate-700 leading-relaxed">
                As doses anuais de vacina contra a gripe (Influenza) e reforços de Covid-19 estão disponíveis para grupos prioritários e população geral na sua UBS de referência. Em caso de dúvidas, consulte a equipe de enfermagem.
              </p>
            </div>
          </div>
        )}

        {/* ABA: FILA VIRTUAL */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
              {myTicket ? (
                <div className="max-w-md mx-auto space-y-3">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase">
                    Sua Senha Ativa
                  </span>
                  <div className="text-5xl font-black font-mono text-slate-900 tracking-wider">
                    {myTicket.ticketNumber}
                  </div>
                  <p className="text-xs font-semibold text-slate-600">
                    Setor: {myTicket.serviceName}
                  </p>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                    {myTicket.status === 'CHAMADO' ? (
                      <span className="text-rose-700 font-bold text-sm animate-pulse">
                        🔔 DIRIGIR-SE AO: {myTicket.deskNumber || 'GUICHÊ 01'}
                      </span>
                    ) : (
                      <span>Você está aguardando na fila. Fique atento ao painel sonoro.</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Ticket className="w-10 h-10 text-sky-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">Retirar Senha Virtual de Atendimento</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Se você já está a caminho ou nas imediações da UBS Central, pode retirar sua senha de triagem com antecedência.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <button
                      onClick={() => onTakeVirtualTicket('srv-clinica-geral', 'NORMAL')}
                      className="text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-xl transition"
                    >
                      Senha Normal - Clínica
                    </button>
                    <button
                      onClick={() => onTakeVirtualTicket('srv-clinica-geral', 'PRIORIDADE_IDOSO_60')}
                      className="text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl transition"
                    >
                      Senha Prioritária (60+ / PCD / Gestante)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA: SOLICITAÇÕES E OUVIDORIA */}
        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formulário */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Nova Solicitação ou Ouvidoria</h3>
              <p className="text-xs text-slate-500 mb-4">
                Envie dúvidas sobre exames, pedidos de atualização de dados, sugestões ou elogios para a equipe da UBS.
              </p>

              {reqSuccess && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sua manifestação foi protocolada com sucesso e será analisada pela equipe da unidade.</span>
                </div>
              )}

              <form onSubmit={handleCreateRequestSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoria:</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="DUVIDA">Dúvida sobre Atendimento / Exames</option>
                    <option value="ATUALIZACAO_CADASTRO">Atualização Cadastral (Endereço/Telefone)</option>
                    <option value="ELOGIO">Elogio à Equipe</option>
                    <option value="SUGESTAO">Sugestão de Melhoria</option>
                    <option value="RECLAMACAO">Reclamação Operacional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Título:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Confirmação de disponibilidade de medicamento"
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Descrição detalhada:</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Descreva com clareza sua necessidade..."
                    value={reqDesc}
                    onChange={(e) => setReqDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2.5 rounded-xl transition text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Solicitação Oficial</span>
                </button>
              </form>
            </div>

            {/* Lista de Minhas Solicitações */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Acompanhamento por Protocolo</h3>
              {requests.map((r) => (
                <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-4 text-xs shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                    <span className="font-mono font-bold text-sky-800">{r.protocol}</span>
                    <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md font-semibold">
                      {r.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">{r.title}</h4>
                  <p className="text-slate-600 mb-2 leading-relaxed">{r.description}</p>
                  {r.responseNotes && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                      <strong className="text-emerald-700">Resposta da UBS:</strong> {r.responseNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: PERFIL */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-sky-600" />
              <span>Dados Cadastrais do Cidadão (SUS)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Nome Completo:</span>
                <span className="font-bold text-slate-900">{currentUser.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">CPF:</span>
                <span className="font-bold font-mono text-slate-900">{currentUser.cpf}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Cartão Nacional de Saúde (CNS):</span>
                <span className="font-bold font-mono text-slate-900">{currentUser.cns}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Data de Nascimento:</span>
                <span className="font-bold text-slate-900">{currentUser.birthDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Telefone de Contato:</span>
                <span className="font-bold text-slate-900">{currentUser.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">E-mail:</span>
                <span className="font-bold text-slate-900">{currentUser.email}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Protegido pela Lei Geral de Proteção de Dados (LGPD).</span>
              <span className="text-emerald-700 font-semibold">● Cadastro Ativo no SUS</span>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: WIZARD DE AGENDAMENTO (6 ETAPAS CONFORME SEÇÃO 9) */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-700">Agendamento Online</span>
                <h3 className="text-base font-bold text-slate-900">
                  Etapa {bookingStep} de 5: {getStepTitle(bookingStep)}
                </h3>
              </div>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {bookingError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Etapa 1: Escolher UBS */}
              {bookingStep === 1 && (
                <div className="space-y-3">
                  <p className="text-slate-600">Selecione a Unidade Básica de Saúde para atendimento:</p>
                  {healthUnits.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setSelectedUnit(u.id);
                        setBookingStep(2);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                        selectedUnit === u.id
                          ? 'border-sky-600 bg-sky-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-slate-900">{u.name}</h4>
                        <p className="text-slate-500 text-[11px] mt-0.5">{u.address} · {u.neighborhood}</p>
                        <span className="text-[10px] text-slate-400 font-mono">CNES: {u.cnesCode}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Etapa 2: Escolher Serviço */}
              {bookingStep === 2 && (
                <div className="space-y-3">
                  <p className="text-slate-600">Escolha o serviço desejado:</p>
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedService(s.id);
                        setBookingStep(3);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                        selectedService === s.id
                          ? 'border-sky-600 bg-sky-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-slate-900">{s.name}</h4>
                        <p className="text-slate-500 text-[11px] mt-0.5">{s.description}</p>
                        <span className="text-[10px] text-teal-700 font-semibold">Duração aproximada: {s.durationMinutes} min</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Etapa 3: Escolher Data Disponível */}
              {bookingStep === 3 && (
                <div className="space-y-3">
                  <p className="text-slate-600">Datas com vagas oficiais cadastradas:</p>
                  {availableDates.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                      Não há vagas disponíveis para este serviço nos próximos 7 dias.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableDates.map((date) => (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDate(date);
                            setBookingStep(4);
                          }}
                          className={`p-3 rounded-xl border text-center font-bold transition ${
                            selectedDate === date
                              ? 'border-sky-600 bg-sky-600 text-white'
                              : 'border-slate-200 hover:border-sky-400 text-slate-800'
                          }`}
                        >
                          <Calendar className="w-4 h-4 mx-auto mb-1 opacity-75" />
                          <span>{date}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Etapa 4: Escolher Horário Disponível */}
              {bookingStep === 4 && (
                <div className="space-y-3">
                  <p className="text-slate-600">Selecione o horário disponível na data {selectedDate}:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => {
                          setSelectedTime(slot.slotTime);
                          setBookingStep(5);
                        }}
                        className={`p-2.5 rounded-xl border text-center font-bold font-mono transition ${
                          selectedTime === slot.slotTime
                            ? 'border-sky-600 bg-sky-600 text-white'
                            : 'border-slate-200 hover:border-sky-400 text-slate-800'
                        }`}
                      >
                        {slot.slotTime}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Etapa 5: Confirmação e Regras de Comparecimento */}
              {bookingStep === 5 && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm">Resumo da Confirmação</h4>
                  <div className="space-y-1 text-slate-700">
                    <p><strong>Cidadão:</strong> {currentUser.fullName} (CPF: {currentUser.cpf})</p>
                    <p><strong>Serviço:</strong> {services.find((s) => s.id === selectedService)?.name}</p>
                    <p><strong>Unidade:</strong> {healthUnits.find((u) => u.id === selectedUnit)?.name}</p>
                    <p><strong>Data & Horário:</strong> {selectedDate} às {selectedTime}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg text-[11px] mt-2">
                    ⚠️ Chegue com 15 minutos de antecedência. Em caso de imprevisto, cancele o agendamento pelo aplicativo para liberar a vaga para outro cidadão.
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              {bookingStep > 1 ? (
                <button
                  onClick={() => setBookingStep((s) => s - 1)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Voltar
                </button>
              ) : (
                <div />
              )}

              {bookingStep === 5 && (
                <button
                  disabled={bookingLoading}
                  onClick={handleFinishBooking}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition disabled:opacity-50"
                >
                  {bookingLoading ? 'Confirmando...' : 'Finalizar Agendamento'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CANCELAMENTO COM JUSTIFICATIVA AUDITADA */}
      {cancelingAptId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Cancelar Agendamento</h3>
            <p className="text-xs text-slate-600">
              Ao cancelar, sua vaga será imediatamente disponibilizada para outros usuários da rede SUS.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo do cancelamento:</label>
              <textarea
                rows={3}
                placeholder="Ex: Conflito de horário de trabalho, melhora dos sintomas, etc."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelingAptId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Manter Agendamento
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR MOBILE FIRST PARA CIDADÃO */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-2 px-3 flex items-center justify-around text-[10px] font-semibold text-slate-500 shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-sky-700 font-bold' : ''}`}
        >
          <span>🏠</span>
          <span>Início</span>
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'appointments' ? 'text-sky-700 font-bold' : ''}`}
        >
          <span>📅</span>
          <span>Agenda</span>
        </button>
        <button
          onClick={() => setActiveTab('vaccines')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'vaccines' ? 'text-sky-700 font-bold' : ''}`}
        >
          <span>💉</span>
          <span>Vacinas</span>
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'queue' ? 'text-sky-700 font-bold' : ''}`}
        >
          <span>🎫</span>
          <span>Fila</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'profile' ? 'text-sky-700 font-bold' : ''}`}
        >
          <span>👤</span>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return 'Selecionar Unidade Básica';
    case 2:
      return 'Escolher Especialidade';
    case 3:
      return 'Selecionar Data';
    case 4:
      return 'Selecionar Horário';
    case 5:
      return 'Confirmação e Orientações';
    default:
      return '';
  }
}
