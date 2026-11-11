-- ==============================================================================
-- UNBS - Plataforma Inteligente de Saúde Pública
-- Esquema de Banco de Dados PostgreSQL v4 (Multi-tenant, SUS, RLS, Auditoria)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. MUNICIPALITIES (Multi-tenancy Root)
CREATE TABLE IF NOT EXISTS municipalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ibge_code VARCHAR(7) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    state VARCHAR(2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/Sao_Paulo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. HEALTH DEPARTMENTS (Secretaria Municipal de Saúde)
CREATE TABLE IF NOT EXISTS health_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    secretary_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. HEALTH UNITS (Unidades Básicas de Saúde - UBS)
CREATE TABLE IF NOT EXISTS health_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    cnes_code VARCHAR(10) NOT NULL UNIQUE, -- Código Nacional de Estabelecimentos de Saúde
    name VARCHAR(200) NOT NULL,
    popular_name VARCHAR(150),
    neighborhood VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    opening_time TIME NOT NULL DEFAULT '07:00:00',
    closing_time TIME NOT NULL DEFAULT '19:00:00',
    has_pharmacy BOOLEAN NOT NULL DEFAULT true,
    has_vaccine_room BOOLEAN NOT NULL DEFAULT true,
    has_dental BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SECTORS (Setores da UBS)
CREATE TABLE IF NOT EXISTS sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    health_unit_id UUID NOT NULL REFERENCES health_units(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SERVICES (Serviços Oferecidos)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    health_unit_id UUID NOT NULL REFERENCES health_units(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES sectors(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 20,
    daily_capacity INTEGER NOT NULL DEFAULT 30,
    requires_referral BOOLEAN NOT NULL DEFAULT false,
    guidance_notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. USERS & PROFILES (RBAC / Cidadãos & Profissionais)
CREATE TYPE user_role AS ENUM (
    'CITIZEN',
    'RECEPTIONIST',
    'NURSE',
    'DOCTOR',
    'NURSE_TECH',
    'VACCINATOR',
    'DENTIST',
    'COMMUNITY_HEALTH_AGENT',
    'UBS_MANAGER',
    'MUNICIPAL_SECRETARY',
    'SUPERADMIN'
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    cns VARCHAR(15) UNIQUE, -- Cartão Nacional de Saúde
    birth_date DATE NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'CITIZEN',
    municipality_id UUID REFERENCES municipalities(id) ON DELETE SET NULL,
    health_unit_id UUID REFERENCES health_units(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS citizen_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    preferred_health_unit_id UUID REFERENCES health_units(id) ON DELETE SET NULL,
    blood_type VARCHAR(5),
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(20),
    allergies TEXT,
    chronic_conditions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    council_type VARCHAR(10) NOT NULL, -- CRM, COREN, CRO, etc.
    council_number VARCHAR(20) NOT NULL,
    council_state VARCHAR(2) NOT NULL,
    specialty VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. APPOINTMENT SLOTS & APPOINTMENTS (Controle de Concorrência e Estados)
CREATE TYPE appointment_status AS ENUM (
    'SOLICITADO',
    'PENDENTE',
    'CONFIRMADO',
    'CANCELADO',
    'REAGENDADO',
    'CHECK_IN',
    'EM_ATENDIMENTO',
    'CONCLUIDO',
    'NAO_COMPARECEU'
);

CREATE TABLE IF NOT EXISTS appointment_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    health_unit_id UUID NOT NULL REFERENCES health_units(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professional_profiles(id) ON DELETE SET NULL,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT false,
    version INTEGER NOT NULL DEFAULT 1, -- Optimistic locking
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_slot_unique UNIQUE (health_unit_id, professional_id, slot_date, slot_time)
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol VARCHAR(30) NOT NULL UNIQUE,
    citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    health_unit_id UUID NOT NULL REFERENCES health_units(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    professional_id UUID REFERENCES professional_profiles(id) ON DELETE SET NULL,
    slot_id UUID REFERENCES appointment_slots(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status appointment_status NOT NULL DEFAULT 'CONFIRMADO',
    cancellation_reason TEXT,
    attendance_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CHECK-IN & QUEUES (Filas de Atendimento & Painel de TV)
CREATE TYPE ticket_priority AS ENUM (
    'NORMAL',
    'PRIORIDADE_IDOSO_60',
    'PRIORIDADE_IDOSO_80',
    'PRIORIDADE_GESTANTE_LACTANTE',
    'PRIORIDADE_PCD',
    'EMERGENCIA_ACOLHIMENTO'
);

CREATE TYPE queue_status AS ENUM (
    'AGUARDANDO',
    'CHAMADO',
    'EM_ATENDIMENTO',
    'CONCLUIDO',
    'AUSENTE',
    'CANCELADO'
);

CREATE TABLE IF NOT EXISTS queue_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    health_unit_id UUID NOT NULL REFERENCES health_units(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    ticket_number VARCHAR(10) NOT NULL, -- Ex: 'N-042', 'P-015'
    priority_type ticket_priority NOT NULL DEFAULT 'NORMAL',
    citizen_name_masked VARCHAR(50) NOT NULL, -- LGPD: Maria S. ***
    status queue_status NOT NULL DEFAULT 'AGUARDANDO',
    desk_number VARCHAR(20),
    called_at TIMESTAMPTZ,
    attended_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. VACCINATIONS & BATCHES (Rastreabilidade e Segurança)
CREATE TABLE IF NOT EXISTS vaccines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    manufacturer VARCHAR(150) NOT NULL,
    target_disease VARCHAR(200) NOT NULL,
    total_doses_recommended INTEGER NOT NULL DEFAULT 1,
    min_age_months INTEGER NOT NULL DEFAULT 0,
    storage_temp_min NUMERIC(4, 1) NOT NULL DEFAULT 2.0,
    storage_temp_max NUMERIC(4, 1) NOT NULL DEFAULT 8.0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS vaccine_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vaccine_id UUID NOT NULL REFERENCES vaccines(id) ON DELETE CASCADE,
    health_unit_id UUID NOT NULL REFERENCES health_units(id) ON DELETE CASCADE,
    batch_number VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    initial_doses INTEGER NOT NULL,
    remaining_doses INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_remaining_positive CHECK (remaining_doses >= 0)
);

CREATE TABLE IF NOT EXISTS immunization_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol VARCHAR(30) NOT NULL UNIQUE,
    citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vaccine_id UUID NOT NULL REFERENCES vaccines(id) ON DELETE RESTRICT,
    batch_id UUID NOT NULL REFERENCES vaccine_batches(id) ON DELETE RESTRICT,
    health_unit_id UUID NOT NULL REFERENCES health_units(id) ON DELETE RESTRICT,
    professional_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    dose_number VARCHAR(20) NOT NULL, -- '1ª Dose', 'Reforço', 'Dose Única'
    administered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. INVENTORY (Controle de Estoque e Insumos)
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    health_unit_id UUID NOT NULL REFERENCES health_units(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'MEDICAMENTO', 'VACINA', 'MATERIAL_CIRURGICO', 'EPI'
    unit_measure VARCHAR(20) NOT NULL, -- 'AMPOLA', 'COMPRIMIDO', 'FRASCO', 'CAIXA'
    current_quantity INTEGER NOT NULL DEFAULT 0,
    minimum_quantity INTEGER NOT NULL DEFAULT 10,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_quantity_positive CHECK (current_quantity >= 0)
);

-- 11. ANNOUNCEMENTS & OFFICIAL COMMUNICATIONS
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    health_unit_id UUID REFERENCES health_units(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'GERAL', -- 'VACINACAO', 'FUNCIONAMENTO', 'CAMPANHA'
    is_urgent BOOLEAN NOT NULL DEFAULT false,
    published_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SERVICE REQUESTS & OMBUDSMAN (Solicitações Administrativas & Ouvidoria)
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol VARCHAR(30) NOT NULL UNIQUE,
    citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    health_unit_id UUID NOT NULL REFERENCES health_units(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'DUVIDA', 'ATUALIZACAO_CADASTRO', 'ELOGIO', 'RECLAMACAO', 'SUGESTAO'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ABERTO', -- 'ABERTO', 'EM_ANALISE', 'RESPONDIDO', 'FINALIZADO'
    response_notes TEXT,
    responded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AUDIT LOGS (Trilha de Auditoria LGPD e Segurança)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    municipality_id UUID REFERENCES municipalities(id) ON DELETE CASCADE,
    health_unit_id UUID REFERENCES health_units(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'CRIAR_AGENDAMENTO', 'CANCELAR_AGENDAMENTO', 'APLICAR_VACINA', 'CHAMAR_SENHA'
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & ISOLATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_health_units_mun ON health_units(municipality_id);
CREATE INDEX IF NOT EXISTS idx_appointments_citizen ON appointments(citizen_id);
CREATE INDEX IF NOT EXISTS idx_appointments_unit_date ON appointments(health_unit_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_queue_unit_status ON queue_entries(health_unit_id, status);
CREATE INDEX IF NOT EXISTS idx_immunization_citizen ON immunization_records(citizen_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunization_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Cidadão só enxerga seus próprios agendamentos e registros de vacinas
CREATE POLICY citizen_own_appointments ON appointments
    FOR ALL
    USING (citizen_id = auth.uid() OR auth.jwt() ->> 'role' IN ('RECEPTIONIST', 'DOCTOR', 'NURSE', 'UBS_MANAGER', 'SUPERADMIN'));

CREATE POLICY citizen_own_vaccines ON immunization_records
    FOR SELECT
    USING (citizen_id = auth.uid() OR auth.jwt() ->> 'role' IN ('VACCINATOR', 'NURSE', 'DOCTOR', 'UBS_MANAGER', 'SUPERADMIN'));
