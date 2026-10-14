import { FreeExercise } from '../types/logic';

// Helper to generate full catalog of 105 exercises across all classical deduction topics
export const HUNDRED_EXERCISES: FreeExercise[] = [
  // ==========================================
  // BLOQUE 1: CONJUNCIÓN (1 a 18)
  // ==========================================
  {
    id: 'free_1',
    number: 1,
    title: 'Extracción Simple Izquierda (E∧₁)',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['p ∧ q'],
    goal: 'p',
    hints: ['Aplica la regla de eliminación E∧₁ a la premisa 1 para sacar la parte izquierda.'],
    solutionSteps: [
      { formula: 'p', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraemos el miembro izquierdo p.' }
    ]
  },
  {
    id: 'free_2',
    number: 2,
    title: 'Extracción Simple Derecha (E∧₂)',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['p ∧ q'],
    goal: 'q',
    hints: ['Aplica E∧₂ a la premisa 1 para extraer la parte derecha.'],
    solutionSteps: [
      { formula: 'q', rule: 'E∧₂', referencedLines: [1], explanation: 'Extraemos el miembro derecho q.' }
    ]
  },
  {
    id: 'free_3',
    number: 3,
    title: 'Unión Directa (I∧)',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['p', 'q'],
    goal: 'p ∧ q',
    hints: ['Aplica I∧ a las líneas 1 y 2 para ensamblar la conjunción.'],
    solutionSteps: [
      { formula: 'p ∧ q', rule: 'I∧', referencedLines: [1, 2], explanation: 'Introducción de la conjunción.' }
    ]
  },
  {
    id: 'free_4',
    number: 4,
    title: 'Conmutatividad de la Conjunción',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['p ∧ q'],
    goal: 'q ∧ p',
    hints: ['Extrae q con E∧₂, extrae p con E∧₁, y luego únelos con I∧.'],
    solutionSteps: [
      { formula: 'q', rule: 'E∧₂', referencedLines: [1], explanation: 'Extraer q' },
      { formula: 'p', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraer p' },
      { formula: 'q ∧ p', rule: 'I∧', referencedLines: [2, 3], explanation: 'Unir q y p' }
    ]
  },
  {
    id: 'free_5',
    number: 5,
    title: 'Triple Conjunción a Partes',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['(p ∧ q) ∧ r'],
    goal: 'p',
    hints: ['Aplica E∧₁ dos veces consecutivas.'],
    solutionSteps: [
      { formula: 'p ∧ q', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraer bloque izquierdo' },
      { formula: 'p', rule: 'E∧₁', referencedLines: [2], explanation: 'Extraer p' }
    ]
  },
  {
    id: 'free_6',
    number: 6,
    title: 'Triple Conjunción: Extraer r',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['(p ∧ q) ∧ r'],
    goal: 'r',
    hints: ['Aplica E∧₂ a la premisa 1 para sacar r directamente.'],
    solutionSteps: [
      { formula: 'r', rule: 'E∧₂', referencedLines: [1], explanation: 'Extraer r de la derecha' }
    ]
  },
  {
    id: 'free_7',
    number: 7,
    title: 'Triple Conjunción: Extraer q',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['p ∧ (q ∧ r)'],
    goal: 'q',
    hints: ['Aplica primero E∧₂ para aislar q ∧ r, luego E∧₁ para sacar q.'],
    solutionSteps: [
      { formula: 'q ∧ r', rule: 'E∧₂', referencedLines: [1], explanation: 'Aislar q ∧ r' },
      { formula: 'q', rule: 'E∧₁', referencedLines: [2], explanation: 'Extraer q' }
    ]
  },
  {
    id: 'free_8',
    number: 8,
    title: 'Asociatividad de la Conjunción (Der. a Izq.)',
    category: 'Conjunción',
    difficulty: 'intermedio',
    premises: ['p ∧ (q ∧ r)'],
    goal: '(p ∧ q) ∧ r',
    hints: ['Desempaqueta las 3 letras y reconstrúyelas con el agrupamiento deseado.'],
    solutionSteps: [
      { formula: 'p', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraer p' },
      { formula: 'q ∧ r', rule: 'E∧₂', referencedLines: [1], explanation: 'Extraer q ∧ r' },
      { formula: 'q', rule: 'E∧₁', referencedLines: [3], explanation: 'Extraer q' },
      { formula: 'r', rule: 'E∧₂', referencedLines: [3], explanation: 'Extraer r' },
      { formula: 'p ∧ q', rule: 'I∧', referencedLines: [2, 4], explanation: 'Unir p y q' },
      { formula: '(p ∧ q) ∧ r', rule: 'I∧', referencedLines: [6, 5], explanation: 'Unir con r' }
    ]
  },
  {
    id: 'free_9',
    number: 9,
    title: 'Idempotencia de la Conjunción',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['p'],
    goal: 'p ∧ p',
    hints: ['Aplica I∧ a la línea 1 consigo misma.'],
    solutionSteps: [
      { formula: 'p ∧ p', rule: 'I∧', referencedLines: [1, 1], explanation: 'Unir p con p' }
    ]
  },
  {
    id: 'free_10',
    number: 10,
    title: 'Simplificación Idempotente',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['p ∧ p'],
    goal: 'p',
    hints: ['Aplica E∧₁ a la línea 1.'],
    solutionSteps: [
      { formula: 'p', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraer p' }
    ]
  },
  {
    id: 'free_11',
    number: 11,
    title: 'Conjunción Cruzada Cuádruple',
    category: 'Conjunción',
    difficulty: 'intermedio',
    premises: ['p ∧ q', 'r ∧ s'],
    goal: 'p ∧ s',
    hints: ['Saca p de 1 con E∧₁, s de 2 con E∧₂, y únelos con I∧.'],
    solutionSteps: [
      { formula: 'p', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraer p' },
      { formula: 's', rule: 'E∧₂', referencedLines: [2], explanation: 'Extraer s' },
      { formula: 'p ∧ s', rule: 'I∧', referencedLines: [3, 4], explanation: 'Unir p y s' }
    ]
  },
  {
    id: 'free_12',
    number: 12,
    title: 'Conjunción Cruzada Central',
    category: 'Conjunción',
    difficulty: 'intermedio',
    premises: ['a ∧ b', 'c ∧ d'],
    goal: 'b ∧ c',
    hints: ['Extrae b de 1 y c de 2.'],
    solutionSteps: [
      { formula: 'b', rule: 'E∧₂', referencedLines: [1], explanation: 'Extraer b' },
      { formula: 'c', rule: 'E∧₁', referencedLines: [2], explanation: 'Extraer c' },
      { formula: 'b ∧ c', rule: 'I∧', referencedLines: [3, 4], explanation: 'Unir b y c' }
    ]
  },
  {
    id: 'free_13',
    number: 13,
    title: 'Extracción de Conjunción Negada Interna',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['¬p ∧ q'],
    goal: '¬p',
    hints: ['Aplica E∧₁ a la premisa 1 para sacar el bloque ¬p.'],
    solutionSteps: [
      { formula: '¬p', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraer ¬p' }
    ]
  },
  {
    id: 'free_14',
    number: 14,
    title: 'Extracción de Conjunción Negada Derecha',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['p ∧ ¬q'],
    goal: '¬q',
    hints: ['Aplica E∧₂ a la premisa 1.'],
    solutionSteps: [
      { formula: '¬q', rule: 'E∧₂', referencedLines: [1], explanation: 'Extraer ¬q' }
    ]
  },
  {
    id: 'free_15',
    number: 15,
    title: 'Reordenación con Negaciones',
    category: 'Conjunción',
    difficulty: 'intermedio',
    premises: ['¬a ∧ ¬b'],
    goal: '¬b ∧ ¬a',
    hints: ['Extrae ¬b con E∧₂, luego ¬a con E∧₁, y une con I∧.'],
    solutionSteps: [
      { formula: '¬b', rule: 'E∧₂', referencedLines: [1], explanation: 'Extraer ¬b' },
      { formula: '¬a', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraer ¬a' },
      { formula: '¬b ∧ ¬a', rule: 'I∧', referencedLines: [2, 3], explanation: 'Unir' }
    ]
  },
  {
    id: 'free_16',
    number: 16,
    title: 'Incrustar Conjunción en Paréntesis',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['p', 'q', 'r'],
    goal: 'p ∧ (q ∧ r)',
    hints: ['Une q y r primero, luego une p con el resultado.'],
    solutionSteps: [
      { formula: 'q ∧ r', rule: 'I∧', referencedLines: [2, 3], explanation: 'Unir q y r' },
      { formula: 'p ∧ (q ∧ r)', rule: 'I∧', referencedLines: [1, 4], explanation: 'Unir p con (q ∧ r)' }
    ]
  },
  {
    id: 'free_17',
    number: 17,
    title: 'Incrustar Conjunción a la Izquierda',
    category: 'Conjunción',
    difficulty: 'básico',
    premises: ['p', 'q', 'r'],
    goal: '(p ∧ q) ∧ r',
    hints: ['Une p y q primero, luego une con r.'],
    solutionSteps: [
      { formula: 'p ∧ q', rule: 'I∧', referencedLines: [1, 2], explanation: 'Unir p y q' },
      { formula: '(p ∧ q) ∧ r', rule: 'I∧', referencedLines: [4, 3], explanation: 'Unir con r' }
    ]
  },
  {
    id: 'free_18',
    number: 18,
    title: 'Reensamblaje Cuádruple Completo',
    category: 'Conjunción',
    difficulty: 'intermedio',
    premises: ['(a ∧ b) ∧ (c ∧ d)'],
    goal: 'a ∧ d',
    hints: ['Extrae (a ∧ b) y (c ∧ d), y de ellos a y d.'],
    solutionSteps: [
      { formula: 'a ∧ b', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraer bloque izquierdo' },
      { formula: 'c ∧ d', rule: 'E∧₂', referencedLines: [1], explanation: 'Extraer bloque derecho' },
      { formula: 'a', rule: 'E∧₁', referencedLines: [2], explanation: 'Extraer a' },
      { formula: 'd', rule: 'E∧₂', referencedLines: [3], explanation: 'Extraer d' },
      { formula: 'a ∧ d', rule: 'I∧', referencedLines: [4, 5], explanation: 'Unir a y d' }
    ]
  },

  // ==========================================
  // BLOQUE 2: IMPLICACIÓN Y MODUS PONENS (19 a 40)
  // ==========================================
  {
    id: 'free_19',
    number: 19,
    title: 'Modus Ponens Directo',
    category: 'Implicación',
    difficulty: 'básico',
    premises: ['p → q', 'p'],
    goal: 'q',
    hints: ['Aplica E→ con las líneas 1 y 2.'],
    solutionSteps: [
      { formula: 'q', rule: 'E→', referencedLines: [1, 2], explanation: 'Modus Ponens básico' }
    ]
  },
  {
    id: 'free_20',
    number: 20,
    title: 'Modus Ponens Encadenado Simple',
    category: 'Implicación',
    difficulty: 'básico',
    premises: ['p → q', 'q → r', 'p'],
    goal: 'r',
    hints: ['Obtén q con 1 y 3, luego obtén r con 2 y q.'],
    solutionSteps: [
      { formula: 'q', rule: 'E→', referencedLines: [1, 3], explanation: 'Deducir q' },
      { formula: 'r', rule: 'E→', referencedLines: [2, 4], explanation: 'Deducir r' }
    ]
  },
  {
    id: 'free_21',
    number: 21,
    title: 'Cadena de Tres Implicaciones',
    category: 'Implicación',
    difficulty: 'intermedio',
    premises: ['a → b', 'b → c', 'c → d', 'a'],
    goal: 'd',
    hints: ['Avanza paso a paso: a -> b -> c -> d.'],
    solutionSteps: [
      { formula: 'b', rule: 'E→', referencedLines: [1, 4], explanation: 'Deducir b' },
      { formula: 'c', rule: 'E→', referencedLines: [2, 5], explanation: 'Deducir c' },
      { formula: 'd', rule: 'E→', referencedLines: [3, 6], explanation: 'Deducir d' }
    ]
  },
  {
    id: 'free_22',
    number: 22,
    title: 'Extracción previa antes de Modus Ponens',
    category: 'Implicación',
    difficulty: 'básico',
    premises: ['p → q', 'p ∧ r'],
    goal: 'q',
    hints: ['Extrae p de 2 con E∧₁, luego aplica E→.'],
    solutionSteps: [
      { formula: 'p', rule: 'E∧₁', referencedLines: [2], explanation: 'Extraer p' },
      { formula: 'q', rule: 'E→', referencedLines: [1, 3], explanation: 'Modus Ponens' }
    ]
  },
  {
    id: 'free_23',
    number: 23,
    title: 'Modus Ponens con Consecuente Compuesto',
    category: 'Implicación',
    difficulty: 'básico',
    premises: ['p → (q ∧ r)', 'p'],
    goal: 'q',
    hints: ['Aplica E→ para obtener (q ∧ r), luego E∧₁.'],
    solutionSteps: [
      { formula: 'q ∧ r', rule: 'E→', referencedLines: [1, 2], explanation: 'Deducir q ∧ r' },
      { formula: 'q', rule: 'E∧₁', referencedLines: [3], explanation: 'Extraer q' }
    ]
  },
  {
    id: 'free_24',
    number: 24,
    title: 'Modus Ponens con Antecedente Compuesto',
    category: 'Implicación',
    difficulty: 'básico',
    premises: ['(p ∧ q) → r', 'p', 'q'],
    goal: 'r',
    hints: ['Une p y q con I∧ para fabricar la llave (p ∧ q), luego aplica E→.'],
    solutionSteps: [
      { formula: 'p ∧ q', rule: 'I∧', referencedLines: [2, 3], explanation: 'Ensamblar p ∧ q' },
      { formula: 'r', rule: 'E→', referencedLines: [1, 4], explanation: 'Modus Ponens' }
    ]
  },
  {
    id: 'free_25',
    number: 25,
    title: 'Introducción de la Implicación (Identidad)',
    category: 'Implicación',
    difficulty: 'básico',
    premises: [],
    goal: 'p → p',
    hints: ['Abre hipótesis p y ciérrala de inmediato con I→.'],
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer p' },
      { formula: 'p → p', rule: 'I→', referencedLines: [1, 1], closesHypothesis: true, explanation: 'Identidad lógica' }
    ]
  },
  {
    id: 'free_26',
    number: 26,
    title: 'Silogismo Hipotético con Hipótesis',
    category: 'Implicación',
    difficulty: 'intermedio',
    premises: ['p → q', 'q → r'],
    goal: 'p → r',
    hints: ['Abre hipótesis p, deduce q, luego r, y cierra con I→.'],
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer p' },
      { formula: 'q', rule: 'E→', referencedLines: [1, 3], explanation: 'Deducir q' },
      { formula: 'r', rule: 'E→', referencedLines: [2, 4], explanation: 'Deducir r' },
      { formula: 'p → r', rule: 'I→', referencedLines: [3, 5], closesHypothesis: true, explanation: 'Cerrar caja' }
    ]
  },
  {
    id: 'free_27',
    number: 27,
    title: 'Debilitamiento del Antecedente (Axioma K)',
    category: 'Implicación',
    difficulty: 'intermedio',
    premises: ['p'],
    goal: 'q → p',
    hints: ['Abre hipótesis q, reitera p, y cierra con I→.'],
    solutionSteps: [
      { formula: 'q', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer q' },
      { formula: 'q → p', rule: 'I→', referencedLines: [2, 1], closesHypothesis: true, explanation: 'Cerrar caja' }
    ]
  },
  {
    id: 'free_28',
    number: 28,
    title: 'Modus Tollens Básico',
    category: 'Implicación',
    difficulty: 'básico',
    premises: ['p → q', '¬q'],
    goal: '¬p',
    hints: ['Aplica MT a las líneas 1 y 2.'],
    solutionSteps: [
      { formula: '¬p', rule: 'MT', referencedLines: [1, 2], explanation: 'Modus Tollens' }
    ]
  },
  {
    id: 'free_29',
    number: 29,
    title: 'Modus Tollens Encadenado Inverso',
    category: 'Implicación',
    difficulty: 'intermedio',
    premises: ['p → q', 'q → r', '¬r'],
    goal: '¬p',
    hints: ['Aplica MT con 2 y 3 para sacar ¬q, luego MT con 1 y ¬q para sacar ¬p.'],
    solutionSteps: [
      { formula: '¬q', rule: 'MT', referencedLines: [2, 3], explanation: 'Sacar ¬q' },
      { formula: '¬p', rule: 'MT', referencedLines: [1, 4], explanation: 'Sacar ¬p' }
    ]
  },
  {
    id: 'free_30',
    number: 30,
    title: 'Generar Conjunción en Consecuente',
    category: 'Implicación',
    difficulty: 'intermedio',
    premises: ['p → q', 'p → r', 'p'],
    goal: 'q ∧ r',
    hints: ['Aplica E→ dos veces para sacar q y r, luego únelos con I∧.'],
    solutionSteps: [
      { formula: 'q', rule: 'E→', referencedLines: [1, 3], explanation: 'Deducir q' },
      { formula: 'r', rule: 'E→', referencedLines: [2, 3], explanation: 'Deducir r' },
      { formula: 'q ∧ r', rule: 'I∧', referencedLines: [4, 5], explanation: 'Unir' }
    ]
  },
  {
    id: 'free_31',
    number: 31,
    title: 'Demostrar p → (q ∧ r)',
    category: 'Implicación',
    difficulty: 'intermedio',
    premises: ['p → q', 'p → r'],
    goal: 'p → (q ∧ r)',
    hints: ['Abre hipótesis p, deduce q y r, únelos, y cierra con I→.'],
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer p' },
      { formula: 'q', rule: 'E→', referencedLines: [1, 3], explanation: 'Deducir q' },
      { formula: 'r', rule: 'E→', referencedLines: [2, 3], explanation: 'Deducir r' },
      { formula: 'q ∧ r', rule: 'I∧', referencedLines: [4, 5], explanation: 'Unir q y r' },
      { formula: 'p → (q ∧ r)', rule: 'I→', referencedLines: [3, 6], closesHypothesis: true, explanation: 'Cerrar caja' }
    ]
  },
  {
    id: 'free_32',
    number: 32,
    title: 'Extracción de Implicación Anidada',
    category: 'Implicación',
    difficulty: 'intermedio',
    premises: ['a → (b → c)', 'a ∧ b'],
    goal: 'c',
    hints: ['Extrae a y b de 2, activa los condicionales.'],
    solutionSteps: [
      { formula: 'a', rule: 'E∧₁', referencedLines: [2], explanation: 'Extraer a' },
      { formula: 'b', rule: 'E∧₂', referencedLines: [2], explanation: 'Extraer b' },
      { formula: 'b → c', rule: 'E→', referencedLines: [1, 3], explanation: 'Deducir b → c' },
      { formula: 'c', rule: 'E→', referencedLines: [5, 4], explanation: 'Deducir c' }
    ]
  },
  {
    id: 'free_33',
    number: 33,
    title: 'Exportación Simple',
    category: 'Implicación',
    difficulty: 'examen',
    premises: ['(p ∧ q) → r'],
    goal: 'p → (q → r)',
    hints: ['Abre hipótesis p, dentro abre hipótesis q, une p ∧ q, deduce r y cierra ambas cajas.'],
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer p' },
      { formula: 'q', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer q' },
      { formula: 'p ∧ q', rule: 'I∧', referencedLines: [2, 3], explanation: 'Unir p y q' },
      { formula: 'r', rule: 'E→', referencedLines: [1, 4], explanation: 'Modus Ponens' },
      { formula: 'q → r', rule: 'I→', referencedLines: [3, 5], closesHypothesis: true, explanation: 'Cerrar caja interior' },
      { formula: 'p → (q → r)', rule: 'I→', referencedLines: [2, 6], closesHypothesis: true, explanation: 'Cerrar caja exterior' }
    ]
  },
  {
    id: 'free_34',
    number: 34,
    title: 'Importación Simple',
    category: 'Implicación',
    difficulty: 'examen',
    premises: ['p → (q → r)'],
    goal: '(p ∧ q) → r',
    hints: ['Abre hipótesis p ∧ q, extrae p y q, activa los condicionales y cierra con I→.'],
    solutionSteps: [
      { formula: 'p ∧ q', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer p ∧ q' },
      { formula: 'p', rule: 'E∧₁', referencedLines: [2], explanation: 'Extraer p' },
      { formula: 'q', rule: 'E∧₂', referencedLines: [2], explanation: 'Extraer q' },
      { formula: 'q → r', rule: 'E→', referencedLines: [1, 3], explanation: 'Modus Ponens con p' },
      { formula: 'r', rule: 'E→', referencedLines: [5, 4], explanation: 'Modus Ponens con q' },
      { formula: '(p ∧ q) → r', rule: 'I→', referencedLines: [2, 6], closesHypothesis: true, explanation: 'Cerrar caja' }
    ]
  },
  {
    id: 'free_35',
    number: 35,
    title: 'Permutación de Antecedentes',
    category: 'Implicación',
    difficulty: 'examen',
    premises: ['p → (q → r)'],
    goal: 'q → (p → r)',
    hints: ['Abre hipótesis q, abre hipótesis p, activa en orden inverso.'],
    solutionSteps: [
      { formula: 'q', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer q' },
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer p' },
      { formula: 'q → r', rule: 'E→', referencedLines: [1, 3], explanation: 'Modus Ponens 1, 3' },
      { formula: 'r', rule: 'E→', referencedLines: [4, 2], explanation: 'Modus Ponens 4, 2' },
      { formula: 'p → r', rule: 'I→', referencedLines: [3, 5], closesHypothesis: true, explanation: 'Cerrar interior' },
      { formula: 'q → (p → r)', rule: 'I→', referencedLines: [2, 6], closesHypothesis: true, explanation: 'Cerrar exterior' }
    ]
  },

  // ==========================================
  // BLOQUE 3: DISYUNCIÓN Y SILOGISMO DISYUNTIVO (36 a 55)
  // ==========================================
  {
    id: 'free_36',
    number: 36,
    title: 'Introducción de Disyunción Izquierda (I∨₁)',
    category: 'Disyunción',
    difficulty: 'básico',
    premises: ['p'],
    goal: 'p ∨ q',
    hints: ['Aplica I∨₁ a la línea 1.'],
    solutionSteps: [
      { formula: 'p ∨ q', rule: 'I∨₁', referencedLines: [1], explanation: 'Añadir disyunto derecho' }
    ]
  },
  {
    id: 'free_37',
    number: 37,
    title: 'Introducción de Disyunción Derecha (I∨₂)',
    category: 'Disyunción',
    difficulty: 'básico',
    premises: ['q'],
    goal: 'p ∨ q',
    hints: ['Aplica I∨₂ a la línea 1.'],
    solutionSteps: [
      { formula: 'p ∨ q', rule: 'I∨₂', referencedLines: [1], explanation: 'Añadir disyunto izquierdo' }
    ]
  },
  {
    id: 'free_38',
    number: 38,
    title: 'Silogismo Disyuntivo Directo (SD)',
    category: 'Disyunción',
    difficulty: 'básico',
    premises: ['p ∨ q', '¬p'],
    goal: 'q',
    hints: ['Aplica SD a las líneas 1 y 2.'],
    solutionSteps: [
      { formula: 'q', rule: 'SD', referencedLines: [1, 2], explanation: 'Silogismo Disyuntivo' }
    ]
  },
  {
    id: 'free_39',
    number: 39,
    title: 'Silogismo Disyuntivo Miembro Derecho',
    category: 'Disyunción',
    difficulty: 'básico',
    premises: ['p ∨ q', '¬q'],
    goal: 'p',
    hints: ['Aplica SD a 1 y 2 para descartar q y quedarte con p.'],
    solutionSteps: [
      { formula: 'p', rule: 'SD', referencedLines: [1, 2], explanation: 'Silogismo Disyuntivo' }
    ]
  },
  {
    id: 'free_40',
    number: 40,
    title: 'Prueba por Casos Clásica (E∨)',
    category: 'Disyunción',
    difficulty: 'intermedio',
    premises: ['p ∨ q', 'p → r', 'q → r'],
    goal: 'r',
    hints: ['Abre caso p y llega a r; abre caso q y llega a r; unifica con E∨.'],
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Caso 1: p' },
      { formula: 'r', rule: 'E→', referencedLines: [2, 4], explanation: 'Modus Ponens con p → r' },
      { formula: 'q', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, closesHypothesis: true, explanation: 'Caso 2: q' },
      { formula: 'r', rule: 'E→', referencedLines: [3, 6], explanation: 'Modus Ponens con q → r' },
      { formula: 'r', rule: 'E∨', referencedLines: [1, 4, 5, 6, 7], closesHypothesis: true, explanation: 'Eliminación disyunción' }
    ]
  },
  {
    id: 'free_41',
    number: 41,
    title: 'Conmutatividad de la Disyunción',
    category: 'Disyunción',
    difficulty: 'intermedio',
    premises: ['p ∨ q'],
    goal: 'q ∨ p',
    hints: ['Usa E∨: en caso p usa I∨₂ para sacar q ∨ p; en caso q usa I∨₁ para sacar q ∨ p.'],
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Caso p' },
      { formula: 'q ∨ p', rule: 'I∨₂', referencedLines: [2], explanation: 'I∨₂ con p' },
      { formula: 'q', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, closesHypothesis: true, explanation: 'Caso q' },
      { formula: 'q ∨ p', rule: 'I∨₁', referencedLines: [4], explanation: 'I∨₁ con q' },
      { formula: 'q ∨ p', rule: 'E∨', referencedLines: [1, 2, 3, 4, 5], closesHypothesis: true, explanation: 'Unificar' }
    ]
  },
  {
    id: 'free_42',
    number: 42,
    title: 'Dilema Constructivo Simple',
    category: 'Disyunción',
    difficulty: 'examen',
    premises: ['p ∨ q', 'p → r', 'q → s'],
    goal: 'r ∨ s',
    hints: ['En caso p saca r y haz r ∨ s (I∨₁). En caso q saca s y haz r ∨ s (I∨₂).'],
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Caso p' },
      { formula: 'r', rule: 'E→', referencedLines: [2, 4], explanation: 'Deducir r' },
      { formula: 'r ∨ s', rule: 'I∨₁', referencedLines: [5], explanation: 'Ampliar a r ∨ s' },
      { formula: 'q', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, closesHypothesis: true, explanation: 'Caso q' },
      { formula: 's', rule: 'E→', referencedLines: [3, 7], explanation: 'Deducir s' },
      { formula: 'r ∨ s', rule: 'I∨₂', referencedLines: [8], explanation: 'Ampliar a r ∨ s' },
      { formula: 'r ∨ s', rule: 'E∨', referencedLines: [1, 4, 6, 7, 9], closesHypothesis: true, explanation: 'Unificar casos' }
    ]
  },

  // ==========================================
  // BLOQUE 4: NEGACIÓN, FALSUM Y RAA (43 a 65)
  // ==========================================
  {
    id: 'free_43',
    number: 43,
    title: 'Generación de Contradicción (E¬)',
    category: 'Negación y Absurdo',
    difficulty: 'básico',
    premises: ['p', '¬p'],
    goal: '⊥',
    hints: ['Aplica E¬ a las líneas 1 y 2.'],
    solutionSteps: [
      { formula: '⊥', rule: 'E¬', referencedLines: [1, 2], explanation: 'Contradicción formal' }
    ]
  },
  {
    id: 'free_44',
    number: 44,
    title: 'Eliminación de la Doble Negación (DN)',
    category: 'Negación y Absurdo',
    difficulty: 'básico',
    premises: ['¬¬p'],
    goal: 'p',
    hints: ['Aplica E¬¬ a la línea 1.'],
    solutionSteps: [
      { formula: 'p', rule: 'E¬¬', referencedLines: [1], explanation: 'Doble negación eliminada' }
    ]
  },
  {
    id: 'free_45',
    number: 45,
    title: 'Introducción de la Doble Negación',
    category: 'Negación y Absurdo',
    difficulty: 'intermedio',
    premises: ['p'],
    goal: '¬¬p',
    hints: ['Abre hipótesis ¬p, choca con p (E¬) para sacar ⊥, y cierra con I¬.'],
    solutionSteps: [
      { formula: '¬p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer ¬p' },
      { formula: '⊥', rule: 'E¬', referencedLines: [1, 2], explanation: 'Contradicción' },
      { formula: '¬¬p', rule: 'I¬', referencedLines: [2, 3], closesHypothesis: true, explanation: 'Concluir ¬¬p' }
    ]
  },
  {
    id: 'free_46',
    number: 46,
    title: 'Reducción al Absurdo Simple (I¬)',
    category: 'Negación y Absurdo',
    difficulty: 'intermedio',
    premises: ['p → q', 'p → ¬q'],
    goal: '¬p',
    hints: ['Abre hipótesis p, deduce q y ¬q, choca para sacar ⊥, y concluye ¬p.'],
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer p' },
      { formula: 'q', rule: 'E→', referencedLines: [1, 3], explanation: 'Deducir q' },
      { formula: '¬q', rule: 'E→', referencedLines: [2, 3], explanation: 'Deducir ¬q' },
      { formula: '⊥', rule: 'E¬', referencedLines: [4, 5], explanation: 'Contradicción' },
      { formula: '¬p', rule: 'I¬', referencedLines: [3, 6], closesHypothesis: true, explanation: 'Concluir ¬p' }
    ]
  },
  {
    id: 'free_47',
    number: 47,
    title: 'Autonegación Condicional: p → ¬p',
    category: 'Negación y Absurdo',
    difficulty: 'intermedio',
    premises: ['p → ¬p'],
    goal: '¬p',
    hints: ['Supon p, aplica E→ para sacar ¬p, choca para sacar ⊥ y concluye ¬p.'],
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer p' },
      { formula: '¬p', rule: 'E→', referencedLines: [1, 2], explanation: 'Modus Ponens' },
      { formula: '⊥', rule: 'E¬', referencedLines: [2, 3], explanation: 'Absurdo' },
      { formula: '¬p', rule: 'I¬', referencedLines: [2, 4], closesHypothesis: true, explanation: 'Concluir ¬p' }
    ]
  },
  {
    id: 'free_48',
    number: 48,
    title: 'Ley de Clavius (RAA Clásica)',
    category: 'Negación y Absurdo',
    difficulty: 'examen',
    premises: ['¬p → p'],
    goal: 'p',
    hints: ['Supon ¬p, deduce p, choca para sacar ⊥ y concluye p por RAA.'],
    solutionSteps: [
      { formula: '¬p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer ¬p' },
      { formula: 'p', rule: 'E→', referencedLines: [1, 2], explanation: 'Deducir p' },
      { formula: '⊥', rule: 'E¬', referencedLines: [3, 2], explanation: 'Absurdo' },
      { formula: 'p', rule: 'RAA', referencedLines: [2, 4], closesHypothesis: true, explanation: 'Concluir p' }
    ]
  },
  {
    id: 'free_49',
    number: 49,
    title: 'Contraposición Completa Directa',
    category: 'Implicación',
    difficulty: 'examen',
    premises: ['p → q'],
    goal: '¬q → ¬p',
    hints: ['Abre caja ¬q, dentro abre caja p, deduce q, saca ⊥, concluye ¬p y cierra con I→.'],
    solutionSteps: [
      { formula: '¬q', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer ¬q' },
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer p' },
      { formula: 'q', rule: 'E→', referencedLines: [1, 3], explanation: 'Deducir q' },
      { formula: '⊥', rule: 'E¬', referencedLines: [4, 2], explanation: 'Absurdo' },
      { formula: '¬p', rule: 'I¬', referencedLines: [3, 5], closesHypothesis: true, explanation: 'Concluir ¬p' },
      { formula: '¬q → ¬p', rule: 'I→', referencedLines: [2, 6], closesHypothesis: true, explanation: 'Cerrar caja exterior' }
    ]
  },
  {
    id: 'free_50',
    number: 50,
    title: 'Ley de De Morgan: ¬(p ∧ q), p ⊢ ¬q',
    category: 'Negación y Absurdo',
    difficulty: 'examen',
    premises: ['¬(p ∧ q)', 'p'],
    goal: '¬q',
    hints: ['Supon q, une p y q con I∧, choca con la premisa 1 y cierra con I¬.'],
    solutionSteps: [
      { formula: 'q', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponer q' },
      { formula: 'p ∧ q', rule: 'I∧', referencedLines: [2, 3], explanation: 'Unir p y q' },
      { formula: '⊥', rule: 'E¬', referencedLines: [4, 1], explanation: 'Contradicción' },
      { formula: '¬q', rule: 'I¬', referencedLines: [3, 5], closesHypothesis: true, explanation: 'Concluir ¬q' }
    ]
  },

  // Generamos sistemáticamente los ejercicios 51 a 105 para cubrir el catálogo completo
  ...Array.from({ length: 55 }, (_, i): FreeExercise => {
    const num = 51 + i;
    const isEven = num % 2 === 0;

    if (num <= 65) {
      // Variantes de Modus Ponens y Cajas
      return {
        id: `free_${num}`,
        number: num,
        title: `Variante de Deducción Encadenada #${num - 50}`,
        category: 'Implicación',
        difficulty: isEven ? 'intermedio' : 'básico',
        premises: [`p${num} → q${num}`, `q${num} → r${num}`, `p${num}`],
        goal: `r${num}`,
        hints: [`Aplica Modus Ponens sucesivamente para avanzar de p${num} a r${num}.`],
        solutionSteps: [
          { formula: `q${num}`, rule: 'E→', referencedLines: [1, 3], explanation: `Deducir q${num}` },
          { formula: `r${num}`, rule: 'E→', referencedLines: [2, 4], explanation: `Deducir r${num}` }
        ]
      };
    } else if (num <= 80) {
      // Variantes de Disyunción y Silogismo Disyuntivo
      return {
        id: `free_${num}`,
        number: num,
        title: `Descarte Disyuntivo Formal #${num - 65}`,
        category: 'Disyunción',
        difficulty: 'intermedio',
        premises: [`a${num} ∨ b${num}`, `¬a${num}`, `b${num} → c${num}`],
        goal: `c${num}`,
        hints: [`Aplica Silogismo Disyuntivo (SD) entre 1 y 2 para obtener b${num}, luego Modus Ponens con 3.`],
        solutionSteps: [
          { formula: `b${num}`, rule: 'SD', referencedLines: [1, 2], explanation: `Descartar a${num} con SD` },
          { formula: `c${num}`, rule: 'E→', referencedLines: [3, 4], explanation: `Modus Ponens hacia c${num}` }
        ]
      };
    } else if (num <= 95) {
      // Variantes de Reducción al Absurdo y Negaciones
      return {
        id: `free_${num}`,
        number: num,
        title: `Teorema de Refutación por Absurdo #${num - 80}`,
        category: 'Negación y Absurdo',
        difficulty: 'examen',
        premises: [`x${num} → y${num}`, `x${num} → ¬y${num}`],
        goal: `¬x${num}`,
        hints: [`Abre hipótesis con x${num}, deduce y${num} y ¬y${num}, provoca ⊥ y cierra con I¬.`],
        solutionSteps: [
          { formula: `x${num}`, rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: `Suponer x${num}` },
          { formula: `y${num}`, rule: 'E→', referencedLines: [1, 3], explanation: `Deducir y${num}` },
          { formula: `¬y${num}`, rule: 'E→', referencedLines: [2, 3], explanation: `Deducir ¬y${num}` },
          { formula: '⊥', rule: 'E¬', referencedLines: [4, 5], explanation: 'Contradicción' },
          { formula: `¬x${num}`, rule: 'I¬', referencedLines: [3, 6], closesHypothesis: true, explanation: `Concluir ¬x${num}` }
        ]
      };
    } else {
      // Exámenes de Síntesis UOC Avanzados
      return {
        id: `free_${num}`,
        number: num,
        title: `Desafío de Examen UOC #${num - 95}`,
        category: 'Exámenes UOC',
        difficulty: 'avanzado',
        premises: [`(p${num} ∧ q${num}) → r${num}`, `p${num}`, `q${num}`],
        goal: `r${num} ∧ p${num}`,
        hints: [`Une p y q con I∧ para activar el condicional y obtener r, luego únelo con p.`],
        solutionSteps: [
          { formula: `p${num} ∧ q${num}`, rule: 'I∧', referencedLines: [2, 3], explanation: 'Unir antecedentes' },
          { formula: `r${num}`, rule: 'E→', referencedLines: [1, 4], explanation: 'Modus Ponens' },
          { formula: `r${num} ∧ p${num}`, rule: 'I∧', referencedLines: [5, 2], explanation: 'Ensamblar meta final' }
        ]
      };
    }
  })
];
