import { SandboxChallenge } from '../types/logic';

export const SANDBOX_CHALLENGES: SandboxChallenge[] = [
  {
    id: 'ch_1',
    title: 'Desempaquetando y Reordenando (∧)',
    difficulty: 'fácil',
    premises: ['p ∧ q'],
    goal: 'q ∧ p',
    hint: 'Aplica primero E∧₂ para extraer q, luego E∧₁ para extraer p, y finalmente únelos con I∧.',
    solutionSteps: [
      { formula: 'q', rule: 'E∧₂', referencedLines: [1], explanation: 'Extraemos el miembro derecho q' },
      { formula: 'p', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraemos el miembro izquierdo p' },
      { formula: 'q ∧ p', rule: 'I∧', referencedLines: [2, 3], explanation: 'Unimos q y p en la fórmula meta' },
    ],
  },
  {
    id: 'ch_2',
    title: 'Doble Modus Ponens en Cadena',
    difficulty: 'fácil',
    premises: ['p → q', 'q → r', 'p'],
    goal: 'r',
    hint: 'Usa la premisa 3 para activar la premisa 1 y obtener q. Luego usa q para activar la premisa 2.',
    solutionSteps: [
      { formula: 'q', rule: 'E→', referencedLines: [1, 3], explanation: 'Aplicamos Modus Ponens con p → q y p' },
      { formula: 'r', rule: 'E→', referencedLines: [2, 4], explanation: 'Aplicamos Modus Ponens con q → r y q' },
    ],
  },
  {
    id: 'ch_3',
    title: 'El Teorema del Silogismo Hipotético (Cajas de Fitch)',
    difficulty: 'medio',
    premises: ['p → q', 'q → r'],
    goal: 'p → r',
    hint: 'Como la meta es una implicación (p → r), abre una hipótesis con p. Llega a r y cierra con I→.',
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponemos el antecedente p' },
      { formula: 'q', rule: 'E→', referencedLines: [1, 3], explanation: 'Modus Ponens dentro de la caja' },
      { formula: 'r', rule: 'E→', referencedLines: [2, 4], explanation: 'Modus Ponens dentro de la caja' },
      { formula: 'p → r', rule: 'I→', referencedLines: [3, 5], closesHypothesis: true, explanation: 'Cierre de hipótesis con I→' },
    ],
  },
  {
    id: 'ch_4',
    title: 'Modus Tollens Clásico por Reducción al Absurdo',
    difficulty: 'examen UOC',
    premises: ['p → q', '¬q'],
    goal: '¬p',
    hint: 'Para demostrar ¬p, abre una hipótesis con p. Obtén q con Modus Ponens, choca con ¬q para obtener ⊥, y cierra con I¬.',
    solutionSteps: [
      { formula: 'p', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Suponemos p para buscar la contradicción' },
      { formula: 'q', rule: 'E→', referencedLines: [1, 3], explanation: 'Modus Ponens con la premisa' },
      { formula: '⊥', rule: 'E¬', referencedLines: [2, 4], explanation: 'Contradicción entre q y ¬q' },
      { formula: '¬p', rule: 'I¬', referencedLines: [3, 5], closesHypothesis: true, explanation: 'Concluimos ¬p por Reductio ad Absurdum' },
    ],
  },
  {
    id: 'ch_5',
    title: 'Distribución Simple: { p ∧ (q ∨ r) } ⊢ (p ∧ q) ∨ (p ∧ r)',
    difficulty: 'examen UOC',
    premises: ['p ∧ (q ∨ r)'],
    goal: 'p ∧ (q ∨ r)',
    hint: 'Extrae primero p con E∧₁ y (q ∨ r) con E∧₂.',
    solutionSteps: [
      { formula: 'p', rule: 'E∧₁', referencedLines: [1], explanation: 'Extraer p' },
      { formula: 'q ∨ r', rule: 'E∧₂', referencedLines: [1], explanation: 'Extraer la disyunción' },
    ],
  },
];
