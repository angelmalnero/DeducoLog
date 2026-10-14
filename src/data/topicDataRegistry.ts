import { Module, GymExercise, FreeExercise, LogicRule } from '../types/logic';
import { TopicId } from './topics';
import { MODULES as PEC2_MODULES } from './curriculum';
import { UOC_EXAM_EXERCISES as PEC2_GYM } from './uocExams';
import { HUNDRED_EXERCISES as PEC2_FREE } from './hundredExercises';
import { LOGIC_RULES as PEC2_RULES } from './rules';

// ==========================================
// PEC1 DATA: Lenguaje Formal de Enunciados
// ==========================================
export const PEC1_MODULES: Module[] = [
  {
    id: 'pec1_mod_1',
    title: 'Módulo 1: Formalización de Enunciados',
    subtitle: 'De las palabras a los símbolos proposicionales',
    description: 'Aprende a identificar átomos (p, q, r) y traducirlos con conectivas lógicas.',
    color: 'from-blue-600 to-indigo-600',
    accentColor: 'blue',
    lessons: [
      {
        id: 'pec1_l1',
        moduleId: 'pec1_mod_1',
        title: 'Identificando Proposiciones Atómicas',
        subtitle: 'Distinguiendo hechos de opiniones',
        description: '¿Qué frases del castellano se pueden formalizar en lógica proposicional?',
        icon: 'book',
        color: 'bg-blue-600',
        owlIntroTip: 'En lógica proposicional, una proposición atómica debe ser verdadera o falsa sin ambigüedades.',
        xpReward: 25,
        questions: [
          {
            id: 'pec1_q1',
            type: 'choose_rule',
            prompt: '¿Cómo formalizas: "Si llueve o hace viento, me quedo en casa estudiando"?',
            options: [
              { id: 'opt_1', text: '(p ∨ q) → r', isCorrect: true, explanation: '¡Correcto! "p" (llueve) o "q" (viento) es la condición antecedente para "r" (me quedo).' },
              { id: 'opt_2', text: 'p ∧ (q → r)', isCorrect: false, explanation: 'Incorrecto: la disyunción forma parte del antecedente completo.' },
              { id: 'opt_3', text: 'p → (q ∨ r)', isCorrect: false, explanation: 'Eso diría "Si llueve, hace viento o me quedo".' },
            ],
            hint: 'Identifica la condición ("Si...") y la consecuencia ("entonces...").',
            explanation: 'En expresiones "Si A o B, entonces C", la formalización canónica es (A ∨ B) → C.',
          },
          {
            id: 'pec1_q2',
            type: 'choose_conclusion',
            prompt: 'Formaliza: "Ni Juan aprueba ni Pedro suspende" (donde p = Juan aprueba, q = Pedro suspende):',
            options: [
              { id: 'opt_1', text: '¬p ∧ ¬q', isCorrect: true, explanation: '¡Perfecto! "Ni A ni B" equivale a (¬A ∧ ¬B).' },
              { id: 'opt_2', text: '¬(p ∧ q)', isCorrect: false, explanation: 'Eso significaría que no aprueban los dos a la vez, pero uno podría aprobar.' },
              { id: 'opt_3', text: '¬p ∨ ¬q', isCorrect: false, explanation: 'Eso sería "O Juan no aprueba o Pedro no suspende".' },
            ],
            hint: '"Ni... ni..." significa que NO ocurre lo primero Y TAMPOCO ocurre lo segundo.',
            explanation: 'La estructura "Ni p ni q" se formaliza como ¬p ∧ ¬q (o equivalentemente ¬(p ∨ q) por De Morgan).',
          },
        ],
      },
      {
        id: 'pec1_l2',
        moduleId: 'pec1_mod_1',
        title: 'Tablas de Verdad e Interpretaciones',
        subtitle: 'Calculando el valor de verdad en 2ⁿ filas',
        description: 'Evalúa cuándo una fórmula compuesta resulta verdadera o falsa.',
        icon: 'layers',
        color: 'bg-indigo-600',
        owlIntroTip: 'Una fórmula con n variables proposicionales tiene exactamente 2ⁿ filas en su tabla de verdad.',
        xpReward: 30,
        questions: [
          {
            id: 'pec1_l2_q1',
            type: 'choose_rule',
            prompt: 'Si p = Verdadero y q = Falso, ¿cuál es el valor de verdad de (p → q)?',
            options: [
              { id: 'opt_1', text: 'Falso (V → F es el único caso falso del condicional)', isCorrect: true, explanation: '¡Exacto! Una promesa solo se rompe si se cumple la condición pero no el resultado.' },
              { id: 'opt_2', text: 'Verdadero', isCorrect: false, explanation: 'V → F siempre evalúa a F.' },
            ],
            hint: 'El condicional solo es falso cuando la causa ocurre pero la consecuencia no.',
            explanation: 'La tabla de verdad de la implicación determina que V → F = F. En todos los demás casos es V.',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_pec1',
      title: 'Desafío Maestro: Lenguaje Formal PEC1 👑',
      description: 'Supera el test integral de formalización y tablas de verdad.',
      xpReward: 60,
      questions: [
        {
          id: 'boss_pec1_q1',
          type: 'choose_rule',
          prompt: 'La fórmula (p ∧ ¬p) es un ejemplo clásico de:',
          options: [
            { id: 'opt_1', text: 'Contradicción (insatisfacible, siempre F)', isCorrect: true, explanation: '¡Correcto! Es imposible que una fórmula y su negación sean verdaderas a la vez.' },
            { id: 'opt_2', text: 'Tautología (válida, siempre V)', isCorrect: false, explanation: 'Una tautología sería p ∨ ¬p.' },
            { id: 'opt_3', text: 'Contingencia', isCorrect: false, explanation: 'No depende de la interpretación, siempre es F.' },
          ],
          hint: 'Evalúa los dos casos: si p = V, p ∧ ¬p = F; si p = F, p ∧ ¬p = F.',
          explanation: 'Una contradicción formal es aquella fórmula que evalúa a Falso en todas sus interpretaciones posibles.',
        },
      ],
    },
  },
];

export const PEC1_GYM: GymExercise[] = [
  {
    id: 'gym_pec1_1',
    title: 'Formalización de un Argumento de Examen PEC1',
    uocExamOrigin: 'PEC1 Lògica UOC',
    difficulty: 'fácil',
    category: 'conjunción',
    premises: ['p → q', 'q → r'],
    goal: 'p → r',
    strategyOverview: 'Evalúa la validez del razonamiento mediante equivalencia lógica o implicación tautológica.',
    hints: ['Verifica si en las filas donde las premisas son V, la conclusión también lo es.'],
    solutionSteps: [
      { formula: 'p → q', rule: 'Premisa', referencedLines: [], explanation: 'Premisa 1' },
      { formula: 'q → r', rule: 'Premisa', referencedLines: [], explanation: 'Premisa 2' },
      { formula: 'p → r', rule: 'Tautología', referencedLines: [1, 2], explanation: 'Consecuencia lógica demostrada' },
    ],
  },
  {
    id: 'gym_pec1_2',
    title: 'Leyes de De Morgan: Equivalencia Formal',
    uocExamOrigin: 'Examen PEC1 UOC',
    difficulty: 'medio',
    category: 'disyunción',
    premises: ['¬(p ∨ q)'],
    goal: '¬p ∧ ¬q',
    strategyOverview: 'Aplica la ley de De Morgan para negar una disyunción distribuyendo la negación y cambiando a conjunción.',
    hints: ['¬(A ∨ B) ≡ ¬A ∧ ¬B.'],
    solutionSteps: [
      { formula: '¬(p ∨ q)', rule: 'Premisa', referencedLines: [], explanation: 'Premisa dada' },
      { formula: '¬p ∧ ¬q', rule: 'De Morgan', referencedLines: [1], explanation: 'Equivalencia lógica de De Morgan' },
    ],
  },
];

export const PEC1_FREE: FreeExercise[] = Array.from({ length: 25 }, (_, i) => ({
  id: `pec1_free_${i + 1}`,
  number: i + 1,
  title: `Formalización y Tabla de Verdad #${i + 1}`,
  category: 'Lenguaje Formal',
  difficulty: i < 8 ? 'básico' : i < 18 ? 'intermedio' : 'examen',
  premises: [`p${i + 1} → q${i + 1}`, `q${i + 1}`],
  goal: `p${i + 1} ∨ q${i + 1}`,
  hints: ['Evalúa el valor de verdad o simplifica usando leyes de equivalencia proposicional.'],
  solutionSteps: [
    { formula: `p${i + 1} ∨ q${i + 1}`, rule: 'I∨', referencedLines: [2], explanation: 'Demostración de consecuencia lógica' },
  ],
}));

// ==========================================
// PEC3 DATA: Mecanización y Resolución Proposicional
// ==========================================
export const PEC3_MODULES: Module[] = [
  {
    id: 'pec3_mod_1',
    title: 'Módulo 1: Formas Normales y Cláusulas',
    subtitle: 'FNC, FND y el paso al formato clausal',
    description: 'Transforma cualquier fórmula en una conjunción de cláusulas disyuntivas para mecanizar.',
    color: 'from-purple-600 to-violet-700',
    accentColor: 'purple',
    lessons: [
      {
        id: 'pec3_l1',
        moduleId: 'pec3_mod_1',
        title: 'Forma Normal Conjuntiva (FNC)',
        subtitle: 'Conjunciones de disyunciones',
        description: 'Aprende a eliminar implicaciones (A → B ≡ ¬A ∨ B) y aplicar distributividad.',
        icon: 'cpu',
        color: 'bg-purple-600',
        owlIntroTip: 'El primer paso del método de resolución es convertir todo a FNC (cláusulas unidas por ∧).',
        xpReward: 30,
        questions: [
          {
            id: 'pec3_q1',
            type: 'choose_rule',
            prompt: '¿Cómo transformas la implicación (p → q) en forma clausal disyuntiva?',
            options: [
              { id: 'opt_1', text: '¬p ∨ q', isCorrect: true, explanation: '¡Correcto! Por equivalencia del condicional, p → q es exactamente ¬p ∨ q.' },
              { id: 'opt_2', text: 'p ∧ ¬q', isCorrect: false, explanation: 'Esa es la negación del condicional, no el condicional mismo.' },
            ],
            hint: 'A → B es falso solo cuando A es V y B es F, luego es V cuando ¬A o B.',
            explanation: 'La regla de eliminación del condicional establece: A → B ≡ ¬A ∨ B.',
          },
        ],
      },
      {
        id: 'pec3_l2',
        moduleId: 'pec3_mod_1',
        title: 'El Método de Resolución Proposicional',
        subtitle: 'Buscando la cláusula vacía (□)',
        description: 'Si tienes {p, ¬p ∨ q}, el resolvente produce {q}. Si llegas a □, el conjunto es insatisfacible.',
        icon: 'split',
        color: 'bg-violet-600',
        owlIntroTip: 'La regla de resolución elimina literales complementarios: de {A, B} y {¬A, C} se deduce {B, C}.',
        xpReward: 35,
        questions: [
          {
            id: 'pec3_q2',
            type: 'choose_conclusion',
            prompt: 'Dadas las cláusulas C1: {p, q} y C2: {¬p, r}, ¿cuál es su resolvente Res(C1, C2)?',
            options: [
              { id: 'opt_1', text: '{q, r}', isCorrect: true, explanation: '¡Exacto! El literal p y ¬p se cancelan, dejando la unión de los literales restantes.' },
              { id: 'opt_2', text: '{p, ¬p, q, r}', isCorrect: false, explanation: 'No, los literales complementarios deben eliminarse.' },
              { id: 'opt_3', text: '□ (cláusula vacía)', isCorrect: false, explanation: 'Solo se obtiene □ si las cláusulas son exactamente {p} y {¬p}.' },
            ],
            hint: 'Elimina el par complementario (p y ¬p) y une el resto.',
            explanation: 'La regla de resolución proposicional toma (L ∨ A) y (¬L ∨ B) y produce el resolvente (A ∨ B).',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_pec3',
      title: 'Desafío Maestro: Resolución Proposicional PEC3 👑',
      description: 'Demuestra la refutación completa llegando a la cláusula vacía □.',
      xpReward: 70,
      questions: [
        {
          id: 'boss_pec3_q1',
          type: 'choose_rule',
          prompt: 'En el método de resolución, si derivamos la cláusula vacía □ significa que:',
          options: [
            { id: 'opt_1', text: 'El conjunto de cláusulas original es INSATISFACIBLE (hemos demostrado el teorema por refutación)', isCorrect: true, explanation: '¡Magistral! La cláusula vacía representa una contradicción insuperable.' },
            { id: 'opt_2', text: 'El conjunto es contingente', isCorrect: false, explanation: 'No, □ demuestra que es contradictorio.' },
          ],
          hint: '□ es el equivalente al absurdo ⊥ en deducción natural.',
          explanation: 'La derivación de la cláusula vacía □ demuestra que no existe ninguna interpretación que haga verdaderas todas las cláusulas simultáneamente.',
        },
      ],
    },
  },
];

export const PEC3_GYM: GymExercise[] = [
  {
    id: 'gym_pec3_1',
    title: 'Resolución de un Argumento Clásico PEC3',
    uocExamOrigin: 'PEC3 Lògica UOC',
    difficulty: 'medio',
    category: 'cajas_anidadas',
    premises: ['{¬p, q}', '{p}', '{¬q}'],
    goal: '□',
    strategyOverview: 'Resuelve C1 y C2 para obtener {q}, luego resuelve {q} con {¬q} para derivar la cláusula vacía □.',
    hints: ['Res(C1, C2) = {q}. Luego Res({q}, C3) = □.'],
    solutionSteps: [
      { formula: '{q}', rule: 'Res(1, 2)', referencedLines: [1, 2], explanation: 'Resolución de ¬p con p' },
      { formula: '□', rule: 'Res(3, 4)', referencedLines: [3, 4], explanation: 'Resolución de q con ¬q produce □' },
    ],
  },
];

export const PEC3_FREE: FreeExercise[] = Array.from({ length: 25 }, (_, i) => ({
  id: `pec3_free_${i + 1}`,
  number: i + 1,
  title: `Resolución y Cláusula Vacía #${i + 1}`,
  category: 'Resolución',
  difficulty: i < 8 ? 'básico' : i < 18 ? 'intermedio' : 'examen',
  premises: [`{p${i + 1}, q${i + 1}}`, `{¬p${i + 1}}`, `{¬q${i + 1}}`],
  goal: '□',
  hints: ['Resuelve las cláusulas por pares complementarios hasta alcanzar □.'],
  solutionSteps: [
    { formula: `{q${i + 1}}`, rule: 'Res', referencedLines: [1, 2], explanation: 'Resolvente intermedio' },
    { formula: '□', rule: 'Res', referencedLines: [3, 4], explanation: 'Cláusula vacía' },
  ],
}));

// ==========================================
// PEC4 DATA: Lógica de Predicados (Lenguaje)
// ==========================================
export const PEC4_MODULES: Module[] = [
  {
    id: 'pec4_mod_1',
    title: 'Módulo 1: Cuantificadores ∀ y ∃',
    subtitle: 'Formalización en Primer Orden',
    description: 'Aprende a formalizar afirmaciones sobre objetos, propiedades y relaciones.',
    color: 'from-amber-600 to-orange-700',
    accentColor: 'amber',
    lessons: [
      {
        id: 'pec4_l1',
        moduleId: 'pec4_mod_1',
        title: 'El Cuantificador Universal (∀)',
        subtitle: '"Para todo x..." y el condicional',
        description: 'La regla de oro: casi siempre que usas ∀, el conector principal es →.',
        icon: 'binary',
        color: 'bg-amber-600',
        owlIntroTip: '"Todos los humanos son mortales" se formaliza como ∀x (Humano(x) → Mortal(x)). ¡Cuidado con poner ∧!',
        xpReward: 30,
        questions: [
          {
            id: 'pec4_q1',
            type: 'choose_rule',
            prompt: '¿Por qué "Todos los informáticos estudian" NO se formaliza como ∀x (Inf(x) ∧ Est(x))?',
            options: [
              { id: 'opt_1', text: 'Porque eso afirmaría que TODO en el universo es informático y además estudia', isCorrect: true, explanation: '¡Exacto! El cuantificador universal exige condicional (→).' },
              { id: 'opt_2', text: 'Porque falta un cuantificador existencial', isCorrect: false, explanation: 'La frase es universal, pero requiere →.' },
            ],
            hint: 'El ∧ afirmaría que todas las cosas del universo (árboles, coches) son informáticos.',
            explanation: 'Regla de oro de la UOC: ∀x casi siempre se empareja con la implicación →, mientras que ∃x se empareja con la conjunción ∧.',
          },
        ],
      },
      {
        id: 'pec4_l2',
        moduleId: 'pec4_mod_1',
        title: 'El Cuantificador Existencial (∃)',
        subtitle: '"Existe al menos un x..." y la conjunción',
        description: 'Formalizando "Algunos informáticos aprueban con matrícula".',
        icon: 'compass',
        color: 'bg-orange-600',
        owlIntroTip: '"Algunos gatos duermen" se formaliza como ∃x (Gato(x) ∧ Duerme(x)).',
        xpReward: 30,
        questions: [
          {
            id: 'pec4_q2',
            type: 'choose_conclusion',
            prompt: 'Formaliza: "Existe un estudiante (E) que aprueba lógica (A)":',
            options: [
              { id: 'opt_1', text: '∃x (E(x) ∧ A(x))', isCorrect: true, explanation: '¡Correcto! Existe al menos un objeto que cumple ambas propiedades a la vez.' },
              { id: 'opt_2', text: '∃x (E(x) → A(x))', isCorrect: false, explanation: '¡Trampa típica! Eso sería verdadero si existiera cualquier objeto que NO fuera estudiante.' },
            ],
            hint: 'El existencial se asocia canónicamente con la conjunción ∧.',
            explanation: 'En lógica de primer orden, las sentencias existenciales afirmativas requieren ∧ para ser restrictivas.',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_pec4',
      title: 'Desafío Maestro: Lenguaje de Predicados PEC4 👑',
      description: 'Supera el test de formalización de primer orden con relaciones binarias.',
      xpReward: 70,
      questions: [
        {
          id: 'boss_pec4_q1',
          type: 'choose_rule',
          prompt: 'La negación de "Todos los pájaros vuelan" (¬∀x (P(x) → V(x))) equivale a:',
          options: [
            { id: 'opt_1', text: '∃x (P(x) ∧ ¬V(x)) (Existe al menos un pájaro que no vuela)', isCorrect: true, explanation: '¡Brillante! El contraejemplo existencial refuta la universalidad.' },
            { id: 'opt_2', text: '∀x (P(x) → ¬V(x))', isCorrect: false, explanation: 'Eso diría "Ningún pájaro vuela".' },
          ],
          hint: 'Intercambio de cuantificadores: ¬∀x A(x) ≡ ∃x ¬A(x).',
          explanation: 'La negación del universal es el existencial con la fórmula interior negada: ¬(P → V) ≡ P ∧ ¬V.',
        },
      ],
    },
  },
];

export const PEC4_GYM: GymExercise[] = [
  {
    id: 'gym_pec4_1',
    title: 'Formalización de un Enunciado Polinómico de Examen',
    uocExamOrigin: 'PEC4 Lògica UOC',
    difficulty: 'medio',
    category: 'implicación',
    premises: ['∀x (P(x) → Q(x))', 'P(a)'],
    goal: 'Q(a)',
    strategyOverview: 'Aplica eliminación del universal sobre la constante a, luego Modus Ponens.',
    hints: ['De ∀x (P(x) → Q(x)) deduces P(a) → Q(a). Con P(a) sacas Q(a).'],
    solutionSteps: [
      { formula: 'P(a) → Q(a)', rule: 'E∀', referencedLines: [1], explanation: 'Instanciación en a' },
      { formula: 'Q(a)', rule: 'E→', referencedLines: [3, 2], explanation: 'Modus Ponens en a' },
    ],
  },
];

export const PEC4_FREE: FreeExercise[] = Array.from({ length: 25 }, (_, i) => ({
  id: `pec4_free_${i + 1}`,
  number: i + 1,
  title: `Predicados y Cuantificadores #${i + 1}`,
  category: 'Predicados',
  difficulty: i < 8 ? 'básico' : i < 18 ? 'intermedio' : 'examen',
  premises: [`∀x (P${i + 1}(x) → Q${i + 1}(x))`, `P${i + 1}(c)`],
  goal: `Q${i + 1}(c)`,
  hints: ['Instancia el universal en la constante c y aplica Modus Ponens.'],
  solutionSteps: [
    { formula: `P${i + 1}(c) → Q${i + 1}(c)`, rule: 'E∀', referencedLines: [1], explanation: 'Instanciar universal' },
    { formula: `Q${i + 1}(c)`, rule: 'E→', referencedLines: [3, 2], explanation: 'Modus Ponens' },
  ],
}));

// ==========================================
// PEC5 DATA: Deducción Natural en Predicados
// ==========================================
export const PEC5_MODULES: Module[] = [
  {
    id: 'pec5_mod_1',
    title: 'Módulo 1: Reglas de Cuantificación de Gentzen',
    subtitle: 'I∀, E∀, I∃ y la caja con constante fresca de E∃',
    description: 'Extiende las reglas proposicionales a fórmulas con cuantificadores de primer orden.',
    color: 'from-rose-600 to-pink-700',
    accentColor: 'rose',
    lessons: [
      {
        id: 'pec5_l1',
        moduleId: 'pec5_mod_1',
        title: 'Instanciación y Generalización Universal',
        subtitle: 'E∀ (para cualquier término) e I∀ (con variable fresca c)',
        description: 'Cómo eliminar ∀x y cuándo es legal introducir un ∀x al cerrar una caja.',
        icon: 'compass',
        color: 'bg-rose-600',
        owlIntroTip: 'Para aplicar I∀, debes demostrar P(c) donde c es una constante totalmente nueva y arbitraria que no aparece en las premisas.',
        xpReward: 35,
        questions: [
          {
            id: 'pec5_q1',
            type: 'choose_rule',
            prompt: 'Si en la línea 1 tienes ∀x (P(x) ∧ Q(x)), ¿qué regla te permite deducir P(a) ∧ Q(a)?',
            options: [
              { id: 'opt_1', text: 'E∀ 1 (Eliminación del Universal)', isCorrect: true, explanation: '¡Correcto! Si vale para todo x, vale en particular para la constante a.' },
              { id: 'opt_2', text: 'I∀ 1', isCorrect: false, explanation: 'I∀ sirve para poner el ∀, no para quitarlo.' },
            ],
            hint: 'Quitas el cuantificador universal sustituyendo x por a.',
            explanation: 'La regla E∀ permite instanciar la variable cuantificada universalmente en cualquier término cerrado o constante del dominio.',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_pec5',
      title: 'Desafío Maestro: Deducción en Predicados PEC5 👑',
      description: 'Supera la prueba de eliminación del existencial E∃ con caja de Fitch.',
      xpReward: 75,
      questions: [
        {
          id: 'boss_pec5_q1',
          type: 'choose_rule',
          prompt: 'Al aplicar E∃ a partir de ∃x P(x), se abre una subderivación suponiendo:',
          options: [
            { id: 'opt_1', text: '[Hipótesis: P(c)] donde c es una constante fresca no usada previamente', isCorrect: true, explanation: '¡Exacto! "Sea c ese elemento que existe". La constante no puede salir de la caja.' },
            { id: 'opt_2', text: '[Hipótesis: ∀x P(x)]', isCorrect: false, explanation: 'Que exista uno no significa que todos lo sean.' },
          ],
          hint: 'Supones un testigo representativo arbitrario c.',
          explanation: 'La regla E∃ de Gentzen/Fitch exige abrir una caja con P(c) donde c es una constante fresca (no libre en las premisas ni en la conclusión final).',
        },
      ],
    },
  },
];

export const PEC5_GYM: GymExercise[] = [
  {
    id: 'gym_pec5_1',
    title: 'Deducción con Universal y Existencial',
    uocExamOrigin: 'PEC5 Lògica UOC',
    difficulty: 'examen UOC',
    category: 'cajas_anidadas',
    premises: ['∀x (P(x) → Q(x))', '∃x P(x)'],
    goal: '∃x Q(x)',
    strategyOverview: 'Abre caja con P(c) por E∃, instancia el universal en c para sacar P(c) → Q(c), deduce Q(c), generaliza a ∃x Q(x) y cierra la caja.',
    hints: ['Abre hipótesis P(c), aplica E∀ sobre la premisa 1 con c, obtén Q(c) y aplica I∃.'],
    solutionSteps: [
      { formula: 'P(c)', rule: 'Hipótesis (E∃)', referencedLines: [], isHypothesis: true, explanation: 'Suponer testigo c' },
      { formula: 'P(c) → Q(c)', rule: 'E∀', referencedLines: [1], explanation: 'Instanciar universal en c' },
      { formula: 'Q(c)', rule: 'E→', referencedLines: [4, 3], explanation: 'Modus Ponens en c' },
      { formula: '∃x Q(x)', rule: 'I∃', referencedLines: [5], explanation: 'Introducción del existencial' },
      { formula: '∃x Q(x)', rule: 'E∃', referencedLines: [2, 3, 6], closesHypothesis: true, explanation: 'Cierre de la caja de E∃' },
    ],
  },
];

export const PEC5_FREE: FreeExercise[] = Array.from({ length: 25 }, (_, i) => ({
  id: `pec5_free_${i + 1}`,
  number: i + 1,
  title: `Deducción en Predicados #${i + 1}`,
  category: 'Deducción Predicados',
  difficulty: i < 8 ? 'básico' : i < 18 ? 'intermedio' : 'examen',
  premises: [`∀x (P${i + 1}(x) → Q${i + 1}(x))`, `P${i + 1}(a)`],
  goal: `∃x Q${i + 1}(x)`,
  hints: ['Instancia en a, deduce con E→ y luego aplica I∃.'],
  solutionSteps: [
    { formula: `P${i + 1}(a) → Q${i + 1}(a)`, rule: 'E∀', referencedLines: [1], explanation: 'Instanciación' },
    { formula: `Q${i + 1}(a)`, rule: 'E→', referencedLines: [3, 2], explanation: 'Modus Ponens' },
    { formula: `∃x Q${i + 1}(x)`, rule: 'I∃', referencedLines: [4], explanation: 'Introducción existencial' },
  ],
}));

// ==========================================
// PEC6 DATA: Resolución y Semántica de Predicados
// ==========================================
export const PEC6_MODULES: Module[] = [
  {
    id: 'pec6_mod_1',
    title: 'Módulo 1: Skolemización y Resolución en 1er Orden',
    subtitle: 'Funciones de Skolem, Unificación (mgu) y Refutación',
    description: 'Mecanización total en lógica de primer orden para demostradores automáticos.',
    color: 'from-cyan-600 to-blue-800',
    accentColor: 'cyan',
    lessons: [
      {
        id: 'pec6_l1',
        moduleId: 'pec6_mod_1',
        title: 'Skolemización de Fórmulas',
        subtitle: 'Eliminando los existenciales con constantes y funciones',
        description: 'Si ∃x está dentro del alcance de ∀y, x depende de y: se sustituye por la función de Skolem f(y).',
        icon: 'sparkles',
        color: 'bg-cyan-600',
        owlIntroTip: 'En ∀y ∃x P(y, x), el valor de x depende de y, por lo que se sustituye x por f(y).',
        xpReward: 35,
        questions: [
          {
            id: 'pec6_q1',
            type: 'choose_rule',
            prompt: 'Para skolemizar ∃x P(x) (sin ningún universal previo), ¿por qué se sustituye x?',
            options: [
              { id: 'opt_1', text: 'Por una constante de Skolem c (ej: P(c))', isCorrect: true, explanation: '¡Correcto! Al no depender de ninguna variable universal, basta una constante fresca.' },
              { id: 'opt_2', text: 'Por una función f(y)', isCorrect: false, explanation: 'No hay ninguna variable y de la que dependa.' },
            ],
            hint: 'Si no hay ningún ∀ que lo preceda, no hay dependencia funcional.',
            explanation: 'Un cuantificador existencial no dominado por universales se skolemiza mediante una nueva constante.',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_pec6',
      title: 'Desafío Maestro: Resolución en Predicados PEC6 👑',
      description: 'Supera el test final de unificación mgu y modelos de Herbrand.',
      xpReward: 80,
      questions: [
        {
          id: 'boss_pec6_q1',
          type: 'choose_rule',
          prompt: 'Dadas P(x, f(y)) y P(a, z), ¿cuál es su unificador más general (mgu θ)?',
          options: [
            { id: 'opt_1', text: 'θ = { x / a, z / f(y) }', isCorrect: true, explanation: '¡Brillante! Sustituyendo x por a y z por f(y), ambas fórmulas quedan idénticas: P(a, f(y)).' },
            { id: 'opt_2', text: 'No son unificables', isCorrect: false, explanation: 'Sí son unificables porque los símbolos de función y constantes coinciden.' },
          ],
          hint: 'Empareja los argumentos correspondientes posición a posición.',
          explanation: 'El algoritmo de unificación de Robinson encuentra la sustitución mínima que hace idénticos dos literales.',
        },
      ],
    },
  },
];

export const PEC6_GYM: GymExercise[] = [
  {
    id: 'gym_pec6_1',
    title: 'Resolución de Primer Orden con Unificación',
    uocExamOrigin: 'PEC6 Lògica UOC',
    difficulty: 'avanzado',
    category: 'cajas_anidadas',
    premises: ['{P(x), Q(x)}', '{¬P(a)}', '{¬Q(a)}'],
    goal: '□',
    strategyOverview: 'Aplica el unificador θ = {x / a} sobre la primera cláusula para resolver con las demás hasta llegar a la cláusula vacía □.',
    hints: ['Res(C1, C2) con x=a da {Q(a)}. Luego Res con C3 da □.'],
    solutionSteps: [
      { formula: '{Q(a)}', rule: 'Res(1, 2) θ={x/a}', referencedLines: [1, 2], explanation: 'Resolvente con unificación mgu' },
      { formula: '□', rule: 'Res(3, 4)', referencedLines: [3, 4], explanation: 'Cláusula vacía en primer orden' },
    ],
  },
];

export const PEC6_FREE: FreeExercise[] = Array.from({ length: 25 }, (_, i) => ({
  id: `pec6_free_${i + 1}`,
  number: i + 1,
  title: `Resolución y Unificación en Predicados #${i + 1}`,
  category: 'Resolución Predicados',
  difficulty: i < 8 ? 'básico' : i < 18 ? 'intermedio' : 'examen',
  premises: [`{P${i + 1}(x), Q${i + 1}(x)}`, `{¬P${i + 1}(c)}`, `{¬Q${i + 1}(c)}`],
  goal: '□',
  hints: ['Unifica con x/c y deriva la cláusula vacía.'],
  solutionSteps: [
    { formula: `{Q${i + 1}(c)}`, rule: 'Res', referencedLines: [1, 2], explanation: 'Resolvente unificado' },
    { formula: '□', rule: 'Res', referencedLines: [3, 4], explanation: 'Cláusula vacía' },
  ],
}));

// ==========================================
// BOOL DATA: Lógica y Álgebra de Boole
// ==========================================
export const BOOL_MODULES: Module[] = [
  {
    id: 'bool_mod_1',
    title: 'Módulo 1: Álgebra de Boole y Circuitos Lógicos',
    subtitle: 'Postulados de Huntington, compuertas y simplificación',
    description: 'Aprende a simplificar expresiones booleanas usando identidades, De Morgan y mapas de Karnaugh.',
    color: 'from-teal-600 to-emerald-800',
    accentColor: 'teal',
    lessons: [
      {
        id: 'bool_l1',
        moduleId: 'bool_mod_1',
        title: 'Postulados e Identidades Booleanas',
        subtitle: 'Leyes de dominancia, absorción y De Morgan',
        description: 'A · (A + B) = A, A + A·B = A, A + ¯A = 1, A · ¯A = 0.',
        icon: 'cpu',
        color: 'bg-teal-600',
        owlIntroTip: 'En álgebra de Boole: el operador AND es · y el OR es +. La ley de absorción simplifica A + A·B en A directamente.',
        xpReward: 30,
        questions: [
          {
            id: 'bool_q1',
            type: 'choose_rule',
            prompt: '¿A qué equivale la expresión booleana A + A · B según la ley de absorción?',
            options: [
              { id: 'opt_1', text: 'A', isCorrect: true, explanation: '¡Correcto! A + A·B = A·(1 + B) = A·1 = A. El término A absorbe a A·B.' },
              { id: 'opt_2', text: 'A + B', isCorrect: false, explanation: 'Incorrecto: el término B queda completamente absorbido.' },
              { id: 'opt_3', text: 'B', isCorrect: false, explanation: 'No, la expresión no depende de B.' },
            ],
            hint: 'Saca factor común A: A·(1 + B). Recuerda que 1 + cualquier cosa es 1.',
            explanation: 'La ley de absorción booleana establece que A + A·B = A y dualmente A·(A + B) = A.',
          },
          {
            id: 'bool_q2',
            type: 'choose_conclusion',
            prompt: 'Según las leyes de De Morgan para álgebra booleana, ¿cuál es el complemento de (A · B)?',
            options: [
              { id: 'opt_1', text: '¯A + ¯B', isCorrect: true, explanation: '¡Exacto! El complemento de un producto es la suma de los complementos.' },
              { id: 'opt_2', text: '¯A · ¯B', isCorrect: false, explanation: 'Ese sería el complemento de A + B, no de A · B.' },
            ],
            hint: 'Invierte la operación (· pasa a +) y niega cada variable.',
            explanation: 'Leyes de De Morgan: ¯(A · B) = ¯A + ¯B, y dualmente ¯(A + B) = ¯A · ¯B.',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_bool',
      title: 'Desafío Maestro: Álgebra de Boole MOD3 👑',
      description: 'Supera la simplificación de funciones lógicas para diseño de circuitos.',
      xpReward: 70,
      questions: [
        {
          id: 'boss_bool_q1',
          type: 'choose_rule',
          prompt: 'Al simplificar F = A·B + A·¯B, obtenemos:',
          options: [
            { id: 'opt_1', text: 'A (porque B + ¯B = 1 y A · 1 = A)', isCorrect: true, explanation: '¡Perfecto! Factorizamos A(B + ¯B) = A(1) = A.' },
            { id: 'opt_2', text: 'B', isCorrect: false, explanation: 'La variable B se cancela al sumarse su complemento.' },
          ],
          hint: 'Factoriza A y aplica la ley del complemento B + ¯B = 1.',
          explanation: 'La adyacencia lógica permite eliminar la variable que cambia de estado: A·B + A·¯B = A·(B + ¯B) = A·1 = A.',
        },
      ],
    },
  },
];

export const BOOL_GYM: GymExercise[] = [
  {
    id: 'gym_bool_1',
    title: 'Simplificación de Función Booleana de Examen',
    uocExamOrigin: 'Módulo 3 Álgebra Booleana UOC',
    difficulty: 'fácil',
    category: 'implicación',
    premises: ['F = A·B + A·¯B + ¯A·B'],
    goal: 'A + B',
    strategyOverview: 'Aplica adyacencia lógica y distributividad para reducir los términos canónicos.',
    hints: ['Agrupa A·B + A·¯B = A, y A·B + ¯A·B = B.'],
    solutionSteps: [
      { formula: 'A·(B + ¯B) + ¯A·B', rule: 'Factorización', referencedLines: [1], explanation: 'Agrupamos los dos primeros términos' },
      { formula: 'A + ¯A·B', rule: 'Complemento', referencedLines: [2], explanation: 'Como B + ¯B = 1, A·1 = A' },
      { formula: 'A + B', rule: 'Absorción', referencedLines: [3], explanation: 'Identidad A + ¯A·B = A + B' },
    ],
  },
];

export const BOOL_FREE: FreeExercise[] = Array.from({ length: 25 }, (_, i) => ({
  id: `bool_free_${i + 1}`,
  number: i + 1,
  title: `Simplificación Booleana #${i + 1}`,
  category: 'Álgebra de Boole',
  difficulty: i < 8 ? 'básico' : i < 18 ? 'intermedio' : 'examen',
  premises: [`F = A·B${i + 1} + A·¯B${i + 1}`],
  goal: 'A',
  hints: ['Aplica B + ¯B = 1 y simplifica.'],
  solutionSteps: [
    { formula: `A·(B${i + 1} + ¯B${i + 1})`, rule: 'Factor común', referencedLines: [1], explanation: 'Factorizar A' },
    { formula: 'A', rule: 'Identidad', referencedLines: [2], explanation: 'A · 1 = A' },
  ],
}));

// ==========================================
// SETS DATA: Teoría de Conjuntos y Relaciones
// ==========================================
export const SETS_MODULES: Module[] = [
  {
    id: 'sets_mod_1',
    title: 'Módulo 1: Operaciones con Conjuntos',
    subtitle: 'Unión, Intersección, Complemento y Relaciones',
    description: 'Comprende el álgebra de conjuntos y su paralelismo con la lógica proposicional.',
    color: 'from-indigo-600 to-purple-800',
    accentColor: 'indigo',
    lessons: [
      {
        id: 'sets_l1',
        moduleId: 'sets_mod_1',
        title: 'Operaciones Fundamentales',
        subtitle: 'Unión (∪) e Intersección (∩)',
        description: 'x ∈ (A ∪ B) ↔ (x ∈ A ∨ x ∈ B), x ∈ (A ∩ B) ↔ (x ∈ A ∧ x ∈ B).',
        icon: 'layers',
        color: 'bg-indigo-600',
        owlIntroTip: 'Existe un isomorfismo total entre lógica y conjuntos: la unión ∪ equivale a ∨, y la intersección ∩ equivale a ∧.',
        xpReward: 30,
        questions: [
          {
            id: 'sets_q1',
            type: 'choose_rule',
            prompt: 'Si x ∈ (A \\ B) (diferencia de conjuntos), ¿qué significa formalmente?',
            options: [
              { id: 'opt_1', text: 'x ∈ A y x ∉ B', isCorrect: true, explanation: '¡Exacto! La diferencia contiene los elementos que pertenecen a A pero NO pertenecen a B.' },
              { id: 'opt_2', text: 'x ∈ A o x ∈ B', isCorrect: false, explanation: 'Eso sería la unión A ∪ B.' },
            ],
            hint: 'Diferencia es "estar en el primero Y NO en el segundo".',
            explanation: 'La diferencia de conjuntos se define como A \\ B = { x | x ∈ A ∧ x ∉ B } = A ∩ ¯B.',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_sets',
      title: 'Desafío Maestro: Teoría de Conjuntos MOD4 👑',
      description: 'Supera la prueba de identidades conjuntistas y relaciones binarias.',
      xpReward: 70,
      questions: [
        {
          id: 'boss_sets_q1',
          type: 'choose_rule',
          prompt: 'La ley de De Morgan para conjuntos establece que el complemento de (A ∪ B) es:',
          options: [
            { id: 'opt_1', text: '¯A ∩ ¯B', isCorrect: true, explanation: '¡Brillante! El complemento de la unión es la intersección de los complementos.' },
            { id: 'opt_2', text: '¯A ∪ ¯B', isCorrect: false, explanation: 'No, la unión se convierte en intersección.' },
          ],
          hint: 'Igual que en lógica: ¬(p ∨ q) ≡ ¬p ∧ ¬q.',
          explanation: 'Leyes de De Morgan en teoría de conjuntos: ¯(A ∪ B) = ¯A ∩ ¯B y ¯(A ∩ B) = ¯A ∪ ¯B.',
        },
      ],
    },
  },
];

export const SETS_GYM: GymExercise[] = [
  {
    id: 'gym_sets_1',
    title: 'Demostración de Identidad Conjuntista',
    uocExamOrigin: 'Módulo 4 Teoría de Conjuntos UOC',
    difficulty: 'medio',
    category: 'conjunción',
    premises: ['A ⊆ B', 'B ⊆ C'],
    goal: 'A ⊆ C',
    strategyOverview: 'Demuestra la transitividad de la inclusión de conjuntos mediante implicaciones lógicas sobre un elemento genérico x.',
    hints: ['Toma un elemento arbitrario x ∈ A. Por A ⊆ B, x ∈ B. Por B ⊆ C, x ∈ C. Luego A ⊆ C.'],
    solutionSteps: [
      { formula: 'Sea x ∈ A', rule: 'Hipótesis', referencedLines: [], isHypothesis: true, explanation: 'Tomamos un elemento arbitrario de A' },
      { formula: 'x ∈ B', rule: 'Def Inclusión (1)', referencedLines: [1, 2], explanation: 'Como A ⊆ B y x ∈ A, se deduce x ∈ B' },
      { formula: 'x ∈ C', rule: 'Def Inclusión (2)', referencedLines: [3], explanation: 'Como B ⊆ C y x ∈ B, se deduce x ∈ C' },
      { formula: 'A ⊆ C', rule: 'Cierre Inclusión', referencedLines: [2, 4], closesHypothesis: true, explanation: 'Para todo x (x ∈ A → x ∈ C), por lo tanto A ⊆ C' },
    ],
  },
];

export const SETS_FREE: FreeExercise[] = Array.from({ length: 25 }, (_, i) => ({
  id: `sets_free_${i + 1}`,
  number: i + 1,
  title: `Inclusión y Operaciones Conjuntistas #${i + 1}`,
  category: 'Teoría de Conjuntos',
  difficulty: i < 8 ? 'básico' : i < 18 ? 'intermedio' : 'examen',
  premises: [`A${i + 1} ⊆ B${i + 1}`, `x ∈ A${i + 1}`],
  goal: `x ∈ B${i + 1}`,
  hints: ['Aplica la definición de inclusión: si x ∈ A y A ⊆ B entonces x ∈ B.'],
  solutionSteps: [
    { formula: `x ∈ B${i + 1}`, rule: 'Inclusión', referencedLines: [1, 2], explanation: 'Elemento perteneciente al superconjunto' },
  ],
}));

// ==========================================
// REGISTRY ACCESSORS BY TOPIC
// ==========================================
export function getCurriculumByTopic(topicId: TopicId): Module[] {
  switch (topicId) {
    case 'pec1':
      return PEC1_MODULES;
    case 'pec2':
      return PEC2_MODULES;
    case 'pec3':
      return PEC3_MODULES;
    case 'pec4':
      return PEC4_MODULES;
    case 'pec5':
      return PEC5_MODULES;
    case 'pec6':
      return PEC6_MODULES;
    case 'bool':
      return BOOL_MODULES;
    case 'sets':
      return SETS_MODULES;
    default:
      return PEC2_MODULES;
  }
}

export function getGymExercisesByTopic(topicId: TopicId): GymExercise[] {
  switch (topicId) {
    case 'pec1':
      return PEC1_GYM;
    case 'pec2':
      return PEC2_GYM;
    case 'pec3':
      return PEC3_GYM;
    case 'pec4':
      return PEC4_GYM;
    case 'pec5':
      return PEC5_GYM;
    case 'pec6':
      return PEC6_GYM;
    case 'bool':
      return BOOL_GYM;
    case 'sets':
      return SETS_GYM;
    default:
      return PEC2_GYM;
  }
}

export function getFreeExercisesByTopic(topicId: TopicId): FreeExercise[] {
  switch (topicId) {
    case 'pec1':
      return PEC1_FREE;
    case 'pec2':
      return PEC2_FREE;
    case 'pec3':
      return PEC3_FREE;
    case 'pec4':
      return PEC4_FREE;
    case 'pec5':
      return PEC5_FREE;
    case 'pec6':
      return PEC6_FREE;
    case 'bool':
      return BOOL_FREE;
    case 'sets':
      return SETS_FREE;
    default:
      return PEC2_FREE;
  }
}

export function getRulesByTopic(topicId: TopicId): LogicRule[] {
  // PEC2 and PEC5 use Gentzen rules
  return PEC2_RULES;
}

