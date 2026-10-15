import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, HelpCircle, CheckCircle, Plus, Trash2, ArrowUpRight, Award, AlertCircle, Sparkles } from 'lucide-react';
import { SANDBOX_CHALLENGES } from '../data/sandboxChallenges';
import { LOGIC_RULES } from '../data/rules';
import { ProofStep, SandboxChallenge } from '../types/logic';
import { sound } from '../utils/audio';
import { MascotOwl } from './MascotOwl';

export const ProofBuilder: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<SandboxChallenge>(SANDBOX_CHALLENGES[0]);
  const [steps, setSteps] = useState<ProofStep[]>(() => {
    return SANDBOX_CHALLENGES[0].premises.map((p: string, idx: number) => ({
      id: `p_${idx}`,
      lineNum: idx + 1,
      formula: p,
      rule: 'Premisa',
      referencedLines: [],
      depth: 0,
    }));
  });

  const [currentDepth, setCurrentDepth] = useState<number>(0);
  const [newFormula, setNewFormula] = useState('');
  const [selectedRule, setSelectedRule] = useState(LOGIC_RULES[0].uocNotation);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [logiAdvice, setLogiAdvice] = useState<string | null>(SANDBOX_CHALLENGES[0].hint);

  const resetToChallenge = (challenge: SandboxChallenge) => {
    sound.playClick();
    setSelectedChallenge(challenge);
    setSteps(
      challenge.premises.map((p: string, idx: number) => ({
        id: `p_${idx}`,
        lineNum: idx + 1,
        formula: p,
        rule: 'Premisa',
        referencedLines: [],
        depth: 0,
      }))
    );
    setCurrentDepth(0);
    setNewFormula('');
    setSelectedLines([]);
    setStepError(null);
    setIsCompleted(false);
    setLogiAdvice(challenge.hint);
  };

  const handleInsertSymbol = (sym: string) => {
    sound.playClick();
    setNewFormula((prev) => prev + sym);
  };

  const handleToggleLine = (lineNum: number) => {
    sound.playClick();
    setSelectedLines((prev) =>
      prev.includes(lineNum) ? prev.filter((l) => l !== lineNum) : [...prev, lineNum].sort((a, b) => a - b)
    );
  };

  const handleOpenHypothesis = () => {
    if (!newFormula.trim()) {
      setStepError('Escribe primero la fórmula que quieres suponer como hipótesis.');
      sound.playError();
      return;
    }

    sound.playClick();
    setStepError(null);
    const nextLineNum = steps.length + 1;
    const newStep: ProofStep = {
      id: `step_${Date.now()}`,
      lineNum: nextLineNum,
      formula: newFormula.trim(),
      rule: 'Hipótesis',
      referencedLines: [],
      depth: currentDepth + 1,
      isHypothesis: true,
    };

    setSteps([...steps, newStep]);
    setCurrentDepth((prev) => prev + 1);
    setNewFormula('');
    setSelectedLines([]);
    setLogiAdvice('¡Caja abierta! Ahora razona dentro de esta hipótesis hasta alcanzar la meta de la caja.');
  };

  const handleAddStep = () => {
    if (!newFormula.trim()) {
      setStepError('Escribe la fórmula que se deduce.');
      sound.playError();
      return;
    }

    sound.playClick();
    setStepError(null);
    const nextLineNum = steps.length + 1;

    // Check if this step closes a hypothesis
    const closes = selectedRule.includes('I→') || selectedRule.includes('I¬') || selectedRule.includes('E∨');
    const newDepth = closes ? Math.max(0, currentDepth - 1) : currentDepth;

    const newStep: ProofStep = {
      id: `step_${Date.now()}`,
      lineNum: nextLineNum,
      formula: newFormula.trim(),
      rule: selectedRule,
      referencedLines: selectedLines,
      depth: newDepth,
      closesHypothesis: closes,
    };

    const nextSteps = [...steps, newStep];
    setSteps(nextSteps);
    setCurrentDepth(newDepth);
    setNewFormula('');
    setSelectedLines([]);

    // Check if goal reached at root depth (0)
    if (newFormula.trim() === selectedChallenge.goal.trim() && newDepth === 0) {
      sound.playLevelComplete();
      setIsCompleted(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setLogiAdvice('¡Q.E.D. (Quod Erat Demonstrandum)! Has alcanzado la meta con éxito y rigor formal.');
    } else {
      sound.playSuccess();
      setLogiAdvice('Paso añadido a la deducción. Sigue avanzando hacia la meta.');
    }
  };

  const handleAutoHint = () => {
    sound.playClick();
    const currentStepIndex = steps.length - selectedChallenge.premises.length;
    if (currentStepIndex < selectedChallenge.solutionSteps.length) {
      const nextSol = selectedChallenge.solutionSteps[currentStepIndex];
      setNewFormula(nextSol.formula);
      setSelectedRule(nextSol.rule);
      setSelectedLines(nextSol.referencedLines);
      setLogiAdvice(`💡 Consejo del búho: ${nextSol.explanation}`);
    } else {
      setLogiAdvice('Ya tienes todos los pasos necesarios, solo verifica tu conclusión final.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title & Challenge Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <span>Laboratorio Práctico</span>
            <span>·</span>
            <span>Cálculo de Fitch / Gentzen</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Constructor Interactivo de Deducción Natural
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Pon a prueba tu razonamiento formal escribiendo y justificando cada paso.
          </p>
        </div>

        {/* Challenge selector dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="challenge-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Reto:
          </label>
          <select
            id="challenge-select"
            value={selectedChallenge.id}
            onChange={(e) => {
              const ch = SANDBOX_CHALLENGES.find((c) => c.id === e.target.value);
              if (ch) resetToChallenge(ch);
            }}
            className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 shadow-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {SANDBOX_CHALLENGES.map((ch) => (
              <option key={ch.id} value={ch.id}>
                [{ch.difficulty.toUpperCase()}] {ch.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Goal & Premise Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-mono font-bold text-sm">
            ⊢ Meta
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Premisas dadas:</span>
              <span className="font-mono text-slate-800 font-semibold">
                {selectedChallenge.premises.join(', ')}
              </span>
            </div>
            <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-2 font-mono">
              <span>Demostrar:</span>
              <span className="text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                {selectedChallenge.goal}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoHint}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Pista del siguiente paso</span>
          </button>
          <button
            onClick={() => resetToChallenge(selectedChallenge)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Reiniciar deducción"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Proof Table (Left) + Step Controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Fitch Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-md border border-slate-800 overflow-x-auto min-h-[380px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-sans border-b border-slate-800 pb-2 mb-3">
              <span className="w-8">Línea</span>
              <span className="flex-1 px-4">Fórmula Derivada (Fitch)</span>
              <span className="text-right">Regla & Líneas</span>
            </div>

            <div className="space-y-1.5 font-mono text-sm">
              {steps.map((step) => {
                const isSelected = selectedLines.includes(step.lineNum);
                return (
                  <div
                    key={step.id}
                    onClick={() => handleToggleLine(step.lineNum)}
                    className={`flex items-center justify-between py-1.5 px-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200'
                        : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs w-6 tabular-nums">{step.lineNum}.</span>

                      {/* Fitch indentation box marker */}
                      <div className="flex items-center">
                        {Array.from({ length: step.depth }).map((_, i) => (
                          <div
                            key={i}
                            className="w-4 h-6 border-l-2 border-amber-400/80 -ml-1 mr-2"
                          />
                        ))}
                        <span className={`font-semibold ${step.isHypothesis ? 'text-amber-300 italic' : 'text-slate-100'}`}>
                          {step.formula}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-400">
                        {step.rule}
                        {step.referencedLines.length > 0 ? ` ${step.referencedLines.join(', ')}` : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table bottom status */}
          <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Líneas seleccionadas para aplicar regla: {selectedLines.length > 0 ? selectedLines.join(', ') : 'Ninguna (haz clic arriba)'}</span>
            <span className="font-mono">Profundidad de caja: {currentDepth}</span>
          </div>
        </div>

        {/* Right: Step Creator Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Añadir Nuevo Paso</span>
              <span className="text-[11px] font-medium text-slate-400 font-mono">
                Línea {steps.length + 1}
              </span>
            </h3>

            {/* Quick symbol inserter */}
            <div className="mb-3">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                Símbolos Lógicos Rápidos:
              </label>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {['∧', '∨', '→', '¬', '⊥', '(', ')', 'p', 'q', 'r', 's'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleInsertSymbol(sym)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 text-sm font-bold transition-colors flex items-center justify-center border border-slate-200"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Formula Input */}
            <div className="mb-3">
              <label htmlFor="formula-input" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                Fórmula a deducir o suponer:
              </label>
              <input
                id="formula-input"
                type="text"
                value={newFormula}
                onChange={(e) => setNewFormula(e.target.value)}
                placeholder="Ej: p ∧ q  o  q → r"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 font-mono text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Rule Selector */}
            <div className="mb-4">
              <label htmlFor="rule-select" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                Regla de Inferencia (UOC):
              </label>
              <select
                id="rule-select"
                value={selectedRule}
                onChange={(e) => setSelectedRule(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 shadow-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {LOGIC_RULES.map((rule) => (
                  <option key={rule.id} value={rule.uocNotation}>
                    {rule.uocNotation} - {rule.name}
                  </option>
                ))}
              </select>
            </div>

            {stepError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{stepError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleAddStep}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Aplicar Regla</span>
              </button>
              <button
                onClick={handleOpenHypothesis}
                title="Abre una subderivación / caja de hipótesis"
                className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                [ Abrir Hipótesis ]
              </button>
            </div>
          </div>

          {/* Logi Tutor Advice Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <MascotOwl
              mood={isCompleted ? 'graduate' : 'thinking'}
              className="w-12 h-12 mb-2"
              speechText={logiAdvice || 'Recuerda mirar la meta para saber qué regla aplicar.'}
            />
          </div>

          {/* Victory Modal Overlay if goal reached */}
          {isCompleted && (
            <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center shadow-lg animate-in zoom-in-95 duration-200">
              <div className="w-10 h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center mx-auto mb-2 font-bold">
                ✓
              </div>
              <h4 className="font-bold text-sm">¡Demostración Completada con Éxito!</h4>
              <p className="text-xs text-emerald-100 mt-1 mb-3">
                Has derivado {selectedChallenge.goal} cumpliendo con todas las normas de Fitch.
              </p>
              <button
                onClick={() => {
                  const nextIndex = (SANDBOX_CHALLENGES.findIndex((c) => c.id === selectedChallenge.id) + 1) % SANDBOX_CHALLENGES.length;
                  resetToChallenge(SANDBOX_CHALLENGES[nextIndex]);
                }}
                className="px-4 py-2 bg-white text-emerald-900 font-bold rounded-xl text-xs shadow hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                Siguiente Reto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
