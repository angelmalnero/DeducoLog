import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Plus,
  CheckCircle2,
  ChevronRight,
  Filter,
  Award,
  Layers,
  ArrowRight,
  Check,
  Zap,
  Undo2,
  SlidersHorizontal,
  Keyboard,
  MousePointerClick,
  Info,
  Lightbulb,
} from 'lucide-react';
import { UOC_EXAM_EXERCISES } from '../data/uocExams';
import { LOGIC_RULES } from '../data/rules';
import { GymExercise, ProofStep, ExerciseSavedState, StepChoice } from '../types/logic';
import { TopicId, UOC_TOPICS } from '../data/topics';
import { TopicSelector } from './TopicSelector';
import { sound } from '../utils/audio';
import { MascotOwl } from './MascotOwl';

const STORAGE_GYM_KEY = 'deducolog_uoc_gym_saves_v2';

interface UocGymProps {
  selectedTopicId: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  exercises?: GymExercise[];
}

export const UocGym: React.FC<UocGymProps> = ({
  selectedTopicId,
  onSelectTopic,
  exercises = UOC_EXAM_EXERCISES,
}) => {
  const currentTopic = UOC_TOPICS.find((t) => t.id === selectedTopicId) || UOC_TOPICS[1];
  // Load saved progress for all exercises
  const [savedExercises, setSavedExercises] = useState<Record<string, ExerciseSavedState>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_GYM_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return {};
  });

  const activeList = exercises.length > 0 ? exercises : UOC_EXAM_EXERCISES;
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(activeList[0].id);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('todos');
  const [inputMode, setInputMode] = useState<'cards' | 'manual'>('cards'); // Default to Alura-style card mode!
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // When exercises change due to topic switch, reset selectedExerciseId if needed
  useEffect(() => {
    if (!activeList.some((e) => e.id === selectedExerciseId)) {
      setSelectedExerciseId(activeList[0].id);
    }
  }, [activeList, selectedExerciseId]);

  const currentExercise =
    activeList.find((e) => e.id === selectedExerciseId) || activeList[0];

  // Current proof state
  const [steps, setSteps] = useState<ProofStep[]>(() => {
    const existing = savedExercises[currentExercise.id];
    if (existing && existing.steps && existing.steps.length > 0) {
      return existing.steps;
    }
    return currentExercise.premises.map((p, idx) => ({
      id: `p_${idx}`,
      lineNum: idx + 1,
      formula: p,
      rule: 'Premisa',
      referencedLines: [],
      depth: 0,
    }));
  });

  const [currentDepth, setCurrentDepth] = useState<number>(() => {
    const existing = savedExercises[currentExercise.id];
    return existing?.currentDepth ?? 0;
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    return !!savedExercises[currentExercise.id]?.isCompleted;
  });

  // Manual input state (if student toggles manual mode)
  const [manualFormula, setManualFormula] = useState('');
  const [manualRule, setManualRule] = useState(LOGIC_RULES[0].uocNotation);
  const [manualSelectedLines, setManualSelectedLines] = useState<number[]>([]);
  const [stepError, setStepError] = useState<string | null>(null);

  // Progressive hints
  const [hintIndex, setHintIndex] = useState(0);
  const [logiSpeech, setLogiSpeech] = useState<string>(currentExercise.strategyOverview);

  // Sync state when selected exercise changes
  const handleSelectExercise = (ex: GymExercise) => {
    sound.playClick();
    setSelectedExerciseId(ex.id);
    const existing = savedExercises[ex.id];

    if (existing && existing.steps && existing.steps.length > 0) {
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
        }))
      );
      setCurrentDepth(0);
      setIsCompleted(false);
    }

    setManualFormula('');
    setManualSelectedLines([]);
    setStepError(null);
    setLastFeedback(null);
    setHintIndex(0);
    setLogiSpeech(ex.strategyOverview);
  };

  // Save progress persistently
  useEffect(() => {
    const updated: ExerciseSavedState = {
      exerciseId: currentExercise.id,
      steps,
      isCompleted,
      lastUpdated: new Date().toISOString(),
      currentDepth,
    };

    setSavedExercises((prev) => {
      const next = { ...prev, [currentExercise.id]: updated };
      try {
        localStorage.setItem(STORAGE_GYM_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage write issues
      }
      return next;
    });
  }, [steps, isCompleted, currentDepth, currentExercise.id]);

  // Current step index in the solution
  const currentSolutionIndex = steps.length - currentExercise.premises.length;
  const targetSolutionStep = currentExercise.solutionSteps[currentSolutionIndex];

  // Generate 3 to 4 smart Alura-style step cards for the current state
  const generateStepChoices = (): StepChoice[] => {
    if (!targetSolutionStep || isCompleted) return [];

    // The correct step
    const correctChoice: StepChoice = {
      id: 'choice_correct',
      label: targetSolutionStep.isHypothesis
        ? `Abrir caja de hipótesis con "${targetSolutionStep.formula}"`
        : targetSolutionStep.closesHypothesis
        ? `Cerrar caja y concluir "${targetSolutionStep.formula}" (${targetSolutionStep.rule})`
        : `Deducir "${targetSolutionStep.formula}" usando ${targetSolutionStep.rule} en ${targetSolutionStep.referencedLines.join(', ')}`,
      formula: targetSolutionStep.formula,
      rule: targetSolutionStep.rule,
      referencedLines: targetSolutionStep.referencedLines,
      isHypothesis: targetSolutionStep.isHypothesis,
      closesHypothesis: targetSolutionStep.closesHypothesis,
      isCorrect: true,
      explanation: targetSolutionStep.explanation,
    };

    // Plausible distractors (typical UOC student mistakes)
    const distractors: StepChoice[] = [];

    if (targetSolutionStep.isHypothesis) {
      distractors.push({
        id: 'distractor_1',
        label: `Intentar deducir directamente "${currentExercise.goal}" sin abrir hipótesis`,
        formula: currentExercise.goal,
        rule: 'Directo',
        referencedLines: [1],
        isCorrect: false,
        explanation: `¡Ojo! La meta "${currentExercise.goal}" requiere demostrar un condicional o negación. El método formal de la UOC exige abrir una subderivación temporal.`,
      });
      distractors.push({
        id: 'distractor_2',
        label: `Abrir hipótesis con la conclusión en vez del antecedente`,
        formula: currentExercise.goal,
        rule: 'Hipótesis',
        referencedLines: [],
        isCorrect: false,
        explanation: 'En el Teorema de Deducción (I→) debes suponer el antecedente (el lado izquierdo de la flecha), no la conclusión final.',
      });
    } else if (targetSolutionStep.rule.includes('E∧')) {
      distractors.push({
        id: 'distractor_1',
        label: `Aplicar Modus Ponens (E→) directamente sobre la conjunción`,
        formula: 'q',
        rule: 'E→',
        referencedLines: [1, 2],
        isCorrect: false,
        explanation: 'Las premisas unidas con "∧" no son condicionales (→). Primero debes desempaquetar la conjunción con E∧.',
      });
      distractors.push({
        id: 'distractor_2',
        label: `Unir premisas con I∧ sin haber aislado sus componentes`,
        formula: 'p ∧ r',
        rule: 'I∧',
        referencedLines: [1],
        isCorrect: false,
        explanation: 'No puedes inventar una unión sin tener ambas fórmulas ya demostradas en líneas previas independientes.',
      });
    } else if (targetSolutionStep.rule.includes('E→')) {
      distractors.push({
        id: 'distractor_1',
        label: `Aplicar Modus Tollens (MT) en vez de Modus Ponens`,
        formula: `¬${targetSolutionStep.formula}`,
        rule: 'MT',
        referencedLines: targetSolutionStep.referencedLines,
        isCorrect: false,
        explanation: 'Modus Tollens requiere que el consecuente esté negado (¬B). Aquí tienes el antecedente positivo libre, por lo que la regla correcta es Modus Ponens (E→).',
      });
      distractors.push({
        id: 'distractor_2',
        label: `Aplicar Doble Negación (E¬¬)`,
        formula: targetSolutionStep.formula,
        rule: 'E¬¬',
        referencedLines: [1],
        isCorrect: false,
        explanation: 'Ninguna de las fórmulas activas tiene dos signos de negación seguidos (¬¬).',
      });
    } else if (targetSolutionStep.closesHypothesis) {
      distractors.push({
        id: 'distractor_1',
        label: `Cerrar la caja usando E∧ en vez de ${targetSolutionStep.rule}`,
        formula: targetSolutionStep.formula,
        rule: 'E∧',
        referencedLines: targetSolutionStep.referencedLines,
        isCorrect: false,
        explanation: `Para cerrar una subderivación se usa una regla de Introducción (${targetSolutionStep.rule}), que es la que formaliza la descarga de la hipótesis.`,
      });
      distractors.push({
        id: 'distractor_2',
        label: `Abrir otra caja de hipótesis innecesaria`,
        formula: '⊥',
        rule: 'Hipótesis',
        referencedLines: [],
        isCorrect: false,
        explanation: 'Ya has alcanzado la meta dentro de esta caja. ¡Es el momento de cerrarla y cosechar el teorema!',
      });
    } else {
      distractors.push({
        id: 'distractor_1',
        label: `Aplicar Silogismo Disyuntivo (SD)`,
        formula: 'q',
        rule: 'SD',
        referencedLines: [1],
        isCorrect: false,
        explanation: 'Para aplicar SD necesitas una disyunción (∨) y la negación de uno de sus miembros.',
      });
    }

    // Combine and shuffle choices deterministically for this step
    const all = [correctChoice, ...distractors].slice(0, 3);
    return all.sort((a, b) => a.label.localeCompare(b.label));
  };

  const handleSelectCardChoice = (choice: StepChoice) => {
    if (choice.isCorrect) {
      sound.playSuccess();
      setLastFeedback({ isCorrect: true, text: choice.explanation });

      const nextLineNum = steps.length + 1;
      const closes = !!choice.closesHypothesis;
      const opens = !!choice.isHypothesis;
      const newDepth = opens
        ? currentDepth + 1
        : closes
        ? Math.max(0, currentDepth - 1)
        : currentDepth;

      const newStep: ProofStep = {
        id: `step_${Date.now()}`,
        lineNum: nextLineNum,
        formula: choice.formula,
        rule: choice.rule,
        referencedLines: choice.referencedLines,
        depth: newDepth,
        isHypothesis: opens,
        closesHypothesis: closes,
      };

      const updatedSteps = [...steps, newStep];
      setSteps(updatedSteps);
      setCurrentDepth(newDepth);

      // Check if finished
      const isLastStep = currentSolutionIndex + 1 >= currentExercise.solutionSteps.length;
      if (isLastStep) {
        sound.playLevelComplete();
        setIsCompleted(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setLogiSpeech('¡Q.E.D.! Demostración completa con máxima nota. ¡Eres una máquina de la deducción!');
      } else {
        setLogiSpeech(`¡Muy bien! ${choice.explanation}`);
      }
    } else {
      sound.playError();
      setLastFeedback({ isCorrect: false, text: choice.explanation });
      setLogiSpeech(`Logi te aconseja: ${choice.explanation}`);
    }
  };

  // Undo last step
  const handleUndoStep = () => {
    if (steps.length <= currentExercise.premises.length) return;
    sound.playClick();
    const lastStep = steps[steps.length - 1];
    const prevSteps = steps.slice(0, -1);
    setSteps(prevSteps);

    // Calculate previous depth
    const prevDepth = prevSteps.length > 0 ? prevSteps[prevSteps.length - 1].depth : 0;
    setCurrentDepth(prevDepth);
    setIsCompleted(false);
    setLastFeedback(null);
    setLogiSpeech('Paso deshecho. Vuelve a intentarlo.');
  };

  // Reset exercise
  const handleReset = () => {
    sound.playClick();
    setSteps(
      currentExercise.premises.map((p, idx) => ({
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
    setLastFeedback(null);
    setHintIndex(0);
    setLogiSpeech(currentExercise.strategyOverview);
  };

  // Hint provider
  const handleRequestHint = () => {
    sound.playClick();
    const hints = currentExercise.hints;
    if (hints.length === 0) return;
    const hint = hints[hintIndex % hints.length];
    setLogiSpeech(`💡 Pista (${(hintIndex % hints.length) + 1}/${hints.length}): ${hint}`);
    setHintIndex((prev) => prev + 1);
  };

  const filteredExercises = activeList.filter((ex) => {
    return filterDifficulty === 'todos' || ex.difficulty === filterDifficulty;
  });

  const completedCount = Object.values(savedExercises).filter((s) => s.isCompleted).length;
  const progressPercent = Math.min(
    100,
    Math.round((currentSolutionIndex / currentExercise.solutionSteps.length) * 100)
  );

  const stepChoices = generateStepChoices();

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-28 md:pb-12">
      {/* Topic Selector Dropdown directly above the gym interface */}
      <TopicSelector
        selectedTopicId={selectedTopicId}
        onSelectTopic={onSelectTopic}
      />

      {/* Alura-style Top Navigation & Progress */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs mb-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>Gimnasio Práctico UOC</span>
              <span>·</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{currentExercise.uocExamOrigin}</span>
              <span>·</span>
              <span className="capitalize">{currentExercise.difficulty}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{currentExercise.title}</span>
              {isCompleted && (
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> ¡Completado!
                </span>
              )}
            </h1>
          </div>

          {/* Mode switch (Alura Cards vs Manual Keyboard) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setInputMode(inputMode === 'cards' ? 'manual' : 'cards');
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              {inputMode === 'cards' ? (
                <>
                  <MousePointerClick className="w-4 h-4 text-emerald-600" />
                  <span>Modo Toca y Deduce (Recomendado)</span>
                </>
              ) : (
                <>
                  <Keyboard className="w-4 h-4 text-blue-600" />
                  <span>Modo Teclado Libre</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Goal Strip & Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700">
              Premisas: <strong className="text-slate-900">{currentExercise.premises.join(', ')}</strong>
            </div>
            <div className="font-mono bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-900 font-bold flex items-center gap-1.5">
              <span>⊢ Meta:</span>
              <span className="text-emerald-700 underline decoration-emerald-500 underline-offset-4">
                {currentExercise.goal}
              </span>
            </div>
          </div>

          {/* Step Progress Pill */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 font-mono">
              Paso {Math.min(currentSolutionIndex, currentExercise.solutionSteps.length)} de{' '}
              {currentExercise.solutionSteps.length}
            </span>
            <div className="w-28 sm:w-36 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Carousel Pill Strip */}
      <div className="mb-6 overflow-x-auto pb-2 flex items-center gap-2">
        {UOC_EXAM_EXERCISES.map((ex, idx) => {
          const isSelected = ex.id === currentExercise.id;
          const isExDone = savedExercises[ex.id]?.isCompleted;
          return (
            <button
              key={ex.id}
              onClick={() => handleSelectExercise(ex)}
              className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-200/40 text-[11px] font-mono flex items-center justify-center">
                {idx + 1}
              </span>
              <span>{ex.title}</span>
              {isExDone && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
            </button>
          );
        })}
      </div>

      {/* Main Two-Zone Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Fitch Proof Table (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-300">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Demostración Formal de Fitch (UOC)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndoStep}
                disabled={steps.length <= currentExercise.premises.length}
                title="Deshacer último paso"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-30 cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                title="Reiniciar ejercicio"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
            <span className="w-8">Línea</span>
            <span className="flex-1 px-3">Fórmula Derivada (Cajas)</span>
            <span className="text-right">Regla & Cita</span>
          </div>

          {/* Fitch Lines Container */}
          <div className="p-3 sm:p-4 space-y-1.5 max-h-[460px] overflow-y-auto font-mono text-sm">
            {steps.map((step, idx) => {
              const isPremise = step.rule === 'Premisa';
              const isRecent = idx === steps.length - 1 && !isPremise;

              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all ${
                    isRecent
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold'
                      : isPremise
                      ? 'bg-slate-50 text-slate-700'
                      : 'text-slate-900 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs w-6 tabular-nums">{step.lineNum}.</span>

                    {/* Fitch Colored Box Indentation Lines */}
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
                            ? 'text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300 italic font-semibold'
                            : step.formula === currentExercise.goal && step.depth === 0
                            ? 'text-emerald-700 font-extrabold'
                            : 'font-semibold'
                        }`}
                      >
                        {step.formula}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-500 font-sans">
                      {step.rule}
                      {step.referencedLines.length > 0 ? ` ${step.referencedLines.join(', ')}` : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Cajas de hipótesis abiertas: {currentDepth}</span>
            <span>Líneas totales: {steps.length}</span>
          </div>
        </div>

        {/* Right: Alura-style Action Deck & Tutor Feedback (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Card-Based Smart Action Selector (Alura Mode) */}
          {inputMode === 'cards' && !isCompleted && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tu Turno: ¿Qué paso aplicas a continuación?
                </span>
                <button
                  onClick={handleRequestHint}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pedir Pista</span>
                </button>
              </div>

              {/* 3 Interactive Alura-style Deduction Cards */}
              <div className="space-y-2.5">
                {stepChoices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectCardChoice(choice)}
                    className="w-full text-left p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 active:bg-emerald-100/60 transition-all duration-150 flex items-start justify-between gap-3 group cursor-pointer shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-950">
                        {choice.label}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                        <span>Fórmula:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                          {choice.formula}
                        </span>
                        <span>·</span>
                        <span>Regla: {choice.rule}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Input Mode when student toggles it */}
          {inputMode === 'manual' && !isCompleted && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Modo Libre: Escribe tu propio paso
                </span>
                <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Línea {steps.length + 1}
                </span>
              </div>

              {/* Quick Symbol Keys */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 font-mono">
                  {currentTopic.keyboardSymbols.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => {
                        sound.playClick();
                        setManualFormula((prev) => prev + sym);
                      }}
                      className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:bg-emerald-200 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 font-mono">
                  {currentTopic.keyboardLetters.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => {
                        sound.playClick();
                        setManualFormula((prev) => prev + letter);
                      }}
                      className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:bg-emerald-200 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      {letter}
                    </button>
                  ))}
                  <button
                    onClick={() => setManualFormula('')}
                    className="min-h-[44px] rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors flex items-center justify-center border border-rose-200 dark:border-rose-800 cursor-pointer"
                  >
                    DEL
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={manualFormula}
                onChange={(e) => setManualFormula(e.target.value)}
                placeholder="Fórmula resultante (ej: p ∧ q)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              <select
                value={manualRule}
                onChange={(e) => setManualRule(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 shadow-2xs outline-none"
              >
                {LOGIC_RULES.map((rule) => (
                  <option key={rule.id} value={rule.uocNotation}>
                    {rule.uocNotation} - {rule.name}
                  </option>
                ))}
              </select>

              {stepError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {stepError}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    if (!manualFormula.trim()) {
                      setStepError('Escribe la fórmula que se deduce.');
                      sound.playError();
                      return;
                    }
                    sound.playClick();
                    setStepError(null);
                    const isClosing =
                      manualRule.includes('I→') ||
                      manualRule.includes('I¬') ||
                      manualRule.includes('E∨') ||
                      manualRule.includes('RAA');
                    const nextDepth = isClosing ? Math.max(0, currentDepth - 1) : currentDepth;
                    const newStep: ProofStep = {
                      id: `step_${Date.now()}`,
                      lineNum: steps.length + 1,
                      formula: manualFormula.trim(),
                      rule: manualRule,
                      referencedLines: manualSelectedLines,
                      depth: nextDepth,
                      closesHypothesis: isClosing,
                    };
                    const updated = [...steps, newStep];
                    setSteps(updated);
                    setCurrentDepth(nextDepth);
                    setManualFormula('');
                    setManualSelectedLines([]);

                    if (
                      manualFormula.replace(/\s+/g, '') === currentExercise.goal.replace(/\s+/g, '') &&
                      nextDepth === 0
                    ) {
                      sound.playLevelComplete();
                      setIsCompleted(true);
                      confetti({ particleCount: 90, spread: 70 });
                      setLogiSpeech('¡Demostración completada con éxito!');
                    }
                  }}
                  className="flex-1 min-h-[44px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Aplicar Paso
                </button>
                <button
                  onClick={() => {
                    if (!manualFormula.trim()) {
                      setStepError('Escribe la fórmula de la hipótesis.');
                      sound.playError();
                      return;
                    }
                    sound.playClick();
                    setStepError(null);
                    const newStep: ProofStep = {
                      id: `step_${Date.now()}`,
                      lineNum: steps.length + 1,
                      formula: manualFormula.trim(),
                      rule: 'Hipótesis',
                      referencedLines: [],
                      depth: currentDepth + 1,
                      isHypothesis: true,
                    };
                    setSteps([...steps, newStep]);
                    setCurrentDepth((prev) => prev + 1);
                    setManualFormula('');
                  }}
                  className="min-h-[44px] py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  [ Hipótesis ]
                </button>
              </div>
            </div>
          )}

          {/* Feedback Drawer (Pedagogical explanation of last action) */}
          {lastFeedback && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed flex items-start gap-3 animate-in fade-in duration-200 ${
                lastFeedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              {lastFeedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block mb-0.5">
                  {lastFeedback.isCorrect ? '¡Paso correcto!' : 'Paso no válido:'}
                </strong>
                <span>{lastFeedback.text}</span>
              </div>
            </div>
          )}

          {/* Mascot Owl Live Guidance Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 sm:p-5">
            <MascotOwl
              mood={isCompleted ? 'graduate' : 'thinking'}
              className="w-14 h-14 mb-2"
              speechText={logiSpeech}
            />
          </div>

          {/* Victory Card when Finished */}
          {isCompleted && (
            <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white rounded-3xl p-6 text-center shadow-lg animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-white text-emerald-800 flex items-center justify-center mx-auto mb-3 font-extrabold text-xl shadow-md">
                ✓
              </div>
              <h3 className="text-lg font-extrabold mb-1">¡Demostración UOC Completada con Éxito!</h3>
              <p className="text-xs sm:text-sm text-emerald-100 mb-5 leading-relaxed max-w-md mx-auto">
                Has derivado <strong>{currentExercise.goal}</strong> siguiendo las reglas formales de Gentzen y Fitch. Este ejercicio ha quedado registrado con éxito.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const nextIdx =
                      (UOC_EXAM_EXERCISES.findIndex((e) => e.id === currentExercise.id) + 1) %
                      UOC_EXAM_EXERCISES.length;
                    handleSelectExercise(UOC_EXAM_EXERCISES[nextIdx]);
                  }}
                  className="min-h-[44px] px-6 py-2.5 bg-white text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  Siguiente Ejercicio UOC
                </button>
                <button
                  onClick={handleReset}
                  className="min-h-[44px] px-4 py-2.5 bg-emerald-800/60 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors border border-emerald-500/30 cursor-pointer"
                >
                  Volver a Repetir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
