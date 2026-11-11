import React, { useState, useEffect } from 'react';
import { QueueEntry, HealthUnit } from '../../types';
import { Maximize2, Minimize2, Volume2 } from 'lucide-react';
import { playTicketChime } from '../../utils/audio';

interface TvCallPanelProps {
  queue: QueueEntry[];
  currentUnit: HealthUnit;
}

export const TvCallPanel: React.FC<TvCallPanelProps> = ({ queue, currentUnit }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Atualiza relógio do painel a cada segundo
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Senhas chamadas
  const calledTickets = queue
    .filter((q) => q.status === 'CHAMADO' && q.calledAt)
    .sort((a, b) => (b.calledAt || '').localeCompare(a.calledAt || ''));

  const currentTicket = calledTickets[0] || {
    ticketNumber: '---',
    deskNumber: 'Aguardando Chamada',
    serviceName: 'Acolhimento Geral',
    citizenNameMasked: '---',
  };

  const previousTickets = calledTickets.slice(1, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 font-sans select-none">
      {/* Barra Superior da TV */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center font-black text-xl text-white">
            +
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {currentUnit?.name || 'Unidade Básica de Saúde'}
            </h1>
            <p className="text-xs text-sky-400 font-mono">
              PAINEL OFICIAL DE ATENDIMENTO · SUS SERRA AZUL - SP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-2xl font-black font-mono tracking-wider text-slate-100">
              {currentTime}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">HORÁRIO DE BRASÍLIA</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={playTicketChime}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 transition"
              title="Testar aviso sonoro"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title="Alternar tela cheia"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA CENTRAL: SENHA EM DESTAQUE */}
      <main className="my-auto py-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900 to-slate-900/80 border-2 border-sky-500/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 animate-pulse" />

          <span className="text-sm sm:text-base font-bold text-sky-400 uppercase tracking-widest font-mono">
            SENHA CHAMADA
          </span>

          <div className="text-7xl sm:text-9xl font-black font-mono tracking-wider text-white my-4 drop-shadow-md">
            {currentTicket.ticketNumber}
          </div>

          <div className="inline-block bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xl sm:text-3xl font-extrabold px-6 py-2.5 rounded-2xl mb-4">
            {currentTicket.deskNumber}
          </div>

          <p className="text-sm sm:text-lg text-slate-400 font-medium">
            Setor: <strong className="text-white">{currentTicket.serviceName}</strong>
          </p>
        </div>
      </main>

      {/* HISTÓRICO DAS ÚLTIMAS SENHAS CHAMADAS */}
      <footer className="border-t border-slate-800 pt-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Últimas Senhas Chamadas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {previousTickets.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center"
            >
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-200">
                {t.ticketNumber}
              </div>
              <div className="text-xs font-semibold text-sky-400 mt-0.5">
                {t.deskNumber}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {t.serviceName}
              </div>
            </div>
          ))}
          {previousTickets.length === 0 && (
            <div className="col-span-4 text-center py-3 text-slate-500 text-xs">
              Nenhuma senha anterior registrada nesta sessão.
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
