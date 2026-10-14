import React, { useState } from 'react';
import { Search, Lightbulb, BookOpen, AlertCircle, Sparkles, Filter, Copy, Check } from 'lucide-react';
import { LOGIC_RULES } from '../data/rules';
import { Connective, LogicRule } from '../types/logic';
import { sound } from '../utils/audio';

export const CheatSheet: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | Connective | 'falsum'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRules = LOGIC_RULES.filter((rule) => {
    const matchesFilter = selectedFilter === 'all' || rule.connective === selectedFilter;
    const matchesQuery =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.uocNotation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleCopySchema = (rule: LogicRule) => {
    sound.playClick();
    const text = `${rule.formalSchema.premises.join('\n')}\n──────\n${rule.formalSchema.conclusion}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(rule.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Manual de Consulta Rápida UOC</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          La Chuleta de Deducción Natural
        </h1>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          Todas las reglas de inferencia del cálculo de Gentzen/Fitch explicadas en lenguaje humano, con esquemas formales y trucos de examen.
        </p>
      </div>

      {/* The 3 Golden Rules Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-2 shadow-2xs">
            I
          </div>
          <h3 className="font-bold text-emerald-950 text-sm mb-1">Reglas de Introducción</h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            <strong>¿Para qué sirven?</strong> Para construir el conector que necesitas en la meta. Mira el conector principal de tu objetivo para saber cuál aplicar.
          </p>
        </div>

        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-2 shadow-2xs">
            E
          </div>
          <h3 className="font-bold text-blue-950 text-sm mb-1">Reglas de Eliminación</h3>
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>¿Para qué sirven?</strong> Para desempacar y aprovechar fórmulas compuestas que ya tienes en tus premisas o líneas anteriores.
          </p>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm mb-2 shadow-2xs">
            [ ]
          </div>
          <h3 className="font-bold text-amber-950 text-sm mb-1">Cajas de Fitch (Hipótesis)</h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Regla de oro:</strong> Una vez cerrada una caja (para I→, I¬ o E∨), ¡sus líneas internas quedan bloqueadas y no se pueden volver a citar!
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar regla por nombre (ej: Modus Ponens, conjunción, RAA...)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'and', label: '∧ Y' },
            { id: 'implies', label: '→ Si...entonces' },
            { id: 'or', label: '∨ O' },
            { id: 'not', label: '¬ No' },
            { id: 'falsum', label: '⊥ Absurdo' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                sound.playClick();
                setSelectedFilter(f.id as typeof selectedFilter);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === f.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {rule.uocNotation}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{rule.name}</h3>
                  </div>
                  {rule.latinName && (
                    <span className="text-xs text-slate-400 italic block mt-0.5">
                      {rule.latinName}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleCopySchema(rule)}
                  title="Copiar esquema de deducción"
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {copiedId === rule.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {rule.description}
              </p>

              {/* Formal Schema (Fitch style box) */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-xs mb-3 shadow-inner border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans uppercase tracking-wider mb-1">
                  Esquema Formal
                </div>
                {rule.formalSchema.premises.map((p, i) => (
                  <div key={i} className="text-slate-300">
                    {p}
                  </div>
                ))}
                <div className="border-t border-slate-700 my-1 w-full" />
                <div className="text-emerald-400 font-bold">
                  {rule.formalSchema.conclusion}
                </div>
                {rule.formalSchema.condition && (
                  <div className="text-[10px] text-amber-400 font-sans mt-1">
                    Nota: {rule.formalSchema.condition}
                  </div>
                )}
              </div>

              {/* Human everyday example */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">
                  Ejemplo Cotidiano:
                </span>
                <p className="text-slate-600 italic">
                  {rule.humanExample.premises.join(' + ')} ➔{' '}
                  <span className="font-bold text-slate-800 not-italic">
                    {rule.humanExample.conclusion}
                  </span>
                </p>
              </div>
            </div>

            {/* Exam Tip */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-start gap-2 text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950">Consejo de Examen UOC: </span>
                {rule.examTip}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
