import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import {
  User,
  Municipality,
  HealthUnit,
  Service,
  Appointment,
  AppointmentSlot,
  QueueEntry,
  Vaccine,
  VaccineBatch,
  ImmunizationRecord,
  InventoryItem,
  Announcement,
  ServiceRequest,
  MunicipalKpis,
  AuditLog,
  TicketPriority,
} from './types';
import { Header } from './components/common/Header';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { UbsPanel } from './components/ubs/UbsPanel';
import { TvCallPanel } from './components/queue/TvCallPanel';
import { SecretariaPanel } from './components/secretaria/SecretariaPanel';
import { PlatformAdminPanel } from './components/platform/PlatformAdminPanel';
import { TccResearchView } from './components/tcc/TccResearchView';
import { WifiOff, Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<string>('citizen');
  const [highContrast, setHighContrast] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Dados Centrais da Aplicação
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [healthUnits, setHealthUnits] = useState<HealthUnit[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [batches, setBatches] = useState<VaccineBatch[]>([]);
  const [immunizations, setImmunizations] = useState<ImmunizationRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [kpis, setKpis] = useState<MunicipalKpis | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Monitoramento de Conexão (PWA / Offline)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Carga Inicial dos Dados
  const loadData = async () => {
    try {
      const [
        fetchedUsers,
        fetchedMun,
        fetchedUnits,
        fetchedServices,
        fetchedApts,
        fetchedSlots,
        fetchedQueue,
        fetchedVaccines,
        fetchedBatches,
        fetchedImm,
        fetchedInv,
        fetchedAnn,
        fetchedReq,
        fetchedKpis,
        fetchedAudit,
      ] = await Promise.all([
        api.getUsers(),
        api.getMunicipalities(),
        api.getHealthUnits(),
        api.getServices(),
        api.getAppointments(),
        api.getSlots(),
        api.getQueue(),
        api.getVaccines(),
        api.getVaccineBatches(),
        api.getImmunizations(),
        api.getInventory(),
        api.getAnnouncements(),
        api.getRequests(),
        api.getMunicipalKpis(),
        api.getAuditLogs(),
      ]);

      setUsers(fetchedUsers);
      if (!currentUser) {
        setCurrentUser(fetchedUsers[0]); // Maria Aparecida da Silva (Cidadão)
      }
      setMunicipalities(fetchedMun);
      setHealthUnits(fetchedUnits);
      setServices(fetchedServices);
      setAppointments(fetchedApts);
      setSlots(fetchedSlots);
      setQueue(fetchedQueue);
      setVaccines(fetchedVaccines);
      setBatches(fetchedBatches);
      setImmunizations(fetchedImm);
      setInventory(fetchedInv);
      setAnnouncements(fetchedAnn);
      setRequests(fetchedReq);
      setKpis(fetchedKpis);
      setAuditLogs(fetchedAudit);
    } catch (err) {
      console.error('[UNBS] Erro ao sincronizar dados da API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers para Ações do Cidadão e da Equipe
  const handleBookAppointment = async (data: {
    citizenId: string;
    citizenName: string;
    citizenCpf: string;
    healthUnitId: string;
    serviceId: string;
    slotDate: string;
    slotTime: string;
    professionalId?: string;
  }) => {
    await api.bookAppointment(data);
    await loadData();
  };

  const handleCancelAppointment = async (id: string, reason: string) => {
    if (!currentUser) return;
    await api.cancelAppointment(id, currentUser.id, reason);
    await loadData();
  };

  const handleUpdateAppointmentStatus = async (id: string, status: string, notes?: string) => {
    if (!currentUser) return;
    await api.updateAppointmentStatus(id, status, currentUser.id, notes);
    await loadData();
  };

  const handleGenerateTicket = async (data: {
    healthUnitId: string;
    serviceId: string;
    priorityType: TicketPriority;
    citizenName: string;
  }) => {
    await api.generateTicket(data);
    await loadData();
  };

  const handleTakeVirtualTicket = async (serviceId: string, priorityType: TicketPriority) => {
    if (!currentUser) return;
    await api.generateTicket({
      healthUnitId: healthUnits[0]?.id || 'ubs-central',
      serviceId,
      priorityType,
      citizenName: currentUser.fullName,
    });
    await loadData();
  };

  const handleCallTicket = async (ticketId: string, deskNumber: string) => {
    if (!currentUser) return;
    await api.callTicket(ticketId, deskNumber, currentUser.id);
    await loadData();
  };

  const handleRecordVaccination = async (data: {
    citizenId: string;
    citizenName: string;
    vaccineId: string;
    batchId: string;
    doseNumber: string;
    healthUnitId: string;
    notes?: string;
  }) => {
    if (!currentUser) return;
    await api.recordVaccination({
      ...data,
      staffUserId: currentUser.id,
    });
    await loadData();
  };

  const handleCreateAnnouncement = async (data: {
    healthUnitId: string;
    title: string;
    content: string;
    category: string;
    isUrgent: boolean;
  }) => {
    if (!currentUser) return;
    await api.createAnnouncement({
      municipalityId: municipalities[0]?.id || 'mun-serra-azul',
      healthUnitId: data.healthUnitId,
      title: data.title,
      content: data.content,
      category: data.category,
      isUrgent: data.isUrgent,
      publishedByName: `${currentUser.fullName} (${currentUser.role})`,
    });
    await loadData();
  };

  const handleCreateRequest = async (data: {
    citizenId: string;
    citizenName: string;
    healthUnitId: string;
    category: string;
    title: string;
    description: string;
  }) => {
    await api.createRequest(data);
    await loadData();
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center font-black text-2xl mb-4 shadow-lg">
          +
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white mb-2">UNBS</h1>
        <p className="text-xs text-sky-300 flex items-center gap-2 font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Carregando plataforma de saúde pública...</span>
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${highContrast ? 'contrast-125 saturate-150' : ''}`}>
      {/* Indicador de Conectividade / Modo Offline */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-pulse">
          <WifiOff className="w-4 h-4" />
          <span>Modo Offline — Dados em cache da UBS em uso.</span>
        </div>
      )}

      {/* Não exibe o Header comum se estiver no modo TV / Painel Público */}
      {currentTab !== 'tv' && (
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentUser={currentUser}
          users={users}
          onSelectUser={(u) => {
            setCurrentUser(u);
            // Ajusta aba inicial de acordo com o papel selecionado
            if (u.role === 'CITIZEN') setCurrentTab('citizen');
            else if (['RECEPTIONIST', 'DOCTOR', 'NURSE', 'VACCINATOR', 'UBS_MANAGER'].includes(u.role)) setCurrentTab('ubs');
            else if (u.role === 'MUNICIPAL_SECRETARY') setCurrentTab('secretaria');
            else if (u.role === 'SUPERADMIN') setCurrentTab('audit');
          }}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
        />
      )}

      {/* RENDERIZAÇÃO DA VISÃO SELECIONADA */}
      {currentTab === 'citizen' && (
        <CitizenPortal
          currentUser={currentUser}
          healthUnits={healthUnits}
          services={services}
          appointments={appointments}
          slots={slots}
          immunizations={immunizations}
          queue={queue}
          announcements={announcements}
          requests={requests}
          onBookAppointment={handleBookAppointment}
          onCancelAppointment={handleCancelAppointment}
          onCreateRequest={handleCreateRequest}
          onTakeVirtualTicket={handleTakeVirtualTicket}
        />
      )}

      {currentTab === 'ubs' && (
        <UbsPanel
          currentUser={currentUser}
          healthUnits={healthUnits}
          services={services}
          appointments={appointments}
          queue={queue}
          vaccines={vaccines}
          batches={batches}
          immunizations={immunizations}
          inventory={inventory}
          allUsers={users}
          onCallTicket={handleCallTicket}
          onGenerateTicket={handleGenerateTicket}
          onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          onRecordVaccination={handleRecordVaccination}
          onCreateAnnouncement={handleCreateAnnouncement}
        />
      )}

      {currentTab === 'tv' && (
        <div>
          {/* Barra de Retorno da TV */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
            <span>📺 Visualização de Painel Público de TV da Recepção</span>
            <button
              onClick={() => setCurrentTab('ubs')}
              className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-lg text-xs font-semibold"
            >
              Voltar ao Painel da UBS
            </button>
          </div>
          <TvCallPanel queue={queue} currentUnit={healthUnits[0]} />
        </div>
      )}

      {currentTab === 'secretaria' && kpis && (
        <SecretariaPanel
          kpis={kpis}
          healthUnits={healthUnits}
          auditLogs={auditLogs}
          currentUser={currentUser}
        />
      )}

      {currentTab === 'audit' && (
        <PlatformAdminPanel
          auditLogs={auditLogs}
          municipalities={municipalities}
          healthUnits={healthUnits}
        />
      )}

      {currentTab === 'tcc' && <TccResearchView />}
    </div>
  );
};
export default App;
