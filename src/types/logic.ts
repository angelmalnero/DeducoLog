export type Connective = 'and' | 'or' | 'implies' | 'not' | 'iff';

export interface LogicRule {
  id: string;
  name: string;
  latinName?: string;
  uocNotation: string;
  connective: Connective | 'falsum';
  category: 'introduction' | 'elimination' | 'derived';
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
  | 'hypothesis_strategy';

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
}

export interface SandboxChallenge {
  id: string;
  title: string;
  difficulty: 'fácil' | 'medio' | 'examen UOC';
  premises: string[];
  goal: string;
  hint: string;
  solutionSteps: {
    formula: string;
    rule: string;
    referencedLines: number[];
    isHypothesis?: boolean;
    closesHypothesis?: boolean;
    explanation: string;
  }[];
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
  choices?: StepChoice[];
}

export interface GymExercise {
  id: string;
  title: string;
  uocExamOrigin: string; // e.g. "Examen UOC 2023", "PAC 1 Lògica"
  difficulty: 'fácil' | 'medio' | 'examen UOC' | 'avanzado';
  category: 'conjunción' | 'implicación' | 'disyunción' | 'absurdo' | 'cajas_anidadas';
  premises: string[];
  goal: string;
  strategyOverview: string;
  hints: string[];
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
  solutionSteps: {
    formula: string;
    rule: string;
    referencedLines: number[];
    isHypothesis?: boolean;
    closesHypothesis?: boolean;
    explanation: string;
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
  lessonStars: Record<string, number>; // lessonId -> 1..3 stars
  completedBossModuleIds: string[];
  soundEnabled: boolean;
  darkMode: boolean;
  highScoreSpeedDrill: number;
  openedChests: string[];
  unlockedAchievementIds: string[];
  completedFreeExerciseIds: string[];
}


