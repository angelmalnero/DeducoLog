import { Module } from '../types/logic';

export const MODULES: Module[] = [
  // ==========================================
  // MÓDULO 1: LA CONJUNCIÓN (∧) Y FUNDAMENTOS
  // ==========================================
  {
    id: 'module_1',
    title: 'Módulo 1: Fundamentos y la Conjunción (∧)',
    subtitle: 'El abecé de la deducción: premisas, conclusiones y el conector "Y"',
    description: 'Aprende qué es una deducción formal tipo Fitch y domina las reglas I∧ y E∧.',
    color: 'from-emerald-500 to-teal-600',
    accentColor: 'emerald',
    lessons: [
      {
        id: 'm1_l1',
        moduleId: 'module_1',
        title: '¿Qué es la Deducción Natural?',
        subtitle: 'Premisas, justificaciones y la meta final',
        description: 'Entiende cómo funciona una demostración paso a paso sin memorizar a lo loco.',
        icon: 'book',
        color: 'bg-emerald-500',
        owlIntroTip: '¡Hola! La deducción natural es como un juego de construcción: partes de unas piezas dadas (premisas) y usas reglas legales para fabricar la pieza objetivo (conclusión).',
        xpReward: 20,
        questions: [
          {
            id: 'm1_l1_q1',
            type: 'choose_rule',
            prompt: 'En un examen de la UOC te dan dos premisas y aplican una regla para llegar a la línea 3:',
            contextLines: [
              { lineNum: 1, formula: 'p', justification: 'Premisa' },
              { lineNum: 2, formula: 'q', justification: 'Premisa' },
              { lineNum: 3, formula: 'p ∧ q', justification: '¿?' },
            ],
            options: [
              { id: 'opt_1', text: 'I∧ (Introducción de la conjunción en 1, 2)', isCorrect: true, explanation: '¡Exacto! Como tenías "p" y "q" separados, los uniste con ∧ usando I∧.' },
              { id: 'opt_2', text: 'E∧ (Eliminación de la conjunción en 1)', isCorrect: false, explanation: 'No, la eliminación sirve para separar un ∧ existente, no para crearlo.' },
              { id: 'opt_3', text: 'E→ (Modus Ponens en 1, 2)', isCorrect: false, explanation: 'Ninguna de las líneas tiene una flecha de implicación (→).' },
            ],
            hint: 'Fíjate en lo que pasó: tenías dos fórmulas libres y fabricaste una nueva fórmula con el símbolo ∧.',
            explanation: 'La regla I∧ (Introducción de la Conjunción) te permite unir dos fórmulas que ya están demostradas en líneas anteriores mediante el operador ∧.',
          },
          {
            id: 'm1_l1_q2',
            type: 'choose_conclusion',
            prompt: 'Observa la línea 1. Si aplicas la regla de Eliminación de la Conjunción E∧₁, ¿qué fórmula legal obtienes?',
            contextLines: [
              { lineNum: 1, formula: '(p ∨ r) ∧ s', justification: 'Premisa' },
            ],
            options: [
              { id: 'opt_1', text: 'p ∨ r', isCorrect: true, explanation: '¡Correcto! El conector principal de la línea 1 es el ∧ del medio. Su parte izquierda es (p ∨ r).' },
              { id: 'opt_2', text: 'p', isCorrect: false, explanation: '¡Cuidado! No puedes sacar la p directamente porque está atrapada dentro del paréntesis (p ∨ r).' },
              { id: 'opt_3', text: 's', isCorrect: false, explanation: 'Esa sería la regla E∧₂ (la parte derecha), pero te pedían E∧₁ (la izquierda).' },
            ],
            hint: 'Identifica el conector principal. En "(p ∨ r) ∧ s", el conector principal es ∧. ¿Qué hay en su lado izquierdo?',
            explanation: 'En deducción natural siempre trabajas sobre el conectivo PRINCIPAL de la fórmula. En este caso el conectivo exterior es ∧, y su miembro izquierdo es (p ∨ r).',
          },
          {
            id: 'm1_l1_q3',
            type: 'spot_error',
            prompt: 'Un compañero de la UOC escribió este paso en su borrador. ¿Por qué el profesor le pondría 0 puntos?',
            contextLines: [
              { lineNum: 1, formula: 'p ∧ q', justification: 'Premisa' },
              { lineNum: 2, formula: 'p → r', justification: 'Premisa' },
              { lineNum: 3, formula: 'r', justification: 'E→ 1, 2  (ERROR)' },
            ],
            options: [
              { id: 'opt_1', text: 'Porque en la línea 1 no tiene "p" solo, sino "p ∧ q"', isCorrect: true, explanation: '¡Magistral! Para activar la línea 2 (p → r) necesitas "p" aislado. Primero debió hacer E∧ para extraer "p".' },
              { id: 'opt_2', text: 'Porque la regla E→ no existe en la UOC', isCorrect: false, explanation: 'Sí existe: es el Modus Ponens.' },
              { id: 'opt_3', text: 'Porque "r" es una variable inválida', isCorrect: false, explanation: 'Las letras proposicionales son totalmente válidas.' },
            ],
            hint: 'Para aplicar Modus Ponens (E→) a una implicación α → β, necesitas tener exactamente la fórmula α aislada en otra línea.',
            explanation: 'Las reglas no "saltan" dentro de fórmulas compuestas. Para usar p → r necesitas tener la llave "p". Como tienes "p ∧ q", primero debes extraer "p" en una línea intermedia usando E∧.',
          },
        ],
      },
      {
        id: 'm1_l2',
        moduleId: 'module_1',
        title: 'Desempaquetando y Ensamblando',
        subtitle: 'Dominio total de E∧₁, E∧₂ e I∧',
        description: 'Aprende a transformar (A ∧ B) en (B ∧ A) y manipular conjunciones anidadas.',
        icon: 'layers',
        color: 'bg-emerald-600',
        owlIntroTip: 'El conector ∧ es el más generoso de la lógica: de A ∧ B puedes sacar todo lo que tiene dentro, y de dos cosas sueltas puedes crear su unión.',
        xpReward: 25,
        questions: [
          {
            id: 'm1_l2_q1',
            type: 'order_steps',
            prompt: 'Ordena los pasos para demostrar la conmutatividad del ∧: Demuestra que de { p ∧ q } se deduce { q ∧ p }:',
            orderedItems: [
              { id: 'step_1', text: '1. p ∧ q  (Premisa)', correctOrder: 1, lineNum: 1 },
              { id: 'step_2', text: '2. q  (E∧₂ 1)', correctOrder: 2, lineNum: 2 },
              { id: 'step_3', text: '3. p  (E∧₁ 1)', correctOrder: 3, lineNum: 3 },
              { id: 'step_4', text: '4. q ∧ p  (I∧ 2, 3)', correctOrder: 4, lineNum: 4 },
            ],
            options: [
              { id: 'order_correct', text: '1 → Extraer q → Extraer p → Ensamblar q ∧ p con I∧', isCorrect: true },
              { id: 'order_wrong', text: '1 → Ensamblar q ∧ p directamente con I∧ sin extraer', isCorrect: false },
            ],
            hint: 'Primero extrae los componentes que necesitas en el orden deseado, y luego únelos con I∧.',
            explanation: 'Para construir "q ∧ p", necesitas tener en líneas separadas previas tanto a "q" como a "p". Las extraes de la premisa 1 y luego aplicas I∧.',
          },
          {
            id: 'm1_l2_q2',
            type: 'real_world_match',
            prompt: 'Traduce este razonamiento cotidiano a deducción natural: "Tengo mi carné de la UOC y tengo mi portátil. Por tanto, tengo mi portátil". ¿Qué regla es?',
            options: [
              { id: 'rw_1', text: 'Eliminación de la conjunción: de (C ∧ P) deducimos P (E∧₂)', isCorrect: true, explanation: '¡Exacto! El "y" unía dos verdades, y extrajiste una de ellas.' },
              { id: 'rw_2', text: 'Introducción de la implicación (I→)', isCorrect: false, explanation: 'No hay ninguna hipótesis ni condicional "si... entonces".' },
              { id: 'rw_3', text: 'Reducción al absurdo (RAA)', isCorrect: false, explanation: 'No hay ninguna contradicción.' },
            ],
            hint: 'Tienes dos cosas conectadas con "y", y te quedas con una.',
            explanation: 'La eliminación de la conjunción formaliza la certeza de que si dos cosas son simultáneamente ciertas, cualquiera de ellas por separado también lo es.',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_m1',
      title: 'Desafío Maestro: El Señor de la Conjunción 👑',
      description: 'Demuestra que dominas la estructura de líneas de Fitch y las reglas de ∧.',
      xpReward: 50,
      questions: [
        {
          id: 'boss_m1_q1',
          type: 'choose_conclusion',
          prompt: 'Dadas las premisas 1: (a ∧ b) ∧ c. Si aplicas primero E∧₁ en 1, y luego E∧₂ sobre el resultado, ¿qué letra obtienes?',
          contextLines: [
            { lineNum: 1, formula: '(a ∧ b) ∧ c', justification: 'Premisa' },
            { lineNum: 2, formula: 'a ∧ b', justification: 'E∧₁ 1' },
            { lineNum: 3, formula: '¿?', justification: 'E∧₂ 2' },
          ],
          options: [
            { id: 'b_opt_1', text: 'b', isCorrect: true, explanation: '¡Brillante! El miembro derecho de (a ∧ b) es "b".' },
            { id: 'b_opt_2', text: 'a', isCorrect: false, explanation: 'Ese sería E∧₁ 2.' },
            { id: 'b_opt_3', text: 'c', isCorrect: false, explanation: '"c" estaba en la línea 1 como miembro derecho, no en la línea 2.' },
          ],
          hint: 'En la línea 2 tienes "a ∧ b". Su lado derecho es b.',
          explanation: 'La línea 2 aisló "a ∧ b". Al aplicarle E∧₂ (extraer miembro derecho), obtienes limpiamente la fórmula "b".',
        },
        {
          id: 'boss_m1_q2',
          type: 'choose_rule',
          prompt: 'Queremos demostrar: { p, q, r } ⊢ (p ∧ q) ∧ r. ¿Cuál es la secuencia correcta de reglas?',
          options: [
            { id: 'seq_1', text: 'Aplicar I∧ a p y q para obtener (p ∧ q), y luego I∧ al resultado y r', isCorrect: true, explanation: '¡Perfecto! Construyes de menor a mayor.' },
            { id: 'seq_2', text: 'Aplicar E∧ directamente a las premisas', isCorrect: false, explanation: 'Las premisas están sueltas, no tienen ∧ para eliminar.' },
            { id: 'seq_3', text: 'Abrir una hipótesis temporal', isCorrect: false, explanation: 'No necesitas abrir ninguna caja porque ya tienes todas las piezas en tus premisas.' },
          ],
          hint: 'Cuando todas las piezas están en las premisas y quieres construir una fórmula más grande con ∧, solo necesitas encadenar introducciones (I∧).',
          explanation: 'Para metas que solo contienen ∧ y cuyas piezas ya son conocidas, basta con encadenar reglas I∧.',
        },
      ],
    },
  },

  // ==========================================
  // MÓDULO 2: LA IMPLICACIÓN (→) Y MODUS PONENS
  // ==========================================
  {
    id: 'module_2',
    title: 'Módulo 2: La Implicación (→) y Cajas de Fitch',
    subtitle: 'Modus Ponens, Teorema de Deducción y subderivaciones',
    description: 'Aprende a usar condicionales y descubre el misterio de abrir y cerrar cajas de hipótesis.',
    color: 'from-blue-500 to-indigo-600',
    accentColor: 'blue',
    lessons: [
      {
        id: 'm2_l1',
        moduleId: 'module_2',
        title: 'Modus Ponens (E→): El Motor Deductivo',
        subtitle: 'Si tienes la regla y tienes la llave, abres la puerta',
        description: 'La regla de eliminación del condicional explicada de forma cristalina.',
        icon: 'arrow-right',
        color: 'bg-blue-500',
        owlIntroTip: 'El Modus Ponens (E→) dice: Si "p → q" es verdad, y además "p" es verdad, ¡entonces "q" se cumple sin ninguna duda!',
        xpReward: 20,
        questions: [
          {
            id: 'm2_l1_q1',
            type: 'choose_rule',
            prompt: '¿Qué regla justifica el paso de la línea 3?',
            contextLines: [
              { lineNum: 1, formula: 'estudiar → aprobar', justification: 'Premisa' },
              { lineNum: 2, formula: 'estudiar', justification: 'Premisa' },
              { lineNum: 3, formula: 'aprobar', justification: '¿?' },
            ],
            options: [
              { id: 'mp_1', text: 'E→ 1, 2  (Modus Ponens / Eliminación de la implicación)', isCorrect: true, explanation: '¡Correcto! Tenías el condicional en 1 y su antecedente en 2.' },
              { id: 'mp_2', text: 'I→ 1, 2  (Introducción de la implicación)', isCorrect: false, explanation: 'I→ no se aplica sobre dos líneas así, se usa para cerrar una hipótesis.' },
              { id: 'mp_3', text: 'MT 1, 2  (Modus Tollens)', isCorrect: false, explanation: 'Modus Tollens requiere que el consecuente esté NEGADO (¬aprobar).' },
            ],
            hint: 'Fíjate: en la línea 1 hay una flecha (→), en la 2 está exactamente la parte de la izquierda de la flecha, y en la 3 sale la de la derecha.',
            explanation: 'La regla E→ (o Modus Ponens) elimina el condicional cuando aportas su antecedente (la condición requerida).',
          },
          {
            id: 'm2_l1_q2',
            type: 'spot_error',
            prompt: '¡Peligro de examen UOC! ¿Por qué este paso es una FALACIA y está totalmente PROHIBIDO?',
            contextLines: [
              { lineNum: 1, formula: 'p → q', justification: 'Premisa' },
              { lineNum: 2, formula: 'q', justification: 'Premisa' },
              { lineNum: 3, formula: 'p', justification: 'E→ 1, 2  (¿Válido?)' },
            ],
            options: [
              { id: 'fal_1', text: 'Falacia de afirmación del consecuente: tener "q" no garantiza "p"', isCorrect: true, explanation: '¡Excelente! "Si llueve el suelo se moja" + "el suelo está mojado" NO significa que llovió (pudo pasar un camión de riego).' },
              { id: 'fal_2', text: 'Porque falta aplicar doble negación', isCorrect: false, explanation: 'No tiene nada que ver con dobles negaciones.' },
              { id: 'fal_3', text: 'Porque la línea 2 debería tener ¬q', isCorrect: false, explanation: 'Eso sería para Modus Tollens, pero aquí querían deducir p ilegalmente.' },
            ],
            hint: 'La flecha solo va en una dirección (de izquierda a derecha). Tener el resultado no te dice cuál fue la causa.',
            explanation: 'En p → q, la condición necesaria para deducir q es tener p. Tener q no te permite retroceder a p en lógica clásica.',
          },
        ],
      },
      {
        id: 'm2_l2',
        moduleId: 'module_2',
        title: 'Cajas de Fitch e Introducción de la Flecha (I→)',
        subtitle: 'El Teorema de Deducción: Suponer temporalmente para ganar',
        description: 'Descubre por qué y cómo abrir subderivaciones y cuándo cerrarlas.',
        icon: 'box',
        color: 'bg-indigo-600',
        owlIntroTip: '¿Quieres demostrar que "Si pasa A, entonces pasa B" (A → B)? ¡Pues SUPÓN que A pasa! Mételo en una caja, calcula hasta llegar a B, y al salir de la caja habrás demostrado A → B.',
        xpReward: 30,
        questions: [
          {
            id: 'm2_l2_q1',
            type: 'hypothesis_strategy',
            prompt: 'Tu profesor de la UOC te pide demostrar la meta: (p ∧ q) → r. ¿Cuál es el PRIMER paso obligatorio?',
            options: [
              { id: 'hyp_1', text: 'Abrir una caja de subderivación con la hipótesis temporal: [ (p ∧ q) ]', isCorrect: true, explanation: '¡Exacto! Como la meta es un condicional α → β, siempre supones el antecedente α.' },
              { id: 'hyp_2', text: 'Suponer r', isCorrect: false, explanation: '¡Nunca supongas lo que quieres obtener al final sin una justificación de absurdo!' },
              { id: 'hyp_3', text: 'Aplicar E∧ a la meta', isCorrect: false, explanation: 'La meta es tu objetivo, no una premisa que puedas manipular directamente con reglas de eliminación.' },
            ],
            hint: 'Mnemotecnia de oro: Para demostrar A → B, abre una hipótesis con el lado izquierdo: A.',
            explanation: 'Para introducir una implicación (I→), el procedimiento estándar de Gentzen/Fitch es abrir una hipótesis con el antecedente de la fórmula meta.',
          },
          {
            id: 'm2_l2_q2',
            type: 'spot_error',
            prompt: 'Observa esta demostración de Fitch. ¿Qué GRAVE error cometió el estudiante en la línea 6?',
            contextLines: [
              { lineNum: 1, formula: 'p → q', justification: 'Premisa' },
              { lineNum: 2, formula: 'p', justification: 'Hipótesis (abre caja 1)', depth: 1 },
              { lineNum: 3, formula: 'q', justification: 'E→ 1, 2', depth: 1 },
              { lineNum: 4, formula: 'p → q', justification: 'I→ 2-3 (cierra caja 1)', depth: 0 },
              { lineNum: 5, formula: 'r → s', justification: 'Premisa', depth: 0 },
              { lineNum: 6, formula: 'q ∧ s', justification: 'I∧ 3, 5  (¿ERROR?)', depth: 0 },
            ],
            options: [
              { id: 'box_err_1', text: 'Usó la línea 3, pero la línea 3 está dentro de una caja que YA SE CERRÓ', isCorrect: true, explanation: '¡BRUTAL! Regla sagrada de Fitch: una vez cerrada una caja de hipótesis, todas las líneas de su interior quedan congeladas y no se pueden volver a citar.' },
              { id: 'box_err_2', text: 'La regla I∧ no se puede usar con la línea 5', isCorrect: false, explanation: 'La línea 5 está fuera de la caja y es totalmente accesible.' },
              { id: 'box_err_3', text: 'Falta un Modus Tollens', isCorrect: false, explanation: 'No hay ninguna negación.' },
            ],
            hint: 'Las líneas dentro de una subderivación (profundidad 1) solo son válidas mientras la caja está abierta. Al cerrarse con I→, la hipótesis "p" se descarga.',
            explanation: 'Regla de alcance de Fitch: Las fórmulas derivadas dentro de una subderivación solo existen bajo la vigencia de esa hipótesis. Una vez descargada en la línea 4, la línea 3 deja de ser una verdad global accesible.',
          },
        ],
      },
      {
        id: 'm2_l3',
        moduleId: 'module_2',
        title: 'Modus Tollens (MT) y Negando el Consecuente',
        subtitle: 'El reflejo inverso de la implicación',
        description: 'Si la consecuencia no ocurrió, la causa tampoco pudo ocurrir.',
        icon: 'repeat',
        color: 'bg-indigo-700',
        owlIntroTip: 'El Modus Tollens es el hermano detective del Modus Ponens: Si de A se deduce B, y la policía encuentra que B es falso (¬B), ¡concluyen que A tampoco fue!',
        xpReward: 20,
        questions: [
          {
            id: 'm2_l3_q1',
            type: 'choose_conclusion',
            prompt: 'Tienes las premisas 1: (p ∨ q) → r  y  2: ¬r. Al aplicar Modus Tollens (MT 1, 2), ¿qué obtienes?',
            contextLines: [
              { lineNum: 1, formula: '(p ∨ q) → r', justification: 'Premisa' },
              { lineNum: 2, formula: '¬r', justification: 'Premisa' },
              { lineNum: 3, formula: '¿?', justification: 'MT 1, 2' },
            ],
            options: [
              { id: 'mt_res_1', text: '¬(p ∨ q)', isCorrect: true, explanation: '¡Exacto! Niegas el bloque completo del antecedente.' },
              { id: 'mt_res_2', text: '¬p ∨ ¬q', isCorrect: false, explanation: 'Eso sería aplicar De Morgan adicionalmente, pero MT da directamente ¬(antecedente).' },
              { id: 'mt_res_3', text: 'r', isCorrect: false, explanation: 'Eso contradiría la premisa 2.' },
            ],
            hint: 'Modus Tollens toma α → β y ¬β para devolver ¬α.',
            explanation: 'Modus Tollens (MT) niega el antecedente en su totalidad: si α es (p ∨ q), el resultado de MT es ¬(p ∨ q).',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_m2',
      title: 'Desafío Maestro: El Señor de las Cajas 👑',
      description: 'Demuestra que comprendes el flujo de hipótesis y el Teorema de Deducción.',
      xpReward: 55,
      questions: [
        {
          id: 'boss_m2_q1',
          type: 'order_steps',
          prompt: 'Demuestra el Silogismo Hipotético: De { p → q, q → r } demuestra { p → r }. ¿Cuál es el orden lógico?',
          orderedItems: [
            { id: 'sh_1', text: '1. p → q (Premisa) y 2. q → r (Premisa)', correctOrder: 1, lineNum: 1 },
            { id: 'sh_2', text: '3. [Hipótesis]: p  (Abre subderivación)', correctOrder: 2, lineNum: 3 },
            { id: 'sh_3', text: '4. q  (E→ 1, 3)', correctOrder: 3, lineNum: 4 },
            { id: 'sh_4', text: '5. r  (E→ 2, 4)', correctOrder: 4, lineNum: 5 },
            { id: 'sh_5', text: '6. p → r  (I→ 3-5, cierra caja)', correctOrder: 5, lineNum: 6 },
          ],
          options: [
            { id: 'sh_opt_ok', text: 'Suponer p → Deducir q con 1 → Deducir r con 2 → Cerrar caja con p → r (I→)', isCorrect: true },
            { id: 'sh_opt_ko', text: 'Deducir directamente p → r sin abrir ninguna hipótesis temporal', isCorrect: false },
          ],
          hint: 'Como la meta es p → r, abres la hipótesis p, usas los dos condicionales como una cadena de dominó hasta r, y cierras con I→.',
          explanation: 'Esta es la demostración clásica de transitividad de la implicación. Requiere abrir una caja con la hipótesis del antecedente (p) y cerrarla al alcanzar el consecuente (r).',
        },
      ],
    },
  },

  // ==========================================
  // MÓDULO 3: LA DISYUNCIÓN (∨) Y PRUEBA POR CASOS
  // ==========================================
  {
    id: 'module_3',
    title: 'Módulo 3: La Disyunción (∨) y Casos',
    subtitle: 'El superpoder de I∨ y la prueba por casos de E∨',
    description: 'Pierde el miedo a la regla E∨ y aprende cuándo usar el Silogismo Disyuntivo.',
    color: 'from-amber-500 to-orange-600',
    accentColor: 'amber',
    lessons: [
      {
        id: 'm3_l1',
        moduleId: 'module_3',
        title: 'Introducción de la Disyunción (I∨)',
        subtitle: 'La regla más fácil y generosa de la lógica',
        description: 'Si tienes cualquier cosa demostrada, puedes añadirle "o lo que te dé la gana".',
        icon: 'split',
        color: 'bg-amber-500',
        owlIntroTip: 'Si en la vida real sabes que "hoy es lunes", es 100% verdad decir "hoy es lunes o me llamo Batman". En lógica, I∨ te permite añadir cualquier término a una fórmula ya existente.',
        xpReward: 20,
        questions: [
          {
            id: 'm3_l1_q1',
            type: 'choose_conclusion',
            prompt: 'En la línea 1 tienes: p. Si aplicas la regla de Introducción de la Disyunción I∨₂, ¿cuál de estas fórmulas puedes deducir?',
            contextLines: [
              { lineNum: 1, formula: 'p', justification: 'Premisa' },
              { lineNum: 2, formula: '¿?', justification: 'I∨₂ 1' },
            ],
            options: [
              { id: 'ior_1', text: 'q ∨ p', isCorrect: true, explanation: '¡Correcto! Con I∨₂ colocas la fórmula conocida (p) en el lado derecho de la disyunción.' },
              { id: 'ior_2', text: 'p ∧ q', isCorrect: false, explanation: 'Eso sería I∧, pero no tienes la "q" demostrada en ninguna parte.' },
              { id: 'ior_3', text: 'p → q', isCorrect: false, explanation: 'No puedes convertir una afirmación en una implicación de la nada.' },
            ],
            hint: 'I∨₂ añade una fórmula inventada a la izquierda y pone tu fórmula conocida a la DERECHA.',
            explanation: 'La regla I∨₂ toma una fórmula β y deduce (α ∨ β), donde α puede ser cualquier fórmula que convenga a tu demostración.',
          },
        ],
      },
      {
        id: 'm3_l2',
        moduleId: 'module_3',
        title: 'Eliminación de la Disyunción (E∨): Desmitificada',
        subtitle: 'La temida "Prueba por Casos" explicada con manzanas',
        description: 'Aprende la estructura de las dos cajas paralelas que todos temen en la UOC.',
        icon: 'git-branch',
        color: 'bg-amber-600',
        owlIntroTip: 'Imagina que sabes que "Llueve O Nieva" (A ∨ B). Si llueve, te pones abrigo (C). Si nieva, te pones abrigo (C). ¡En ambos casos te pones abrigo! Eso es E∨: dos cajas separadas que llegan al mismo resultado C.',
        xpReward: 30,
        questions: [
          {
            id: 'm3_l2_q1',
            type: 'hypothesis_strategy',
            prompt: 'Tienes la premisa 1: (p ∨ q) y quieres demostrar r. ¿Cuántas subderivaciones (cajas de hipótesis) necesitas abrir para aplicar E∨?',
            options: [
              { id: 'cases_1', text: 'Dos cajas independientes: una suponiendo [p] y llegando a r, y otra suponiendo [q] y llegando a r', isCorrect: true, explanation: '¡Bravo! Esa es la esencia de la prueba por casos: cubrir todas las alternativas de la disyunción.' },
              { id: 'cases_2', text: 'Una sola caja suponiendo [p ∧ q]', isCorrect: false, explanation: 'No, porque la premisa original no dice que ocurran ambas cosas a la vez.' },
              { id: 'cases_3', text: 'Ninguna caja, se hace con Modus Ponens directo', isCorrect: false, explanation: 'Una disyunción (∨) no es un condicional (→), no puedes aplicar Modus Ponens.' },
            ],
            hint: 'Una disyunción tiene dos caminos (izquierdo y derecho). Debes demostrar que por cualquiera de los dos llegas al mismo destino.',
            explanation: 'Para eliminar una disyunción α ∨ β y llegar a una meta γ, la regla de Gentzen E∨ exige abrir dos ramas: 1) Suponer α y deducir γ; 2) Suponer β y deducir γ. Ambas cajas deben cerrarse en γ.',
          },
          {
            id: 'm3_l2_q2',
            type: 'choose_rule',
            prompt: 'Tienes la premisa 1: (p ∨ q) y la premisa 2: ¬p. En la línea 3 escribes "q". ¿Qué regla de descarte usaste?',
            contextLines: [
              { lineNum: 1, formula: 'p ∨ q', justification: 'Premisa' },
              { lineNum: 2, formula: '¬p', justification: 'Premisa' },
              { lineNum: 3, formula: 'q', justification: '¿?' },
            ],
            options: [
              { id: 'sd_1', text: 'SD (Silogismo Disyuntivo / MTP)', isCorrect: true, explanation: '¡Exacto! "Es carne o pescado", "No es carne", luego obligatoriamente es pescado.' },
              { id: 'sd_2', text: 'E∧₁', isCorrect: false, explanation: 'El conector en 1 es ∨, no ∧.' },
              { id: 'sd_3', text: 'MT (Modus Tollens)', isCorrect: false, explanation: 'MT solo se aplica a condicionales (→), no a disyunciones.' },
            ],
            hint: 'Es la regla que descarta una de las opciones de un "o" porque está negada.',
            explanation: 'El Silogismo Disyuntivo (SD) te permite saltarte la prueba por casos cuando una de las dos alternativas ya ha sido negada explícitamente.',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_m3',
      title: 'Desafío Maestro: El Domador de Casos 👑',
      description: 'Supera el examen de la disyunción.',
      xpReward: 60,
      questions: [
        {
          id: 'boss_m3_q1',
          type: 'spot_error',
          prompt: '¿Por qué esta aplicación de E∨ suspendería al alumno en la UOC?',
          contextLines: [
            { lineNum: 1, formula: 'p ∨ q', justification: 'Premisa' },
            { lineNum: 2, formula: 'p', justification: 'Hipótesis Caso 1', depth: 1 },
            { lineNum: 3, formula: 'r', justification: 'Derivado en Caso 1', depth: 1 },
            { lineNum: 4, formula: 'q', justification: 'Hipótesis Caso 2', depth: 1 },
            { lineNum: 5, formula: 's', justification: 'Derivado en Caso 2', depth: 1 },
            { lineNum: 6, formula: 'r ∨ s', justification: 'E∨ 1, 2-3, 4-5  (ERROR)' },
          ],
          options: [
            { id: 'eor_err_1', text: 'Porque ambos casos deben llegar a la MISMA fórmula idéntica, no a fórmulas distintas (r y s)', isCorrect: true, explanation: '¡INSPECCIÓN PERFECTA! En E∨, la última línea de cada caja debe ser la misma fórmula común γ. Aquí un caso llegó a r y el otro a s sin unificarse antes.' },
            { id: 'eor_err_2', text: 'Porque p ∨ q no se puede descomponer', isCorrect: false, explanation: 'Sí se puede descomponer con E∨ si se llega a una meta común.' },
          ],
          hint: 'Ambas cajas deben desembocar en el mismo mar para que puedas afirmar ese resultado globalmente.',
          explanation: 'La regla E∨ exige que el consecuente de ambas ramas sea exactamente idéntico (γ). Para obtener r ∨ s, el alumno debió aplicar I∨ dentro de cada caja antes de cerrar.',
        },
      ],
    },
  },

  // ==========================================
  // MÓDULO 4: LA NEGACIÓN (¬) Y EL ABSURDO (⊥)
  // ==========================================
  {
    id: 'module_4',
    title: 'Módulo 4: Negación (¬) y Reducción al Absurdo',
    subtitle: 'El choque de la contradicción (⊥) y el clásico RAA',
    description: 'Aprende a destruir hipótesis falsas encontrando contradicciones.',
    color: 'from-rose-500 to-red-600',
    accentColor: 'rose',
    lessons: [
      {
        id: 'm4_l1',
        moduleId: 'module_4',
        title: 'El Absurdo (⊥) y la Eliminación de ¬',
        subtitle: 'Cuando una afirmación choca con su negación',
        description: 'La regla E¬ (Principio de no contradicción).',
        icon: 'alert-triangle',
        color: 'bg-rose-500',
        owlIntroTip: 'En lógica formal no puede ser de día y de noche al mismo tiempo en el mismo lugar. Si en tu prueba tienes "A" y en otra línea tienes "¬A", ¡tienes una bomba de contradicción! Eso se escribe con el símbolo de falsum (⊥).',
        xpReward: 20,
        questions: [
          {
            id: 'm4_l1_q1',
            type: 'choose_rule',
            prompt: 'En la línea 4 se deduce la contradicción ⊥. ¿Qué regla y líneas la justifican?',
            contextLines: [
              { lineNum: 1, formula: 'p → q', justification: 'Premisa' },
              { lineNum: 2, formula: 'q', justification: 'Derivado' },
              { lineNum: 3, formula: '¬q', justification: 'Premisa' },
              { lineNum: 4, formula: '⊥', justification: '¿?' },
            ],
            options: [
              { id: 'bot_1', text: 'E¬ 2, 3  (Eliminación de la negación / Principio de contradicción)', isCorrect: true, explanation: '¡Correcto! Enfrentas una fórmula positiva (q en 2) con su negación directa (¬q en 3).' },
              { id: 'bot_2', text: 'E→ 1, 2', isCorrect: false, explanation: 'E→ no genera ⊥, genera el consecuente.' },
              { id: 'bot_3', text: 'I¬ 2', isCorrect: false, explanation: 'I¬ requiere haber llegado ya al ⊥ para cerrar una caja.' },
            ],
            hint: 'Busca el choque directo entre algo que se afirma y se niega simultáneamente.',
            explanation: 'La regla E¬ toma una fórmula α y su negación ¬α para derivar el absurdo ⊥.',
          },
        ],
      },
      {
        id: 'm4_l2',
        moduleId: 'module_4',
        title: 'Reductio ad Absurdum (I¬ y RAA)',
        subtitle: 'Suponer lo contrario para demostrar la verdad',
        description: 'La estrategia más poderosa cuando ninguna otra regla parece encajar.',
        icon: 'shield-alert',
        color: 'bg-rose-600',
        owlIntroTip: 'El truco de la Reducción al Absurdo: Si quieres demostrar ¬P, abre una caja con [Hipótesis: P]. Provoca una contradicción (⊥). Al cerrar la caja, habrás demostrado ¬P con I¬. ¡Es infalible!',
        xpReward: 30,
        questions: [
          {
            id: 'm4_l2_q1',
            type: 'hypothesis_strategy',
            prompt: 'El enunciado de la UOC dice: "Demuestra ¬p a partir de { p → q, ¬q }". ¿Qué hipótesis abres en la subderivación?',
            options: [
              { id: 'hyp_neg_1', text: '[Hipótesis: p]  (Lo contrario de la meta ¬p)', isCorrect: true, explanation: '¡Perfecto! Supones lo contrario de lo que quieres probar para buscar el absurdo (⊥).' },
              { id: 'hyp_neg_2', text: '[Hipótesis: ¬q]', isCorrect: false, explanation: '¬q ya es una premisa dada, no tiene sentido suponerla dentro de una caja.' },
              { id: 'hyp_neg_3', text: '[Hipótesis: ⊥]', isCorrect: false, explanation: '¡Jamás supongas una contradicción de entrada!' },
            ],
            hint: 'Para demostrar una negación ¬X mediante I¬, siempre supones la versión positiva X.',
            explanation: 'Para aplicar Introducción de la Negación (I¬), se abre una subderivación con la fórmula X y se opera hasta derivar ⊥. Al cerrar la caja se concluye ¬X.',
          },
          {
            id: 'm4_l2_q2',
            type: 'choose_conclusion',
            prompt: 'En la línea 5 tienes: ¬¬(p ∨ q). Al aplicar Eliminación de la Doble Negación (E¬¬ 5), ¿qué te queda?',
            contextLines: [
              { lineNum: 5, formula: '¬¬(p ∨ q)', justification: 'Derivado' },
              { lineNum: 6, formula: '¿?', justification: 'E¬¬ 5' },
            ],
            options: [
              { id: 'dn_1', text: 'p ∨ q', isCorrect: true, explanation: '¡Exacto! Dos negaciones se cancelan mutuamente.' },
              { id: 'dn_2', text: '¬p ∧ ¬q', isCorrect: false, explanation: 'Eso no es eliminar la doble negación.' },
              { id: 'dn_3', text: 'p', isCorrect: false, explanation: 'No puedes eliminar el ∨ mágicamente sin una regla de eliminación.' },
            ],
            hint: 'Quita los dos signos ¬ iniciales y deja la fórmula interior intacta.',
            explanation: 'La regla E¬¬ de la lógica clásica elimina un par de negaciones consecutivas ¬¬α devolviendo α.',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_m4',
      title: 'Desafío Maestro: El Cazador del Absurdo 👑',
      description: 'Supera el reto de contradicciones y RAA.',
      xpReward: 65,
      questions: [
        {
          id: 'boss_m4_q1',
          type: 'order_steps',
          prompt: 'Ordena la demostración de { p → ¬p } ⊢ ¬p usando Reducción al Absurdo:',
          orderedItems: [
            { id: 'raa_1', text: '1. p → ¬p  (Premisa)', correctOrder: 1, lineNum: 1 },
            { id: 'raa_2', text: '2. [Hipótesis]: p  (Abre subderivación para I¬)', correctOrder: 2, lineNum: 2 },
            { id: 'raa_3', text: '3. ¬p  (E→ 1, 2)', correctOrder: 3, lineNum: 3 },
            { id: 'raa_4', text: '4. ⊥  (E¬ 2, 3)', correctOrder: 4, lineNum: 4 },
            { id: 'raa_5', text: '5. ¬p  (I¬ 2-4, cierra caja)', correctOrder: 5, lineNum: 5 },
          ],
          options: [
            { id: 'raa_ok', text: 'Premisa → Suponer p → Obtener ¬p → Obtener ⊥ → Concluir ¬p (I¬)', isCorrect: true },
            { id: 'raa_ko', text: 'Concluir directamente ¬p sin abrir hipótesis', isCorrect: false },
          ],
          hint: 'Supones p, aplicas Modus Ponens con la premisa 1 para obtener ¬p, chocas p con ¬p para sacar ⊥, y cierras la caja con I¬.',
          explanation: 'Esta es una de las preguntas favoritas de los profesores de lógica: demuestra cómo un condicional auto-negante p → ¬p fuerza que p sea necesariamente falso.',
        },
      ],
    },
  },

  // ==========================================
  // MÓDULO 5: ESTRATEGIAS DE EXAMEN UOC
  // ==========================================
  {
    id: 'module_5',
    title: 'Módulo 5: Estrategias de Examen UOC',
    subtitle: 'Razonamiento hacia atrás y los teoremas más preguntados',
    description: 'El método infalible para aprobar el examen de Lógica de la UOC.',
    color: 'from-purple-500 to-violet-600',
    accentColor: 'purple',
    lessons: [
      {
        id: 'm5_l1',
        moduleId: 'module_5',
        title: 'El Algoritmo Mental para Saber Qué Regla Usar',
        subtitle: 'El diagrama de flujo del estudiante sobresaliente',
        description: 'Aprende a analizar tu meta antes de tocar ninguna premisa.',
        icon: 'compass',
        color: 'bg-purple-500',
        owlIntroTip: 'El secreto número 1 de la UOC: ¡NO MIRES SOLO LAS PREMISAS! Mira primero la fórmula que te piden como META. Su conectivo principal te dice el 80% del camino.',
        xpReward: 30,
        questions: [
          {
            id: 'm5_l1_q1',
            type: 'choose_rule',
            prompt: 'Si tu meta final a demostrar es (p ∧ q) → (r ∨ s), ¿cuál es la mejor estrategia de apertura?',
            options: [
              { id: 'strat_1', text: 'Abrir una caja con hipótesis (p ∧ q) para terminar aplicando I→ al final', isCorrect: true, explanation: '¡Premio! El conectivo principal de la meta es →. Por tanto, la regla final será I→ y la hipótesis de inicio es el antecedente (p ∧ q).' },
              { id: 'strat_2', text: 'Empezar aplicando I∨ directamente', isCorrect: false, explanation: 'El conectivo principal no es ∨, está metido dentro del consecuente.' },
              { id: 'strat_3', text: 'Rendirse y dejar el examen en blanco', isCorrect: false, explanation: '¡Jamás! Con DeducoLog vas a por la matrícula de honor.' },
            ],
            hint: 'Mira el conectivo principal de toda la expresión. Hay un paréntesis a la izquierda, una flecha en medio y otro paréntesis a la derecha.',
            explanation: 'Regla de oro de la deducción natural: la regla con la que concluyes una demostración suele ser la regla de INTRODUCCIÓN del conectivo principal de la fórmula meta.',
          },
          {
            id: 'm5_l1_q2',
            type: 'choose_rule',
            prompt: 'Si tienes en una premisa una fórmula compuesta (A ∨ B), ¿qué técnica sueles necesitar para extraer sus datos?',
            options: [
              { id: 'strat_2_1', text: 'Eliminación de la disyunción (E∨) abriendo dos ramas paralelas', isCorrect: true, explanation: '¡Exacto! El ∨ es una bifurcación: para usarlo necesitas comprobar que ambas ramas llevan a la meta.' },
              { id: 'strat_2_2', text: 'Eliminación de la conjunción (E∧)', isCorrect: false, explanation: 'E∧ solo se aplica si el conector es ∧.' },
              { id: 'strat_2_3', text: 'Modus Ponens inmediato', isCorrect: false, explanation: 'Un ∨ no es un →.' },
            ],
            hint: 'Para desarmar una disyunción que ya tienes como premisa, usas su regla de eliminación.',
            explanation: 'Tener una disyunción en las premisas es la señal inequívoca de que muy probablemente tendrás que hacer una prueba por casos con E∨.',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_m5',
      title: 'El Gran Examen Final UOC 🎓',
      description: 'Supera el desafío integral y gradúate en Deducción Natural.',
      xpReward: 100,
      questions: [
        {
          id: 'boss_m5_q1',
          type: 'choose_rule',
          prompt: 'Tienes: 1. p → (q → r)  y  2. p ∧ q. Queremos deducir "r". ¿Cuál es el camino más directo?',
          options: [
            { id: 'final_1', text: 'Extraer p y q de la línea 2 con E∧, y luego aplicar Modus Ponens dos veces con la línea 1', isCorrect: true, explanation: '¡MAGNÍFICO! De p ∧ q sacas p. Con p y la línea 1 obtienes (q → r). Como también tienes q, con otro Modus Ponens obtienes r.' },
            { id: 'final_2', text: 'Hacer una prueba por casos de 4 ramas', isCorrect: false, explanation: 'No hay ninguna disyunción ∨, sería un esfuerzo innecesario.' },
            { id: 'final_3', text: 'Aplicar Modus Tollens a ciegas', isCorrect: false, explanation: 'No tenemos ninguna negación para activar MT.' },
          ],
          hint: 'Desempaqueta la premisa 2 para tener las dos llaves maestras ("p" y "q") que activarán en cadena los dos condicionales de la premisa 1.',
          explanation: '1. p ∧ q (Premisa) -> con E∧ sacas p y q. 2. p → (q → r) con p da q → r vía E→. 3. q → r con q da r vía E→. ¡Demostración limpia y perfecta!',
        },
      ],
    },
  },
  // ==========================================
  // MÓDULO 6: PRUEBA DE SÍNTESIS Y EXÁMENES HISTÓRICOS UOC
  // ==========================================
  {
    id: 'module_6',
    title: 'Módulo 6: El Gran Examen de Síntesis UOC',
    subtitle: 'Leyes de De Morgan, Cajas Anidadas y la Ley de Clavius',
    description: 'Enfrenta los problemas más desafiantes de los exámenes reales de la UOC.',
    color: 'from-amber-600 to-orange-700',
    accentColor: 'amber',
    lessons: [
      {
        id: 'm6_l1',
        moduleId: 'module_6',
        title: 'Cajas de Fitch Anidadas (Subderivaciones Múltiples)',
        subtitle: 'Cuando una caja vive dentro de otra caja',
        description: 'Aprende la técnica de abrir dos hipótesis sucesivas para demostrar A → (B → C).',
        icon: 'layers',
        color: 'bg-amber-600',
        owlIntroTip: 'Si tu meta tiene dos flechas anidadas como A → (B → C), ¡no te asustes! Abres una caja grande con A, y dentro abres otra caja pequeña con B. Al llegar a C, las vas cerrando de dentro hacia afuera.',
        xpReward: 35,
        questions: [
          {
            id: 'm6_l1_q1',
            type: 'hypothesis_strategy',
            prompt: 'En la UOC te piden demostrar: p → (q → r). ¿Cuál es la apertura correcta de subderivaciones?',
            options: [
              { id: 'nest_1', text: 'Abrir Caja 1 con [Hipótesis: p], y dentro abrir Caja 2 con [Hipótesis: q]', isCorrect: true, explanation: '¡Magistral! Cada hipótesis descarga una flecha en orden inverso al cerrarse.' },
              { id: 'nest_2', text: 'Abrir una sola caja con [Hipótesis: p ∧ q ∧ r]', isCorrect: false, explanation: 'No puedes suponer la conclusión r de entrada.' },
              { id: 'nest_3', text: 'Hacer una prueba por casos de disyunción', isCorrect: false, explanation: 'No hay ningún operador ∨ en la meta.' },
            ],
            hint: 'Fíjate en las dos flechas: la primera requiere suponer p; la segunda requiere suponer q.',
            explanation: 'Para demostrar una fórmula con implicaciones anidadas, se abren hipótesis sucesivas para cada antecedente.',
          },
        ],
      },
      {
        id: 'm6_l2',
        moduleId: 'module_6',
        title: 'La Ley de De Morgan en Deducción Natural',
        subtitle: 'Cómo convertir ¬(p ∧ q) en ¬p ∨ ¬q con rigor formal',
        description: 'La demostración que separa a los alumnos de notable de los de matrícula.',
        icon: 'split',
        color: 'bg-orange-600',
        owlIntroTip: 'En tablas de verdad De Morgan es fácil, pero en deducción natural requiere Reducción al Absurdo. Si tienes ¬(p ∧ q) y quieres ¬p, busca cómo fabricar (p ∧ q) para provocar el choque ⊥.',
        xpReward: 35,
        questions: [
          {
            id: 'm6_l2_q1',
            type: 'choose_rule',
            prompt: 'Tienes: 1. ¬(p ∧ q) y 2. p. En la línea 3 abres [Hipótesis: q]. ¿Qué regla aplicas a las líneas 2 y 3 para buscar la contradicción?',
            contextLines: [
              { lineNum: 1, formula: '¬(p ∧ q)', justification: 'Premisa' },
              { lineNum: 2, formula: 'p', justification: 'Premisa' },
              { lineNum: 3, formula: 'q', justification: 'Hipótesis', depth: 1 },
              { lineNum: 4, formula: 'p ∧ q', justification: '¿?' },
            ],
            options: [
              { id: 'dm_1', text: 'I∧ 2, 3 (Introducción de la conjunción para chocar con 1)', isCorrect: true, explanation: '¡Brillante! Fabriques (p ∧ q) para que choque de frente con ¬(p ∧ q) en el siguiente paso.' },
              { id: 'dm_2', text: 'E∧ 1', isCorrect: false, explanation: 'La línea 1 es una negación exterior ¬(p ∧ q), no una conjunción pura libre.' },
              { id: 'dm_3', text: 'MT 1, 2', isCorrect: false, explanation: 'No hay ninguna flecha de implicación.' },
            ],
            hint: 'Tienes p suelta y q suelta. Para provocar el absurdo con ¬(p ∧ q), necesitas armar (p ∧ q).',
            explanation: 'Al tener p y q en líneas activas, I∧ 2, 3 crea la fórmula (p ∧ q) que contradice inmediatamente a la premisa 1 ¬(p ∧ q).',
          },
        ],
      },
    ],
    masteryBoss: {
      id: 'boss_m6',
      title: 'El Gran Diploma de Honor UOC 🏆',
      description: 'Supera el examen final y conviértete en Maestro de la Deducción Natural.',
      xpReward: 120,
      questions: [
        {
          id: 'boss_m6_q1',
          type: 'choose_rule',
          prompt: 'La Ley de Clavius dice: { ¬p → p } ⊢ p. ¿Cuál es el núcleo del razonamiento?',
          options: [
            { id: 'clav_1', text: 'Suponer ¬p por RAA, obtener p por Modus Ponens con 1, generar ⊥ y concluir p', isCorrect: true, explanation: '¡PERFECTO! Si de la falsedad se deduce la verdad, entonces la proposición es indiscutiblemente verdadera.' },
            { id: 'clav_2', text: 'Aplicar directamente doble negación sin abrir ninguna caja', isCorrect: false, explanation: 'No tienes ¬¬p, tienes un condicional ¬p → p.' },
            { id: 'clav_3', text: 'No se puede demostrar en deducción natural', isCorrect: false, explanation: 'Es un teorema clásico de la lógica proposicional.' },
          ],
          hint: 'Como quieres demostrar p por contradicción, el primer paso infalible es abrir [Hipótesis: ¬p].',
          explanation: 'La Consecuentia Mirabilis (Ley de Clavius) se demuestra suponiendo ¬p, aplicando E→ para obtener p, provocando ⊥ vía E¬, y cerrando con RAA clásica para afirmar p.',
        },
      ],
    },
  },
];

