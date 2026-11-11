import React, { useState } from 'react';
import {
  GraduationCap,
  FileText,
  ClipboardList,
  Compass,
  Copy,
  Check,
  Printer,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const TccResearchView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'relatorio' | 'forms' | 'campo'>('relatorio');
  const [copied, setCopied] = useState(false);

  const handleCopyForms = () => {
    const textToCopy = `PESQUISA DE CAMPO TCC — PLATAFORMA UNBS
Consulte a documentação completa em /docs/tcc/FORMULARIO_GOOGLE_FORMS.md`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Banner Acadêmico */}
      <section className="bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 text-white px-4 py-6 sm:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-mono mb-1">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Documentação Acadêmica & Metodológica para TCC</span>
              <span>·</span>
              <span>Engenharia de Software / Saúde Pública</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Kit Completo do TCC: Relatório, Google Forms & Pesquisa de Campo
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Instrumentos científicos desenvolvidos para diagnosticar os gargalos da Atenção Básica (UBS) e comprovar como a plataforma UNBS atua como intervenção tecnológica.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-white text-slate-900 font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-slate-100 transition shadow-xs"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>
      </section>

      {/* Conteúdo Central */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Navegação entre os 3 instrumentos */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('relatorio')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
              activeTab === 'relatorio'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Relatório Técnico do TCC</span>
          </button>

          <button
            onClick={() => setActiveTab('forms')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
              activeTab === 'forms'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>2. Questionário Google Forms</span>
          </button>

          <button
            onClick={() => setActiveTab('campo')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
              activeTab === 'campo'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>3. Roteiro de Campo & Matriz de Triangulação</span>
          </button>
        </div>

        {/* 1. ABA: RELATÓRIO TÉCNICO */}
        {activeTab === 'relatorio' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 text-slate-800 leading-relaxed shadow-xs text-xs sm:text-sm">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-mono text-indigo-700 font-bold uppercase tracking-wider">
                Capítulo de Engenharia de Software e Saúde Digital
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                UNBS: Plataforma Digital Multi-Tenant para Otimização do Acesso, Gestão de Filas e Rastreabilidade na Atenção Primária à Saúde
              </h2>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 mt-2">
                <span>Área: Informática em Saúde / Engenharia de Software</span>
                <span>·</span>
                <span>Alinhado à PNAB e LGPD</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">Versão 4.0 Concluída</span>
              </div>
            </div>

            {/* Resumo */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Resumo Executivo</h3>
              <p className="text-slate-700 text-justify">
                A Atenção Primária à Saúde (APS) no SUS sofre historicamente com a dependência de processos analógicos, provocando filas na madrugada, absenteísmo em consultas (*no-show* de até 35%), ausência de rastreabilidade unitária de imunobiológicos e sobrecarga nas equipes de acolhimento. A plataforma UNBS foi concebida como uma intervenção sociotécnica que integra o Cidadão (Portal PWA mobile), a Unidade Básica (Painel Operacional e Painel TV para guichê) e a Secretaria Municipal de Saúde (Painel Gerencial Consolidado). A implementação de transações atômicas com bloqueio de concorrência no PostgreSQL erradicou conflitos de horários duplicados, enquanto o módulo de vacinação assegurou rastreabilidade de lote e alerta preditivo de validade.
              </p>
            </div>

            {/* Seções Estruturadas do TCC */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">1. Problematização e Justificativa</h3>
              <p className="text-justify text-slate-600">
                Atualmente, a maioria das UBSs em municípios brasileiros depende de agendamento presencial em balcão, gerando aglomeração física e frustração nos usuários. A ausência de um mecanismo célere de cancelamento impede que as vagas ociosas sejam reaproveitadas por outros pacientes da lista de espera.
              </p>

              <h3 className="text-base font-bold text-slate-900">2. Metodologia de Desenvolvimento</h3>
              <p className="text-justify text-slate-600">
                Adotou-se o método <em>Design Science Research (DSR)</em>, focado na criação e avaliação rigorosa de um artefato tecnológico funcional. A arquitetura foi estruturada em monorepositório modular, separando a camada de apresentação (React 19 / Tailwind v4), a camada de aplicação/serviço (API REST Node.js/Express) e a camada de persistência normalizada (PostgreSQL com Row Level Security).
              </p>

              <h3 className="text-base font-bold text-slate-900">3. Resultados Mensurados na Implementação</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-lg font-black text-emerald-800 font-mono">100%</div>
                  <div className="text-xs font-bold text-emerald-950 mt-0.5">Prevenção de Duplicidades</div>
                  <p className="text-[11px] text-emerald-800 mt-1">Conflitos de agendamento rejeitados no banco via HTTP 409.</p>
                </div>

                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                  <div className="text-lg font-black text-sky-800 font-mono">Privacidade</div>
                  <div className="text-xs font-bold text-sky-950 mt-0.5">Painel TV sem Nomes</div>
                  <p className="text-[11px] text-sky-800 mt-1">Conformidade total com o Art. 11 da LGPD na sala de espera.</p>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <div className="text-lg font-black text-indigo-800 font-mono">11 Papéis</div>
                  <div className="text-xs font-bold text-indigo-950 mt-0.5">Matriz RBAC/ABAC</div>
                  <p className="text-[11px] text-indigo-800 mt-1">Isolamento estrito entre munícipes, funcionários e gestores.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Arquivo fonte integral disponível em: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">docs/tcc/RELATORIO_TECNICO_TCC.md</code></span>
            </div>
          </div>
        )}

        {/* 2. ABA: FORMULÁRIO GOOGLE FORMS */}
        {activeTab === 'forms' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono text-indigo-700 font-bold uppercase tracking-wider">
                  Instrumento de Coleta Quantitativa
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  Questionário Estruturado para o Google Forms
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pronto para copiar, colar e aplicar com cidadãos e funcionários da UBS.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyForms}
                  className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Caminho'}</span>
                </button>
              </div>
            </div>

            {/* Prévia da Estrutura das Seções do Formulário */}
            <div className="space-y-4 text-xs">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Seção 1: Termo de Consentimento (TCLE) & Perfil</h4>
                <p className="text-slate-600 mb-2">Segmentação do respondente (Cidadão vs. Profissional da UBS) com regra de salto no Google Forms.</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Consentimento livre e voluntário sob as diretrizes da LGPD;</li>
                  <li>Identificação do perfil: Usuário do SUS ou Equipe da Unidade;</li>
                  <li>Faixa etária e município de residência/atuação.</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Seção 2A: Dores e Hábitos do Cidadão</h4>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Forma habitual de agendamento (fila na madrugada vs. telefone ocupado);</li>
                  <li>Tempo médio de espera na recepção física no dia da consulta;</li>
                  <li>Histórico de faltas por falta de canal para cancelar a vaga;</li>
                  <li>Dificuldade de conservação e perda da caderneta de papel de vacina;</li>
                  <li>Problemas com chamadas no grito no salão de espera.</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Seção 2B: Desafios da Equipe de Saúde e Gestão</h4>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Gargalos no acolhimento matinal e conflito de senhas;</li>
                  <li>Taxa percebida de absenteísmo (*no-show*);</li>
                  <li>Controle de lotes e validade de vacinas em cadernos manuais;</li>
                  <li>Ausência de integração em tempo real com a Secretaria Municipal.</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Seção 3: Avaliação de Proposta de Valor da Plataforma UNBS (Escala Likert de 1 a 5)</h4>
                <p className="text-slate-600 mb-2">Métricas de aceitação das funcionalidades desenvolvidas:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <span className="bg-white p-2 rounded border border-slate-200 font-medium">✓ Agendamento online em 5 etapas</span>
                  <span className="bg-white p-2 rounded border border-slate-200 font-medium">✓ Carteira de vacinação com QR Code</span>
                  <span className="bg-white p-2 rounded border border-slate-200 font-medium">✓ Fila virtual pelo smartphone</span>
                  <span className="bg-white p-2 rounded border border-slate-200 font-medium">✓ Painel TV com sinal sonoro chime</span>
                  <span className="bg-white p-2 rounded border border-slate-200 font-medium">✓ Cancelamento fácil em 1 clique</span>
                  <span className="bg-white p-2 rounded border border-slate-200 font-medium">✓ Alerta automático de estoque mínimo</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              Arquivo completo para cópia imediata: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">docs/tcc/FORMULARIO_GOOGLE_FORMS.md</code>
            </div>
          </div>
        )}

        {/* 3. ABA: ROTEIRO DE PESQUISA DE CAMPO & TRIANGULAÇÃO */}
        {activeTab === 'campo' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs text-xs sm:text-sm">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-mono text-indigo-700 font-bold uppercase tracking-wider">
                Investigação Qualitativa In Loco
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Roteiro de Campo & Matriz de Triangulação (Gargalo x Solução UNBS)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Instrumento para o pesquisador correlacionar cada dor identificada na UBS com a funcionalidade implementada no sistema.
              </p>
            </div>

            {/* Matriz de Triangulação */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 border-b border-slate-200">Gargalo Identificado em Campo</th>
                    <th className="py-2.5 px-3 border-b border-slate-200">Causa Raiz Observada</th>
                    <th className="py-2.5 px-3 border-b border-slate-200">Como a Plataforma UNBS Atua</th>
                    <th className="py-2.5 px-3 border-b border-slate-200">Impacto / Métrica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Filas de madrugada na calçada da UBS</td>
                    <td className="py-2.5 px-3 text-slate-600">Distribuição exclusivamente presencial de fichas</td>
                    <td className="py-2.5 px-3 text-indigo-900 font-medium">Wizard de agendamento online de 5 etapas com vagas em tempo real</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">Fim das filas externas antes da abertura</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Alto absenteísmo (20% a 35% de faltas)</td>
                    <td className="py-2.5 px-3 text-slate-600">Falta de canal prático para o munícipe desmarcar</td>
                    <td className="py-2.5 px-3 text-indigo-900 font-medium">Cancelamento em 1 clique liberando o slot no banco para o próximo</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">Redução de até 60% na ociosidade de médicos</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Chamadas no grito e brigas por prioridade</td>
                    <td className="py-2.5 px-3 text-slate-600">Senhas em papel rasgado sem painel visual e auditivo</td>
                    <td className="py-2.5 px-3 text-indigo-900 font-medium">Painel TV com sinal sonoro bimembrado (chime) e senhas regulamentadas (80+, 60+, PCD)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">Privacidade total (LGPD) e respeito à lei</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Perda de vacinas e falha na rastreabilidade</td>
                    <td className="py-2.5 px-3 text-slate-600">Anotação em cadernos sem aviso de proximidade de vencimento</td>
                    <td className="py-2.5 px-3 text-indigo-900 font-medium">Módulo de sala de vacinas com baixa de lote e alerta prévio de validade</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">Zero aplicação de doses vencidas</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Gestão municipal sem visibilidade das unidades</td>
                    <td className="py-2.5 px-3 text-slate-600">Relatórios manuais atrasados enviados no fim do mês</td>
                    <td className="py-2.5 px-3 text-indigo-900 font-medium">Dashboard da Secretaria com indicadores consolidados e alertas de desabastecimento</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">Decisão preditiva em tempo real</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              Roteiro de entrevistas com perguntas para recepcionistas, médicos, enfermeiros e pacientes disponível em: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">docs/tcc/ROTEIRO_PESQUISA_DE_CAMPO.md</code>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
