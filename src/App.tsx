import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { LearningPath } from './components/LearningPath';
import { LessonModal } from './components/LessonModal';
import { UocGym } from './components/UocGym';
import { FreePracticeMode } from './components/FreePracticeMode';
import { ProfileAchievements } from './components/ProfileAchievements';
import { SpeedDrill } from './components/SpeedDrill';
import { CheatSheet } from './components/CheatSheet';
import { MODULES } from './data/curriculum';
import { ACHIEVEMENTS_DEFINITIONS } from './data/achievements';
import { TopicId, UOC_TOPICS } from './data/topics';
import {
  getCurriculumByTopic,
  getGymExercisesByTopic,
  getFreeExercisesByTopic,
} from './data/topicDataRegistry';
import { Lesson, Module, UserStats } from './types/logic';
import { sound } from './utils/audio';

const STORAGE_KEY = 'deducolog_uoc_progress_v3';
const STORAGE_TOPIC_KEY = 'deducolog_uoc_selected_topic_v1';

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hearts: 5,
  maxHearts: 5,
  completedLessonIds: [],
  lessonStars: {},
  completedBossModuleIds: [],
  soundEnabled: true,
  darkMode: false,
  highScoreSpeedDrill: 0,
  openedChests: [],
  unlockedAchievementIds: [],
  completedFreeExerciseIds: [],
};

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        if (parsed.lastActiveDate !== today) {
          parsed.lastActiveDate = today;
        }
        return { ...DEFAULT_STATS, ...parsed };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STATS;
  });

  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>(() => {
    try {
      const savedTopic = localStorage.getItem(STORAGE_TOPIC_KEY);
      if (savedTopic && UOC_TOPICS.some((t) => t.id === savedTopic)) {
        return savedTopic as TopicId;
      }
    } catch {}
    return 'pec2'; // Default to Deducción Natural
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('path');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Sync selected topic to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TOPIC_KEY, selectedTopicId);
    } catch {}
  }, [selectedTopicId]);

  // Sync dark mode class on HTML document root
  useEffect(() => {
    if (stats.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [stats.darkMode]);

  // Sync sound settings with audio controller
  useEffect(() => {
    sound.setEnabled(stats.soundEnabled);
  }, [stats.soundEnabled]);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }, [stats]);

  // Check achievements unlock
  useEffect(() => {
    ACHIEVEMENTS_DEFINITIONS.forEach((def) => {
      const currentProgress = def.getProgress(stats);
      if (
        currentProgress >= def.maxProgress &&
        !stats.unlockedAchievementIds?.includes(def.id)
      ) {
        // Unlock new achievement
        setStats((prev) => ({
          ...prev,
          xp: prev.xp + def.xpReward,
          unlockedAchievementIds: [...(prev.unlockedAchievementIds || []), def.id],
        }));
      }
    });
  }, [stats]);

  const handleToggleSound = () => {
    setStats((prev) => {
      const nextVal = !prev.soundEnabled;
      sound.setEnabled(nextVal);
      if (nextVal) sound.playClick();
      return { ...prev, soundEnabled: nextVal };
    });
  };

  const handleToggleDarkMode = () => {
    setStats((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  const handleCompleteLesson = (lessonId: string, xpEarned: number) => {
    setStats((prev) => {
      const isAlreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = isAlreadyCompleted
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];

      const currentStars = prev.lessonStars[lessonId] || 0;
      const newStars = Math.max(currentStars, 3);

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        completedLessonIds: newCompleted,
        lessonStars: {
          ...prev.lessonStars,
          [lessonId]: newStars,
        },
      };
    });
  };

  const handleLoseHeart = () => {
    setStats((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  };

  const handleRefillHearts = () => {
    setStats((prev) => ({
      ...prev,
      hearts: prev.maxHearts,
    }));
  };

  const handleOpenChest = (chestId: string) => {
    setStats((prev) => {
      if (prev.openedChests?.includes(chestId)) return prev;
      return {
        ...prev,
        xp: prev.xp + 50,
        hearts: Math.min(prev.maxHearts, prev.hearts + 2),
        openedChests: [...(prev.openedChests || []), chestId],
      };
    });
  };

  const handleStartBoss = (module: Module) => {
    const bossLesson: Lesson = {
      id: module.masteryBoss.id,
      moduleId: module.id,
      title: module.masteryBoss.title,
      subtitle: 'Prueba de Maestría con Corona',
      description: module.masteryBoss.description,
      icon: 'crown',
      color: 'bg-amber-500',
      owlIntroTip:
        '¡El examen de maestría del módulo! Concéntrate, aplica las reglas con precisión y llévate la corona.',
      questions: module.masteryBoss.questions,
      xpReward: module.masteryBoss.xpReward,
    };
    setActiveLesson(bossLesson);
  };

  const handleFreeExerciseCompleted = (exId: string) => {
    setStats((prev) => {
      const already = prev.completedFreeExerciseIds?.includes(exId);
      const nextList = already
        ? prev.completedFreeExerciseIds
        : [...(prev.completedFreeExerciseIds || []), exId];

      return {
        ...prev,
        xp: already ? prev.xp : prev.xp + 25,
        completedFreeExerciseIds: nextList,
      };
    });
  };

  const handleSaveHighScore = (newHighScore: number) => {
    setStats((prev) => ({
      ...prev,
      highScoreSpeedDrill: Math.max(prev.highScoreSpeedDrill, newHighScore),
    }));
  };

  const handleAddXp = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  const activeCurriculum = getCurriculumByTopic(selectedTopicId);
  const activeGymExercises = getGymExercisesByTopic(selectedTopicId);
  const activeFreeExercises = getFreeExercisesByTopic(selectedTopicId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        stats={stats}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onToggleSound={handleToggleSound}
        onToggleDarkMode={handleToggleDarkMode}
        onRechargeHearts={handleRefillHearts}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentTab === 'path' && (
          <LearningPath
            modules={activeCurriculum}
            stats={stats}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onStartLesson={(lesson) => setActiveLesson(lesson)}
            onStartBoss={handleStartBoss}
            onOpenGym={() => setCurrentTab('gym')}
            onOpenCheatSheet={() => setCurrentTab('cheatsheet')}
            onOpenChest={handleOpenChest}
          />
        )}

        {currentTab === 'gym' && (
          <UocGym
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            exercises={activeGymExercises}
          />
        )}

        {currentTab === 'free' && (
          <FreePracticeMode
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            exercises={activeFreeExercises}
            onExerciseCompleted={handleFreeExerciseCompleted}
            completedIds={stats.completedFreeExerciseIds || []}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileAchievements
            stats={stats}
            onToggleDarkMode={handleToggleDarkMode}
            onRechargeHearts={handleRefillHearts}
          />
        )}

        {currentTab === 'drill' && (
          <SpeedDrill
            highScore={stats.highScoreSpeedDrill}
            onSaveHighScore={handleSaveHighScore}
            onAddXp={handleAddXp}
          />
        )}

        {currentTab === 'cheatsheet' && <CheatSheet />}
      </main>

      {/* Active Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          stats={stats}
          onClose={() => setActiveLesson(null)}
          onCompleteLesson={handleCompleteLesson}
          onLoseHeart={handleLoseHeart}
          onRefillHearts={handleRefillHearts}
        />
      )}

      {/* Desktop Footer */}
      <footer className="hidden lg:block border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">DeducoLog UOC</span>
            <span>·</span>
            <span>Deducción Natural para Informática y Lógica Formal</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span>Cálculo de Gentzen & Fitch</span>
            <span>·</span>
            <span>105 Ejercicios</span>
            <span>·</span>
            <span>Exámenes UOC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
