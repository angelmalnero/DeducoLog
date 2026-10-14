export type TopicId = 'pec1' | 'pec2' | 'pec3' | 'pec4' | 'pec5' | 'pec6' | 'bool' | 'sets';

export interface UocTopic {
  id: TopicId;
  code: string; // 'PEC1', 'PEC2', 'MOD3', etc.
  title: string;
  fullName: string;
  semesterInfo: string;
  description: string;
  iconName: string;
  color: string;
  badgeBg: string;
  keyboardSymbols: string[];
  keyboardLetters: string[];
}

export const UOC_TOPICS: UocTopic[] = [
  {
    id: 'pec1',
    code: 'PEC 1',
    title: 'Lenguaje Formal de Enunciados',
    fullName: 'PEC1 - El lenguaje formal de la lógica de enunciados',
    semesterInfo: 'Lógica UOC (24/25-2)',
    description: 'Formalización de lenguaje natural, conectivas lógicas, tablas de verdad, tautologías y equivalencias lógicas.',
    iconName: 'file-text',
    color: 'from-blue-600 to-indigo-700',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
    keyboardSymbols: ['∧', '∨', '→', '¬', '↔', '≡', '(', ')', 'V', 'F'],
    keyboardLetters: ['p', 'q', 'r', 's', 't'],
  },
  {
    id: 'pec2',
    code: 'PEC 2',
    title: 'Deducción Natural Proposicional',
    fullName: 'PEC2 - La deducción natural: sistema de razonamiento formal',
    semesterInfo: 'Lógica UOC (24/25-2)',
    description: 'Reglas de inferencia de Gentzen, cajas de Fitch, subderivaciones, RAA y demostraciones formales.',
    iconName: 'git-branch',
    color: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
    keyboardSymbols: ['∧', '∨', '→', '¬', '⊥', '↔', '(', ')'],
    keyboardLetters: ['p', 'q', 'r', 's', 't', 'a', 'b', 'c'],
  },
  {
    id: 'pec3',
    code: 'PEC 3',
    title: 'Mecanización y Resolución',
    fullName: 'PEC3 - Mecanización y verificación de razonamientos formales',
    semesterInfo: 'Lógica UOC (24/25-2)',
    description: 'Formas normales FNC/FND, paso a cláusulas, algoritmo de Davis-Putnam y método de resolución proposicional.',
    iconName: 'cpu',
    color: 'from-purple-600 to-violet-700',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
    keyboardSymbols: ['∨', '∧', '¬', '□', '{', '}', ',', '(', ')'],
    keyboardLetters: ['p', 'q', 'r', 's', 'C1', 'C2', 'Res'],
  },
  {
    id: 'pec4',
    code: 'PEC 4',
    title: 'Lógica de Predicados (Lenguaje)',
    fullName: 'PEC4 - El lenguaje formal de la lógica de predicados',
    semesterInfo: 'Lógica UOC (24/25-2)',
    description: 'Formalización en primer orden con cuantificadores ∀ y ∃, constantes, variables libres y ligadas, predicados y funciones.',
    iconName: 'binary',
    color: 'from-amber-600 to-orange-700',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
    keyboardSymbols: ['∀', '∃', '∧', '∨', '→', '¬', '↔', '(', ')', ','],
    keyboardLetters: ['x', 'y', 'z', 'a', 'b', 'c', 'P', 'Q', 'R', 'S'],
  },
  {
    id: 'pec5',
    code: 'PEC 5',
    title: 'Deducción Natural en Predicados',
    fullName: 'PEC5 - La deducción natural en la lógica de predicados',
    semesterInfo: 'Lógica UOC (24/25-2)',
    description: 'Reglas de cuantificación: I∀ (con constante fresca), E∀, I∃ y E∃ (eliminación del existencial en caja de Fitch).',
    iconName: 'compass',
    color: 'from-rose-600 to-pink-700',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800',
    keyboardSymbols: ['∀', '∃', '∧', '∨', '→', '¬', '⊥', '(', ')'],
    keyboardLetters: ['x', 'y', 'z', 'a', 'b', 'c', 'P', 'Q'],
  },
  {
    id: 'pec6',
    code: 'PEC 6',
    title: 'Resolución y Semántica de Predicados',
    fullName: 'PEC6 - El método de resolución y semántica de primer orden',
    semesterInfo: 'Lógica UOC (24/25-2)',
    description: 'Skolemización, forma clausal en primer orden, algoritmo de unificación (mgu), modelos, validez e interpretaciones.',
    iconName: 'sparkles',
    color: 'from-cyan-600 to-blue-800',
    badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-800',
    keyboardSymbols: ['∀', '∃', '∨', '∧', '¬', '□', 'θ', '{', '}', '/', ','],
    keyboardLetters: ['x', 'y', 'f(x)', 'g(x)', 'c', 'P', 'Q'],
  },
  {
    id: 'bool',
    code: 'MOD 3',
    title: 'Álgebra de Boole y Circuitos',
    fullName: 'Módulo 3 - Lógica y Álgebra de Boole',
    semesterInfo: 'Lógica UOC (24/25-2)',
    description: 'Funciones booleanas, compuertas AND/OR/NOT/XOR, simplificación algebraica, mapas de Karnaugh y circuitos digitales.',
    iconName: 'cpu',
    color: 'from-teal-600 to-emerald-800',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800',
    keyboardSymbols: ['·', '+', '¯', '⊕', '0', '1', '≡', '(', ')'],
    keyboardLetters: ['A', 'B', 'C', 'D', 'F', 'X', 'Y'],
  },
  {
    id: 'sets',
    code: 'MOD 4',
    title: 'Teoría de Conjuntos y Relaciones',
    fullName: 'Módulo 4 - Teoría de Conjuntos para Informática',
    semesterInfo: 'Lógica UOC (24/25-2)',
    description: 'Operaciones conjuntistas (unión, intersección, complemento), relaciones de equivalencia, orden parcial y diagramas de Venn.',
    iconName: 'layers',
    color: 'from-indigo-600 to-purple-800',
    badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800',
    keyboardSymbols: ['∪', '∩', '\\', '⊆', '∈', '∉', '∅', '𝕌', '(', ')'],
    keyboardLetters: ['A', 'B', 'C', 'x', 'y', 'R', 'P'],
  },
];
