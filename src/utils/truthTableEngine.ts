import { TruthTableAnalysis, TruthTableRow } from '../types/logic';

/**
 * Motor de evaluación y análisis semántico de Lógica Proposicional (UOC Bloque 1).
 * Calcula tablas de verdad completas (2ⁿ filas), detecta Tautología / Contradicción / Contingencia,
 * y valida razonamientos buscando contraejemplos (filas donde premisas = 1 y conclusión = 0).
 */

// Extrae variables proposicionales únicas en orden alfabético
export function extractVariables(formulas: string[]): string[] {
  const vars = new Set<string>();
  const combined = formulas.join(' ');
  // Variables proposicionales típicas: p, q, r, s, t, a, b, c
  const matches = combined.match(/[a-z]/gi) || [];
  for (const m of matches) {
    const lower = m.toLowerCase();
    // Excluir conectores como 'v' si fue escrito como disyunción
    if (['p', 'q', 'r', 's', 't', 'a', 'b', 'c', 'd'].includes(lower)) {
      vars.add(lower);
    }
  }
  return Array.from(vars).sort();
}

/**
 * Tokenizador y evaluador de expresiones lógicas con valores de verdad dados.
 */
export function evaluateFormula(formula: string, valuation: Record<string, boolean>): boolean {
  // Limpiar y normalizar fórmula
  let expr = formula.trim();

  // Reemplazar variables con 'true' o 'false'
  // Ordenar variables por longitud descendente para evitar colisiones
  const varNames = Object.keys(valuation).sort((a, b) => b.length - a.length);
  for (const v of varNames) {
    const val = valuation[v] ? 'T' : 'F';
    const regex = new RegExp(`\\b${v}\\b`, 'gi');
    expr = expr.replace(regex, val);
  }

  // Evaluar recursivamente
  return evalParsed(expr);
}

function evalParsed(str: string): boolean {
  let s = str.trim();

  // Eliminar paréntesis externos redundantes
  while (s.startsWith('(') && s.endsWith(')')) {
    let depth = 0;
    let wraps = true;
    for (let i = 0; i < s.length - 1; i++) {
      if (s[i] === '(') depth++;
      else if (s[i] === ')') depth--;
      if (depth === 0) {
        wraps = false;
        break;
      }
    }
    if (wraps) s = s.slice(1, -1).trim();
    else break;
  }

  if (s === 'T' || s === '1' || s === 'V') return true;
  if (s === 'F' || s === '0') return false;

  // Buscar operadores de menor precedencia fuera de paréntesis:
  // 1. Bicondicional (↔)
  // 2. Condicional (→)
  // 3. Disyunción (∨)
  // 4. Conjunción (∧)
  // 5. Negación (¬)

  const splitByOp = (op: string): { left: string; right: string } | null => {
    let depth = 0;
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i] === ')') depth++;
      else if (s[i] === '(') depth--;
      else if (depth === 0 && s.startsWith(op, i)) {
        return {
          left: s.substring(0, i),
          right: s.substring(i + op.length),
        };
      }
    }
    return null;
  };

  const iff = splitByOp('↔');
  if (iff) {
    return evalParsed(iff.left) === evalParsed(iff.right);
  }

  const imp = splitByOp('→');
  if (imp) {
    const leftVal = evalParsed(imp.left);
    const rightVal = evalParsed(imp.right);
    // V → F = F, todo lo demás es V
    return !leftVal || rightVal;
  }

  const or = splitByOp('∨');
  if (or) {
    return evalParsed(or.left) || evalParsed(or.right);
  }

  const and = splitByOp('∧');
  if (and) {
    return evalParsed(and.left) && evalParsed(and.right);
  }

  // Negación al inicio
  if (s.startsWith('¬') || s.startsWith('~') || s.startsWith('!')) {
    return !evalParsed(s.slice(1));
  }

  return false;
}

/**
 * Genera la tabla de verdad completa y realiza la clasificación semántica.
 */
export function generateTruthTableAnalysis(
  premises: string[],
  conclusion: string
): TruthTableAnalysis {
  const allFormulas = [...premises, conclusion];
  const variables = extractVariables(allFormulas);

  if (variables.length === 0) {
    variables.push('p');
  }

  const totalRows = Math.pow(2, variables.length);
  const rows: TruthTableRow[] = [];
  const counterexamples: TruthTableRow[] = [];

  let allConclusionTrue = true;
  let allConclusionFalse = true;
  let hasValidArgument = true;

  for (let i = 0; i < totalRows; i++) {
    const valuation: Record<string, boolean> = {};

    // Asignar V/F de mayor a menor peso binario
    for (let vIdx = 0; vIdx < variables.length; vIdx++) {
      const bitWeight = Math.pow(2, variables.length - 1 - vIdx);
      const isTrue = Math.floor(i / bitWeight) % 2 === 0; // 0 = True (V), 1 = False (F)
      valuation[variables[vIdx]] = isTrue;
    }

    const premiseValues = premises.map((p) => evaluateFormula(p, valuation));
    const conclusionValue = evaluateFormula(conclusion, valuation);

    if (conclusionValue) allConclusionFalse = false;
    else allConclusionTrue = false;

    const allPremisesTrue = premiseValues.length === 0 || premiseValues.every((pv) => pv === true);
    const isCounterexample = allPremisesTrue && !conclusionValue;

    if (isCounterexample) {
      hasValidArgument = false;
    }

    const rowObj: TruthTableRow = {
      valuation,
      premiseValues,
      conclusionValue,
      allPremisesTrue,
      isCounterexample,
    };

    rows.push(rowObj);
    if (isCounterexample) {
      counterexamples.push(rowObj);
    }
  }

  const isTautology = allConclusionTrue;
  const isContradiction = allConclusionFalse;
  const isContingency = !isTautology && !isContradiction;

  let semanticVerdict = '';
  if (premises.length > 0) {
    if (hasValidArgument) {
      semanticVerdict =
        'El razonamiento es VÁLIDO (consecuencia lógica formal). En todas las interpretaciones donde todas las premisas son verdaderas, la conclusión es obligatoriamente verdadera (no existe ningún contraejemplo).';
    } else {
      semanticVerdict = `El razonamiento es INVÁLIDO (falacia formal). Existen ${counterexamples.length} fila(s) de contraejemplo donde las premisas son verdaderas pero la conclusión resulta falsa.`;
    }
  } else {
    if (isTautology) {
      semanticVerdict = 'La fórmula es una TAUTOLOGÍA (válida en todas las interpretaciones posibles, 1 en todas las filas).';
    } else if (isContradiction) {
      semanticVerdict = 'La fórmula es una CONTRADICCIÓN (insatisfacible, 0 en todas las filas posibles).';
    } else {
      semanticVerdict = 'La fórmula es una CONTINGENCIA (satisfacible pero no tautológica, depende de la asignación de verdad).';
    }
  }

  return {
    variables,
    rows,
    isTautology,
    isContradiction,
    isContingency,
    isValidArgument: hasValidArgument,
    counterexamples,
    semanticVerdict,
  };
}

/**
 * Diccionario de patrones de examen UOC para formalización en lenguaje natural.
 */
export interface NaturalLanguagePattern {
  id: string;
  phrasePattern: string; // ej: "A solo si B"
  formalSchema: string;  // ej: "A → B"
  explanation: string;
  exampleNatural: string;
  exampleFormal: string;
  examWarning: string;
}

export const UOC_NATURAL_PATTERNS: NaturalLanguagePattern[] = [
  {
    id: 'solo_si',
    phrasePattern: 'A solo si B',
    formalSchema: 'A → B',
    explanation: '"B" es condición necesaria para "A". Que ocurra A exige que ocurra B. ¡Cuidado! NO es B → A.',
    exampleNatural: '"Apruebas la PEC solo si entregas a tiempo"',
    exampleFormal: 'Apruebas → Entregas_a_tiempo',
    examWarning: 'Error frecuente en la UOC: formalizar "A solo si B" como B → A. La regla mnemotécnica: "solo si" introduce el consecuente.',
  },
  {
    id: 'a_menos_que',
    phrasePattern: 'A a menos que B / A salvo que B',
    formalSchema: '¬B → A (equivalente a A ∨ B)',
    explanation: 'Si no ocurre B, entonces obligatoriamente ocurrirá A.',
    exampleNatural: '"Iremos a la biblioteca a menos que llueva"',
    exampleFormal: '¬Llueve → Biblioteca (o Biblioteca ∨ Llueve)',
    examWarning: 'En la UOC se admite tanto ¬B → A como la forma disyuntiva A ∨ B.',
  },
  {
    id: 'condicion_necesaria',
    phrasePattern: 'B es condición necesaria para A',
    formalSchema: 'A → B',
    explanation: 'Sin B no puede haber A. Por tanto, si se da A es seguro que se da B.',
    exampleNatural: '"Tener más de 18 años es condición necesaria para votar"',
    exampleFormal: 'Votar → Mayor_18',
    examWarning: 'La condición necesaria SIEMPRE va en el consecuente (a la derecha de la flecha →).',
  },
  {
    id: 'condicion_suficiente',
    phrasePattern: 'A es condición suficiente para B',
    formalSchema: 'A → B',
    explanation: 'Basta con que ocurra A para garantizar automáticamente que ocurre B.',
    exampleNatural: '"Sacar un 10 es condición suficiente para aprobar con honores"',
    exampleFormal: 'Sacar_10 → Honores',
    examWarning: 'La condición suficiente SIEMPRE va en el antecedente (a la izquierda de la flecha →).',
  },
  {
    id: 'ni_ni',
    phrasePattern: 'Ni A ni B',
    formalSchema: '¬A ∧ ¬B (o ¬(A ∨ B))',
    explanation: 'No se da A y tampoco se da B.',
    exampleNatural: '"Ni Juan estudia ni Pedro atiende"',
    exampleFormal: '¬Estudia_Juan ∧ ¬Atiende_Pedro',
    examWarning: 'Por leyes de De Morgan, ¬A ∧ ¬B es idéntico a ¬(A ∨ B). Nunca formalices como ¬A ∨ ¬B.',
  },
  {
    id: 'si_y_solo_si',
    phrasePattern: 'A si y solo si B / A es condición necesaria y suficiente para B',
    formalSchema: 'A ↔ B',
    explanation: 'Ambas proposiciones tienen exactamente el mismo valor de verdad en todo momento.',
    exampleNatural: '"Un triángulo es equilátero si y solo si tiene los tres lados iguales"',
    exampleFormal: 'Equilatero ↔ Lados_iguales',
    examWarning: 'Equivale a la doble implicación: (A → B) ∧ (B → A).',
  },
];

/**
 * Guía de transformación a Forma Normal Conjuntiva (FNC) y Forma Normal Disyuntiva (FND).
 */
export interface NormalFormGuideStep {
  stepNum: number;
  name: string;
  ruleFormula: string;
  description: string;
}

export const FNC_TRANSFORMATION_STEPS: NormalFormGuideStep[] = [
  {
    stepNum: 1,
    name: 'Eliminación de conectivos derivados (→ y ↔)',
    ruleFormula: 'A → B ≡ ¬A ∨ B  |  A ↔ B ≡ (¬A ∨ B) ∧ (¬B ∨ A)',
    description: 'Sustituye cualquier implicación o bicondicional para dejar solo conectivos {∧, ∨, ¬}.',
  },
  {
    stepNum: 2,
    name: 'Interiorización de negaciones (De Morgan y Doble Negación)',
    ruleFormula: '¬(A ∧ B) ≡ ¬A ∨ ¬B  |  ¬(A ∨ B) ≡ ¬A ∧ ¬B  |  ¬¬A ≡ A',
    description: 'Empuja todas las negaciones hasta que afecten única y exclusivamente a variables atómicas aisladas (literales).',
  },
  {
    stepNum: 3,
    name: 'Aplicación de distributividad para FNC',
    ruleFormula: 'A ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C)',
    description: 'Distribuye la disyunción sobre la conjunción para obtener una gran CONJUNCIÓN de cláusulas DISYUNTIVAS (C₁ ∧ C₂ ∧ ... ∧ Cₖ).',
  },
  {
    stepNum: 4,
    name: 'Simplificación y eliminación de tautologías triviales',
    ruleFormula: 'A ∨ ¬A ∨ B ≡ Tautología (se descarta de la FNC)',
    description: 'Cualquier cláusula que contenga un literal y su negación (p ∨ ¬p) es trivialmente verdadera y se elimina del conjunto de cláusulas.',
  },
];
