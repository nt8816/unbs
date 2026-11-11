import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { User } from '../../types';
import { ShieldCheck, Tv, UserCheck, Accessibility, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  users,
  onSelectUser,
  highContrast,
  setHighContrast,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Aviso de Ambiente Demonstrativo Conforme Seção 34 da Especificação */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400">● AMBIENTE HOMOLOGADO SUS</span>
          <span className="text-slate-400">·</span>
          <span>Município Piloto: Serra Azul - SP (IBGE: 3551502)</span>
          <span className="text-slate-400 hidden sm:inline">·</span>
          <span className="text-slate-400 hidden sm:inline">Conexão Criptografada TLS 1.3 / LGPD</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHighContrast((prev: boolean) => !prev)}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition text-[11px]"
            title="Alternar modo de alto contraste para acessibilidade"
          >
            <Accessibility className="w-3.5 h-3.5 text-sky-400" />
            <span>{highContrast ? 'Contraste Normal' : 'Alto Contraste'}</span>
          </button>
        </div>
      </div>

      {/* Top Bar Contract: 3 Zonas Rigorosas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* ZONA 1: Logomarca e Identidade Institucional UNBS */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-teal-700 flex items-center justify-center text-white shadow-sm font-black text-lg">
            +
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                UNBS
              </span>
              <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded-sm">
                SUS DIGITAL
              </span>
            </div>
            <p className="text-[10px] text-slate-500 whitespace-nowrap hidden sm:block">
              Atenção Primária à Saúde
            </p>
          </div>
        </div>

        {/* ZONA 2: Links de Navegação Principal */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setCurrentTab('citizen')}
            className={`transition whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'citizen'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Portal do Cidadão
          </button>
          <button
            onClick={() => setCurrentTab('ubs')}
            className={`transition whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'ubs'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Painel da UBS
          </button>
          <button
            onClick={() => setCurrentTab('tv')}
            className={`flex items-center gap-1.5 transition whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'tv'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-teal-600" />
            <span>Painel TV / Guichê</span>
          </button>
          <button
            onClick={() => setCurrentTab('secretaria')}
            className={`transition whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'secretaria'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Secretaria Municipal
          </button>
          <button
            onClick={() => setCurrentTab('audit')}
            className={`flex items-center gap-1 transition whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'audit'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Auditoria</span>
          </button>
          <button
            onClick={() => setCurrentTab('tcc')}
            className={`flex items-center gap-1 transition whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'tcc'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-indigo-600 hover:text-indigo-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            <span>Pesquisa & TCC</span>
          </button>
        </nav>

        {/* ZONA 3: Seletor de Perfil / Ação Primária & PWA */}
        <div className="flex items-center gap-3 shrink-0">
          <PWAInstallButton />

          {/* Alternador de Usuário / Matriz RBAC para Testes e Demonstração Real */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <div className="text-left">
              <span className="block text-[10px] text-slate-400 font-medium leading-none">
                Perfil Ativo:
              </span>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const selected = users.find((u) => u.id === e.target.value);
                  if (selected) onSelectUser(selected);
                }}
                className="text-xs font-bold text-slate-800 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer outline-hidden"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName.split(' ')[0]} ({formatRole(u.role)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

function formatRole(role: string): string {
  switch (role) {
    case 'CITIZEN':
      return 'Cidadão';
    case 'RECEPTIONIST':
      return 'Recepção';
    case 'DOCTOR':
      return 'Médica';
    case 'NURSE':
      return 'Enfermeiro';
    case 'VACCINATOR':
      return 'Vacinadora';
    case 'UBS_MANAGER':
      return 'Gestor UBS';
    case 'MUNICIPAL_SECRETARY':
      return 'Secretária de Saúde';
    case 'SUPERADMIN':
      return 'Superadmin';
    default:
      return role;
  }
}
