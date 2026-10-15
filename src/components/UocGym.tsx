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
  Lock,
  Compass,
  ShieldAlert,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { UOC_EXAM_EXERCISES } from '../data/uocExams';
import { LOGIC_RULES } from '../data/rules';
import {
  GymExercise,
  ProofStep,
  ExerciseSavedState,
  StepChoice,
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
  areRulesEquivalent,
  detectMainConnective,
} from '../utils/logicNotation';
import { validateStepSemantics, SemanticValidationResult } from '../utils/fitchValidator';

const STORAGE_GYM_KEY = 'deducolog_uoc_gym_saves_v2';

interface UocGymProps {
  selectedTopicId: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  exercises?: GymExercise[];
  notationStyle?: NotationStyle;
  onToggleNotation?: () => void;
  ruleSetMode?: RuleSetMode;
  onToggleRuleSet?: () => void;
  onOpenCheatSheet?: () => void;
}

export const UocGym: React.FC<UocGymProps> = ({
  selectedTopicId,
  onSelectTopic,
  exercises = UOC_EXAM_EXERCISES,
  notationStyle = 'symbol',
  onToggleNotation,
  ruleSetMode = 'complete',
  onToggleRuleSet,
  onOpenCheatSheet,
}) => {
  const currentTopic = UOC_TOPICS.find((t) => t.id === selectedTopicId) || UOC_TOPICS[1];
  const activeList = exercises.length > 0 ? exercises : UOC_EXAM_EXERCISES;

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

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(activeList[0].id);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('todos');
  const [inputMode, setInputMode] = useState<'cards' | 'manual'>('cards'); // Default to Alura-style card mode
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
      isClosedBlock: false,
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
  const [manualRule, setManualRule] = useState(LOGIC_RULES[0].uocSymbol);
  const [manualSelectedLines, setManualSelectedLines] = useState<number[]>([]);
  const [semanticError, setSemanticError] = useState<SemanticValidationResult | null>(null);

  // Socratic hints state (Levels 1, 2, 3)
  const [socraticLevel, setSocraticLevel] = useState<number>(1);
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
          isClosedBlock: false,
        }))
      );
      setCurrentDepth(0);
      setIsCompleted(false);
    }

    setManualFormula('');
    setManualSelectedLines([]);
    setSemanticError(null);
    setLastFeedback(null);
    setSocraticLevel(1);
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

  // Backward & Forward Reasoning connective detection
  const goalConnectiveAnalysis = detectMainConnective(currentExercise.goal);

  // Generate smart step choices (Alura mode)
  const generateStepChoices = (): StepChoice[] => {
    if (!targetSolutionStep || isCompleted) return [];

    const displayRuleName = formatRuleName(
      targetSolutionStep.rule,
      notationStyle,
      ruleSetMode === 'complete'
    );

    const correctChoice: StepChoice = {
      id: 'choice_correct',
      label: targetSolutionStep.isHypothesis
        ? `[Supuesto] Abrir caja con "${targetSolutionStep.formula}"`
        : targetSolutionStep.closesHypothesis
        ? `[Cerrar Caja] Concluir "${targetSolutionStep.formula}" (${displayRuleName})`
        : `Deducir "${targetSolutionStep.formula}" aplicando ${displayRuleName}`,
      formula: targetSolutionStep.formula,
      rule: targetSolutionStep.rule,
      referencedLines: targetSolutionStep.referencedLines,
      isHypothesis: targetSolutionStep.isHypothesis,
      closesHypothesis: targetSolutionStep.closesHypothesis,
      isCorrect: true,
      explanation: targetSolutionStep.explanation,
    };

    // Distractors tailored to UOC common traps
    const distractors: StepChoice[] = [];
    if (targetSolutionStep.closesHypothesis) {
      distractors.push({
        id: 'distractor_1',
        label: `Cerrar caja citando regla de eliminación (E∧)`,
        formula: targetSolutionStep.formula,
        rule: 'E∧',
        referencedLines: targetSolutionStep.referencedLines,
        isCorrect: false,
        explanation: `Para cerrar una subderivación se usa una regla de Introducción (${displayRuleName}), que es la que formaliza la descarga de la hipótesis.`,
      });
      distractors.push({
        id: 'distractor_2',
        label: `Abrir otra caja de supuesto innecesaria`,
        formula: '⊥',
        rule: 'Supuesto',
        referencedLines: [],
        isCorrect: false,
        explanation: 'Ya has alcanzado la meta dentro de esta caja. ¡Es el momento de cerrarla y cosechar el teorema!',
      });
    } else {
      distractors.push({
        id: 'distractor_1',
        label: `Aplicar Silogismo Disyuntivo (SD) sin negar disyunto`,
        formula: 'q',
        rule: 'SD',
        referencedLines: [1],
        isCorrect: false,
        explanation: 'Para aplicar SD necesitas una disyunción (∨) y la negación estricta de uno de sus miembros.',
      });
    }

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

      // Si se cierra un supuesto, marcamos las líneas dentro de esa caja como inaccesibles (isClosedBlock)
      let updatedPrevSteps = [...steps];
      if (closes) {
        // Encontrar la hipótesis más reciente al nivel actual y marcar las líneas intermedias
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
        formula: choice.formula,
        rule: formatRuleName(choice.rule, notationStyle, ruleSetMode === 'complete'),
        referencedLines: choice.referencedLines,
        depth: newDepth,
        isHypothesis: opens,
        closesHypothesis: closes,
        isClosedBlock: false,
      };

      const updatedSteps = [...updatedPrevSteps, newStep];
      setSteps(updatedSteps);
      setCurrentDepth(newDepth);

      // Check if finished
      const isLastStep = currentSolutionIndex + 1 >= currentExercise.solutionSteps.length;
      if (isLastStep) {
        sound.playLevelComplete();
        setIsCompleted(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setLogiSpeech('¡Q.E.D.! Demostración completa con máxima nota UOC. ¡Eres una máquina de la deducción!');
      } else {
        setLogiSpeech(`¡Correcto! ${choice.explanation}`);
      }
    } else {
      sound.playError();
      setLastFeedback({ isCorrect: false, text: choice.explanation });
      setLogiSpeech(`Atención: ${choice.explanation}`);
    }
  };

  const handleUndoStep = () => {
    if (steps.length <= currentExercise.premises.length) return;
    sound.playClick();
    const prevSteps = steps.slice(0, -1);
    const lastStep = prevSteps[prevSteps.length - 1];
    setSteps(prevSteps);
    setCurrentDepth(lastStep?.depth ?? 0);
    setIsCompleted(false);
    setLastFeedback(null);
    setSemanticError(null);
    setLogiSpeech('Paso deshecho. Puedes intentar otra vía.');
  };

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
        isClosedBlock: false,
      }))
    );
    setCurrentDepth(0);
    setIsCompleted(false);
    setLastFeedback(null);
    setSemanticError(null);
    setSocraticLevel(1);
    setLogiSpeech(currentExercise.strategyOverview);
  };

  // 3-Level Socratic Hint Request Handler
  const handleRequestSocraticHint = () => {
    sound.playClick();

    if (socraticLevel === 1) {
      // Level 1: Estrategia Fabricar vs Romper
      const text =
        targetSolutionStep?.socraticHints?.level1Strategy ||
        `🎯 Nivel 1 (Estrategia): Tu meta es ${currentExercise.goal}. ${goalConnectiveAnalysis.advice}`;
      setLogiSpeech(`💡 Pista Nivel 1: ${text}`);
      setSocraticLevel(2);
    } else if (socraticLevel === 2) {
      // Level 2: Foco en líneas clave
      const refs = targetSolutionStep?.referencedLines || [1];
      const text =
        targetSolutionStep?.socraticHints?.level2Focus ||
        `🔍 Nivel 2 (Foco): Fíjate en las líneas [${refs.join(', ')}]. ¿Qué conector tienen y cómo puedes combinarlo o extraer su información?`;
      setLogiSpeech(`💡 Pista Nivel 2: ${text}`);
      setSocraticLevel(3);
    } else {
      // Level 3: Regla concreta
      const ruleName = formatRuleName(
        targetSolutionStep?.rule || 'I→',
        notationStyle,
        ruleSetMode === 'complete'
      );
      const refs = targetSolutionStep?.referencedLines || [];
      const text =
        targetSolutionStep?.socraticHints?.level3Concrete ||
        `⚡ Nivel 3 (Regla Concreta): Aplica ${ruleName} sobre las líneas [${refs.join(', ')}] para obtener el siguiente paso.`;
      setLogiSpeech(`💡 Pista Nivel 3: ${text}`);
      setSocraticLevel(1); // loop back
    }
  };

  // Manual step validation and submission
  const handleApplyManualStep = () => {
    if (!manualFormula.trim()) {
      sound.playError();
      setSemanticError({
        isValid: false,
        errorType: 'empty_formula',
        title: 'Fórmula vacía',
        explanation: 'Por favor, escribe la fórmula formal que deduces en esta línea.',
      });
      return;
    }

    // Semantic and Scope validation
    const validation = validateStepSemantics(
      steps,
      manualFormula,
      manualRule,
      manualSelectedLines,
      currentExercise.premises,
      currentExercise.goal
    );

    if (!validation.isValid) {
      sound.playError();
      setSemanticError(validation);
      setLogiSpeech(`⚠️ ${validation.title}: ${validation.explanation}`);
      return;
    }

    // Check against target step or match equivalent rules
    sound.playSuccess();
    setSemanticError(null);

    const isClosing =
      manualRule.includes('I→') ||
      manualRule.includes('II') ||
      manualRule.includes('I¬') ||
      manualRule.includes('IN') ||
      manualRule.includes('E∨') ||
      manualRule.includes('ED') ||
      manualRule.includes('RAA');

    const nextDepth = isClosing ? Math.max(0, currentDepth - 1) : currentDepth;

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
      lineNum: steps.length + 1,
      formula: manualFormula.trim(),
      rule: formatRuleName(manualRule, notationStyle, ruleSetMode === 'complete'),
      referencedLines: manualSelectedLines,
      depth: nextDepth,
      closesHypothesis: isClosing,
      isClosedBlock: false,
    };

    const nextSteps = [...updatedPrevSteps, newStep];
    setSteps(nextSteps);
    setCurrentDepth(nextDepth);
    setManualFormula('');
    setManualSelectedLines([]);

    if (manualFormula.trim() === currentExercise.goal.trim() && nextDepth === 0) {
      sound.playLevelComplete();
      setIsCompleted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setLogiSpeech('¡DEMOSTRACIÓN COMPLETADA! Has alcanzado la meta con éxito.');
    } else {
      setLogiSpeech('Paso formal añadido. Continúa deduciendo hacia la meta.');
    }
  };

  const handleOpenManualHypothesis = () => {
    if (!manualFormula.trim()) {
      sound.playError();
      setSemanticError({
        isValid: false,
        errorType: 'empty_formula',
        title: 'Fórmula de supuesto vacía',
        explanation: 'Escribe la fórmula que deseas suponer (ej: p para demostrar p → q).',
      });
      return;
    }

    sound.playClick();
    setSemanticError(null);
    const newStep: ProofStep = {
      id: `step_${Date.now()}`,
      lineNum: steps.length + 1,
      formula: manualFormula.trim(),
      rule: 'Supuesto',
      referencedLines: [],
      depth: currentDepth + 1,
      isHypothesis: true,
      isClosedBlock: false,
    };

    setSteps([...steps, newStep]);
    setCurrentDepth(currentDepth + 1);
    setManualFormula('');
    setLogiSpeech(`Supuesto abierto: [${manualFormula.trim()}]. Ahora deduce hasta la sub-meta para poder cerrarlo.`);
  };

  const filteredExercises = activeList.filter((ex) => {
    return filterDifficulty === 'todos' || ex.difficulty === filterDifficulty;
  });

  const progressPercent = Math.min(
    100,
    Math.round((currentSolutionIndex / currentExercise.solutionSteps.length) * 100)
  );

  const stepChoices = generateStepChoices();

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-28 md:pb-12 space-y-6">
      {/* Topic Selector Dropdown directly above the gym interface */}
      <TopicSelector
        selectedTopicId={selectedTopicId}
        onSelectTopic={onSelectTopic}
      />

      {/* Main Gym Navigation & Config Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>Gimnasio Práctico UOC</span>
              <span>·</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentExercise.uocExamOrigin}</span>
              <span>·</span>
              <span className="capitalize">{currentExercise.difficulty}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{currentExercise.title}</span>
              {isCompleted && (
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> ¡Demostrado!
                </span>
              )}
            </h1>
          </div>

          {/* Quick Controls: Input Mode & Cheat Sheet Drawer */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setInputMode(inputMode === 'cards' ? 'manual' : 'cards');
              }}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              {inputMode === 'cards' ? (
                <>
                  <MousePointerClick className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Modo Toca y Deduce</span>
                </>
              ) : (
                <>
                  <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Modo Teclado Libre</span>
                </>
              )}
            </button>

            {onOpenCheatSheet && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenCheatSheet();
                }}
                className="min-h-[40px] px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-indigo-200 dark:border-indigo-800"
                title="Abrir Chuleta Lateral"
              >
                <BookOpen className="w-4 h-4" />
                <span>Chuleta</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Goal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex-1">
            <div className="flex justify-between font-semibold mb-1 text-slate-600 dark:text-slate-400">
              <span>Progreso de la demostración</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs shrink-0 flex items-center gap-2">
            <span className="text-slate-400">Meta:</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              ⊢ {currentExercise.goal}
            </span>
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
                Conectivo: {goalConnectiveAnalysis.connective.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
              {goalConnectiveAnalysis.advice}
            </p>
          </div>
        </div>

        {/* Socratic Hint 3-Level Button */}
        <button
          onClick={handleRequestSocraticHint}
          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Pedir Pista (Nivel {socraticLevel}/3)</span>
        </button>
      </div>

      {/* Mascot Speech Bubble with Socratic Guidance */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 flex items-start gap-4">
        <MascotOwl mood="thinking" className="w-12 h-12 shrink-0 hidden sm:block" />
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
          {logiSpeech}
        </div>
      </div>

      {/* Exercise Pill Carousel */}
      <div className="overflow-x-auto pb-2 flex items-center gap-2">
        {activeList.map((ex, idx) => {
          const isSelected = ex.id === currentExercise.id;
          const isExDone = savedExercises[ex.id]?.isCompleted;
          return (
            <button
              key={ex.id}
              onClick={() => handleSelectExercise(ex)}
              className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-200/50 dark:bg-slate-800 text-[11px] font-mono flex items-center justify-center">
                {idx + 1}
              </span>
              <span>{ex.title}</span>
              {isExDone && <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />}
            </button>
          );
        })}
      </div>

      {/* Main Two-Zone Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Fitch Proof Table (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-300">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Demostración Formal de Fitch (UOC)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndoStep}
                disabled={steps.length <= currentExercise.premises.length}
                title="Deshacer último paso"
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-30 cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                title="Reiniciar ejercicio"
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <span className="w-8">Línea</span>
            <span className="flex-1 px-3">Fórmula Derivada (Cajas)</span>
            <span className="text-right">Regla UOC</span>
          </div>

          {/* Fitch Lines Container with Scope Locks */}
          <div className="p-3 sm:p-4 space-y-1.5 max-h-[500px] overflow-y-auto font-mono text-sm">
            {steps.map((step, idx) => {
              const isPremise = step.rule === 'Premisa';
              const isRecent = idx === steps.length - 1 && !isPremise;
              const isClosed = !!step.isClosedBlock;

              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all ${
                    isRecent
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 font-bold'
                      : isPremise
                      ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      : isClosed
                      ? 'opacity-60 bg-slate-100/60 dark:bg-slate-800/30 text-slate-500 line-through-none'
                      : 'text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/40'
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
                            isClosed
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
                            : step.formula === currentExercise.goal && step.depth === 0
                            ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                            : 'font-semibold'
                        }`}
                      >
                        {step.formula}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right text-xs">
                    {isClosed && (
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

          <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Cajas abiertas: {currentDepth}</span>
            <span>Total líneas: {steps.length}</span>
          </div>
        </div>

        {/* Right: Actions Deck (Cards or Manual with Live Snippets) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Card-Based Smart Action Selector (Alura Mode) */}
          {inputMode === 'cards' && !isCompleted && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Elige el siguiente paso formal:</span>
                </span>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                  Línea {steps.length + 1}
                </span>
              </div>

              <div className="space-y-2.5">
                {stepChoices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectCardChoice(choice)}
                    className="w-full text-left p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/70 active:scale-[0.99] border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {choice.label}
                        </div>
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Resultado: <span className="font-bold text-indigo-600 dark:text-indigo-400">{choice.formula}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Input Mode with Live Snippets & Keyboard Navigation */}
          {inputMode === 'manual' && !isCompleted && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Modo Libre: Escribe tu propio paso
                </span>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded font-bold">
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
                        setManualFormula((prev) => expandFormulaSnippets(prev + sym));
                      }}
                      className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:bg-indigo-200 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer"
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
                        setManualFormula((prev) => expandFormulaSnippets(prev + letter));
                      }}
                      className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:bg-indigo-200 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      {letter}
                    </button>
                  ))}
                  <button
                    onClick={() => setManualFormula('')}
                    className="min-h-[44px] rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors flex items-center justify-center border border-rose-200 dark:border-rose-800 cursor-pointer"
                  >
                    DEL
                  </button>
                </div>
              </div>

              {/* Formula input with live snippets */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {"Fórmula deducida (autocompleta '->' a '→', '&' a '∧', etc.):"}
                </label>
                <input
                  type="text"
                  value={manualFormula}
                  onChange={(e) => setManualFormula(expandFormulaSnippets(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyManualStep();
                  }}
                  placeholder="ej: p → q  (o usa ->)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Rule selector */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Regla de la UOC:
                </label>
                <select
                  value={manualRule}
                  onChange={(e) => setManualRule(e.target.value)}
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

              {/* Line citation checkboxes */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Líneas citadas como premisas de la regla:
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {steps.map((s) => {
                    const isChecked = manualSelectedLines.includes(s.lineNum);
                    const isLocked = !!s.isClosedBlock;
                    return (
                      <button
                        key={s.lineNum}
                        disabled={isLocked}
                        onClick={() => {
                          setManualSelectedLines((prev) =>
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
                        title={isLocked ? 'Línea de supuesto cerrado (no accesible)' : s.formula}
                      >
                        <span>{s.lineNum}</span>
                        {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleApplyManualStep}
                  className="flex-1 min-h-[44px] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Aplicar Paso (Enter)</span>
                </button>
                <button
                  onClick={handleOpenManualHypothesis}
                  className="min-h-[44px] py-2.5 px-3.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  [ Abrir Supuesto ]
                </button>
              </div>
            </div>
          )}

          {/* Semantic Error Alert Modal / Panel with Truth Table Counterexamples */}
          {semanticError && (
            <div className="bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 rounded-3xl p-5 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-rose-900 dark:text-rose-100">
                    {semanticError.title || 'Error en la demostración'}
                  </h4>
                  <p className="text-xs text-rose-800 dark:text-rose-200 mt-1 leading-relaxed">
                    {semanticError.explanation}
                  </p>
                  {semanticError.pedagogicHint && (
                    <p className="text-xs font-semibold text-rose-950 dark:text-rose-100 mt-2 bg-rose-100/70 dark:bg-rose-900/60 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
                      💡 {semanticError.pedagogicHint}
                    </p>
                  )}
                </div>
              </div>

              {/* Counterexample if applicable */}
              {semanticError.counterexampleTable && (
                <div className="mt-2 bg-white dark:bg-slate-900 rounded-xl p-3 border border-rose-200 dark:border-rose-800 text-xs font-mono space-y-1">
                  <span className="font-bold text-rose-700 dark:text-rose-300 block text-[11px]">
                    Contraejemplo Semántico:
                  </span>
                  <div className="text-slate-500">{semanticError.counterexampleTable.rowDescription}</div>
                  <div className="text-emerald-600">{semanticError.counterexampleTable.premiseTruth}</div>
                  <div className="text-rose-600 font-bold">{semanticError.counterexampleTable.conclusionTruth}</div>
                </div>
              )}
            </div>
          )}

          {/* Completion Celebration Card */}
          {isCompleted && (
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 text-center shadow-lg animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-white text-indigo-700 flex items-center justify-center mx-auto mb-3 font-extrabold text-xl shadow-md">
                ✓
              </div>
              <h3 className="text-lg font-extrabold mb-1">¡Deducción Completada!</h3>
              <p className="text-xs sm:text-sm text-indigo-100 mb-5 leading-relaxed max-w-md mx-auto">
                Has derivado formalmente <strong>{currentExercise.goal}</strong> con total rigor según
                las reglas y alcance de cajas de Fitch de la UOC.
              </p>

              <button
                onClick={() => {
                  const nextIdx =
                    (activeList.findIndex((e) => e.id === currentExercise.id) + 1) %
                    activeList.length;
                  handleSelectExercise(activeList[nextIdx]);
                }}
                className="px-6 py-2.5 bg-white text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                Siguiente Ejercicio UOC
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
