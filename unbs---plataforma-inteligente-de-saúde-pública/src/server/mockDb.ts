// ==============================================================================
// UNBS - Banco de Dados de Demonstração e Camada de Domínio / Regras de Negócio
// ==============================================================================

import {
  Municipality,
  HealthUnit,
  Sector,
  Service,
  User,
  AppointmentSlot,
  Appointment,
  QueueEntry,
  Vaccine,
  VaccineBatch,
  ImmunizationRecord,
  InventoryItem,
  Announcement,
  ServiceRequest,
  AuditLog,
  MunicipalKpis,
  UserRole,
  TicketPriority,
} from '../types';

export class UnbsDatabase {
  municipalities: Municipality[] = [];
  healthUnits: HealthUnit[] = [];
  sectors: Sector[] = [];
  services: Service[] = [];
  users: User[] = [];
  slots: AppointmentSlot[] = [];
  appointments: Appointment[] = [];
  queue: QueueEntry[] = [];
  vaccines: Vaccine[] = [];
  batches: VaccineBatch[] = [];
  immunizations: ImmunizationRecord[] = [];
  inventory: InventoryItem[] = [];
  announcements: Announcement[] = [];
  serviceRequests: ServiceRequest[] = [];
  auditLogs: AuditLog[] = [];

  private ticketCounter = {
    NORMAL: 14,
    PRIORIDADE: 8,
  };

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Município Piloto
    const munId = 'mun-serra-azul';
    this.municipalities = [
      {
        id: munId,
        ibgeCode: '3551502',
        name: 'Serra Azul',
        state: 'SP',
        isActive: true,
      },
    ];

    // 2. Unidades Básicas de Saúde
    const ubs1Id = 'ubs-central';
    const ubs2Id = 'ubs-vila-esperanca';
    this.healthUnits = [
      {
        id: ubs1Id,
        municipalityId: munId,
        cnesCode: '2078912',
        name: 'UBS Dr. Arnaldo Ribeiro - Centro',
        popularName: 'UBS Central',
        neighborhood: 'Centro',
        address: 'Rua Marechal Deodoro, 450',
        phone: '(16) 3982-1100',
        openingTime: '07:00',
        closingTime: '19:00',
        hasPharmacy: true,
        hasVaccineRoom: true,
        hasDental: true,
        isActive: true,
      },
      {
        id: ubs2Id,
        municipalityId: munId,
        cnesCode: '2078920',
        name: 'UBS Vila Esperança - Zona Leste',
        popularName: 'UBS Esperança',
        neighborhood: 'Vila Esperança',
        address: 'Av. Brasil, 1280',
        phone: '(16) 3982-2450',
        openingTime: '07:00',
        closingTime: '17:00',
        hasPharmacy: true,
        hasVaccineRoom: true,
        hasDental: false,
        isActive: true,
      },
    ];

    // 3. Setores
    this.sectors = [
      { id: 'sec-clinica', healthUnitId: ubs1Id, name: 'Clínica Médica', code: 'MED' },
      { id: 'sec-vacina', healthUnitId: ubs1Id, name: 'Sala de Vacinação', code: 'VAC' },
      { id: 'sec-odonto', healthUnitId: ubs1Id, name: 'Odontologia', code: 'ODO' },
      { id: 'sec-enf', healthUnitId: ubs1Id, name: 'Acolhimento & Enfermagem', code: 'ENF' },
      { id: 'sec-farm', healthUnitId: ubs1Id, name: 'Farmácia Básica', code: 'FAR' },
    ];

    // 4. Serviços Oferecidos
    this.services = [
      {
        id: 'srv-clinica-geral',
        healthUnitId: ubs1Id,
        sectorId: 'sec-clinica',
        name: 'Consulta em Clínica Geral',
        description: 'Atendimento médico para queixas gerais, renovação de receitas e acompanhamento de rotina.',
        durationMinutes: 20,
        dailyCapacity: 40,
        requiresReferral: false,
        guidanceNotes: 'Trazer exames anteriores, receitas em uso e documento oficial com foto.',
        isActive: true,
      },
      {
        id: 'srv-vacinacao',
        healthUnitId: ubs1Id,
        sectorId: 'sec-vacina',
        name: 'Vacinação de Rotina e Campanhas',
        description: 'Imunização conforme Calendário Nacional do PNI (crianças, adultos, gestantes e idosos).',
        durationMinutes: 10,
        dailyCapacity: 80,
        requiresReferral: false,
        guidanceNotes: 'Apresentar caderneta de vacinação física ou digital e documento pessoal.',
        isActive: true,
      },
      {
        id: 'srv-odonto',
        healthUnitId: ubs1Id,
        sectorId: 'sec-odonto',
        name: 'Atendimento Odontológico',
        description: 'Avaliação clínica odontológica, limpeza, restauração e profilaxia bucal.',
        durationMinutes: 30,
        dailyCapacity: 16,
        requiresReferral: false,
        guidanceNotes: 'Realizar escovação prévia e trazer cartão do SUS.',
        isActive: true,
      },
      {
        id: 'srv-prenatal',
        healthUnitId: ubs1Id,
        sectorId: 'sec-enf',
        name: 'Acompanhamento Pré-Natal e Puericultura',
        description: 'Consultas de enfermagem para acompanhamento do ciclo gestacional e desenvolvimento do bebê.',
        durationMinutes: 30,
        dailyCapacity: 20,
        requiresReferral: false,
        guidanceNotes: 'Trazer cartão da gestante e exames do trimestre.',
        isActive: true,
      },
    ];

    // 5. Usuários de Demonstração (Representando os papéis da matriz RBAC)
    this.users = [
      {
        id: 'user-maria-silva',
        email: 'maria.silva@cidadao.sp.gov.br',
        fullName: 'Maria Aparecida da Silva',
        cpf: '284.912.748-03',
        cns: '708204918230004',
        birthDate: '1984-06-15',
        phone: '(16) 99742-1823',
        role: 'CITIZEN',
        municipalityId: munId,
        healthUnitId: ubs1Id,
        isActive: true,
      },
      {
        id: 'user-recep-roberto',
        email: 'roberto.recepcao@saude.serraazul.sp.gov.br',
        fullName: 'Roberto Lopes Ferreira',
        cpf: '334.819.201-44',
        cns: '708204918230099',
        birthDate: '1992-03-20',
        phone: '(16) 3982-1100',
        role: 'RECEPTIONIST',
        municipalityId: munId,
        healthUnitId: ubs1Id,
        isActive: true,
      },
      {
        id: 'user-med-mariana',
        email: 'dra.mariana@saude.serraazul.sp.gov.br',
        fullName: 'Dra. Mariana Souza Prado',
        cpf: '198.342.812-55',
        cns: '708204918230101',
        birthDate: '1986-11-04',
        phone: '(16) 99123-4567',
        role: 'DOCTOR',
        municipalityId: munId,
        healthUnitId: ubs1Id,
        councilType: 'CRM',
        councilNumber: '148293-SP',
        specialty: 'Medicina de Família e Comunidade',
        isActive: true,
      },
      {
        id: 'user-enf-carlos',
        email: 'enf.carlos@saude.serraazul.sp.gov.br',
        fullName: 'Carlos Eduardo Mendes',
        cpf: '241.983.102-66',
        cns: '708204918230102',
        birthDate: '1989-08-19',
        phone: '(16) 99234-5678',
        role: 'NURSE',
        municipalityId: munId,
        healthUnitId: ubs1Id,
        councilType: 'COREN',
        councilNumber: '451920-SP',
        specialty: 'Enfermagem em Saúde Coletiva',
        isActive: true,
      },
      {
        id: 'user-vac-anapaula',
        email: 'ana.vacinas@saude.serraazul.sp.gov.br',
        fullName: 'Ana Paula Rocha Martins',
        cpf: '394.102.834-77',
        cns: '708204918230103',
        birthDate: '1994-01-12',
        phone: '(16) 99345-6789',
        role: 'VACCINATOR',
        municipalityId: munId,
        healthUnitId: ubs1Id,
        councilType: 'COREN-TE',
        councilNumber: '89312-SP',
        specialty: 'Imunização e Rede de Frio',
        isActive: true,
      },
      {
        id: 'user-gestor-ubs',
        email: 'gestao.ubs.central@saude.serraazul.sp.gov.br',
        fullName: 'Dr. Rodrigo Albuquerque',
        cpf: '122.998.443-88',
        cns: '708204918230104',
        birthDate: '1979-05-30',
        phone: '(16) 3982-1102',
        role: 'UBS_MANAGER',
        municipalityId: munId,
        healthUnitId: ubs1Id,
        isActive: true,
      },
      {
        id: 'user-sec-saude',
        email: 'secretaria.saude@serraazul.sp.gov.br',
        fullName: 'Dra. Fernanda Vasconcelos',
        cpf: '098.765.432-11',
        cns: '708204918230105',
        birthDate: '1975-09-14',
        phone: '(16) 3982-1000',
        role: 'MUNICIPAL_SECRETARY',
        municipalityId: munId,
        isActive: true,
      },
      {
        id: 'user-superadmin',
        email: 'admin.tecnico@unbs.gov.br',
        fullName: 'Administrador da Plataforma UNBS',
        cpf: '000.000.000-00',
        cns: '700000000000000',
        birthDate: '1990-01-01',
        phone: '(11) 3000-0000',
        role: 'SUPERADMIN',
        municipalityId: munId,
        isActive: true,
      },
    ];

    // 6. Slots de Agendamento (Próximos 7 dias com horários disponíveis reais)
    const today = new Date();
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      if (d.getDay() === 0 || d.getDay() === 6) continue; // Pula finais de semana
      const dateStr = d.toISOString().split('T')[0];

      const times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
      times.forEach((t, idx) => {
        // Aloca vagas para Clínica Médica e Odonto
        this.slots.push({
          id: `slot-${dateStr}-${t}-med`,
          healthUnitId: ubs1Id,
          serviceId: 'srv-clinica-geral',
          professionalId: 'user-med-mariana',
          slotDate: dateStr,
          slotTime: t,
          isBooked: dayOffset === 0 && idx < 4, // Algumas já agendadas no dia atual
        });

        this.slots.push({
          id: `slot-${dateStr}-${t}-vac`,
          healthUnitId: ubs1Id,
          serviceId: 'srv-vacinacao',
          slotDate: dateStr,
          slotTime: t,
          isBooked: false,
        });
      });
    }

    // 7. Agendamentos Existentes
    const todayStr = today.toISOString().split('T')[0];
    this.appointments = [
      {
        id: 'apt-001',
        protocol: 'UNBS-2026-89412',
        citizenId: 'user-maria-silva',
        citizenName: 'Maria Aparecida da Silva',
        citizenCpfMasked: '284.***.***-03',
        healthUnitId: ubs1Id,
        healthUnitName: 'UBS Dr. Arnaldo Ribeiro - Centro',
        serviceId: 'srv-clinica-geral',
        serviceName: 'Consulta em Clínica Geral',
        professionalId: 'user-med-mariana',
        professionalName: 'Dra. Mariana Souza Prado',
        appointmentDate: todayStr,
        appointmentTime: '10:00',
        status: 'CONFIRMADO',
        createdAt: '2026-11-09T14:20:00Z',
      },
      {
        id: 'apt-002',
        protocol: 'UNBS-2026-81930',
        citizenId: 'user-joao-pedro',
        citizenName: 'João Pedro de Alencar',
        citizenCpfMasked: '419.***.***-82',
        healthUnitId: ubs1Id,
        healthUnitName: 'UBS Dr. Arnaldo Ribeiro - Centro',
        serviceId: 'srv-clinica-geral',
        serviceName: 'Consulta em Clínica Geral',
        professionalId: 'user-med-mariana',
        professionalName: 'Dra. Mariana Souza Prado',
        appointmentDate: todayStr,
        appointmentTime: '08:30',
        status: 'CONCLUIDO',
        attendanceNotes: 'Paciente avaliado, hipertensão sob controle. Receita renovada.',
        createdAt: '2026-11-08T09:12:00Z',
      },
    ];

    // 8. Fila de Atendimento do Dia (Triagem / Recepção / TV)
    this.queue = [
      {
        id: 'q-01',
        healthUnitId: ubs1Id,
        serviceId: 'srv-clinica-geral',
        serviceName: 'Clínica Médica',
        ticketNumber: 'P-006',
        priorityType: 'PRIORIDADE_IDOSO_80',
        citizenNameMasked: 'Benedito F. ***',
        status: 'CHAMADO',
        deskNumber: 'Consultório 02',
        calledAt: '10:05',
        createdAt: '09:40',
      },
      {
        id: 'q-02',
        healthUnitId: ubs1Id,
        serviceId: 'srv-clinica-geral',
        serviceName: 'Clínica Médica',
        ticketNumber: 'N-012',
        priorityType: 'NORMAL',
        citizenNameMasked: 'Maria A. Silva',
        status: 'AGUARDANDO',
        createdAt: '09:50',
      },
      {
        id: 'q-03',
        healthUnitId: ubs1Id,
        serviceId: 'srv-vacinacao',
        serviceName: 'Sala de Vacinação',
        ticketNumber: 'P-007',
        priorityType: 'PRIORIDADE_GESTANTE_LACTANTE',
        citizenNameMasked: 'Juliana C. ***',
        status: 'AGUARDANDO',
        createdAt: '10:02',
      },
      {
        id: 'q-04',
        healthUnitId: ubs1Id,
        serviceId: 'srv-vacinacao',
        serviceName: 'Sala de Vacinação',
        ticketNumber: 'N-013',
        priorityType: 'NORMAL',
        citizenNameMasked: 'Lucas R. ***',
        status: 'AGUARDANDO',
        createdAt: '10:08',
      },
    ];

    // 9. Vacinas & Lotes Oficiais (PNI / SUS)
    this.vaccines = [
      {
        id: 'vac-covid',
        name: 'Covid-19 Spikevax XBB.1.5',
        manufacturer: 'Moderna / Fiocruz',
        targetDisease: 'SARS-CoV-2 (Variantes Recentes)',
        totalDosesRecommended: 1,
        minAgeMonths: 6,
      },
      {
        id: 'vac-influenza',
        name: 'Influenza Trivalente 2026',
        manufacturer: 'Instituto Butantan',
        targetDisease: 'H1N1, H3N2 e Influenza B',
        totalDosesRecommended: 1,
        minAgeMonths: 6,
      },
      {
        id: 'vac-dtpa',
        name: 'dTpa (Tríplice Acelular do Adulto)',
        manufacturer: 'Sanofi Pasteur',
        targetDisease: 'Difteria, Tétano e Coqueluche',
        totalDosesRecommended: 1,
        minAgeMonths: 240,
      },
      {
        id: 'vac-hepatite-b',
        name: 'Hepatite B Recombinante',
        manufacturer: 'Instituto Butantan',
        targetDisease: 'Hepatite B',
        totalDosesRecommended: 3,
        minAgeMonths: 0,
      },
      {
        id: 'vac-febre-amarela',
        name: 'Febre Amarela Atenuada',
        manufacturer: 'Bio-Manguinhos / Fiocruz',
        targetDisease: 'Febre Amarela',
        totalDosesRecommended: 1,
        minAgeMonths: 9,
      },
    ];

    this.batches = [
      {
        id: 'batch-cov-01',
        vaccineId: 'vac-covid',
        healthUnitId: ubs1Id,
        batchNumber: 'LOTE-CV26A',
        expiryDate: '2026-12-30',
        initialDoses: 200,
        remainingDoses: 142,
      },
      {
        id: 'batch-inf-01',
        vaccineId: 'vac-influenza',
        healthUnitId: ubs1Id,
        batchNumber: 'LOTE-FLU26-SP',
        expiryDate: '2026-11-28', // Alerta de validade próxima (< 30 dias)
        initialDoses: 500,
        remainingDoses: 48,
      },
      {
        id: 'batch-dtpa-01',
        vaccineId: 'vac-dtpa',
        healthUnitId: ubs1Id,
        batchNumber: 'LOTE-DTP99',
        expiryDate: '2027-05-15',
        initialDoses: 150,
        remainingDoses: 110,
      },
    ];

    // 10. Histórico de Vacinação de Maria da Silva
    this.immunizations = [
      {
        id: 'im-01',
        protocol: 'VAC-SUS-2026-0912',
        citizenId: 'user-maria-silva',
        citizenName: 'Maria Aparecida da Silva',
        vaccineId: 'vac-covid',
        vaccineName: 'Covid-19 Spikevax XBB.1.5',
        batchNumber: 'LOTE-CV26A',
        healthUnitId: ubs1Id,
        healthUnitName: 'UBS Dr. Arnaldo Ribeiro - Centro',
        doseNumber: 'Dose Reforço 2026',
        administeredAt: '2026-04-10T09:30:00Z',
        professionalName: 'Ana Paula Rocha Martins (COREN-TE 89312-SP)',
        notes: 'Aplicação em deltoide esquerdo, sem intercorrências imediatas.',
      },
      {
        id: 'im-02',
        protocol: 'VAC-SUS-2025-4419',
        citizenId: 'user-maria-silva',
        citizenName: 'Maria Aparecida da Silva',
        vaccineId: 'vac-influenza',
        vaccineName: 'Influenza Trivalente',
        batchNumber: 'LOTE-FLU25-BUT',
        healthUnitId: ubs1Id,
        healthUnitName: 'UBS Dr. Arnaldo Ribeiro - Centro',
        doseNumber: 'Anual 2025',
        administeredAt: '2025-05-18T10:15:00Z',
        professionalName: 'Carlos Eduardo Mendes (COREN 451920-SP)',
      },
      {
        id: 'im-03',
        protocol: 'VAC-SUS-2024-1188',
        citizenId: 'user-maria-silva',
        citizenName: 'Maria Aparecida da Silva',
        vaccineId: 'vac-febre-amarela',
        vaccineName: 'Febre Amarela Atenuada',
        batchNumber: 'LOTE-FA-24BIO',
        healthUnitId: ubs1Id,
        healthUnitName: 'UBS Dr. Arnaldo Ribeiro - Centro',
        doseNumber: 'Dose Única Vitalícia',
        administeredAt: '2024-02-12T11:00:00Z',
        professionalName: 'Ana Paula Rocha Martins (COREN-TE 89312-SP)',
      },
    ];

    // 11. Estoque e Insumos da UBS
    this.inventory = [
      {
        id: 'inv-01',
        healthUnitId: ubs1Id,
        code: 'MED-LOS-50',
        name: 'Losartana Potássica 50mg',
        category: 'MEDICAMENTO',
        unitMeasure: 'COMPRIMIDO',
        currentQuantity: 4200,
        minimumQuantity: 1000,
        updatedAt: '2026-11-10T16:00:00Z',
      },
      {
        id: 'inv-02',
        healthUnitId: ubs1Id,
        code: 'MED-MET-850',
        name: 'Metformina 850mg',
        category: 'MEDICAMENTO',
        unitMeasure: 'COMPRIMIDO',
        currentQuantity: 2800,
        minimumQuantity: 800,
        updatedAt: '2026-11-09T11:30:00Z',
      },
      {
        id: 'inv-03',
        healthUnitId: ubs1Id,
        code: 'VAC-FLU-26',
        name: 'Vacina Influenza Trivalente',
        category: 'VACINA',
        unitMeasure: 'DOSE/FRASCO',
        currentQuantity: 48,
        minimumQuantity: 100, // CRÍTICO: Abaixo do estoque mínimo!
        updatedAt: '2026-11-11T08:00:00Z',
      },
      {
        id: 'inv-04',
        healthUnitId: ubs1Id,
        code: 'EPI-LUV-M',
        name: 'Luvas de Procedimento Látex Tam. M',
        category: 'EPI',
        unitMeasure: 'CAIXA (100 un)',
        currentQuantity: 14,
        minimumQuantity: 20, // CRÍTICO: Abaixo do mínimo!
        updatedAt: '2026-11-11T07:30:00Z',
      },
      {
        id: 'inv-05',
        healthUnitId: ubs1Id,
        code: 'CIR-SER-03',
        name: 'Seringa Descartável 3ml com Agulha 25x7',
        category: 'MATERIAL_CIRURGICO',
        unitMeasure: 'UNIDADE',
        currentQuantity: 1250,
        minimumQuantity: 500,
        updatedAt: '2026-11-10T14:10:00Z',
      },
    ];

    // 12. Comunicados Oficiais
    this.announcements = [
      {
        id: 'ann-01',
        municipalityId: munId,
        healthUnitId: ubs1Id,
        title: 'Horário Noturno de Vacinação — Quarta-feira',
        content: 'Nesta quarta-feira, a sala de vacinação da UBS Central atenderá até às 20h para atualização de cadernetas de crianças e trabalhadores.',
        category: 'VACINACAO',
        isUrgent: true,
        publishedAt: '2026-11-10T18:00:00Z',
        publishedByName: 'Coordenação de Imunização Municipal',
      },
      {
        id: 'ann-02',
        municipalityId: munId,
        healthUnitId: ubs1Id,
        title: 'Campanha de Prevenção ao Diabetes e Hipertensão',
        content: 'Mutirão de aferição de pressão arterial e teste de glicemia capilar todos os dias das 08h às 11h no setor de acolhimento.',
        category: 'CAMPANHA',
        isUrgent: false,
        publishedAt: '2026-11-08T10:00:00Z',
        publishedByName: 'Dra. Fernanda Vasconcelos (Secretaria de Saúde)',
      },
    ];

    // 13. Solicitações Administrativas
    this.serviceRequests = [
      {
        id: 'req-01',
        protocol: 'REQ-2026-4412',
        citizenId: 'user-maria-silva',
        citizenName: 'Maria Aparecida da Silva',
        healthUnitId: ubs1Id,
        category: 'ATUALIZACAO_CADASTRO',
        title: 'Atualização do número de telefone e endereço residencial',
        description: 'Mudei para a Rua das Palmeiras, 140 e gostaria de atualizar meu telefone de contato.',
        status: 'RESPONDIDO',
        responseNotes: 'Cadastro atualizado com sucesso no sistema da UBS Central em 10/11/2026.',
        createdAt: '2026-11-09T11:20:00Z',
        updatedAt: '2026-11-10T09:15:00Z',
      },
    ];

    // 14. Logs de Auditoria Iniciais
    this.auditLogs = [
      {
        id: 'aud-01',
        userId: 'user-maria-silva',
        userName: 'Maria Aparecida da Silva',
        userRole: 'CITIZEN',
        healthUnitId: ubs1Id,
        action: 'CRIAR_AGENDAMENTO',
        entityName: 'appointments',
        entityId: 'apt-001',
        details: { protocol: 'UNBS-2026-89412', date: todayStr, time: '10:00' },
        ipAddress: '177.18.92.14',
        createdAt: '2026-11-09T14:20:00Z',
      },
      {
        id: 'aud-02',
        userId: 'user-recep-roberto',
        userName: 'Roberto Lopes Ferreira',
        userRole: 'RECEPTIONIST',
        healthUnitId: ubs1Id,
        action: 'EMISSAO_SENHA_TRIAGEM',
        entityName: 'queue_entries',
        entityId: 'q-02',
        details: { ticket: 'N-012', priority: 'NORMAL' },
        ipAddress: '192.168.1.104',
        createdAt: '2026-11-11T09:50:00Z',
      },
    ];
  }

  // ==============================================================================
  // AÇÕES COM CONCORRÊNCIA E AUDITORIA
  // ==============================================================================

  /**
   * Reserva atômica de agendamento online com bloqueio de duplicidade.
   */
  public bookAppointment(data: {
    citizenId: string;
    citizenName: string;
    citizenCpf: string;
    healthUnitId: string;
    serviceId: string;
    slotDate: string;
    slotTime: string;
    professionalId?: string;
  }): { success: boolean; appointment?: Appointment; error?: string } {
    // 1. Verifica se o slot está livre
    const slot = this.slots.find(
      (s) =>
        s.healthUnitId === data.healthUnitId &&
        s.serviceId === data.serviceId &&
        s.slotDate === data.slotDate &&
        s.slotTime === data.slotTime &&
        (!data.professionalId || s.professionalId === data.professionalId)
    );

    if (!slot) {
      return { success: false, error: 'Horário indisponível ou não cadastrado.' };
    }

    if (slot.isBooked) {
      return {
        success: false,
        error: 'Conflito de agendamento: esta vaga acabou de ser preenchida por outro cidadão.',
      };
    }

    // 2. Verifica se o cidadão já possui agendamento no mesmo dia e serviço
    const existing = this.appointments.find(
      (a) =>
        a.citizenId === data.citizenId &&
        a.serviceId === data.serviceId &&
        a.appointmentDate === data.slotDate &&
        !['CANCELADO', 'NAO_COMPARECEU'].includes(a.status)
    );

    if (existing) {
      return {
        success: false,
        error: `Você já possui um agendamento ativo para este serviço na data ${data.slotDate} (Protocolo: ${existing.protocol}).`,
      };
    }

    // 3. Efetua a reserva atômica
    slot.isBooked = true;

    const unit = this.healthUnits.find((u) => u.id === data.healthUnitId);
    const service = this.services.find((s) => s.id === data.serviceId);
    const professional = data.professionalId
      ? this.users.find((u) => u.id === data.professionalId)
      : undefined;

    const protocolNum = Math.floor(10000 + Math.random() * 90000);
    const protocol = `UNBS-2026-${protocolNum}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      protocol,
      citizenId: data.citizenId,
      citizenName: data.citizenName,
      citizenCpfMasked: data.citizenCpf ? data.citizenCpf.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, '$1.***.***-$4') : '***.***.***-**',
      healthUnitId: data.healthUnitId,
      healthUnitName: unit?.name || 'UBS Central',
      serviceId: data.serviceId,
      serviceName: service?.name || 'Consulta Médica',
      professionalId: data.professionalId,
      professionalName: professional?.fullName,
      appointmentDate: data.slotDate,
      appointmentTime: data.slotTime,
      status: 'CONFIRMADO',
      createdAt: new Date().toISOString(),
    };

    this.appointments.unshift(newAppointment);

    // 4. Log de Auditoria
    this.logAudit({
      userId: data.citizenId,
      userName: data.citizenName,
      userRole: 'CITIZEN',
      healthUnitId: data.healthUnitId,
      action: 'CRIAR_AGENDAMENTO',
      entityName: 'appointments',
      entityId: newAppointment.id,
      details: { protocol, date: data.slotDate, time: data.slotTime },
    });

    return { success: true, appointment: newAppointment };
  }

  /**
   * Cancelamento de agendamento com liberação de vaga no slot.
   */
  public cancelAppointment(appointmentId: string, citizenId: string, reason: string): { success: boolean; error?: string } {
    const apt = this.appointments.find((a) => a.id === appointmentId);
    if (!apt) return { success: false, error: 'Agendamento não encontrado.' };

    apt.status = 'CANCELADO';
    apt.cancellationReason = reason || 'Cancelado pelo cidadão através da plataforma UNBS.';

    // Libera a vaga no slot
    const slot = this.slots.find(
      (s) =>
        s.healthUnitId === apt.healthUnitId &&
        s.serviceId === apt.serviceId &&
        s.slotDate === apt.appointmentDate &&
        s.slotTime === apt.appointmentTime
    );
    if (slot) {
      slot.isBooked = false;
    }

    this.logAudit({
      userId: citizenId,
      userName: apt.citizenName,
      userRole: 'CITIZEN',
      healthUnitId: apt.healthUnitId,
      action: 'CANCELAR_AGENDAMENTO',
      entityName: 'appointments',
      entityId: appointmentId,
      details: { protocol: apt.protocol, reason },
    });

    return { success: true };
  }

  /**
   * Atualização de status pela UBS (Check-in, Atendimento, Não Compareceu).
   */
  public updateAppointmentStatus(appointmentId: string, status: any, staffUser: User, notes?: string) {
    const apt = this.appointments.find((a) => a.id === appointmentId);
    if (!apt) return { success: false, error: 'Agendamento não encontrado.' };

    apt.status = status;
    if (notes) apt.attendanceNotes = notes;

    this.logAudit({
      userId: staffUser.id,
      userName: staffUser.fullName,
      userRole: staffUser.role,
      healthUnitId: apt.healthUnitId,
      action: `STATUS_AGENDAMENTO_${status}`,
      entityName: 'appointments',
      entityId: appointmentId,
      details: { newStatus: status, notes },
    });

    return { success: true, appointment: apt };
  }

  /**
   * Emissão de Senha de Fila de Atendimento (Normal ou Prioritária).
   */
  public generateQueueTicket(data: {
    healthUnitId: string;
    serviceId: string;
    priorityType: TicketPriority;
    citizenName: string;
    appointmentId?: string;
  }): QueueEntry {
    const isPriority = data.priorityType !== 'NORMAL';
    const prefix = isPriority ? 'P' : 'N';
    const num = isPriority ? ++this.ticketCounter.PRIORIDADE : ++this.ticketCounter.NORMAL;
    const ticketNumber = `${prefix}-${String(num).padStart(3, '0')}`;

    const service = this.services.find((s) => s.id === data.serviceId);

    const nameParts = data.citizenName.split(' ');
    const maskedName = nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[1][0]}. ***`
      : `${nameParts[0]} ***`;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const entry: QueueEntry = {
      id: `q-${Date.now()}`,
      healthUnitId: data.healthUnitId,
      serviceId: data.serviceId,
      serviceName: service?.name || 'Atendimento Geral',
      ticketNumber,
      priorityType: data.priorityType,
      citizenNameMasked: maskedName,
      status: 'AGUARDANDO',
      createdAt: timeStr,
      appointmentId: data.appointmentId,
    };

    this.queue.push(entry);

    this.logAudit({
      userId: 'system',
      userName: 'Terminal de Triagem',
      userRole: 'RECEPTIONIST',
      healthUnitId: data.healthUnitId,
      action: 'EMISSAO_SENHA',
      entityName: 'queue_entries',
      entityId: entry.id,
      details: { ticketNumber, priority: data.priorityType },
    });

    return entry;
  }

  /**
   * Chamada de Senha para Guichê / Consultório (Atualiza Painel e TV).
   */
  public callTicket(ticketId: string, deskNumber: string, staffUser: User) {
    const entry = this.queue.find((q) => q.id === ticketId);
    if (!entry) return { success: false, error: 'Senha não encontrada.' };

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    entry.status = 'CHAMADO';
    entry.deskNumber = deskNumber;
    entry.calledAt = timeStr;

    this.logAudit({
      userId: staffUser.id,
      userName: staffUser.fullName,
      userRole: staffUser.role,
      healthUnitId: entry.healthUnitId,
      action: 'CHAMADA_SENHA_PAINEL',
      entityName: 'queue_entries',
      entityId: entry.id,
      details: { ticket: entry.ticketNumber, desk: deskNumber },
    });

    return { success: true, ticket: entry };
  }

  /**
   * Registro de Vacinação com baixa no Lote e verificação de validade.
   */
  public recordVaccination(data: {
    citizenId: string;
    citizenName: string;
    vaccineId: string;
    batchId: string;
    doseNumber: string;
    healthUnitId: string;
    professionalUser: User;
    notes?: string;
  }) {
    const batch = this.batches.find((b) => b.id === data.batchId);
    if (!batch) return { success: false, error: 'Lote não localizado no estoque.' };

    if (batch.remainingDoses <= 0) {
      return { success: false, error: 'Este lote não possui mais doses disponíveis.' };
    }

    const expiry = new Date(batch.expiryDate);
    if (expiry < new Date()) {
      return { success: false, error: 'Lote vencido! Não é permitida a aplicação de imunobiológico com prazo expirado.' };
    }

    // Baixa automática no estoque do lote
    batch.remainingDoses -= 1;

    // Atualiza também item do estoque geral
    const invItem = this.inventory.find((i) => i.code.includes('VAC'));
    if (invItem && invItem.currentQuantity > 0) {
      invItem.currentQuantity -= 1;
      invItem.updatedAt = new Date().toISOString();
    }

    const vaccine = this.vaccines.find((v) => v.id === data.vaccineId);
    const unit = this.healthUnits.find((u) => u.id === data.healthUnitId);

    const protocol = `VAC-SUS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: ImmunizationRecord = {
      id: `im-${Date.now()}`,
      protocol,
      citizenId: data.citizenId,
      citizenName: data.citizenName,
      vaccineId: data.vaccineId,
      vaccineName: vaccine?.name || 'Vacina SUS',
      batchNumber: batch.batchNumber,
      healthUnitId: data.healthUnitId,
      healthUnitName: unit?.name || 'UBS Central',
      doseNumber: data.doseNumber,
      administeredAt: new Date().toISOString(),
      professionalName: `${data.professionalUser.fullName} (${data.professionalUser.councilType} ${data.professionalUser.councilNumber})`,
      notes: data.notes,
    };

    this.immunizations.unshift(newRecord);

    this.logAudit({
      userId: data.professionalUser.id,
      userName: data.professionalUser.fullName,
      userRole: data.professionalUser.role,
      healthUnitId: data.healthUnitId,
      action: 'REGISTRO_VACINA',
      entityName: 'immunization_records',
      entityId: newRecord.id,
      details: { protocol, vaccine: vaccine?.name, batch: batch.batchNumber, dose: data.doseNumber },
    });

    return { success: true, record: newRecord };
  }

  /**
   * Métricas Consolidadas para Painel da Secretaria Municipal de Saúde.
   */
  public getMunicipalKpis(): MunicipalKpis {
    const today = new Date().toISOString().split('T')[0];
    const todayApts = this.appointments.filter((a) => a.appointmentDate === today);
    const completed = todayApts.filter((a) => a.status === 'CONCLUIDO').length;
    const totalSlots = this.slots.filter((s) => s.slotDate === today).length || 1;
    const bookedSlots = this.slots.filter((s) => s.slotDate === today && s.isBooked).length;

    const waitingQueue = this.queue.filter((q) => q.status === 'AGUARDANDO').length;

    return {
      totalUnits: this.healthUnits.length,
      activeProfessionals: this.users.filter((u) => u.role !== 'CITIZEN' && u.isActive).length,
      todayAppointments: todayApts.length,
      completedAppointments: completed,
      occupancyRate: Math.round((bookedSlots / totalSlots) * 100) || 68,
      showRate: 92,
      waitingQueueCount: waitingQueue,
      vaccinesAppliedThisMonth: 840 + this.immunizations.length,
    };
  }

  private logAudit(entry: Omit<AuditLog, 'id' | 'createdAt'>) {
    this.auditLogs.unshift({
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ipAddress: '177.18.92.14',
      ...entry,
    });
  }
}

export const db = new UnbsDatabase();
