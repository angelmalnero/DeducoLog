import { Clause, ResolutionStep } from '../types/logic';

/**
 * Motor interactivo de Resolución Refutacional y Forma Clausal (UOC Bloque 3).
 * Convierte argumentos a cláusulas, niega la conclusión y guía la refutación paso a paso
 * hasta alcanzar la cláusula vacía (□ o ⊥).
 */

export interface ResolutionChallenge {
  id: string;
  title: string;
  description: string;
  premises: string[];
  goal: string;
  initialClauses: Clause[];
  expectedSteps: ResolutionStep[];
}

export const UOC_RESOLUTION_CHALLENGES: ResolutionChallenge[] = [
  {
    id: 'res_1',
    title: 'Resolución Proposicional Básica (Modus Ponens Clausal)',
    description: 'Demuestra p → q, p ⊢ q por el método de resolución refutacional.',
    premises: ['p → q', 'p'],
    goal: 'q',
    initialClauses: [
      { id: 'C1', literals: ['¬p', 'q'], origin: 'Premisa 1 (p → q ≡ ¬p ∨ q)' },
      { id: 'C2', literals: ['p'], origin: 'Premisa 2' },
      { id: 'C3', literals: ['¬q'], origin: 'Negación de la Conclusión (¬q)' },
    ],
    expectedSteps: [
      {
        clause1Id: 'C1',
        clause2Id: 'C2',
        cancellingLiteral: 'p',
        resultingClause: ['q'],
        isEmptyClause: false,
      },
      {
        clause1Id: 'C4',
        clause2Id: 'C3',
        cancellingLiteral: 'q',
        resultingClause: [],
        isEmptyClause: true,
      },
    ],
  },
  {
    id: 'res_2',
    title: 'Resolución de Silogismo Disyuntivo',
    description: 'Demuestra p ∨ q, ¬p ⊢ q por resolución refutacional.',
    premises: ['p ∨ q', '¬p'],
    goal: 'q',
    initialClauses: [
      { id: 'C1', literals: ['p', 'q'], origin: 'Premisa 1' },
      { id: 'C2', literals: ['¬p'], origin: 'Premisa 2' },
      { id: 'C3', literals: ['¬q'], origin: 'Negación de la Conclusión (¬q)' },
    ],
    expectedSteps: [
      {
        clause1Id: 'C1',
        clause2Id: 'C2',
        cancellingLiteral: 'p',
        resultingClause: ['q'],
        isEmptyClause: false,
      },
      {
        clause1Id: 'C4',
        clause2Id: 'C3',
        cancellingLiteral: 'q',
        resultingClause: [],
        isEmptyClause: true,
      },
    ],
  },
  {
    id: 'res_3',
    title: 'Transitividad y Encadenamiento (Examen PEC3)',
    description: 'Demuestra p → q, q → r, p ⊢ r mediante resolución en cascada.',
    premises: ['p → q', 'q → r', 'p'],
    goal: 'r',
    initialClauses: [
      { id: 'C1', literals: ['¬p', 'q'], origin: 'Premisa 1' },
      { id: 'C2', literals: ['¬q', 'r'], origin: 'Premisa 2' },
      { id: 'C3', literals: ['p'], origin: 'Premisa 3' },
      { id: 'C4', literals: ['¬r'], origin: 'Negación de la Conclusión' },
    ],
    expectedSteps: [
      {
        clause1Id: 'C1',
        clause2Id: 'C3',
        cancellingLiteral: 'p',
        resultingClause: ['q'],
        isEmptyClause: false,
      },
      {
        clause1Id: 'C5',
        clause2Id: 'C2',
        cancellingLiteral: 'q',
        resultingClause: ['r'],
        isEmptyClause: false,
      },
      {
        clause1Id: 'C6',
        clause2Id: 'C4',
        cancellingLiteral: 'r',
        resultingClause: [],
        isEmptyClause: true,
      },
    ],
  },
  {
    id: 'res_pred_1',
    title: 'Resolución en Predicados con Unificación (PEC6)',
    description: 'Demuestra ∀x (P(x) → Q(x)), P(a) ⊢ Q(a) usando unificación mgu θ={x/a}.',
    premises: ['∀x (P(x) → Q(x))', 'P(a)'],
    goal: 'Q(a)',
    initialClauses: [
      { id: 'C1', literals: ['¬P(x)', 'Q(x)'], origin: 'Premisa 1 clausal' },
      { id: 'C2', literals: ['P(a)'], origin: 'Premisa 2 clausal' },
      { id: 'C3', literals: ['¬Q(a)'], origin: 'Negación Conclusión' },
    ],
    expectedSteps: [
      {
        clause1Id: 'C1',
        clause2Id: 'C2',
        cancellingLiteral: 'P',
        resultingClause: ['Q(a)'],
        isEmptyClause: false,
      },
      {
        clause1Id: 'C4',
        clause2Id: 'C3',
        cancellingLiteral: 'Q(a)',
        resultingClause: [],
        isEmptyClause: true,
      },
    ],
  },
];

/**
 * Resuelve dos cláusulas y produce la cláusula resolvente si existe un par complementario.
 */
export function resolveClauses(
  c1: Clause,
  c2: Clause
): {
  canResolve: boolean;
  cancellingLiteral?: string;
  resultingLiterals: string[];
  isEmptyClause: boolean;
  explanation: string;
} {
  // Buscar literal en C1 cuyo complemento esté en C2
  for (const lit1 of c1.literals) {
    const isNeg1 = lit1.startsWith('¬');
    const base1 = isNeg1 ? lit1.slice(1) : lit1;
    const comp1 = isNeg1 ? base1 : `¬${base1}`;

    const matchIdx = c2.literals.findIndex((lit2) => {
      if (lit2 === comp1) return true;
      // Compatibilidad con predicados unificados: P(x) y ¬P(a)
      if (lit1.includes('(') && lit2.includes('(')) {
        const predName1 = lit1.replace(/¬/g, '').split('(')[0];
        const predName2 = lit2.replace(/¬/g, '').split('(')[0];
        const signsOpposite = lit1.startsWith('¬') !== lit2.startsWith('¬');
        return predName1 === predName2 && signsOpposite;
      }
      return false;
    });

    if (matchIdx !== -1) {
      const lit2 = c2.literals[matchIdx];
      // Unir los literales restantes de ambas cláusulas
      const remaining1 = c1.literals.filter((l) => l !== lit1);
      const remaining2 = c2.literals.filter((l) => l !== lit2);

      // Si eran predicados, aplicar sustitución si es necesario
      let unifiedRemain2 = remaining2;
      if (lit1.includes('(x)') && lit2.includes('(a)')) {
        unifiedRemain2 = remaining1.map((l) => l.replace(/\(x\)/g, '(a)'));
      }

      const combined = Array.from(new Set([...remaining1, ...unifiedRemain2]));
      const isEmpty = combined.length === 0;

      return {
        canResolve: true,
        cancellingLiteral: `${lit1} con ${lit2}`,
        resultingLiterals: combined,
        isEmptyClause: isEmpty,
        explanation: isEmpty
          ? `¡Cláusula vacía derivada (□)! Los literales ${lit1} y ${lit2} se cancelaron mutuamente y no quedó ningún literal restante. Hemos demostrado la contradicción del conjunto clausal refutado.`
          : `Resolvente generado con éxito eliminando el par complementario {${lit1}, ${lit2}}. Cláusula resultante: { ${combined.join(', ')} }.`,
      };
    }
  }

  return {
    canResolve: false,
    resultingLiterals: [],
    isEmptyClause: false,
    explanation: 'Estas dos cláusulas no contienen ningún par de literales complementarios (L y ¬L) para cancelar.',
  };
}
