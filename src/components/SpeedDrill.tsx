import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, RotateCcw, Play, CheckCircle2, XCircle } from 'lucide-react';
import { sound } from '../utils/audio';
import { MascotOwl } from './MascotOwl';

interface SpeedDrillProps {
  highScore: number;
  onSaveHighScore: (score: number) => void;
  onAddXp: (xp: number) => void;
}

interface DrillQuestion {
  premises: string;
  conclusion: string;
  correctRule: string;
  options: string[];
}

const DRILL_QUESTIONS: DrillQuestion[] = [
  {
    premises: 'p → q,  p',
    conclusion: 'q',
    correctRule: 'E→ (MP)',
    options: ['E→ (MP)', 'I→', 'MT', 'E∧'],
  },
  {
    premises: 'p ∧ q',
    conclusion: 'p',
    correctRule: 'E∧₁',
    options: ['E∧₁', 'I∧', 'I∨₁', 'E∨'],
  },
  {
    premises: 'p ∧ q',
    conclusion: 'q',
    correctRule: 'E∧₂',
    options: ['E∧₂', 'E∧₁', 'I→', 'I∧'],
  },
  {
    premises: 'p,  q',
    conclusion: 'p ∧ q',
    correctRule: 'I∧',
    options: ['I∧', 'E∧', 'I∨', 'E→'],
  },
  {
    premises: 'p → q,  ¬q',
    conclusion: '¬p',
    correctRule: 'MT',
    options: ['MT', 'E→ (MP)', 'SD', 'E¬'],
  },
  {
    premises: 'p ∨ q,  ¬p',
    conclusion: 'q',
    correctRule: 'SD',
    options: ['SD', 'MT', 'E∨', 'I∨'],
  },
  {
    premises: 'p',
    conclusion: 'p ∨ q',
    correctRule: 'I∨₁',
    options: ['I∨₁', 'I∨₂', 'E∨', 'I∧'],
  },
  {
    premises: 'q',
    conclusion: 'p ∨ q',
    correctRule: 'I∨₂',
    options: ['I∨₂', 'I∨₁', 'E∧', 'I→'],
  },
  {
    premises: 'p,  ¬p',
    conclusion: '⊥',
    correctRule: 'E¬ (Contradicción)',
    options: ['E¬ (Contradicción)', 'I¬', 'RAA', 'E¬¬'],
  },
  {
    premises: '¬¬p',
    conclusion: 'p',
    correctRule: 'E¬¬ (DN)',
    options: ['E¬¬ (DN)', 'E¬', 'I¬', 'MT'],
  },
  {
    premises: '[Hipótesis: p] ... deriva q',
    conclusion: 'p → q',
    correctRule: 'I→',
    options: ['I→', 'E→', 'MT', 'I∧'],
  },
  {
    premises: '[Hipótesis: p] ... deriva ⊥',
    conclusion: '¬p',
    correctRule: 'I¬ (RAA)',
    options: ['I¬ (RAA)', 'E¬', 'E¬¬', 'MT'],
  },
];

export const SpeedDrill: React.FC<SpeedDrillProps> = ({
  highScore,
  onSaveHighScore,
  onAddXp,
}) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<DrillQuestion[]>(DRILL_QUESTIONS);

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      sound.playLevelComplete();
      setGameState('ended');
      if (score > highScore) {
        onSaveHighScore(score);
        confetti({ particleCount: 100, spread: 80 });
      }
      onAddXp(Math.max(10, Math.floor(score / 5)));
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, highScore, onSaveHighScore, onAddXp]);

  const startGame = () => {
    sound.playClick();
    // Shuffle questions
    const shuffled = [...DRILL_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQIdx(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(60);
    setGameState('playing');
  };

  const handleSelectOption = (option: string) => {
    if (gameState !== 'playing') return;

    const currentQ = shuffledQuestions[currentQIdx];
    if (option === currentQ.correctRule) {
      sound.playSuccess();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const multiplier = Math.min(4, 1 + Math.floor(newCombo / 3));
      setScore((prev) => prev + 10 * multiplier);
    } else {
      sound.playError();
      setCombo(0);
    }

    // Next question (cycle)
    setCurrentQIdx((prev) => (prev + 1) % shuffledQuestions.length);
  };

  const currentQ = shuffledQuestions[currentQIdx];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-2">
          <Zap className="w-3.5 h-3.5 fill-amber-500" />
          <span>Automatización de Reglas de Inferencia</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Desafío Relámpago (60 Segundos)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
          En el examen de la UOC no puedes dudar: entrena tu vista para reconocer la regla adecuada en milisegundos.
        </p>
      </div>

      {gameState === 'idle' ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
          <MascotOwl mood="waving" className="w-28 h-28 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">¿Listo para el sprint mental?</h2>
          <p className="text-slate-600 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Tienes 60 segundos para acertar tantas reglas como puedas. Los aciertos consecutivos activan multiplicadores de puntos (x2, x3, x4).
          </p>

          <div className="flex items-center justify-center gap-6 mb-8 text-center">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-w-[120px]">
              <span className="text-xs text-slate-500 font-medium block">Récord Actual</span>
              <span className="text-xl font-bold font-mono text-amber-600">{highScore} pts</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-w-[120px]">
              <span className="text-xs text-slate-500 font-medium block">Tiempo</span>
              <span className="text-xl font-bold font-mono text-slate-800">60 seg</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Comenzar Desafío</span>
          </button>
        </div>
      ) : gameState === 'playing' ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
          {/* Top HUD: Timer & Score */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
              <span className={`text-xl font-extrabold font-mono tabular-nums ${timeLeft <= 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                {timeLeft}s
              </span>
            </div>

            {/* Combo Multiplier */}
            {combo >= 2 && (
              <div className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold font-mono animate-bounce">
                🔥 COMBO x{Math.min(4, 1 + Math.floor(combo / 3))}
              </div>
            )}

            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium block">Puntos</span>
              <span className="text-xl font-extrabold font-mono text-emerald-600 tabular-nums">
                {score}
              </span>
            </div>
          </div>

          {/* Flashcard Question Prompt */}
          <div className="text-center py-6 bg-slate-900 text-white rounded-2xl mb-6 shadow-inner border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">
              ¿Qué regla justifica este paso?
            </span>
            <div className="text-slate-300 font-mono text-sm sm:text-base mb-1">
              Premisas: <span className="text-emerald-400 font-bold">{currentQ.premises}</span>
            </div>
            <div className="text-slate-100 font-mono text-lg sm:text-2xl font-bold mt-2">
              Deduces: <span className="text-amber-300 underline decoration-amber-500/50 underline-offset-4">{currentQ.conclusion}</span>
            </div>
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                className="p-4 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-500 border border-slate-200 text-slate-800 font-mono font-bold text-sm sm:text-base rounded-xl transition-all shadow-2xs hover:scale-[1.02] cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Game Ended View */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-md animate-in zoom-in-95 duration-200">
          <MascotOwl mood="graduate" className="w-24 h-24 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">¡Tiempo Agotado!</h2>
          <p className="text-slate-600 text-sm mb-6">
            Gran entrenamiento de reflejos lógicos. ¡Tu cerebro procesa inferencias cada vez más rápido!
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 font-medium block">Puntos</span>
              <span className="text-xl font-bold font-mono text-emerald-600">{score}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 font-medium block">Combo Máx.</span>
              <span className="text-xl font-bold font-mono text-amber-600">{maxCombo}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 font-medium block">Récord</span>
              <span className="text-xl font-bold font-mono text-slate-800">{Math.max(score, highScore)}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={startGame}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar Otra Vez</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
