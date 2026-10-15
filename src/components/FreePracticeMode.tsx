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
  Lock,
  Compass,
  ShieldAlert,
} from 'lucide-react';
import { HUNDRED_EXERCISES } from '../data/hundredExercises';
import { LOGIC_RULES } from '../data/rules';
import {
  FreeExercise,
  ProofStep,
  ExerciseSavedState,
  NotationStyle,
  RuleSetMode,
} from '../types/logic';
import { TopicId, UOC_TOPICS } from '../data/topics';
import { TopicSelector } from './TopicSelector';
import { sound } from '../utils/audio';
import { MascotOwl } from './MascotOwl';
import {
  expandFormulaSnippets,
  formatRuleName,
  detectMainConnective,
} from '../utils/logicNotation';
import { validateStepSemantics, SemanticValidationResult } from '../utils/fitchValidator';

const STORAGE_FREE_KEY = 'deducolog_freemode_saves_v1';

interface FreePracticeModeProps {
  onExerciseCompleted: (exerciseId: string) => void;
  completedIds: string[];
  selectedTopicId: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  exercises?: FreeExercise[];
  notationStyle?: NotationStyle;
  onToggleNotation?: () => void;
  ruleSetMode?: RuleSetMode;
  onToggleRuleSet?: () => void;
  onOpenCheatSheet?: () => void;
}

export const FreePracticeMode: React.FC<FreePracticeModeProps> = ({
  onExerciseCompleted,
  completedIds,
  selectedTopicId,
  onSelectTopic,
  exercises = HUNDRED_EXERCISES,
  notationStyle = 'symbol',
  onToggleNotation,
  ruleSetMode = 'complete',
  onToggleRuleSet,
  onOpenCheatSheet,
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
      isClosedBlock: false,
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
  const [selectedRule, setSelectedRule] = useState(LOGIC_RULES[0].uocSymbol);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [semanticError, setSemanticError] = useState<SemanticValidationResult | null>(null);

  // Socratic 3-Level hints
  const [socraticLevel, setSocraticLevel] = useState<number>(1);
  const [logiAdvice, setLogiAdvice] = useState<string>(
    currentEx.hints[0] || 'Empieza analizando las premisas y la meta final.'
  );

  // Backward & Forward connective detection
  const goalAnalysis = detectMainConnective(currentEx.goal);

  // When selected exercise changes
  const handleSelectExercise = (ex: FreeExercise) => {
    sound.playClick();
    setSelectedExId(ex.id);
    const existing = savedProofs[ex.id];

    if (existing && existing.steps?.length > 0) {
      setSteps(existing.steps);
      setCurrentDepth(existing.currentDepth ?? 0);
      setIsCompleted(existing.isCompleted);
    } else {
      setSteps(
        ex.premises.map((p, idx) => ({
          id: `p_${idx}`,
          lineNum: idx + 1,
          formula: p,
          rule: 'Premisa',
          referencedLines: [],
          depth: 0,
          isClosedBlock: false,
        }))
      );
      setCurrentDepth(0);
      setIsCompleted(false);
    }

    setInputFormula('');
    setSelectedLines([]);
    setSemanticError(null);
    setSocraticLevel(1);
    setLogiAdvice(ex.hints[0] || 'Analiza el conector principal de la meta.');
  };

  // Persist state
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

  const handleInsertKey = (val: string) => {
    sound.playClick();
    setInputFormula((prev) => expandFormulaSnippets(prev + val));
  };

  const handleBackspace = () => {
    sound.playClick();
    setInputFormula((prev) => prev.slice(0, -1));
  };

  const handleOpenHypothesis = () => {
    if (!inputFormula.trim()) {
      sound.playError();
      setSemanticError({
        isValid: false,
        errorType: 'empty_formula',
        title: 'Fórmula de supuesto vacía',
        explanation: 'Escribe la fórmula que deseas suponer temporalmente (ej: p).',
      });
      return;
    }

    sound.playClick();
    setSemanticError(null);
    const nextLineNum = steps.length + 1;
    const nextDepth = currentDepth + 1;

    const newStep: ProofStep = {
      id: `step_${Date.now()}`,
      lineNum: nextLineNum,
      formula: inputFormula.trim(),
      rule: 'Supuesto',
      referencedLines: [],
      depth: nextDepth,
      isHypothesis: true,
      isClosedBlock: false,
    };

    setSteps([...steps, newStep]);
    setCurrentDepth(nextDepth);
    setInputFormula('');
    setSelectedLines([]);
    setLogiAdvice(`Caja ${nextDepth} abierta. Desarrolla tu deducción dentro de esta hipótesis.`);
  };

  const handleAddStep = () => {
    if (!inputFormula.trim()) {
      sound.playError();
      setSemanticError({
        isValid: false,
        errorType: 'empty_formula',
        title: 'Fórmula vacía',
        explanation: 'Escribe la fórmula resultante antes de aplicar la regla.',
      });
      return;
    }

    // Run semantic & scope validation
    const validation = validateStepSemantics(
      steps,
      inputFormula,
      selectedRule,
      selectedLines,
      currentEx.premises,
      currentEx.goal
    );

    if (!validation.isValid) {
      sound.playError();
      setSemanticError(validation);
      setLogiAdvice(`⚠️ ${validation.title}: ${validation.explanation}`);
      return;
    }

    sound.playClick();
    setSemanticError(null);
    const nextLineNum = steps.length + 1;

    const isClosing =
      selectedRule.includes('I→') ||
      selectedRule.includes('II') ||
      selectedRule.includes('I¬') ||
      selectedRule.includes('IN') ||
      selectedRule.includes('E∨') ||
      selectedRule.includes('ED') ||
      selectedRule.includes('RAA');

    const nextDepth = isClosing ? Math.max(0, currentDepth - 1) : currentDepth;

    // Lock closed subderivation
    let updatedPrevSteps = [...steps];
    if (isClosing) {
      let lastHypoIdx = -1;
      for (let i = updatedPrevSteps.length - 1; i >= 0; i--) {
        if (updatedPrevSteps[i].isHypothesis && !updatedPrevSteps[i].isClosedBlock) {
          lastHypoIdx = i;
          break;
        }
      }
      if (lastHypoIdx !== -1) {
        for (let i = lastHypoIdx; i < updatedPrevSteps.length; i++) {
          updatedPrevSteps[i] = { ...updatedPrevSteps[i], isClosedBlock: true };
        }
      }
    }

    const newStep: ProofStep = {
      id: `step_${Date.now()}`,
      lineNum: nextLineNum,
      formula: inputFormula.trim(),
      rule: formatRuleName(selectedRule, notationStyle, ruleSetMode === 'complete'),
      referencedLines: selectedLines,
      depth: nextDepth,
      closesHypothesis: isClosing,
      isClosedBlock: false,
    };

    const nextSteps = [...updatedPrevSteps, newStep];
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
      setLogiAdvice('¡FANTÁSTICO! Demostración completada paso a paso como en papel de examen de la UOC.');
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
    setSemanticError(null);
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
        isClosedBlock: false,
      }))
    );
    setCurrentDepth(0);
    setIsCompleted(false);
    setSemanticError(null);
    setSocraticLevel(1);
    setLogiAdvice('Ejercicio reiniciado.');
  };

  const handleRequestSocraticHint = () => {
    sound.playClick();
    if (socraticLevel === 1) {
      setLogiAdvice(`💡 Pista Nivel 1 (Estrategia): Tu meta es ${currentEx.goal}. ${goalAnalysis.advice}`);
      setSocraticLevel(2);
    } else if (socraticLevel === 2) {
      setLogiAdvice(
        `🔍 Pista Nivel 2 (Foco): Revisa las premisas disponibles y busca si puedes descomponer una conjunción (E∧ / EC) o si necesitas suponer el antecedente con I→ (II).`
      );
      setSocraticLevel(3);
    } else {
      const solutionStep = currentEx.solutionSteps[steps.length - currentEx.premises.length];
      if (solutionStep) {
        const ruleName = formatRuleName(solutionStep.rule, notationStyle, ruleSetMode === 'complete');
        setLogiAdvice(
          `⚡ Pista Nivel 3 (Regla Concreta): Aplica ${ruleName} sobre las líneas [${solutionStep.referencedLines.join(', ')}] para avanzar.`
        );
      } else {
        setLogiAdvice(currentEx.hints[0] || 'Concéntrate en la meta final.');
      }
      setSocraticLevel(1);
    }
  };

  const filteredExercises = activeExercises.filter((ex) => {
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
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      {/* Topic Selector Dropdown directly above the intro */}
      <TopicSelector
        selectedTopicId={selectedTopicId}
        onSelectTopic={onSelectTopic}
      />

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full w-fit mb-2 border border-indigo-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Colección {currentTopic.code} · {activeExercises.length} Ejercicios Prácticos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Modo Libre: {currentTopic.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            {currentTopic.description} Resuelve paso a paso con el teclado integrado adaptado a este tema,
            cajas de Fitch con sangrado jerárquico y pistas socráticas en 3 niveles.
          </p>
        </div>

        {/* Global Progress */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shrink-0">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Ejercicios Superados
            </span>
            <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {totalCompleted} / {activeExercises.length}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* PEDAGOGIC PANEL: "🎯 Sub-meta Actual (Fabricar vs Romper)" */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Estrategia Pedagógica UOC
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 font-mono font-bold text-indigo-700 dark:text-indigo-300">
                Conectivo: {goalAnalysis.connective.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
              {goalAnalysis.advice}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestSocraticHint}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Pedir Pista ({socraticLevel}/3)</span>
          </button>

          {onOpenCheatSheet && (
            <button
              onClick={onOpenCheatSheet}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Abrir Chuleta Lateral"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Catalog Selector Strip with Search & Categories */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar entre los ${activeExercises.length} ejercicios (ej: Modus Ponens, #42, De Morgan...)`}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['Todas', 'Conjunción', 'Implicación', 'Disyunción', 'Negación y Absurdo', 'Exámenes UOC'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Carousel of exercise cards */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
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
              <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1.5">
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
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-30 flex items-center justify-center cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                title="Reiniciar ejercicio"
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
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
            <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
              ⊢ Meta: {currentEx.goal}
            </span>
          </div>

          {/* Table Header */}
          <div className="bg-slate-100/70 dark:bg-slate-800/80 px-4 py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 font-mono">
            <span className="w-8">Línea</span>
            <span className="flex-1 px-3">Fórmula (Cajas Fitch)</span>
            <span className="text-right">Regla</span>
          </div>

          {/* Fitch Table Body */}
          <div className="p-3 sm:p-4 space-y-1 max-h-[460px] overflow-y-auto font-mono text-sm">
            {steps.map((step, idx) => {
              const isPremise = step.rule === 'Premisa';
              const isLast = idx === steps.length - 1 && !isPremise;
              const isLocked = !!step.isClosedBlock;

              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all ${
                    isLast
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100 font-bold'
                      : isPremise
                      ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      : isLocked
                      ? 'opacity-60 bg-slate-100/60 dark:bg-slate-800/30 text-slate-500'
                      : 'text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs w-6 tabular-nums">{step.lineNum}.</span>

                    {/* Fitch Indentation Lines */}
                    <div className="flex items-center">
                      {Array.from({ length: step.depth }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3.5 h-7 border-l-2 -ml-1 mr-2 ${
                            isLocked
                              ? 'border-slate-300 dark:border-slate-700'
                              : i === 0
                              ? 'border-amber-500'
                              : i === 1
                              ? 'border-indigo-500'
                              : 'border-rose-500'
                          }`}
                        />
                      ))}
                      <span
                        className={`${
                          step.isHypothesis
                            ? 'text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700 italic font-semibold'
                            : step.formula === currentEx.goal && step.depth === 0
                            ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                            : 'font-semibold'
                        }`}
                      >
                        {step.formula}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right text-xs">
                    {isLocked && (
                      <span title="Línea dentro de una caja de supuesto ya cerrada (inaccesible)">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </span>
                    )}
                    <span className="text-slate-500 dark:text-slate-400 font-sans">
                      {step.rule}
                      {step.referencedLines.length > 0 ? ` ${step.referencedLines.join(', ')}` : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Profundidad cajas: {currentDepth}</span>
            <span>Total líneas: {steps.length}</span>
          </div>
        </div>

        {/* Right: Step Editor & Keyboard */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Teclado Lógico y Editor UOC</span>
              </span>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded font-bold">
                Línea {steps.length + 1}
              </span>
            </div>

            {/* In-App Keyboard: Logic Signs */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Símbolos y Operadores ({currentTopic.code}):
              </span>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 font-mono">
                {currentTopic.keyboardSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleInsertKey(sym)}
                    className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:bg-indigo-200 text-slate-900 dark:text-slate-100 font-bold text-base transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* In-App Keyboard: Letters */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Variables y Constantes:
              </span>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 font-mono">
                {currentTopic.keyboardLetters.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleInsertKey(letter)}
                    className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:bg-indigo-200 text-slate-900 dark:text-slate-100 font-bold text-sm transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                  >
                    {letter}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  className="min-h-[44px] rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors flex items-center justify-center border border-rose-200 dark:border-rose-800 cursor-pointer col-span-2 sm:col-span-1"
                >
                  DEL
                </button>
              </div>
            </div>

            {/* Formula Input Box with live snippets */}
            <div>
              <label htmlFor="free-formula" className="text-[11px] font-semibold text-slate-500 block mb-1">
                {"Fórmula de esta línea (autocompleta '->' a '→', '&' a '∧', etc.):"}
              </label>
              <input
                id="free-formula"
                type="text"
                value={inputFormula}
                onChange={(e) => setInputFormula(expandFormulaSnippets(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddStep();
                }}
                placeholder="Escribe o toca las teclas (ej: p ∧ q)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Rule Selector */}
            <div>
              <label htmlFor="free-rule" className="text-[11px] font-semibold text-slate-500 block mb-1">
                Regla de Inferencia UOC:
              </label>
              <select
                id="free-rule"
                value={selectedRule}
                onChange={(e) => setSelectedRule(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 shadow-2xs outline-none"
              >
                {LOGIC_RULES.filter((r) => ruleSetMode === 'complete' || !r.isDerived).map((rule) => {
                  const label =
                    notationStyle === 'symbol'
                      ? `${rule.uocSymbol} - ${rule.name}`
                      : `${rule.uocAcronym} - ${rule.name}`;
                  return (
                    <option key={rule.id} value={rule.uocSymbol}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Line Selection */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Líneas citadas:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {steps.map((s) => {
                  const isChecked = selectedLines.includes(s.lineNum);
                  const isLocked = !!s.isClosedBlock;
                  return (
                    <button
                      key={s.lineNum}
                      disabled={isLocked}
                      onClick={() => {
                        setSelectedLines((prev) =>
                          prev.includes(s.lineNum)
                            ? prev.filter((x) => x !== s.lineNum)
                            : [...prev, s.lineNum]
                        );
                      }}
                      className={`min-h-[36px] px-2.5 rounded-lg border font-bold transition-all flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed ${
                        isLocked
                          ? 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200'
                          : isChecked
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                      title={isLocked ? 'Caja cerrada inaccesible' : s.formula}
                    >
                      <span>{s.lineNum}</span>
                      {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Semantic Error Panel */}
            {semanticError && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 rounded-2xl text-xs text-rose-900 dark:text-rose-100 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>{semanticError.title || 'Error en el paso'}</span>
                </div>
                <p className="leading-relaxed">{semanticError.explanation}</p>
                {semanticError.pedagogicHint && (
                  <p className="font-semibold text-rose-950 dark:text-rose-200 mt-1">
                    💡 {semanticError.pedagogicHint}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAddStep}
                className="flex-1 min-h-[44px] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Aplicar Regla (Enter)</span>
              </button>
              <button
                onClick={handleOpenHypothesis}
                className="min-h-[44px] py-2.5 px-3.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                [ Abrir Supuesto ]
              </button>
            </div>
          </div>

          {/* Socratic Logi Advice Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 flex items-start gap-3">
            <MascotOwl mood="thinking" className="w-10 h-10 shrink-0 hidden sm:block" />
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
              {logiAdvice}
            </div>
          </div>

          {/* Completion Celebration Card */}
          {isCompleted && (
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 text-center shadow-lg animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-white text-indigo-700 flex items-center justify-center mx-auto mb-3 font-extrabold text-xl shadow-md">
                ✓
              </div>
              <h3 className="text-lg font-extrabold mb-1">¡Ejercicio #{currentEx.number} Completado!</h3>
              <p className="text-xs sm:text-sm text-indigo-100 mb-5 leading-relaxed max-w-md mx-auto">
                Has derivado formalmente <strong>{currentEx.goal}</strong> con el rigor y notación de la UOC.
              </p>

              <button
                onClick={() => {
                  const nextIdx =
                    (activeExercises.findIndex((e) => e.id === currentEx.id) + 1) %
                    activeExercises.length;
                  handleSelectExercise(activeExercises[nextIdx]);
                }}
                className="px-6 py-2.5 bg-white text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                Siguiente Ejercicio (#{currentEx.number + 1})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
