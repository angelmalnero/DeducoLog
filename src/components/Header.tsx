import React from 'react';
import {
  Flame,
  Heart,
  Zap,
  Volume2,
  VolumeX,
  Map,
  Dumbbell,
  Timer,
  BookOpen,
  Pencil,
  Trophy,
  Moon,
  Sun,
  Table,
  Cpu,
} from 'lucide-react';
import { UserStats } from '../types/logic';
import { sound } from '../utils/audio';

export type NavTab =
  | 'path'
  | 'gym'
  | 'free'
  | 'tables'
  | 'resolution'
  | 'drill'
  | 'cheatsheet'
  | 'profile';

interface HeaderProps {
  stats: UserStats;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onToggleSound: () => void;
  onToggleDarkMode: () => void;
  onRechargeHearts: () => void;
  onOpenCheatSheetDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentTab,
  onSelectTab,
  onToggleSound,
  onToggleDarkMode,
  onRechargeHearts,
  onOpenCheatSheetDrawer,
}) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('path');
            }}
            className="text-left flex items-center gap-2 group transition-opacity hover:opacity-90 whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-2xs group-hover:scale-105 transition-transform">
              ⊢
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Deduco<span className="text-indigo-600 dark:text-indigo-400">Log</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-slate-400">
                UOC Lógica
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links for Desktop */}
          <nav className="hidden xl:flex items-center gap-4 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('path');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center cursor-pointer ${
                currentTab === 'path'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Ruta
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('gym');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'gym'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Gimnasio Fitch</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('free');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'free'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Modo Libre</span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-1.5 py-0.5 rounded-full font-bold">
                105
              </span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('tables');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'tables'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Tablas & Validez</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('resolution');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'resolution'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Resolución (□)</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('drill');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center cursor-pointer ${
                currentTab === 'drill'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Desafío 60s
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('profile');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center cursor-pointer ${
                currentTab === 'profile'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Medallas
            </button>
          </nav>

          {/* Zone 3: Gamification Stats & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Chuleta Button */}
            {onOpenCheatSheetDrawer && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenCheatSheetDrawer();
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all border border-indigo-200 dark:border-indigo-800 cursor-pointer shadow-2xs"
                title="Abrir Chuleta Lateral (UOC)"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Chuleta</span>
              </button>
            )}

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-xl"
              title={`Racha actual: ${stats.streakDays} días consecutivos`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold font-mono text-amber-900 dark:text-amber-200">
                {stats.streakDays}
              </span>
            </div>

            {/* XP Counter */}
            <div
              className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-xl"
              title={`Puntos de experiencia: ${stats.xp} XP`}
            >
              <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500" />
              <span className="text-xs sm:text-sm font-bold font-mono text-indigo-900 dark:text-indigo-200">
                {stats.xp}
              </span>
            </div>

            {/* Hearts Counter */}
            <button
              onClick={() => {
                if (stats.hearts < stats.maxHearts) {
                  sound.playLevelComplete();
                  onRechargeHearts();
                }
              }}
              className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-2.5 py-1 rounded-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Vidas restantes. Haz clic para recargar."
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-xs sm:text-sm font-bold font-mono text-rose-900 dark:text-rose-200">
                {stats.hearts}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                onToggleDarkMode();
              }}
              className="min-h-[40px] min-w-[40px] p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              title={stats.darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {stats.darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={onToggleSound}
              className="min-h-[40px] min-w-[40px] p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              title={stats.soundEnabled ? 'Silenciar sonidos' : 'Activar efectos de sonido'}
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 safe-area-pb shadow-lg">
        <div className="grid grid-cols-6 items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('path');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              currentTab === 'path'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Map className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] tracking-tight mt-1">Ruta</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('gym');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              currentTab === 'gym'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] tracking-tight mt-1">Gimnasio</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('free');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center text-center transition-colors relative cursor-pointer ${
              currentTab === 'free'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] tracking-tight mt-1">Libre</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('tables');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              currentTab === 'tables'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Table className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] tracking-tight mt-1">Tablas</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('resolution');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              currentTab === 'resolution'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] tracking-tight mt-1">Cláusulas</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              if (onOpenCheatSheetDrawer) onOpenCheatSheetDrawer();
              else onSelectTab('cheatsheet');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              currentTab === 'cheatsheet'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] tracking-tight mt-1">Chuleta</span>
          </button>
        </div>
      </nav>
    </>
  );
};
