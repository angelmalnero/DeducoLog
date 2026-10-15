import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Cpu,
  Sparkles,
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';
import { Clause } from '../types/logic';
import {
  UOC_RESOLUTION_CHALLENGES,
  ResolutionChallenge,
  resolveClauses,
} from '../utils/resolutionEngine';
import { sound } from '../utils/audio';

export const ResolutionPlayground: React.FC = () => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    UOC_RESOLUTION_CHALLENGES[0].id
  );

  const activeChallenge: ResolutionChallenge =
    UOC_RESOLUTION_CHALLENGES.find((c) => c.id === selectedChallengeId) ||
    UOC_RESOLUTION_CHALLENGES[0];

  const [clauses, setClauses] = useState<Clause[]>(() => activeChallenge.initialClauses);
  const [selectedC1, setSelectedC1] = useState<string | null>(null);
  const [selectedC2, setSelectedC2] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Switch challenge
  const handleSelectChallenge = (ch: ResolutionChallenge) => {
    sound.playClick();
    setSelectedChallengeId(ch.id);
    setClauses(ch.initialClauses);
    setSelectedC1(null);
    setSelectedC2(null);
    setFeedback(null);
    setIsCompleted(false);
  };

  const handleReset = () => {
    sound.playClick();
    setClauses(activeChallenge.initialClauses);
    setSelectedC1(null);
    setSelectedC2(null);
    setFeedback(null);
    setIsCompleted(false);
  };

  const handleSelectClauseForResolution = (id: string) => {
    sound.playClick();
    if (!selectedC1) {
      setSelectedC1(id);
    } else if (selectedC1 === id) {
      setSelectedC1(null);
    } else if (!selectedC2) {
      setSelectedC2(id);
    } else if (selectedC2 === id) {
      setSelectedC2(null);
    } else {
      setSelectedC2(id);
    }
  };

  const handleExecuteResolution = () => {
    if (!selectedC1 || !selectedC2) return;

    const clause1 = clauses.find((c) => c.id === selectedC1);
    const clause2 = clauses.find((c) => c.id === selectedC2);

    if (!clause1 || !clause2) return;

    const result = resolveClauses(clause1, clause2);

    if (!result.canResolve) {
      sound.playError();
      setFeedback({
        isSuccess: false,
        message: result.explanation,
      });
      return;
    }

    sound.playSuccess();
    const newClauseId = `C${clauses.length + 1}`;
    const newClause: Clause = {
      id: newClauseId,
      literals: result.resultingLiterals,
      origin: `Res(${clause1.id}, ${clause2.id})`,
      parentClauseIds: [clause1.id, clause2.id],
      resolvedLiteral: result.cancellingLiteral,
    };

    const nextClauses = [...clauses, newClause];
    setClauses(nextClauses);
    setSelectedC1(null);
    setSelectedC2(null);

    if (result.isEmptyClause) {
      sound.playLevelComplete();
      setIsCompleted(true);
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      setFeedback({
        isSuccess: true,
        message:
          '¡Q.E.D.! Se ha derivado la Cláusula Vacía (□). El conjunto de cláusulas {Premisas ∪ {¬Conclusión}} es INSATISFACIBLE, por lo que el argumento queda formalmente demostrado por resolución refutacional.',
      });
    } else {
      setFeedback({
        isSuccess: true,
        message: result.explanation,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full mb-2 border border-purple-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Bloque 3 · Mecanización y Resolución Refutacional UOC</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Resolución Refutacional y Forma Clausal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Aprende la técnica de demostración automatizada que usan los verificadores formales: añade
            la conclusión negada, resuelve pares de cláusulas con literales opuestos y deriva la cláusula vacía (□).
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reiniciar Refutación</span>
        </button>
      </div>

      {/* Challenge Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {UOC_RESOLUTION_CHALLENGES.map((ch) => {
          const isSelected = ch.id === selectedChallengeId;
          return (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(ch)}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-400 dark:border-purple-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 block mb-1">
                {ch.id.toUpperCase()}
              </span>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                {ch.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {ch.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Current Argument Info */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="text-slate-500">Premisas: </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {activeChallenge.premises.join(', ')}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Conclusión a demostrar: </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {activeChallenge.goal}
          </span>
        </div>
        <div className="text-purple-600 dark:text-purple-400 font-bold">
          Meta de Refutación: Derivar □
        </div>
      </div>

      {/* Main Resolution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Clauses List (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Conjunto de Cláusulas Activo</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({clauses.length} cláusulas)
              </span>
            </h2>
            <span className="text-[11px] text-slate-400">
              Toca dos cláusulas para resolverlas
            </span>
          </div>

          <div className="space-y-2.5">
            {clauses.map((clause) => {
              const isSelected1 = selectedC1 === clause.id;
              const isSelected2 = selectedC2 === clause.id;
              const isSelected = isSelected1 || isSelected2;
              const isEmpty = clause.literals.length === 0;

              return (
                <div
                  key={clause.id}
                  onClick={() => !isCompleted && handleSelectClauseForResolution(clause.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isEmpty
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-400'
                      : isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/70 border-purple-500 ring-2 ring-purple-400/50'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                        isEmpty
                          ? 'bg-emerald-500 text-white'
                          : isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {clause.id}
                    </span>

                    <div>
                      <div className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                        {isEmpty ? (
                          <span className="text-base text-emerald-600 dark:text-emerald-400 font-bold">
                            □ (Cláusula Vacía)
                          </span>
                        ) : (
                          `{ ${clause.literals.join(', ')} }`
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {clause.origin}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">
                      Seleccionada
                    </span>
                  )}
                  {isEmpty && (
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ¡Refutado!
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Resolution Control Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Operador de Resolución
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div
                className={`p-3 rounded-2xl border ${
                  selectedC1
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/60 font-mono font-bold text-purple-700 dark:text-purple-300'
                    : 'border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs'
                }`}
              >
                {selectedC1 ? `Cláusula ${selectedC1}` : 'Selecciona Cláusula 1'}
              </div>
              <div
                className={`p-3 rounded-2xl border ${
                  selectedC2
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/60 font-mono font-bold text-purple-700 dark:text-purple-300'
                    : 'border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs'
                }`}
              >
                {selectedC2 ? `Cláusula ${selectedC2}` : 'Selecciona Cláusula 2'}
              </div>
            </div>

            <button
              onClick={handleExecuteResolution}
              disabled={!selectedC1 || !selectedC2 || isCompleted}
              className="w-full min-h-[44px] py-2.5 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              <span>Resolver Cláusulas Res({selectedC1 || '?'}, {selectedC2 || '?'})</span>
            </button>

            {feedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                  feedback.isSuccess
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                {feedback.message}
              </div>
            )}
          </div>

          {/* Socratic Hint / Theory Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 sm:p-5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Info className="w-4 h-4 text-purple-500" />
              <span>¿Cómo funciona la regla de resolución?</span>
            </div>
            <p className="leading-relaxed">
              Dadas dos cláusulas que contienen un literal complementario como $p$ y $\neg p$, el resolvente
              elimina ambos literales y une todos los restantes:
            </p>
            <div className="font-mono bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-purple-700 dark:text-purple-300 font-bold">
              Res(&#123;p, q&#125;, &#123;¬p, r&#125;) = &#123;q, r&#125;
            </div>
            <p className="leading-relaxed">
              {"Si se resuelven dos cláusulas unitarias complementarias como {q} y {¬q}, se obtiene el conjunto vacío {} = □, lo que certifica la refutación formal."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
