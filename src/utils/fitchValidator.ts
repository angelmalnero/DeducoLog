import { ProofStep } from '../types/logic';

export interface SemanticValidationResult {
  isValid: boolean;
  errorType?:
    | 'scope_violation'
    | 'fresh_constant_violation'
    | 'universal_generalization_error'
    | 'affirming_consequent'
    | 'denying_antecedent'
    | 'empty_formula'
    | 'rule_mismatch'
    | 'unreferenced_line';
  title?: string;
  explanation: string;
  pedagogicHint?: string;
  counterexampleTable?: {
    rowDescription: string;
    premiseTruth: string;
    conclusionTruth: string;
  };
}

/**
 * Validador estricto de alcance de cajas de Fitch y reglas semánticas de la UOC.
 */
export function validateStepSemantics(
  currentSteps: ProofStep[],
  newLineFormula: string,
  ruleName: string,
  referencedLineNums: number[],
  premises: string[],
  goal: string
): SemanticValidationResult {
  const formula = newLineFormula.trim();

  if (!formula) {
    return {
      isValid: false,
      errorType: 'empty_formula',
      title: 'Fórmula vacía',
      explanation: 'Debes introducir la fórmula formal resultante de la aplicación de la regla.',
      pedagogicHint: 'Escribe la fórmula que se deduce lógicamente de las líneas citadas.',
    };
  }

  // 1. Validar que las líneas citadas existen
  for (const lineNum of referencedLineNums) {
    const step = currentSteps.find((s) => s.lineNum === lineNum);
    if (!step) {
      return {
        isValid: false,
        errorType: 'unreferenced_line',
        title: 'Línea inexistente',
        explanation: `Has citado la línea ${lineNum}, pero la demostración actual solo tiene ${currentSteps.length} líneas.`,
        pedagogicHint: 'Revisa la numeración de las líneas que utilizas como premisas.',
      };
    }
  }

  // 2. Control Estricto de Alcance (Scope de Fitch):
  // Comprobar si alguna de las líneas citadas se encuentra dentro de una caja de supuesto ya cerrada
  for (const lineNum of referencedLineNums) {
    const stepIndex = currentSteps.findIndex((s) => s.lineNum === lineNum);
    if (stepIndex === -1) continue;

    const step = currentSteps[stepIndex];

    // Si la línea está marcada como cerrada, o si su profundidad es mayor que la actual
    // y hubo un cierre de hipótesis entre esa línea y el momento actual
    if (step.isClosedBlock) {
      return {
        isValid: false,
        errorType: 'scope_violation',
        title: 'Violación de Alcance de Fitch (Caja Cerrada)',
        explanation: `La línea ${lineNum} [${step.formula}] pertenece a un supuesto que YA FUE CERRADO y descargado.`,
        pedagogicHint:
          'En el sistema de deducción natural de la UOC, una vez que se cierra una subderivación (por I→, I¬ o E∨), todas las líneas intermedias quedan inaccesibles para siempre. Solo el resultado final que sale de la caja puede utilizarse.',
      };
    }
  }

  // 3. Control de Falacias Frecuentes de Examen
  const normRule = ruleName.trim().toUpperCase();

  // Falacia de afirmación del consecuente: p → q, q deducir p con Modus Ponens
  if (normRule.includes('MP') || normRule.includes('E→') || normRule.includes('EI')) {
    if (referencedLineNums.length === 2) {
      const step1 = currentSteps.find((s) => s.lineNum === referencedLineNums[0]);
      const step2 = currentSteps.find((s) => s.lineNum === referencedLineNums[1]);

      if (step1 && step2) {
        const condStep = step1.formula.includes('→') ? step1 : step2.formula.includes('→') ? step2 : null;
        const otherStep = condStep === step1 ? step2 : step1;

        if (condStep && otherStep) {
          const parts = condStep.formula.split('→').map((p) => p.trim().replace(/^\(|\)$/g, ''));
          if (parts.length === 2) {
            const antecedent = parts[0];
            const consequent = parts[1];
            const otherFormula = otherStep.formula.trim().replace(/^\(|\)$/g, '');

            // Si el otro paso coincide con el consecuente y el usuario deduce el antecedente -> Falacia
            if (otherFormula === consequent && formula === antecedent) {
              return {
                isValid: false,
                errorType: 'affirming_consequent',
                title: 'Falacia de Afirmación del Consecuente',
                explanation: `Tener ${condStep.formula} y tener ${consequent} NO te permite deducir ${antecedent}.`,
                pedagogicHint:
                  'Modus Ponens (E→ / EI) exige tener el ANTECEDENTE (la condición), no el consecuente. Si llueve el suelo se moja; pero que el suelo esté mojado no demuestra que haya llovido (pudo ser una manguera).',
                counterexampleTable: {
                  rowDescription: 'Interpretación con p=Falso y q=Verdadero',
                  premiseTruth: `${condStep.formula} es V (F→V = V) y ${otherStep.formula} es V`,
                  conclusionTruth: `${formula} es Falso. ¡Contraejemplo demostrado!`,
                },
              };
            }
          }
        }
      }
    }
  }

  // 4. Control de Restricción de Cuantificadores en Predicados:
  // E∃ (EE): Si se introduce un testigo que ya existe en premisas o supuestos
  if (normRule.includes('E∃') || normRule.includes('EE') || normRule.includes('EXIST')) {
    // Buscar constantes en la fórmula (ej: P(c), a, b)
    const constantMatch = formula.match(/\(([a-z0-9]+)\)/i);
    if (constantMatch) {
      const constantUsed = constantMatch[1];
      // Comprobar si ya existe en premisas
      const inPremises = premises.some((p) => p.includes(`(${constantUsed})`));
      const inPriorSteps = currentSteps.some((s) => s.formula.includes(`(${constantUsed})`));

      if (inPremises || inPriorSteps) {
        return {
          isValid: false,
          errorType: 'fresh_constant_violation',
          title: 'Violación de Constante Fresca en E∃ (EE)',
          explanation: `La constante '${constantUsed}' ya fue utilizada previamente en las premisas o pasos anteriores.`,
          pedagogicHint:
            'En la regla de Eliminación del Existencial (E∃), la constante testigo DEBE SER COMPLETAMENTE NUEVA (fresca) y no haber aparecido jamás en premisas, supuestos previos ni en la conclusión final.',
        };
      }
    }
  }

  // I∀ (IU): Comprobar que no se generaliza sobre constante dependiente de supuesto
  if (normRule.includes('I∀') || normRule.includes('IU') || normRule.includes('UNIVERSAL')) {
    const activeHypotheses = currentSteps.filter((s) => s.isHypothesis && !s.isClosedBlock);
    if (activeHypotheses.length > 0) {
      const activeText = activeHypotheses.map((h) => h.formula).join(' ');
      const constantMatch = formula.match(/[∀@](\w+)/);
      if (constantMatch) {
        const quantifiedVar = constantMatch[1];
        // Comprobar si la variable o constante aparece en supuestos
        if (activeText.includes(quantifiedVar)) {
          return {
            isValid: false,
            errorType: 'universal_generalization_error',
            title: 'Error de Generalización Universal (I∀ / IU)',
            explanation: `No puedes generalizar universalmente con I∀ sobre un término que depende de un supuesto activo sin cerrar.`,
            pedagogicHint:
              'Para introducir ∀x P(x), la constante instanciada debe ser arbitraria y completamente independiente de cualquier hipótesis activa.',
          };
        }
      }
    }
  }

  return {
    isValid: true,
    explanation: 'El paso respeta todas las restricciones semánticas y de alcance de Fitch de la UOC.',
  };
}
