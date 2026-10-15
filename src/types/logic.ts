export type Connective = 'and' | 'or' | 'implies' | 'not' | 'iff';

export type NotationStyle = 'symbol' | 'acronym'; // 'symbol': I→, E∧ | 'acronym': II, EC, MP
export type RuleSetMode = 'strict' | 'complete'; // 'strict': solo básicas | 'complete': básicas + derivadas (MT, SD, SH, DeM, etc.)
export type PedagogicRole = 'fabricar' | 'romper' | 'auxiliar'; // Fabricar (Introducción), Romper (Eliminación)

export interface LogicRule {
  id: string;
  name: string;
  latinName?: string;
  uocNotation: string; // Notación canónica combinada
  uocSymbol: string; // ej: "I∧", "E→"
  uocAcronym: string; // ej: "IC", "EI (MP)"
  connective: Connective | 'falsum' | 'quantifier' | 'derived';
  category: 'introduction' | 'elimination' | 'derived' | 'quantifier';
  isDerived: boolean;
  pedagogicRole: PedagogicRole;
  description: string;
  whenToUse: string;
  examTip: string;
  formalSchema: {
    premises: string[];
    conclusion: string;
    condition?: string;
  };
  humanExample: {
    premises: string[];
    conclusion: string;
  };
}

export type QuestionType =
  | 'choose_rule'
  | 'choose_conclusion'
  | 'spot_error'
  | 'order_steps'
  | 'real_world_match'
  | 'hypothesis_strategy'
  | 'truth_table_eval'
  | 'clausal_resolution';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  contextFormula?: string;
  contextLines?: { lineNum: number; formula: string; justification: string; depth?: number }[];
  targetPrompt?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  orderedItems?: { id: string; text: string; correctOrder: number; lineNum: number }[];
  hint: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  owlIntroTip: string;
  questions: Question[];
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  accentColor: string;
  lessons: Lesson[];
  masteryBoss: {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    xpReward: number;
  };
}

export interface ProofStep {
  id: string;
  lineNum: number;
  formula: string;
  rule: string;
  referencedLines: number[];
  depth: number;
  isHypothesis?: boolean;
  closesHypothesis?: boolean;
  isClosedBlock?: boolean; // Para cajas de supuestos ya descargadas e inaccesibles
  boxId?: string;
}

export interface SocraticHints {
  level1Strategy: string; // Nivel 1: Estrategia (¿Qué conectivo domina? Fabricar vs Romper)
  level2Focus: string;    // Nivel 2: Foco (Líneas X e Y a observar)
  level3Concrete: string; // Nivel 3: Regla exacta y líneas a citar
}

export interface StepChoice {
  id: string;
  label: string;
  formula: string;
  rule: string;
  referencedLines: number[];
  isHypothesis?: boolean;
  closesHypothesis?: boolean;
  isCorrect: boolean;
  explanation: string;
}

export interface GuidedStep {
  formula: string;
  rule: string;
  referencedLines: number[];
  isHypothesis?: boolean;
  closesHypothesis?: boolean;
  explanation: string;
  hint?: string;
  socraticHints?: SocraticHints;
  choices?: StepChoice[];
}

export interface GymExercise {
  id: string;
  title: string;
  uocExamOrigin: string; // e.g. "Examen UOC 2024", "PEC 2 Lògica"
  difficulty: 'fácil' | 'medio' | 'examen UOC' | 'avanzado';
  category: 'conjunción' | 'implicación' | 'disyunción' | 'absurdo' | 'cajas_anidadas' | 'predicados' | 'resolucion';
  premises: string[];
  goal: string;
  strategyOverview: string;
  hints: string[];
  socraticHints?: SocraticHints;
  subgoals?: string[]; // Sub-metas ordenadas para "Fabricar vs Romper"
  solutionSteps: GuidedStep[];
}

export interface FreeExercise {
  id: string;
  number: number;
  title: string;
  category: string;
  difficulty: 'básico' | 'intermedio' | 'examen' | 'avanzado';
  premises: string[];
  goal: string;
  hints: string[];
  socraticHints?: SocraticHints;
  solutionSteps: {
    formula: string;
    rule: string;
    referencedLines: number[];
    isHypothesis?: boolean;
    closesHypothesis?: boolean;
    explanation: string;
  }[];
}

export interface SandboxChallenge {
  id: string;
  title: string;
  difficulty: string;
  premises: string[];
  goal: string;
  hint: string;
  solutionSteps: {
    formula: string;
    rule: string;
    referencedLines: number[];
    isHypothesis?: boolean;
    closesHypothesis?: boolean;
    explanation?: string;
  }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'progress' | 'streak' | 'mastery' | 'speed';
  icon: string;
  xpReward: number;
  conditionDescription: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface ExerciseSavedState {
  exerciseId: string;
  steps: ProofStep[];
  isCompleted: boolean;
  lastUpdated: string;
  currentDepth: number;
}

export interface UserStats {
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  hearts: number;
  maxHearts: number;
  completedLessonIds: string[];
  lessonStars: Record<string, number>;
  completedBossModuleIds: string[];
  soundEnabled: boolean;
  darkMode: boolean;
  highScoreSpeedDrill: number;
  openedChests: string[];
  unlockedAchievementIds: string[];
  completedFreeExerciseIds: string[];
  preferredNotation?: NotationStyle; // 'symbol' | 'acronym'
  preferredRuleSet?: RuleSetMode;   // 'strict' | 'complete'
}

// Bloque 1: Tipos para Tablas de Verdad y Semántica
export interface TruthTableRow {
  valuation: Record<string, boolean>; // e.g. { p: true, q: false }
  premiseValues: boolean[];
  conclusionValue: boolean;
  allPremisesTrue: boolean;
  isCounterexample: boolean; // allPremisesTrue && !conclusionValue
}

export interface TruthTableAnalysis {
  variables: string[];
  rows: TruthTableRow[];
  isTautology: boolean;
  isContradiction: boolean;
  isContingency: boolean;
  isValidArgument: boolean;
  counterexamples: TruthTableRow[];
  semanticVerdict: string;
}

// Bloque 3: Tipos para Resolución y Forma Clausal
export interface Clause {
  id: string;
  literals: string[]; // e.g. ["p", "¬q"]
  origin: string;     // e.g. "Premisa 1", "Negación Conclusión", "Res(C1, C2)"
  parentClauseIds?: [string, string];
  resolvedLiteral?: string;
}

export interface ResolutionStep {
  clause1Id: string;
  clause2Id: string;
  cancellingLiteral: string;
  resultingClause: string[];
  isEmptyClause: boolean;
}
