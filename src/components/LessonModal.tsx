import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, HelpCircle, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { Lesson, Question, UserStats } from '../types/logic';
import { sound } from '../utils/audio';
import { MascotOwl } from './MascotOwl';

interface LessonModalProps {
  lesson: Lesson;
  stats: UserStats;
  onClose: () => void;
  onCompleteLesson: (lessonId: string, xpEarned: number) => void;
  onLoseHeart: () => void;
  onRefillHearts: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  stats,
  onClose,
  onCompleteLesson,
  onLoseHeart,
  onRefillHearts,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<'unanswered' | 'correct' | 'wrong'>('unanswered');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQ: Question = lesson.questions[currentIdx];
  const progressPercent = Math.round((currentIdx / lesson.questions.length) * 100);

  const handleSelectOption = (optionId: string) => {
    if (answerState !== 'unanswered') return;
    sound.playClick();
    setSelectedOptionId(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId || answerState !== 'unanswered') return;

    const chosen = currentQ.options.find((o) => o.id === selectedOptionId);
    if (!chosen) return;

    if (chosen.isCorrect) {
      sound.playSuccess();
      setAnswerState('correct');
    } else {
      sound.playError();
      setAnswerState('wrong');
      onLoseHeart();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    setSelectedOptionId(null);
    setAnswerState('unanswered');
    setShowHint(false);

    if (currentIdx + 1 < lesson.questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Completed lesson!
      sound.playLevelComplete();
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCompleteLesson(lesson.id, lesson.xpReward);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
        
        {/* Top bar with progress and hearts */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 -ml-1 rounded-xl hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Cerrar lección"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Hearts Meter */}
          <div className="flex items-center gap-1.5 text-rose-500 font-bold font-mono text-sm min-h-[44px]">
            <Heart className={`w-4 h-4 fill-rose-500 ${stats.hearts <= 1 ? 'animate-pulse' : ''}`} />
            <span>{stats.hearts}</span>
          </div>
        </div>

        {/* Out of hearts warning screen */}
        {stats.hearts <= 0 && !isCompleted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center my-auto">
            <MascotOwl mood="worried" className="w-28 h-28 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">¡Te has quedado sin corazones!</h3>
            <p className="text-slate-600 max-w-md text-sm mb-6">
              La deducción natural requiere paciencia. Repasa las reglas de la Chuleta UOC o recarga tus vidas para seguir intentándolo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  sound.playSuccess();
                  onRefillHearts();
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
              >
                Recargar Vidas Gratis (+5 ❤️)
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
              >
                Volver a la ruta
              </button>
            </div>
          </div>
        ) : isCompleted ? (
          /* Victory Screen */
          <div className="p-8 text-center flex flex-col items-center justify-center my-auto animate-in zoom-in-95 duration-300">
            <MascotOwl mood="graduate" className="w-32 h-32 mb-4" />
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
              <Award className="w-4 h-4" /> ¡Lección Completada!
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{lesson.title}</h2>
            <p className="text-slate-600 max-w-md text-sm mb-6 leading-relaxed">
              ¡Has dominado estos pasos de deducción! Tu capacidad de deducción formal está subiendo de nivel.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full max-w-xs flex justify-around mb-8 text-center">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Puntos XP</span>
                <span className="text-xl font-bold font-mono text-emerald-600">+{lesson.xpReward}</span>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <span className="text-xs text-slate-500 font-medium block">Precisión</span>
                <span className="text-xl font-bold font-mono text-slate-800">100%</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
            >
              Continuar la Ruta
            </button>
          </div>
        ) : (
          /* Main Question View */
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 flex flex-col justify-between">
            <div>
              {/* Question Intro with Owl Mascot */}
              <div className="mb-6 flex items-start gap-4">
                <MascotOwl
                  mood={answerState === 'correct' ? 'happy' : answerState === 'wrong' ? 'worried' : 'thinking'}
                  className="w-16 h-16 shrink-0"
                />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    Pregunta {currentIdx + 1} de {lesson.questions.length}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 leading-snug">
                    {currentQ.prompt}
                  </h3>
                </div>
              </div>

              {/* Context Lines (Fitch Derivation Table) if applicable */}
              {currentQ.contextLines && currentQ.contextLines.length > 0 && (
                <div className="bg-slate-900 text-slate-100 rounded-xl p-4 mb-6 font-mono text-sm shadow-inner border border-slate-800">
                  <div className="text-xs text-slate-400 font-sans font-medium mb-2 border-b border-slate-800 pb-1 flex justify-between">
                    <span>Línea / Demostración Fitch</span>
                    <span>Justificación UOC</span>
                  </div>
                  <div className="space-y-1.5">
                    {currentQ.contextLines.map((line) => (
                      <div
                        key={line.lineNum}
                        className={`flex items-center justify-between py-1 px-2 rounded ${
                          line.depth && line.depth > 0
                            ? 'ml-4 border-l-2 border-amber-400 bg-slate-800/60'
                            : ''
                        } ${
                          line.justification.includes('¿?') || line.justification.includes('ERROR')
                            ? 'bg-amber-950/40 border border-amber-700/50'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 text-xs w-4 tabular-nums">
                            {line.lineNum}.
                          </span>
                          <span className="font-semibold text-emerald-300">
                            {line.formula}
                          </span>
                        </div>
                        <span className={`text-xs ${line.justification.includes('¿?') ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                          {line.justification}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ordered items display if order question */}
              {currentQ.type === 'order_steps' && currentQ.orderedItems && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Pasos a ordenar lógicamente:
                  </p>
                  {currentQ.orderedItems.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-mono text-slate-800 shadow-2xs">
                      {item.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Options selection */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optionStyles = 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 bg-white text-slate-800';

                  if (answerState === 'unanswered' && isSelected) {
                    optionStyles = 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20';
                  } else if (answerState === 'correct') {
                    if (opt.isCorrect) {
                      optionStyles = 'border-emerald-600 bg-emerald-100 text-emerald-950 font-semibold';
                    } else {
                      optionStyles = 'border-slate-200 opacity-50 bg-slate-50 text-slate-400';
                    }
                  } else if (answerState === 'wrong') {
                    if (isSelected) {
                      optionStyles = 'border-rose-500 bg-rose-50 text-rose-950';
                    } else if (opt.isCorrect) {
                      optionStyles = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold';
                    } else {
                      optionStyles = 'border-slate-200 opacity-40 bg-slate-50 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={answerState !== 'unanswered'}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm transition-all duration-150 flex items-start justify-between gap-3 ${optionStyles}`}
                    >
                      <span className="leading-relaxed">{opt.text}</span>
                      {answerState !== 'unanswered' && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {answerState === 'wrong' && isSelected && !opt.isCorrect && (
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hint button */}
              <div className="mt-4">
                {!showHint ? (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowHint(true);
                    }}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 text-amber-900 font-semibold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>¿Atascado? Pedir Pista a Logi</span>
                  </button>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5 animate-in fade-in duration-200">
                    <span className="font-bold text-amber-950 shrink-0">💡 Pista de Logi:</span>
                    <span>{currentQ.hint}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Feedback / Action Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {answerState === 'unanswered' ? (
                <div className="flex justify-end">
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!selectedOptionId}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                      selectedOptionId
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-md'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Comprobar Respuesta
                  </button>
                </div>
              ) : answerState === 'correct' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-emerald-950 text-sm">¡Excelente deducción!</h4>
                      <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shrink-0 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-950 text-sm">¡Cuidado con la regla!</h4>
                      <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shrink-0 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Entendido</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
