import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Crown,
  Lock,
  Star,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight,
  Box,
  Split,
  AlertTriangle,
  Compass,
  Gift,
  RotateCcw,
  GraduationCap,
} from 'lucide-react';
import { Module, Lesson, UserStats } from '../types/logic';
import { TopicId, UOC_TOPICS } from '../data/topics';
import { TopicSelector } from './TopicSelector';
import { sound } from '../utils/audio';
import { MascotOwl } from './MascotOwl';

interface LearningPathProps {
  modules: Module[];
  stats: UserStats;
  selectedTopicId: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  onStartLesson: (lesson: Lesson) => void;
  onStartBoss: (module: Module) => void;
  onOpenGym: () => void;
  onOpenCheatSheet: () => void;
  onOpenChest: (chestId: string) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'book':
      return <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />;
    case 'layers':
      return <Layers className="w-5 h-5 sm:w-6 sm:h-6" />;
    case 'arrow-right':
      return <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />;
    case 'box':
      return <Box className="w-5 h-5 sm:w-6 sm:h-6" />;
    case 'split':
      return <Split className="w-5 h-5 sm:w-6 sm:h-6" />;
    case 'alert-triangle':
      return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />;
    case 'compass':
      return <Compass className="w-5 h-5 sm:w-6 sm:h-6" />;
    case 'crown':
      return <Crown className="w-5 h-5 sm:w-6 sm:h-6" />;
    default:
      return <Star className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
};

export const LearningPath: React.FC<LearningPathProps> = ({
  modules,
  stats,
  selectedTopicId,
  onSelectTopic,
  onStartLesson,
  onStartBoss,
  onOpenGym,
  onOpenCheatSheet,
  onOpenChest,
}) => {
  const isLessonCompleted = (id: string) => stats.completedLessonIds.includes(id);
  const isBossCompleted = (moduleId: string) => stats.completedBossModuleIds.includes(moduleId);
  const isChestOpened = (chestId: string) => stats.openedChests?.includes(chestId);
  const currentTopic = UOC_TOPICS.find((t) => t.id === selectedTopicId) || UOC_TOPICS[1];

  let previousCompleted = true; // First lesson is always unlocked

  const handleChestClick = (chestId: string) => {
    if (isChestOpened(chestId)) return;
    sound.playLevelComplete();
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    onOpenChest(chestId);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 pb-24 md:pb-12">
      {/* Topic Selector Dropdown directly above the intro hero banner */}
      <TopicSelector
        selectedTopicId={selectedTopicId}
        onSelectTopic={onSelectTopic}
      />

      {/* Hero Welcome Banner */}
      <div className={`bg-gradient-to-br ${currentTopic.color} to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-md mb-8 relative overflow-hidden border border-white/10`}>
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full mb-3 backdrop-blur-xs border border-emerald-500/30">
            <GraduationCap className="w-4 h-4" />
            <span>Guía Oficial UOC · {currentTopic.code} ({currentTopic.semesterInfo})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-balance leading-snug">
            {currentTopic.title}
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-6">
            {currentTopic.description} Domina cada concepto paso a paso con lecciones interactivas, pruebas de síntesis y desafíos con corona ⭐.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                // Find next incomplete lesson
                for (const m of modules) {
                  for (const l of m.lessons) {
                    if (!isLessonCompleted(l.id)) {
                      onStartLesson(l);
                      return;
                    }
                  }
                }
                onStartLesson(modules[0].lessons[0]);
              }}
              className="min-h-[44px] px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Continuar Ruta de Estudio</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onOpenGym();
              }}
              className="min-h-[44px] px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors border border-white/20"
            >
              Ir al Gimnasio Exámenes
            </button>
          </div>
        </div>

        {/* Mascot in Header */}
        <div className="hidden sm:block absolute -right-2 -bottom-2 z-10 pointer-events-none">
          <MascotOwl mood="waving" className="w-36 h-36" />
        </div>
      </div>

      {/* Modules Roadmap */}
      <div className="space-y-12">
        {modules.map((module, mIdx) => {
          const moduleLessonsCompleted = module.lessons.filter((l) => isLessonCompleted(l.id)).length;
          const isBossUnlocked = moduleLessonsCompleted === module.lessons.length;
          const bossDone = isBossCompleted(module.id);
          const chestId = `chest_${module.id}`;

          return (
            <div key={module.id} className="relative">
              {/* Module Header Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                    <span className="font-bold text-emerald-700">MÓDULO {mIdx + 1}</span>
                    <span>·</span>
                    <span>
                      {moduleLessonsCompleted} de {module.lessons.length + 1} metas logradas
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {module.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                    {module.description}
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Progreso</span>
                    <span className="text-base sm:text-lg font-bold font-mono text-emerald-600">
                      {Math.round(
                        ((moduleLessonsCompleted + (bossDone ? 1 : 0)) / (module.lessons.length + 1)) * 100
                      )}%
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-slate-100 p-1 flex items-center justify-center border border-slate-200">
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold font-mono"
                      style={{
                        background: `conic-gradient(#10b981 ${Math.round(
                          ((moduleLessonsCompleted + (bossDone ? 1 : 0)) / (module.lessons.length + 1)) * 100
                        )}%, #e2e8f0 0)`,
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700">
                        {bossDone ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        ) : (
                          `${moduleLessonsCompleted}/${module.lessons.length}`
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stepping Stones Winding Path */}
              <div className="flex flex-col items-center py-4 space-y-7 relative">
                {module.lessons.map((lesson, lIdx) => {
                  const completed = isLessonCompleted(lesson.id);
                  const isCurrent = !completed && previousCompleted;
                  const isLocked = !completed && !previousCompleted;

                  // Update previous for next lessons
                  previousCompleted = completed;

                  // Winding lateral offsets for the Duolingo zig-zag trail
                  const offsetClasses = [
                    'translate-x-0',
                    'translate-x-10 sm:translate-x-16',
                    '-translate-x-10 sm:-translate-x-16',
                    'translate-x-6 sm:translate-x-12',
                  ][lIdx % 4];

                  const starsCount = stats.lessonStars?.[lesson.id] ?? (completed ? 3 : 0);

                  return (
                    <div
                      key={lesson.id}
                      className={`relative flex flex-col items-center group transition-transform ${offsetClasses}`}
                    >
                      {/* Trail connecting line */}
                      {lIdx > 0 && (
                        <div className="absolute -top-7 w-1 h-7 bg-slate-200 -z-10 group-hover:bg-emerald-300 transition-colors" />
                      )}

                      {/* Lesson Node Button */}
                      <button
                        onClick={() => {
                          if (isLocked) {
                            sound.playError();
                            return;
                          }
                          sound.playClick();
                          onStartLesson(lesson);
                        }}
                        className={`min-w-[56px] min-h-[56px] w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex flex-col items-center justify-center transition-all duration-200 relative select-none cursor-pointer ${
                          completed
                            ? 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-100 hover:scale-105'
                            : isCurrent
                            ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-300 ring-offset-2 animate-pulse hover:scale-110'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                        }`}
                        title={completed ? 'Volver a jugar esta lección' : lesson.title}
                      >
                        {completed ? (
                          <Check className="w-8 h-8 stroke-[2.5]" />
                        ) : isLocked ? (
                          <Lock className="w-6 h-6" />
                        ) : (
                          getIcon(lesson.icon)
                        )}

                        {/* Stars Pill if completed */}
                        {completed && (
                          <div className="absolute -bottom-2 bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs text-[10px] font-bold">
                            <Star className="w-2.5 h-2.5 fill-amber-950" />
                            <span>{starsCount}</span>
                          </div>
                        )}
                      </button>

                      {/* Title & Status */}
                      <div className="mt-2 text-center max-w-[170px]">
                        <span className="text-xs font-bold text-slate-800 line-clamp-1 block">
                          {lesson.title}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {completed ? (
                            <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
                              <RotateCcw className="w-2.5 h-2.5" /> Reintentar
                            </span>
                          ) : isCurrent ? (
                            <strong className="text-emerald-600">¡Tu turno!</strong>
                          ) : (
                            'Bloqueado'
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Optional Mid-Module Surprise Chest 🎁 */}
                {mIdx > 0 && (
                  <div className="relative flex flex-col items-center py-1">
                    <button
                      onClick={() => handleChestClick(chestId)}
                      disabled={!isBossUnlocked && !isChestOpened(chestId)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isChestOpened(chestId)
                          ? 'bg-slate-100 text-slate-400 border border-slate-200'
                          : isBossUnlocked
                          ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 shadow-md ring-4 ring-amber-200 animate-bounce cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                      }`}
                      title={isChestOpened(chestId) ? 'Cofre ya abierto (+50 XP)' : '¡Cofre recompensa!'}
                    >
                      <Gift className="w-5 h-5" />
                    </button>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {isChestOpened(chestId) ? 'Reclamado' : 'Cofre Extra'}
                    </span>
                  </div>
                )}

                {/* Module Boss Level (Crown Node) */}
                <div className="relative flex flex-col items-center pt-2">
                  <div className="absolute -top-5 w-1 h-7 bg-slate-200 -z-10" />
                  <button
                    onClick={() => {
                      if (!isBossUnlocked) {
                        sound.playError();
                        return;
                      }
                      sound.playClick();
                      onStartBoss(module);
                    }}
                    disabled={!isBossUnlocked}
                    className={`min-w-[64px] min-h-[64px] w-20 h-20 sm:w-22 sm:h-22 rounded-3xl flex flex-col items-center justify-center transition-all duration-200 relative select-none cursor-pointer ${
                      bossDone
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 ring-4 ring-amber-100 hover:scale-105'
                        : isBossUnlocked
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-amber-950 shadow-lg shadow-amber-500/30 ring-4 ring-amber-200 animate-bounce hover:scale-110'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                    }`}
                  >
                    <Crown className="w-10 h-10 stroke-[2]" />
                    {bossDone && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </button>

                  <div className="mt-2 text-center max-w-[190px]">
                    <span className="text-xs font-bold text-amber-900 block">
                      {module.masteryBoss.title}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {bossDone ? (
                        <span className="text-amber-700 font-semibold flex items-center justify-center gap-1">
                          Corona Ganada 👑 · Repetir
                        </span>
                      ) : isBossUnlocked ? (
                        <strong className="text-amber-700">¡Desafío Listo!</strong>
                      ) : (
                        'Completa todas las lecciones'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Call to Action for UOC Gym */}
      <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Box className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              ¿Preparando la PAC o el Examen Final de la UOC?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-lg leading-relaxed">
              Practica con ejercicios sacados directamente de exámenes anteriores. Puedes hacerlos enteros, pedir pistas paso a paso y guardar tu progreso.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onOpenGym();
          }}
          className="min-h-[44px] px-6 py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 shadow-md cursor-pointer"
        >
          Entrar al Gimnasio UOC
        </button>
      </div>
    </div>
  );
};
