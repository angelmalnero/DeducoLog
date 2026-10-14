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
} from 'lucide-react';
import { UserStats } from '../types/logic';
import { sound } from '../utils/audio';

export type NavTab = 'path' | 'gym' | 'free' | 'drill' | 'cheatsheet' | 'profile';

interface HeaderProps {
  stats: UserStats;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onToggleSound: () => void;
  onToggleDarkMode: () => void;
  onRechargeHearts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentTab,
  onSelectTab,
  onToggleSound,
  onToggleDarkMode,
  onRechargeHearts,
}) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('path');
            }}
            className="text-left flex items-center gap-2 group transition-opacity hover:opacity-90 whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-2xs group-hover:scale-105 transition-transform">
              ⊢
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Deduco<span className="text-emerald-600 dark:text-emerald-400">Log</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-slate-400">
                UOC Lógica
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links for Desktop */}
          <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('path');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center ${
                currentTab === 'path'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
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
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center gap-1.5 ${
                currentTab === 'gym'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Gimnasio UOC</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                11
              </span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('free');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center gap-1.5 ${
                currentTab === 'free'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Modo Libre</span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                105
              </span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('drill');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center ${
                currentTab === 'drill'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Desafío 60s
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('cheatsheet');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center ${
                currentTab === 'cheatsheet'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Chuleta
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('profile');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 min-h-[44px] flex items-center gap-1 ${
                currentTab === 'profile'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Medallas</span>
            </button>
          </nav>

          {/* Zone 3: HUD Stats (Hearts, Streak, XP, DarkMode, Sound) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Hearts Button */}
            <button
              onClick={onRechargeHearts}
              title={
                stats.hearts < stats.maxHearts
                  ? 'Clic para recargar corazones con práctica'
                  : 'Vidas al máximo'
              }
              className="flex items-center gap-1 px-2 py-1.5 min-h-[40px] rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
            >
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-500 text-rose-500 ${
                  stats.hearts <= 1 ? 'animate-pulse' : ''
                }`}
              />
              <span className="font-mono text-xs font-bold tabular-nums">
                {stats.hearts}/{stats.maxHearts}
              </span>
            </button>

            {/* Streak */}
            <div
              title={`Racha de ${stats.streakDays} días`}
              className="flex items-center gap-1 px-2 py-1.5 min-h-[40px] rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500" />
              <span className="font-mono text-xs font-bold tabular-nums">
                {stats.streakDays}d
              </span>
            </div>

            {/* XP */}
            <div
              title="Puntos XP"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 min-h-[40px] rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
            >
              <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span className="font-mono text-xs font-bold tabular-nums">
                {stats.xp}
              </span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              aria-label={stats.darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="min-h-[40px] min-w-[40px] p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
            >
              {stats.darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              aria-label={stats.soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              className="min-h-[40px] min-w-[40px] p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="grid grid-cols-5 items-center h-16 pb-safe px-0.5">
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('path');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              currentTab === 'path'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
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
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
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
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] tracking-tight mt-1">Modo Libre</span>
            <span className="absolute top-1 right-3 sm:right-6 w-2 h-2 rounded-full bg-amber-500" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('profile');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              currentTab === 'profile'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] tracking-tight mt-1">Medallas</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('cheatsheet');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
              currentTab === 'cheatsheet'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
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
