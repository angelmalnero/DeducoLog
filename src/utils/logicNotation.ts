import { NotationStyle, RuleSetMode } from '../types/logic';

/**
 * Reemplazos en vivo de snippets de texto rápido a símbolos de lógica formal.
 * Soporta operadores clásicos de teclado rápido:
 * -> => →
 * <-> <=> ↔
 * & ^ => ∧
 * | v (en contexto) => ∨
 * ! ~ => ¬
 * # _|_ falsum => ⊥
 * @ forall => ∀
 * $ exists => ∃
 * [] box => □
 */
export function expandFormulaSnippets(input: string): string {
  let result = input;

  // Equivalencia y condicionales largos primero
  result = result.replace(/<->|<=>/g, '↔');
  result = result.replace(/->|=>/g, '→');

  // Negación
  result = result.replace(/!|~/g, '¬');

  // Conjunción
  result = result.replace(/&|\^/g, '∧');

  // Absurdo / Falsum / Cláusula vacía
  result = result.replace(/_\|_|falsum|#bot|#F/gi, '⊥');
  result = result.replace(/\[\]|#empty|box/gi, '□');

  // Cuantificadores
  result = result.replace(/@|\\forall|forall/gi, '∀');
  result = result.replace(/\$|\\exists|exists/gi, '∃');

  // Equivalencia lógica
  result = result.replace(/===|==/g, '≡');

  // Disyunción (| o ' v ' entre letras)
  result = result.replace(/\|{1,2}/g, '∨');
  result = result.replace(/(\s+)v(\s+)/g, '$1∨$2');

  return result;
}

/**
 * Diccionario de equivalencias entre símbolos y siglas oficiales de la UOC.
 */
export interface RuleNotationMap {
  canonicalId: string;
  symbol: string;       // ej: "I→"
  acronym: string;      // ej: "II"
  altAcronyms: string[];// ej: ["MP", "EI", "E→", "Modus Ponens"]
  isDerived: boolean;
  role: 'fabricar' | 'romper' | 'auxiliar';
  name: string;
}

export const UOC_RULE_NOTATION_MAP: RuleNotationMap[] = [
  // BÁSICAS DE CONJUNCIÓN
  {
    canonicalId: 'intro_and',
    symbol: 'I∧',
    acronym: 'IC',
    altAcronyms: ['I∧', 'IC', 'INTRO_CONJ', 'I&'],
    isDerived: false,
    role: 'fabricar',
    name: 'Introducción de la Conjunción',
  },
  {
    canonicalId: 'elim_and_1',
    symbol: 'E∧₁',
    acronym: 'EC₁',
    altAcronyms: ['E∧', 'EC', 'E∧1', 'EC1', 'ELIM_CONJ'],
    isDerived: false,
    role: 'romper',
    name: 'Eliminación Conjunción (1)',
  },
  {
    canonicalId: 'elim_and_2',
    symbol: 'E∧₂',
    acronym: 'EC₂',
    altAcronyms: ['E∧', 'EC', 'E∧2', 'EC2', 'ELIM_CONJ'],
    isDerived: false,
    role: 'romper',
    name: 'Eliminación Conjunción (2)',
  },

  // BÁSICAS DE CONDICIONAL
  {
    canonicalId: 'intro_imp',
    symbol: 'I→',
    acronym: 'II',
    altAcronyms: ['I→', 'II', 'TD', 'TEOREMA_DEDUCCION', 'I->'],
    isDerived: false,
    role: 'fabricar',
    name: 'Introducción del Condicional (Teorema de la Deducción)',
  },
  {
    canonicalId: 'elim_imp',
    symbol: 'E→',
    acronym: 'EI',
    altAcronyms: ['E→', 'EI', 'MP', 'MODUS_PONENS', 'E->'],
    isDerived: false,
    role: 'romper',
    name: 'Eliminación del Condicional (Modus Ponens)',
  },

  // BÁSICAS DE DISYUNCIÓN
  {
    canonicalId: 'intro_or_1',
    symbol: 'I∨₁',
    acronym: 'ID₁',
    altAcronyms: ['I∨', 'ID', 'I∨1', 'ID1'],
    isDerived: false,
    role: 'fabricar',
    name: 'Introducción de la Disyunción (1)',
  },
  {
    canonicalId: 'intro_or_2',
    symbol: 'I∨₂',
    acronym: 'ID₂',
    altAcronyms: ['I∨', 'ID', 'I∨2', 'ID2'],
    isDerived: false,
    role: 'fabricar',
    name: 'Introducción de la Disyunción (2)',
  },
  {
    canonicalId: 'elim_or',
    symbol: 'E∨',
    acronym: 'ED',
    altAcronyms: ['E∨', 'ED', 'CASOS', 'PRUEBA_CASOS'],
    isDerived: false,
    role: 'romper',
    name: 'Eliminación de la Disyunción (Prueba por Casos)',
  },

  // BÁSICAS DE NEGACIÓN
  {
    canonicalId: 'intro_not',
    symbol: 'I¬',
    acronym: 'IN',
    altAcronyms: ['I¬', 'IN', 'RAA', 'REDUCCION_ABSURDO', 'I~', 'I!'],
    isDerived: false,
    role: 'fabricar',
    name: 'Introducción de la Negación (Reducción al Absurdo)',
  },
  {
    canonicalId: 'elim_not',
    symbol: 'E¬',
    acronym: 'EN',
    altAcronyms: ['E¬', 'EN', 'DN', 'DOBLE_NEGACION', 'E~', 'E!'],
    isDerived: false,
    role: 'romper',
    name: 'Eliminación de la Negación (Doble Negación)',
  },

  // BÁSICAS DE BICONDICIONAL
  {
    canonicalId: 'intro_iff',
    symbol: 'I↔',
    acronym: 'IE',
    altAcronyms: ['I↔', 'IE', 'I<->'],
    isDerived: false,
    role: 'fabricar',
    name: 'Introducción de la Equivalencia',
  },
  {
    canonicalId: 'elim_iff',
    symbol: 'E↔',
    acronym: 'EE',
    altAcronyms: ['E↔', 'EE', 'E<->'],
    isDerived: false,
    role: 'romper',
    name: 'Eliminación de la Equivalencia',
  },

  // CUANTIFICADORES (PREDICADOS)
  {
    canonicalId: 'elim_forall',
    symbol: 'E∀',
    acronym: 'EU',
    altAcronyms: ['E∀', 'EU', 'PARTICULARIZACION_UNIVERSAL', 'E@'],
    isDerived: false,
    role: 'romper',
    name: 'Eliminación del Universal (Particularización)',
  },
  {
    canonicalId: 'intro_forall',
    symbol: 'I∀',
    acronym: 'IU',
    altAcronyms: ['I∀', 'IU', 'GENERALIZACION_UNIVERSAL', 'I@'],
    isDerived: false,
    role: 'fabricar',
    name: 'Introducción del Universal (Constante Fresca)',
  },
  {
    canonicalId: 'intro_exists',
    symbol: 'I∃',
    acronym: 'IEx',
    altAcronyms: ['I∃', 'IEx', 'I$', 'IE_EXIST'],
    isDerived: false,
    role: 'fabricar',
    name: 'Introducción del Existencial',
  },
  {
    canonicalId: 'elim_exists',
    symbol: 'E∃',
    acronym: 'EEx',
    altAcronyms: ['E∃', 'EEx', 'E$', 'EE_EXIST', 'CAJA_EXISTENCIAL'],
    isDerived: false,
    role: 'romper',
    name: 'Eliminación del Existencial (Testigo Fresco)',
  },

  // REGLAS DERIVADAS DE LA UOC
  {
    canonicalId: 'modus_tollens',
    symbol: 'MT',
    acronym: 'MT',
    altAcronyms: ['MT', 'MODUS_TOLLENS'],
    isDerived: true,
    role: 'romper',
    name: 'Modus Tollens',
  },
  {
    canonicalId: 'silogismo_disyuntivo',
    symbol: 'SD',
    acronym: 'SD',
    altAcronyms: ['SD', 'SILOGISMO_DISYUNTIVO'],
    isDerived: true,
    role: 'romper',
    name: 'Silogismo Disyuntivo',
  },
  {
    canonicalId: 'silogismo_hipotetico',
    symbol: 'SH',
    acronym: 'SH',
    altAcronyms: ['SH', 'TRANSITIVIDAD', 'SILOGISMO_HIPOTETICO'],
    isDerived: true,
    role: 'fabricar',
    name: 'Silogismo Hipotético (Transitividad)',
  },
  {
    canonicalId: 'de_morgan',
    symbol: 'DeM',
    acronym: 'DeM',
    altAcronyms: ['DEMORGAN', 'DM', 'LEYES_DE_MORGAN'],
    isDerived: true,
    role: 'auxiliar',
    name: 'Leyes de De Morgan',
  },
  {
    canonicalId: 'contraposicion',
    symbol: 'CP',
    acronym: 'CP',
    altAcronyms: ['CP', 'CONTRAPOSICION'],
    isDerived: true,
    role: 'auxiliar',
    name: 'Contraposición',
  },
  {
    canonicalId: 'idempotencia',
    symbol: 'Id',
    acronym: 'Id',
    altAcronyms: ['IDEM', 'IDEMPOTENCIA'],
    isDerived: true,
    role: 'auxiliar',
    name: 'Idempotencia',
  },
  {
    canonicalId: 'conmutatividad',
    symbol: 'Conm',
    acronym: 'Conm',
    altAcronyms: ['CONM', 'CONMUTATIVIDAD'],
    isDerived: true,
    role: 'auxiliar',
    name: 'Conmutatividad',
  },
  {
    canonicalId: 'exportacion',
    symbol: 'Exp',
    acronym: 'Exp',
    altAcronyms: ['EXP', 'EXPORTACION'],
    isDerived: true,
    role: 'auxiliar',
    name: 'Ley de Exportación',
  },
];

/**
 * Resuelve cualquier texto de regla escrito por el usuario (símbolo o sigla)
 * al formato deseado según la preferencia del usuario.
 */
export function formatRuleName(
  ruleStr: string,
  style: NotationStyle = 'symbol',
  allowDerived: boolean = true
): string {
  const clean = ruleStr.trim().replace(/\s+/g, '').toUpperCase();
  const found = UOC_RULE_NOTATION_MAP.find(
    (r) =>
      r.symbol.replace(/\s+/g, '').toUpperCase() === clean ||
      r.acronym.replace(/\s+/g, '').toUpperCase() === clean ||
      r.altAcronyms.some((alt) => alt.replace(/\s+/g, '').toUpperCase() === clean)
  );

  if (!found) return ruleStr;
  if (!allowDerived && found.isDerived) {
    return `${found.symbol} (Derivada no permitida en modo estricto)`;
  }

  return style === 'acronym' ? found.acronym : found.symbol;
}

/**
 * Comprueba si dos identificadores de regla son equivalentes en notación UOC
 * (ej: "MP" === "E→", "II" === "I→", "IC" === "I∧").
 */
export function areRulesEquivalent(ruleA: string, ruleB: string): boolean {
  const norm = (s: string) => s.trim().replace(/[\s()_]/g, '').toUpperCase();
  const nA = norm(ruleA);
  const nB = norm(ruleB);

  if (nA === nB) return true;

  const matchA = UOC_RULE_NOTATION_MAP.find(
    (r) => norm(r.symbol) === nA || norm(r.acronym) === nA || r.altAcronyms.some((x) => norm(x) === nA)
  );
  const matchB = UOC_RULE_NOTATION_MAP.find(
    (r) => norm(r.symbol) === nB || norm(r.acronym) === nB || r.altAcronyms.some((x) => norm(x) === nB)
  );

  if (matchA && matchB) {
    return matchA.canonicalId === matchB.canonicalId;
  }

  return false;
}

/**
 * Detecta el conectivo principal de una fórmula proposicional/primer orden
 * para guiar la estrategia de "Fabricar vs Romper".
 */
export function detectMainConnective(formula: string): {
  connective: 'implies' | 'and' | 'or' | 'not' | 'iff' | 'forall' | 'exists' | 'atom';
  advice: string;
  recommendedIntroRule: string;
  recommendedElimRule: string;
} {
  const f = formula.trim();

  // Cuantificadores al inicio
  if (f.startsWith('∀') || f.startsWith('@')) {
    return {
      connective: 'forall',
      advice: 'Tu objetivo es un Universal (∀). Para FABRICARLO, abre una caja con una constante FRESCA (ej. c) y demuéstralo por I∀ (IU).',
      recommendedIntroRule: 'I∀ / IU',
      recommendedElimRule: 'E∀ / EU',
    };
  }

  if (f.startsWith('∃') || f.startsWith('$')) {
    return {
      connective: 'exists',
      advice: 'Tu objetivo es un Existencial (∃). Para FABRICARLO, demuestra la propiedad para algún término y aplícale I∃ (IEx).',
      recommendedIntroRule: 'I∃ / IEx',
      recommendedElimRule: 'E∃ / EEx',
    };
  }

  // Quitar paréntesis externos si envuelven toda la expresión
  const stripped = stripOuterParentheses(f);

  // Buscar operador principal a nivel de paréntesis 0
  let depth = 0;
  let mainOp = '';

  // Búsqueda de menor a mayor precedencia: ↔, →, ∨, ∧, ¬
  const tokens = ['↔', '→', '∨', '∧'];
  for (const op of tokens) {
    depth = 0;
    for (let i = stripped.length - 1; i >= 0; i--) {
      const ch = stripped[i];
      if (ch === ')') depth++;
      else if (ch === '(') depth--;
      else if (depth === 0 && stripped.startsWith(op, i)) {
        mainOp = op;
        break;
      }
    }
    if (mainOp) break;
  }

  if (mainOp === '→') {
    return {
      connective: 'implies',
      advice: 'Tu objetivo es una Implicación (α → β). La estrategia dorada de la UOC: FABRICAR abriendo un supuesto con el antecedente (α) y alcanzar el consecuente (β) para cerrar con I→ (II).',
      recommendedIntroRule: 'I→ / II (Teorema de la Deducción)',
      recommendedElimRule: 'E→ / EI (Modus Ponens)',
    };
  }

  if (mainOp === '∧') {
    return {
      connective: 'and',
      advice: 'Tu objetivo es una Conjunción (α ∧ β). Para FABRICARLA, demuestra α y β por separado en dos ramas y únelas con I∧ (IC).',
      recommendedIntroRule: 'I∧ / IC',
      recommendedElimRule: 'E∧ / EC',
    };
  }

  if (mainOp === '∨') {
    return {
      connective: 'or',
      advice: 'Tu objetivo es una Disyunción (α ∨ β). Puedes FABRICARLA obteniendo cualquiera de los dos lados (I∨ / ID), o ROMPIENDO una disyunción de las premisas mediante prueba por casos (E∨ / ED).',
      recommendedIntroRule: 'I∨ / ID',
      recommendedElimRule: 'E∨ / ED (Prueba por Casos)',
    };
  }

  if (mainOp === '↔') {
    return {
      connective: 'iff',
      advice: 'Tu objetivo es una Equivalencia (α ↔ β). Debes FABRICARLA demostrando ambas direcciones: α → β y β → α, luego aplicar I↔ (IE).',
      recommendedIntroRule: 'I↔ / IE',
      recommendedElimRule: 'E↔ / EE',
    };
  }

  if (stripped.startsWith('¬') || stripped.startsWith('~') || stripped.startsWith('!')) {
    return {
      connective: 'not',
      advice: 'Tu objetivo es una Negación (¬α). Para FABRICARLA, abre un supuesto con lo contrario (α), busca una contradicción (⊥) y cierra por Reducción al Absurdo I¬ (IN).',
      recommendedIntroRule: 'I¬ / IN (Reducción al Absurdo / RAA)',
      recommendedElimRule: 'E¬ / EN (Doble Negación / DN)',
    };
  }

  return {
    connective: 'atom',
    advice: 'Tu objetivo es un átomo o fórmula simple. No se puede fabricar con reglas de introducción directamente; debes ROMPER las premisas existentes usando reglas de Eliminación (E→, E∧, E∨) o por RAA.',
    recommendedIntroRule: 'RAA (suponer lo contrario si no hay salida directa)',
    recommendedElimRule: 'E→ (MP), E∧ (EC), E∨ (ED)',
  };
}

function stripOuterParentheses(s: string): string {
  let str = s.trim();
  while (str.startsWith('(') && str.endsWith(')')) {
    let depth = 0;
    let wrap = true;
    for (let i = 0; i < str.length - 1; i++) {
      if (str[i] === '(') depth++;
      else if (str[i] === ')') depth--;
      if (depth === 0) {
        wrap = false;
        break;
      }
    }
    if (wrap) {
      str = str.slice(1, -1).trim();
    } else {
      break;
    }
  }
  return str;
}
