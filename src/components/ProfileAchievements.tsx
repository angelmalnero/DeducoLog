import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Zap,
  Award,
  Crown,
  CheckCircle2,
  Lock,
  Moon,
  Sun,
  BookOpen,
  GraduationCap,
  Sparkles,
  Dumbbell,
  Timer,
  Layers,
  ArrowRight,
  Split,
  ShieldAlert,
  Gift,
  Compass,
} from 'lucide-react';
import { UserStats, Achievement } from '../types/logic';
import { computeAchievements } from '../data/achievements';
import { MascotOwl } from './MascotOwl';
import { sound } from '../utils/audio';

interface ProfileAchievementsProps {
  stats: UserStats;
  onToggleDarkMode: () => void;
  onRechargeHearts: () => void;
}

const getBadgeIcon = (iconName: string) => {
  switch (iconName) {
    case 'compass':
      return <Compass className="w-6 h-6" />;
    case 'layers':
      return <Layers className="w-6 h-6" />;
    case 'arrow-right':
      return <ArrowRight className="w-6 h-6" />;
    case 'split':
      return <Split className="w-6 h-6" />;
    case 'shield-alert':
      return <ShieldAlert className="w-6 h-6" />;
    case 'flame':
      return <Flame className="w-6 h-6" />;
    case 'zap':
      return <Zap className="w-6 h-6" />;
    case 'timer':
      return <Timer className="w-6 h-6" />;
    case 'award':
      return <Award className="w-6 h-6" />;
    case 'dumbbell':
      return <Dumbbell className="w-6 h-6" />;
    case 'book-open':
      return <BookOpen className="w-6 h-6" />;
    case 'gift':
      return <Gift className="w-6 h-6" />;
    case 'crown':
      return <Crown className="w-6 h-6" />;
    case 'graduation-cap':
      return <GraduationCap className="w-6 h-6" />;
    default:
      return <Trophy className="w-6 h-6" />;
  }
};

export const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({
  stats,
  onToggleDarkMode,
  onRechargeHearts,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const achievements = computeAchievements(stats);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const userLevel = Math.max(1, Math.floor(stats.xp / 100) + 1);

  const getRankTitle = (lvl: number) => {
    if (lvl >= 15) return 'Catedrático de la Lógica Formal';
    if (lvl >= 10) return 'Gran Maestro de Fitch';
    if (lvl >= 6) return 'Deductivista Avanzado UOC';
    if (lvl >= 3) return 'Iniciado en Reglas de Inferencia';
    return 'Estudiante Novato de Lógica';
  };

  const filteredAchievements = achievements.filter((a) => {
    if (selectedFilter === 'all') return true;
    return a.category === selectedFilter;
  });

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 pb-28 md:pb-12 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xs transition-colors flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <MascotOwl mood="graduate" className="w-24 h-24 sm:w-28 sm:h-28 shrink-0" />
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full mb-2 border border-emerald-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Nivel {userLevel} · {getRankTitle(userLevel)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Perfil y Vitrina de Medallas
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md">
              Desbloquea logros secundarios dominando conectivas, manteniendo tu racha y resolviendo pruebas formales.
            </p>
          </div>
        </div>

        {/* Quick Settings & Dark Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onToggleDarkMode();
            }}
            className="min-h-[44px] px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            {stats.darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>Modo Oscuro</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Performance Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            <span>Puntos de Experiencia</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {stats.xp} XP
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Racha de Días</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {stats.streakDays} días
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Medallas Desbloqueadas</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {unlockedCount} / {achievements.length}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span>Coronas de Módulo</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {stats.completedBossModuleIds.length} / 6
          </span>
        </div>
      </div>

      {/* Achievements Category Filters */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>Colección de Medallas</span>
        </h2>

        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'mastery', label: 'Maestría' },
            { id: 'progress', label: 'Progreso' },
            { id: 'streak', label: 'Rachas' },
            { id: 'speed', label: 'Velocidad' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedFilter(cat.id);
              }}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medals Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => {
          const progressPercent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                ach.isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-500/40 shadow-xs ring-1 ring-amber-400/20'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
              }`}
            >
              <div>
                {/* Badge Top Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                      ach.isUnlocked
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 shadow-amber-500/20'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {getBadgeIcon(ach.icon)}
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                      +{ach.xpReward} XP
                    </span>
                    {ach.isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Desbloqueada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 mt-0.5">
                        <Lock className="w-3 h-3" /> Bloqueada
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mb-1">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                  <span>Requisito: {ach.conditionDescription}</span>
                  <span>
                    {ach.progress}/{ach.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      ach.isUnlocked ? 'bg-amber-500' : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
