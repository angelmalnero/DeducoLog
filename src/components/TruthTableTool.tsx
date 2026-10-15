import React, { useState, useMemo } from 'react';
import {
  Table,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Search,
  Filter,
  Check,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { generateTruthTableAnalysis, UOC_NATURAL_PATTERNS } from '../utils/truthTableEngine';
import { expandFormulaSnippets } from '../utils/logicNotation';
import { sound } from '../utils/audio';

export const TruthTableTool: React.FC = () => {
  const [mode, setMode] = useState<'formula' | 'argument'>('argument');
  const [singleFormula, setSingleFormula] = useState('(p → q) ↔ (¬p ∨ q)');
  const [premisesInput, setPremisesInput] = useState('p → q, ¬q');
  const [conclusionInput, setConclusionInput] = useState('¬p');
  const [activeTab, setActiveTab] = useState<'table' | 'natural_language'>('table');

  // Parse premises
  const parsedPremises = useMemo(() => {
    return premisesInput
      .split(',')
      .map((p) => expandFormulaSnippets(p.trim()))
      .filter((p) => p.length > 0);
  }, [premisesInput]);

  const parsedConclusion = useMemo(() => {
    return expandFormulaSnippets(conclusionInput.trim());
  }, [conclusionInput]);

  // Compute truth table analysis
  const analysis = useMemo(() => {
    try {
      if (mode === 'formula') {
        const clean = expandFormulaSnippets(singleFormula.trim());
        return generateTruthTableAnalysis([], clean || 'p');
      } else {
        return generateTruthTableAnalysis(parsedPremises, parsedConclusion || 'q');
      }
    } catch {
      return null;
    }
  }, [mode, singleFormula, parsedPremises, parsedConclusion]);

  const handleInsertSymbol = (sym: string, target: 'formula' | 'premises' | 'conclusion') => {
    sound.playClick();
    if (target === 'formula') {
      setSingleFormula((prev) => expandFormulaSnippets(prev + sym));
    } else if (target === 'premises') {
      setPremisesInput((prev) => expandFormulaSnippets(prev + sym));
    } else {
      setConclusionInput((prev) => expandFormulaSnippets(prev + sym));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full mb-2 border border-indigo-500/20">
            <Table className="w-3.5 h-3.5" />
            <span>Bloque 1 · Lógica Proposicional y Semántica UOC</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tablas de Verdad, Validez y Contraejemplos
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Evalúa fórmulas completas en 2ⁿ filas, identifica Tautologías, Contradicciones o Contingencias,
            y comprueba la validez formal de argumentos buscando filas de contraejemplo (premisas V y conclusión F).
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setMode('argument');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'argument'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Validez de Argumento (⊢)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setMode('formula');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'formula'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Fórmula Individual
          </button>
        </div>
      </div>

      {/* Tabs: Table vs Natural Language Patterns */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('table')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'table'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Calculadora de Tabla & Validez
        </button>
        <button
          onClick={() => setActiveTab('natural_language')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'natural_language'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Diccionario de Giros UOC ("solo si", "a menos que")
        </button>
      </div>

      {activeTab === 'table' ? (
        <>
          {/* Inputs Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            {mode === 'argument' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Premisas (separadas por coma):
                  </label>
                  <input
                    type="text"
                    value={premisesInput}
                    onChange={(e) => setPremisesInput(expandFormulaSnippets(e.target.value))}
                    placeholder="ej: p → q, ¬q"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {/* Quick symbol buttons */}
                  <div className="flex gap-1 mt-2">
                    {['→', '∧', '∨', '¬', '↔', '(', ')'].map((sym) => (
                      <button
                        key={sym}
                        onClick={() => handleInsertSymbol(sym, 'premises')}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Conclusión (Meta ⊢):
                  </label>
                  <input
                    type="text"
                    value={conclusionInput}
                    onChange={(e) => setConclusionInput(expandFormulaSnippets(e.target.value))}
                    placeholder="ej: ¬p"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-1 mt-2">
                    {['→', '∧', '∨', '¬', '↔', '(', ')'].map((sym) => (
                      <button
                        key={sym}
                        onClick={() => handleInsertSymbol(sym, 'conclusion')}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Fórmula a analizar:
                </label>
                <input
                  type="text"
                  value={singleFormula}
                  onChange={(e) => setSingleFormula(expandFormulaSnippets(e.target.value))}
                  placeholder="ej: (p → q) ↔ (¬p ∨ q)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-1 mt-2">
                  {['→', '∧', '∨', '¬', '↔', '(', ')'].map((sym) => (
                    <button
                      key={sym}
                      onClick={() => handleInsertSymbol(sym, 'formula')}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick preset examples from UOC exams */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Ejemplos de Examen:</span>
              <button
                onClick={() => {
                  setMode('argument');
                  setPremisesInput('p → q, ¬q');
                  setConclusionInput('¬p');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono cursor-pointer"
              >
                Modus Tollens (Válido)
              </button>
              <button
                onClick={() => {
                  setMode('argument');
                  setPremisesInput('p → q, q');
                  setConclusionInput('p');
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-mono border border-rose-200 dark:border-rose-800 cursor-pointer"
              >
                Falacia Afirmar Consecuente (Inválido)
              </button>
              <button
                onClick={() => {
                  setMode('formula');
                  setSingleFormula('(p ∧ (p → q)) → q');
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-mono border border-emerald-200 dark:border-emerald-800 cursor-pointer"
              >
                Tautología MP
              </button>
            </div>
          </div>

          {/* Semantic Verdict Banner */}
          {analysis && (
            <div
              className={`rounded-3xl p-5 sm:p-6 border transition-all ${
                analysis.isValidArgument && mode === 'argument'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : analysis.isTautology
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : analysis.isContradiction
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {analysis.isValidArgument || analysis.isTautology ? (
                  <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-6 h-6 shrink-0 text-rose-600 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-base sm:text-lg">
                      {mode === 'argument'
                        ? analysis.isValidArgument
                          ? 'Razonamiento VÁLIDO (Consecuencia Lógica)'
                          : `Razonamiento INVÁLIDO (${analysis.counterexamples.length} Contraejemplo/s)`
                        : analysis.isTautology
                        ? 'TAUTOLOGÍA (Válida en todo modelo)'
                        : analysis.isContradiction
                        ? 'CONTRADICCIÓN (Insatisfacible)'
                        : 'CONTINGENCIA (Satisfacible)'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                    {analysis.semanticVerdict}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Full Truth Table */}
          {analysis && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">
                  Tabla de Verdad Completa ({analysis.rows.length} interpretaciones)
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Variables: {analysis.variables.join(', ')}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      <th className="py-2.5 px-3 text-center w-12 font-bold">#</th>
                      {analysis.variables.map((v) => (
                        <th key={v} className="py-2.5 px-3 text-center border-l border-slate-200 dark:border-slate-800 font-bold">
                          {v}
                        </th>
                      ))}
                      {mode === 'argument' &&
                        parsedPremises.map((p, idx) => (
                          <th
                            key={idx}
                            className="py-2.5 px-3 text-center border-l border-slate-200 dark:border-slate-800 font-bold bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300"
                          >
                            P{idx + 1}: {p}
                          </th>
                        ))}
                      <th
                        className={`py-2.5 px-4 text-center border-l border-slate-200 dark:border-slate-800 font-extrabold ${
                          mode === 'argument'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                            : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                        }`}
                      >
                        {mode === 'argument' ? `Meta ⊢ ${parsedConclusion}` : singleFormula}
                      </th>
                      {mode === 'argument' && (
                        <th className="py-2.5 px-3 text-center border-l border-slate-200 dark:border-slate-800 font-bold">
                          Estado
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.rows.map((row, rIdx) => {
                      const isContra = row.isCounterexample;
                      return (
                        <tr
                          key={rIdx}
                          className={`border-b border-slate-100 dark:border-slate-800/80 transition-colors ${
                            isContra
                              ? 'bg-rose-100/70 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 font-bold'
                              : row.allPremisesTrue && mode === 'argument'
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/30'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-2 px-3 text-center text-slate-400 font-sans text-[11px]">
                            {rIdx + 1}
                          </td>
                          {analysis.variables.map((v) => (
                            <td
                              key={v}
                              className={`py-2 px-3 text-center border-l border-slate-100 dark:border-slate-800 ${
                                row.valuation[v]
                                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                  : 'text-slate-400'
                              }`}
                            >
                              {row.valuation[v] ? 'V (1)' : 'F (0)'}
                            </td>
                          ))}
                          {mode === 'argument' &&
                            row.premiseValues.map((pv, pIdx) => (
                              <td
                                key={pIdx}
                                className={`py-2 px-3 text-center border-l border-slate-100 dark:border-slate-800 ${
                                  pv
                                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                    : 'text-rose-600 dark:text-rose-400'
                                }`}
                              >
                                {pv ? '1' : '0'}
                              </td>
                            ))}
                          <td
                            className={`py-2 px-4 text-center border-l border-slate-100 dark:border-slate-800 font-extrabold ${
                              row.conclusionValue
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {row.conclusionValue ? '1 (V)' : '0 (F)'}
                          </td>
                          {mode === 'argument' && (
                            <td className="py-2 px-3 text-center border-l border-slate-100 dark:border-slate-800 font-sans text-[11px]">
                              {isContra ? (
                                <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300 font-bold bg-rose-200 dark:bg-rose-900/80 px-2 py-0.5 rounded-full">
                                  ⚠️ Contraejemplo
                                </span>
                              ) : row.allPremisesTrue ? (
                                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                                  ✓ Conclusión válida
                                </span>
                              ) : (
                                <span className="text-slate-400">Premisas Falsas</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Natural Language Dictionary view */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UOC_NATURAL_PATTERNS.map((pat) => (
            <div
              key={pat.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {pat.phrasePattern}
                </h3>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  {pat.formalSchema}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {pat.explanation}
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs space-y-1 font-mono">
                <div className="text-slate-500 dark:text-slate-400">
                  Ej: {pat.exampleNatural}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ⊢ {pat.exampleFormal}
                </div>
              </div>
              <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl p-2.5">
                <strong>Clave de Examen:</strong> {pat.examWarning}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
