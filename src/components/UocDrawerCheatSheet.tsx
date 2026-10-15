import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  HelpCircle,
  Search,
  Filter,
  Check,
  Zap,
  Layers,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import { LOGIC_RULES } from '../data/rules';
import { UOC_NATURAL_PATTERNS, FNC_TRANSFORMATION_STEPS } from '../utils/truthTableEngine';
import { NotationStyle, RuleSetMode } from '../types/logic';
import { sound } from '../utils/audio';

interface UocDrawerCheatSheetProps {
  isOpen: boolean;
  onClose: () => void;
  notationStyle: NotationStyle;
  onToggleNotation: () => void;
  ruleSetMode: RuleSetMode;
  onToggleRuleSet: () => void;
}

type DrawerTab = 'basicas' | 'derivadas' | 'predicados' | 'giros_uoc' | 'formas_normales';

export const UocDrawerCheatSheet: React.FC<UocDrawerCheatSheetProps> = ({
  isOpen,
  onClose,
  notationStyle,
  onToggleNotation,
  ruleSetMode,
  onToggleRuleSet,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('basicas');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const basicRules = LOGIC_RULES.filter((r) => !r.isDerived && r.category !== 'quantifier');
  const derivedRules = LOGIC_RULES.filter((r) => r.isDerived);
  const quantifierRules = LOGIC_RULES.filter((r) => r.category === 'quantifier');

  const filteredRules = (
    activeTab === 'basicas'
      ? basicRules
      : activeTab === 'derivadas'
      ? derivedRules
      : activeTab === 'predicados'
      ? quantifierRules
      : []
  ).filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.uocSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.uocAcronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800 z-10 transition-colors">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Chuleta Oficial UOC
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-300 dark:border-indigo-800">
                  Lógica Inf.
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reglas, Giros de Examen y Equivalencias
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cerrar chuleta (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Configuration Controls (Toggles) */}
        <div className="p-3 sm:px-5 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Notation Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleNotation();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 font-medium text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-all cursor-pointer shadow-2xs"
          >
            <span className="text-[11px] text-slate-400">Notación:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {notationStyle === 'symbol' ? 'Símbolos (I→, E∧)' : 'Siglas UOC (II, EC, MP)'}
            </span>
          </button>

          {/* RuleSet Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleRuleSet();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 font-medium text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-all cursor-pointer shadow-2xs"
          >
            <span className="text-[11px] text-slate-400">Modo:</span>
            <span
              className={`font-bold ${
                ruleSetMode === 'strict'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {ruleSetMode === 'strict' ? 'Estricto (Solo Básicas)' : 'Completo (+ Derivadas)'}
            </span>
          </button>
        </div>

        {/* Nav Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto bg-white dark:bg-slate-900 px-3 pt-2 gap-1 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('basicas')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'basicas'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Básicas Gentzen
          </button>
          <button
            onClick={() => setActiveTab('derivadas')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'derivadas'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Derivadas (MT, SD...)
          </button>
          <button
            onClick={() => setActiveTab('predicados')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'predicados'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Predicados (∀, ∃)
          </button>
          <button
            onClick={() => setActiveTab('giros_uoc')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'giros_uoc'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Giros UOC ("solo si")
          </button>
          <button
            onClick={() => setActiveTab('formas_normales')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'formas_normales'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            FNC y Cláusulas
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Rules lists */}
          {['basicas', 'derivadas', 'predicados'].includes(activeTab) && (
            <>
              {/* Search bar inside drawer */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar regla (ej: Modus Ponens, I→, RAA...)"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {activeTab === 'derivadas' && ruleSetMode === 'strict' && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong>Modo Estricto Activo:</strong> En los primeros exámenes y PECs de la UOC
                    está prohibido usar estas reglas derivadas directamente; debes demostrarlas con
                    las reglas básicas. Activa el "Modo Completo" arriba si tu ejercicio lo permite.
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {filteredRules.map((rule) => {
                  const displayBadge =
                    notationStyle === 'symbol' ? rule.uocSymbol : rule.uocAcronym;
                  const isFabricar = rule.pedagogicRole === 'fabricar';

                  return (
                    <div
                      key={rule.id}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-800/50 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                              {displayBadge}
                            </span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                              {rule.name}
                            </h3>
                          </div>
                          {rule.latinName && (
                            <span className="text-[11px] font-medium text-slate-400 italic">
                              {rule.latinName}
                            </span>
                          )}
                        </div>

                        {/* Pedagogic Role Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                            isFabricar
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : rule.pedagogicRole === 'romper'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {isFabricar ? 'Fabricar 🛠️' : rule.pedagogicRole === 'romper' ? 'Romper 🔨' : 'Auxiliar'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2.5 leading-relaxed">
                        {rule.description}
                      </p>

                      {/* Formal Schema */}
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-[11px] text-slate-800 dark:text-slate-200 mb-2">
                        {rule.formalSchema.premises.map((p, idx) => (
                          <div key={idx} className="text-slate-500 dark:text-slate-400">
                            {p}
                          </div>
                        ))}
                        <div className="border-t border-slate-200 dark:border-slate-800 mt-1 pt-1 font-bold text-emerald-600 dark:text-emerald-400">
                          {rule.formalSchema.conclusion}
                        </div>
                      </div>

                      {/* Exam Tip */}
                      <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-2.5 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                        <div>
                          <strong>Tip Examen UOC:</strong> {rule.examTip}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Giros de Examen UOC (Lenguaje Natural) */}
          {activeTab === 'giros_uoc' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-2xl text-xs text-indigo-900 dark:text-indigo-200">
                <strong>Claves de Formalización UOC:</strong> En la PEC 1 y en el examen final, el 60%
                de los fallos se cometen al traducir expresiones como "solo si", "a menos que" o
                "condición necesaria". Aquí tienes la regla mnemotécnica exacta:
              </div>

              {UOC_NATURAL_PATTERNS.map((pat) => (
                <div
                  key={pat.id}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-800/50 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {pat.phrasePattern}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      {pat.formalSchema}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                    {pat.explanation}
                  </p>

                  <div className="text-[11px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 space-y-1 font-mono mb-2">
                    <div className="text-slate-500 dark:text-slate-400">
                      Lenguaje natural: <span className="text-slate-800 dark:text-slate-200">{pat.exampleNatural}</span>
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Formalización: {pat.exampleFormal}
                    </div>
                  </div>

                  <div className="text-[11px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-2.5 flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
                    <div>
                      <strong>¡Cuidado en el examen!</strong> {pat.examWarning}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formas Normales y Cláusulas */}
          {activeTab === 'formas_normales' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-2xl text-xs text-purple-900 dark:text-purple-200">
                <strong>Algoritmo de Paso a FNC (Resolución):</strong> Antes de aplicar el método de
                resolución, cualquier fórmula debe convertirse en una conjunción de cláusulas disyuntivas.
              </div>

              <div className="space-y-3">
                {FNC_TRANSFORMATION_STEPS.map((step) => (
                  <div
                    key={step.stepNum}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-800/50 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {step.stepNum}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {step.name}
                      </h4>
                    </div>

                    <div className="font-mono text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-xl mb-2 font-bold">
                      {step.ruleFormula}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Guía de Refutación */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-800/50">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  <span>Regla de Resolución y Refutación</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    □ / ⊥
                  </span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Para demostrar P1, ..., Pk ⊢ C, se niega la conclusión (¬C), se pasa
                  todo a cláusulas &#123;C1, ..., Cn, ¬C&#125; y se aplican resoluciones cancelando
                  literales complementarios (L y ¬L) hasta derivar la cláusula vacía □.
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-800 dark:text-slate-200">
                  <div>C1: &#123; p, q &#125;</div>
                  <div>C2: &#123; ¬p, r &#125;</div>
                  <div className="border-t border-slate-200 dark:border-slate-800 mt-1 pt-1 font-bold text-purple-600 dark:text-purple-400">
                    Res(C1, C2) = &#123; q, r &#125;
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500">
          <span>Pulsa <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold">Esc</kbd> para cerrar</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
