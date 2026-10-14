import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Undo2,
  Plus,
  BookOpen,
  Keyboard,
  Check,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Award,
} from 'lucide-react';
import { HUNDRED_EXERCISES } from '../data/hundredExercises';
import { LOGIC_RULES } from '../data/rules';
import { FreeExercise, ProofStep, ExerciseSavedState } from '../types/logic';
import { TopicId, UOC_TOPICS } from '../data/topics';
import { TopicSelector } from './TopicSelector';
import { sound } from '../utils/audio';
import { MascotOwl } from './MascotOwl';

const STORAGE_FREE_KEY = 'deducolog_freemode_saves_v1';

interface FreePracticeModeProps {
  onExerciseCompleted: (exerciseId: string) => void;
  completedIds: string[];
  selectedTopicId: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  exercises?: FreeExercise[];
}

export const FreePracticeMode: React.FC<FreePracticeModeProps> = ({
  onExerciseCompleted,
  completedIds,
  selectedTopicId,
  onSelectTopic,
  exercises = HUNDRED_EXERCISES,
}) => {
  const activeExercises = exercises && exercises.length > 0 ? exercises : HUNDRED_EXERCISES;
  const currentTopic = UOC_TOPICS.find((t) => t.id === selectedTopicId) || UOC_TOPICS[1];

  // Load saved proofs
  const [savedProofs, setSavedProofs] = useState<Record<string, ExerciseSavedState>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_FREE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  });

  const [selectedExId, setSelectedExId] = useState<string>(activeExercises[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState('todos');

  // Reset selected exercise when topic or exercises list changes
  useEffect(() => {
    if (!activeExercises.some((e) => e.id === selectedExId)) {
      setSelectedExId(activeExercises[0].id);
    }
  }, [activeExercises, selectedExId]);

  const currentEx =
    activeExercises.find((e) => e.id === selectedExId) || activeExercises[0];

  // Current Proof Lines
  const [steps, setSteps] = useState<ProofStep[]>(() => {
    const existing = savedProofs[currentEx.id];
    if (existing && existing.steps?.length > 0) return existing.steps;
    return currentEx.premises.map((p, idx) => ({
      id: `p_${idx}`,
      lineNum: idx + 1,
      formula: p,
      rule: 'Premisa',
      referencedLines: [],
      depth: 0,
    }));
  });

  const [currentDepth, setCurrentDepth] = useState<number>(() => {
    return savedProofs[currentEx.id]?.currentDepth ?? 0;
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    return savedProofs[currentEx.id]?.isCompleted || completedIds.includes(currentEx.id);
  });

  // Inputs
  const [inputFormula, setInputFormula] = useState('');
  const [selectedRule, setSelectedRule] = useState(LOGIC_RULES[0].uocNotation);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [stepError, setStepError] = useState<string | null>(null);

  // Progressive help
  const [hintIndex, setHintIndex] = useState(0);
  const [logiAdvice, setLogiAdvice] = useState<string>(
    currentEx.hints[0] || 'Empieza analizando las premisas y la meta final.'
  );

  // When selected exercise changes
  const handleSelectExercise = (ex: FreeExercise) => {
    sound.playClick();
    setSelectedExId(ex.id);
    const existing = savedProofs[ex.id];

    if (existing && existing.steps?.length > 0) {
      setSteps(existing.steps);
      setCurrentDepth(existing.currentDepth ?? 0);
      setIsCompleted(existing.isCompleted || completedIds.includes(ex.id));
    } else {
      setSteps(
        ex.premises.map((p, idx) => ({
          id: `p_${idx}`,
          lineNum: idx + 1,
          formula: p,
          rule: 'Premisa',
          referencedLines: [],
          depth: 0,
        }))
      );
      setCurrentDepth(0);
      setIsCompleted(completedIds.includes(ex.id));
    }

    setInputFormula('');
    setSelectedLines([]);
    setStepError(null);
    setHintIndex(0);
    setLogiAdvice(ex.hints[0] || 'Empieza analizando las premisas y la meta final.');
  };

  // Persistent save
  useEffect(() => {
    const updated: ExerciseSavedState = {
      exerciseId: currentEx.id,
      steps,
      isCompleted,
      lastUpdated: new Date().toISOString(),
      currentDepth,
    };

    setSavedProofs((prev) => {
      const next = { ...prev, [currentEx.id]: updated };
      try {
        localStorage.setItem(STORAGE_FREE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [steps, isCompleted, currentDepth, currentEx.id]);

  const handleInsertKey = (key: string) => {
    sound.playClick();
    setInputFormula((prev) => prev + key);
  };

  const handleBackspace = () => {
    sound.playClick();
    setInputFormula((prev) => prev.slice(0, -1));
  };

  const handleToggleLine = (lineNum: number) => {
    sound.playClick();
    setSelectedLines((prev) =>
      prev.includes(lineNum) ? prev.filter((l) => l !== lineNum) : [...prev, lineNum].sort((a, b) => a - b)
    );
  };

  const handleOpenHypothesis = () => {
    if (!inputFormula.trim()) {
      setStepError('Escribe la fórmula que vas a suponer como hipótesis.');
      sound.playError();
      return;
    }

    sound.playClick();
    setStepError(null);
    const nextLineNum = steps.length + 1;
    const nextDepth = currentDepth + 1;

    const newStep: ProofStep = {
      id: `step_${Date.now()}`,
      lineNum: nextLineNum,
      formula: inputFormula.trim(),
      rule: 'Hipótesis',
      referencedLines: [],
      depth: nextDepth,
      isHypothesis: true,
    };

    setSteps([...steps, newStep]);
    setCurrentDepth(nextDepth);
    setInputFormula('');
    setSelectedLines([]);
    setLogiAdvice(`Caja ${nextDepth} abierta. Desarrolla tu deducción dentro de esta hipótesis.`);
  };

  const handleAddStep = () => {
    if (!inputFormula.trim()) {
      setStepError('Escribe la fórmula resultante antes de aplicar la regla.');
      sound.playError();
      return;
    }

    sound.playClick();
    setStepError(null);
    const nextLineNum = steps.length + 1;

    const isClosing =
      selectedRule.includes('I→') ||
      selectedRule.includes('I¬') ||
      selectedRule.includes('E∨') ||
      selectedRule.includes('RAA');

    const nextDepth = isClosing ? Math.max(0, currentDepth - 1) : currentDepth;

    const newStep: ProofStep = {
      id: `step_${Date.now()}`,
      lineNum: nextLineNum,
      formula: inputFormula.trim(),
      rule: selectedRule,
      referencedLines: selectedLines,
      depth: nextDepth,
      closesHypothesis: isClosing,
    };

    const nextSteps = [...steps, newStep];
    setSteps(nextSteps);
    setCurrentDepth(nextDepth);
    setInputFormula('');
    setSelectedLines([]);

    // Check goal match
    const cleanGoal = currentEx.goal.replace(/\s+/g, '');
    const cleanInput = inputFormula.replace(/\s+/g, '');

    if (cleanInput === cleanGoal && nextDepth === 0) {
      sound.playLevelComplete();
      setIsCompleted(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      onExerciseCompleted(currentEx.id);
      setLogiAdvice('¡FANTÁSTICO! Demostración completada paso a paso como en papel de examen.');
    } else {
      sound.playSuccess();
      setLogiAdvice('Paso formal añadido. Continúa hacia la meta.');
    }
  };

  const handleUndo = () => {
    if (steps.length <= currentEx.premises.length) return;
    sound.playClick();
    const prevSteps = steps.slice(0, -1);
    setSteps(prevSteps);
    const prevDepth = prevSteps.length > 0 ? prevSteps[prevSteps.length - 1].depth : 0;
    setCurrentDepth(prevDepth);
    setIsCompleted(false);
    setLogiAdvice('Paso deshecho. Vuelve a intentarlo.');
  };

  const handleReset = () => {
    sound.playClick();
    setSteps(
      currentEx.premises.map((p, idx) => ({
        id: `p_${idx}`,
        lineNum: idx + 1,
        formula: p,
        rule: 'Premisa',
        referencedLines: [],
        depth: 0,
      }))
    );
    setCurrentDepth(0);
    setIsCompleted(false);
    setInputFormula('');
    setSelectedLines([]);
    setStepError(null);
    setHintIndex(0);
    setLogiAdvice(currentEx.hints[0] || 'Deducción reiniciada.');
  };

  // Step-by-step help button
  const handleRequestHint = () => {
    sound.playClick();
    const hints = currentEx.hints;
    if (hints.length === 0) return;
    const current = hints[hintIndex % hints.length];
    setLogiAdvice(`💡 Pista (${(hintIndex % hints.length) + 1}/${hints.length}): ${current}`);
    setHintIndex((prev) => prev + 1);
  };

  // Auto-fill next step if completely stuck
  const handleSolveNextStep = () => {
    sound.playClick();
    const userStepIdx = steps.length - currentEx.premises.length;
    if (userStepIdx < currentEx.solutionSteps.length) {
      const nextSol = currentEx.solutionSteps[userStepIdx];
      setInputFormula(nextSol.formula);
      setSelectedRule(nextSol.rule);
      setSelectedLines(nextSol.referencedLines);
      setLogiAdvice(`✨ Ayuda paso a paso: ${nextSol.explanation}. ¡Pulsa "Aplicar" para registrarlo!`);
    } else {
      setLogiAdvice('¡Ya tienes todos los pasos necesarios! Revisa tu última línea.');
    }
  };

  // Filter list of 105 exercises
  const filteredExercises = HUNDRED_EXERCISES.filter((ex) => {
    const matchCat = selectedCategory === 'Todas' || ex.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'todos' || ex.difficulty === selectedDifficulty;
    const matchQuery =
      searchQuery === '' ||
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `ejercicio ${ex.number}`.includes(searchQuery.toLowerCase()) ||
      ex.goal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchDiff && matchQuery;
  });

  const totalCompleted = activeExercises.filter(
    (e) => savedProofs[e.id]?.isCompleted || completedIds.includes(e.id)
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-28 md:pb-12">
      {/* Topic Selector Dropdown directly above the intro */}
      <TopicSelector
        selectedTopicId={selectedTopicId}
        onSelectTopic={onSelectTopic}
      />

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full w-fit mb-2 border border-emerald-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Colección {currentTopic.code} · {activeExercises.length} Ejercicios Prácticos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Modo Libre: {currentTopic.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            {currentTopic.description} Resuelve paso a paso con el teclado integrado adaptado a este tema y pide ayuda con pistas en cualquier momento.
          </p>
        </div>

        {/* Global Progress */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shrink-0">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Ejercicios Superados
            </span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {totalCompleted} / {activeExercises.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Catalog Selector Strip with Search & Categories */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar entre los 105 ejercicios (ej: Modus Ponens, #42, De Morgan...)"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['Todas', 'Conjunción', 'Implicación', 'Disyunción', 'Negación y Absurdo', 'Exámenes UOC'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Horizontal Quick-Select Carousel of Numbers */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {filteredExercises.map((ex) => {
            const isSelected = ex.id === currentEx.id;
            const isDone = savedProofs[ex.id]?.isCompleted || completedIds.includes(ex.id);

            return (
              <button
                key={ex.id}
                onClick={() => handleSelectExercise(ex)}
                className={`min-h-[44px] min-w-[56px] px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 border shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 shadow-sm'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
                title={`#${ex.number}: ${ex.title}`}
              >
                <span>#{ex.number}</span>
                {isDone && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Deduction Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Fitch Proof Table (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden transition-colors">
          <div className="bg-slate-900 dark:bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div>
              <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <span>Ejercicio #{currentEx.number}</span>
                <span>·</span>
                <span>{currentEx.category}</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold truncate max-w-[280px] sm:max-w-md">
                {currentEx.title}
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={steps.length <= currentEx.premises.length}
                title="Deshacer último paso"
                className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-30 flex items-center justify-center cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                title="Reiniciar ejercicio"
                className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Goal Ribbon */}
          <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-300">
              Premisas: <strong>{currentEx.premises.length > 0 ? currentEx.premises.join(', ') : 'Ninguna (Teorema)'}</strong>
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100/60 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800">
              ⊢ Meta: {currentEx.goal}
            </span>
          </div>

          {/* Table Header */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span className="w-8">Línea</span>
            <span className="flex-1 px-3">Fórmula Derivada (Cajas Fitch)</span>
            <span className="text-right">Regla</span>
          </div>

          {/* Fitch Proof Lines */}
          <div className="p-3 sm:p-4 space-y-1.5 max-h-[420px] overflow-y-auto font-mono text-sm">
            {steps.map((step) => {
              const isSelected = selectedLines.includes(step.lineNum);
              return (
                <div
                  key={step.id}
                  onClick={() => handleToggleLine(step.lineNum)}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-600 text-emerald-950 dark:text-emerald-200 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs w-6 tabular-nums">{step.lineNum}.</span>

                    {/* Colored Depth Indentations */}
                    <div className="flex items-center">
                      {Array.from({ length: step.depth }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3.5 h-7 border-l-2 -ml-1 mr-2 ${
                            i === 0
                              ? 'border-amber-500'
                              : i === 1
                              ? 'border-blue-500'
                              : 'border-rose-500'
                          }`}
                        />
                      ))}
                      <span
                        className={`${
                          step.isHypothesis
                            ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700 italic font-semibold'
                            : 'font-semibold'
                        }`}
                      >
                        {step.formula}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-sans">
                    {step.rule}
                    {step.referencedLines.length > 0 ? ` ${step.referencedLines.join(', ')}` : ''}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Líneas marcadas: {selectedLines.length > 0 ? selectedLines.join(', ') : 'Ninguna'}</span>
            <span>Cajas abiertas: {currentDepth}</span>
          </div>
        </div>

        {/* Right: Integrated Keypad & Help Deck (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Keyboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Teclado Lógico y de Letras</span>
              </span>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-bold">
                Línea {steps.length + 1}
              </span>
            </div>

            {/* In-App Keyboard: Logic Signs */}
            <div className="mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Símbolos y Operadores ({currentTopic.code}):
              </span>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 font-mono">
                {currentTopic.keyboardSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleInsertKey(sym)}
                    className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:bg-emerald-200 text-slate-900 dark:text-slate-100 font-bold text-base transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* In-App Keyboard: Letters */}
            <div className="mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Variables y Constantes:
              </span>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 font-mono">
                {currentTopic.keyboardLetters.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleInsertKey(letter)}
                    className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:bg-emerald-200 text-slate-900 dark:text-slate-100 font-bold text-sm transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                  >
                    {letter}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  className="min-h-[44px] rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors flex items-center justify-center border border-rose-200 dark:border-rose-800 cursor-pointer col-span-2 sm:col-span-1"
                >
                  DEL
                </button>
              </div>
            </div>

            {/* Formula Input Box */}
            <div className="mb-3">
              <label htmlFor="free-formula" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Fórmula de esta línea:
              </label>
              <input
                id="free-formula"
                type="text"
                value={inputFormula}
                onChange={(e) => setInputFormula(e.target.value)}
                placeholder="Escribe o toca las teclas (ej: p ∧ q)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Rule Selector */}
            <div className="mb-4">
              <label htmlFor="free-rule" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Regla de Inferencia:
              </label>
              <select
                id="free-rule"
                value={selectedRule}
                onChange={(e) => setSelectedRule(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 shadow-2xs outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {LOGIC_RULES.map((rule) => (
                  <option key={rule.id} value={rule.uocNotation}>
                    {rule.uocNotation} - {rule.name}
                  </option>
                ))}
              </select>
            </div>

            {stepError && (
              <div className="mb-3 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                {stepError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleAddStep}
                className="flex-1 min-h-[44px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Aplicar Regla</span>
              </button>
              <button
                onClick={handleOpenHypothesis}
                title="Abre una caja de subderivación temporal"
                className="min-h-[44px] py-2.5 px-3.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                [ Abrir Hipótesis ]
              </button>
            </div>
          </div>

          {/* Help Buttons Deck (Ayuda en cada paso) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestHint}
              className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Pedir Pista de este paso</span>
            </button>
            <button
              onClick={handleSolveNextStep}
              className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Resolver este paso</span>
            </button>
          </div>

          {/* Mascot Live Advice */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-4 sm:p-5 transition-colors">
            <MascotOwl
              mood={isCompleted ? 'graduate' : 'thinking'}
              className="w-14 h-14 mb-2"
              speechText={logiAdvice}
            />
          </div>

          {/* Completion Celebration Card */}
          {isCompleted && (
            <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white rounded-3xl p-6 text-center shadow-lg animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-white text-emerald-800 flex items-center justify-center mx-auto mb-3 font-extrabold text-xl shadow-md">
                ✓
              </div>
              <h3 className="text-lg font-extrabold mb-1">¡Ejercicio #{currentEx.number} Completado!</h3>
              <p className="text-xs sm:text-sm text-emerald-100 mb-5 leading-relaxed max-w-md mx-auto">
                Has derivado formalmente <strong>{currentEx.goal}</strong> con el rigor de la UOC. Tu progreso en la colección de 105 ejercicios ha aumentado.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const nextIdx =
                      (HUNDRED_EXERCISES.findIndex((e) => e.id === currentEx.id) + 1) %
                      HUNDRED_EXERCISES.length;
                    handleSelectExercise(HUNDRED_EXERCISES[nextIdx]);
                  }}
                  className="min-h-[44px] px-6 py-2.5 bg-white text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  Siguiente Ejercicio (#{currentEx.number + 1})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
